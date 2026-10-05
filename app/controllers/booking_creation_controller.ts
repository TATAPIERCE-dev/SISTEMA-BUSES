import type { HttpContext } from "@adonisjs/core/http";
import db from "@adonisjs/lucid/services/db";
import { bookingValidator } from "#validators/booking";
import { bookingHoldValidator } from "#validators/booking_hold";
import Reserva from "#models/reserva";
import ReservaAsiento from "#models/reserva_asiento";
import Viaje from "#models/viaje";
import AsientoBus from "#models/asiento_bus";
import { DateTime } from "luxon";

export default class BookingCreationController {
  async hold({ request, response }: HttpContext) {
    const payload = await request.validateUsing(bookingHoldValidator);
    const viaje = await Viaje.findOrFail(payload.viajeId);
    const expiresAt = DateTime.now().plus({ minutes: 10 });

    try {
      const reservation = await db.transaction(async (trx) => {
        await ReservaAsiento.query({ client: trx })
          .where("viajeId", viaje.id)
          .where("estadoAsiento", "bloqueado")
          .where("bloqueadoHasta", "<=", new Date())
          .delete();

        if (payload.previousHoldId) {
          await Reserva.query({ client: trx })
            .where("id", payload.previousHoldId)
            .where("estado", "pendiente")
            .update({ estado: "expirada", expiraEn: DateTime.now() });
        }

        const seats = await AsientoBus.query({ client: trx })
          .where("busId", viaje.busId)
          .whereIn("id", payload.asientoIds);
        if (seats.length !== payload.asientoIds.length) {
          throw new Error("Uno o más asientos no pertenecen al viaje.");
        }

        const occupied = await ReservaAsiento.query({ client: trx })
          .where("viajeId", viaje.id)
          .whereIn("asientoBusId", payload.asientoIds)
          .whereIn("estadoAsiento", ["bloqueado", "pagado"])
          .where((query) =>
            query.whereNull("bloqueadoHasta").orWhere("bloqueadoHasta", ">", new Date()),
          );
        if (occupied.length > 0) {
          throw new Error("Uno o más asientos ya están ocupados.");
        }

        const code = `HLD-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
        const reservation = await Reserva.create(
          {
            codigoReserva: code,
            viajeId: viaje.id,
            nombrePasajero: "Reserva temporal",
            correoPasajero: `${code.toLowerCase()}@hold.local`,
            montoTotal: "0",
            estado: "pendiente",
            expiraEn: expiresAt,
          },
          { client: trx },
        );
        await ReservaAsiento.createMany(
          seats.map((seat) => ({
            reservaId: reservation.id,
            viajeId: viaje.id,
            asientoBusId: seat.id,
            estadoAsiento: "bloqueado" as const,
            bloqueadoHasta: expiresAt,
          })),
          { client: trx },
        );
        return reservation;
      });

      const params = new URLSearchParams({
        viajeId: payload.viajeId,
        seatIds: payload.asientoIds.join(","),
        nombrePasajero: String(request.input("nombrePasajero", "")),
        correoPasajero: String(request.input("correoPasajero", "")),
        telefonoPasajero: String(request.input("telefonoPasajero", "")),
        holdId: reservation.id,
      });
      return response.redirect().toPath(`/pagar?${params.toString()}`);
    } catch (error) {
      return response.badRequest({
        message: error instanceof Error ? error.message : "No fue posible bloquear los asientos.",
      });
    }
  }

  async store({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(bookingValidator);
    const viaje = await Viaje.findOrFail(payload.viajeId);

    if (viaje.estado !== "programado" || viaje.fechaSalida <= DateTime.now()) {
      return response.badRequest({ message: "El viaje ya no está disponible." });
    }

    if (new Set(payload.asientoIds).size !== payload.asientoIds.length) {
      return response.badRequest({ message: "No puedes repetir asientos." });
    }

    try {
      const reservation = await db.transaction(async (trx) => {
        await ReservaAsiento.query({ client: trx })
          .where("viajeId", viaje.id)
          .where("estadoAsiento", "bloqueado")
          .where("bloqueadoHasta", "<=", new Date())
          .delete();

        const seats = await AsientoBus.query({ client: trx })
          .where("busId", viaje.busId)
          .whereIn("id", payload.asientoIds);

        if (seats.length !== payload.asientoIds.length) {
          throw new Error("Uno o más asientos no pertenecen al bus del viaje.");
        }

        const total = seats.reduce(
          (sum, seat) =>
            sum +
            (seat.tipo === "Salon Cama Light"
              ? Math.max(0, Number(viaje.precio) - 1050)
              : Number(viaje.precio)),
          0,
        );

        if (payload.holdId) {
          const hold = await Reserva.query({ client: trx })
            .where("id", payload.holdId)
            .where("viajeId", viaje.id)
            .where("estado", "pendiente")
            .where("expiraEn", ">", new Date())
            .first();
          if (!hold) {
            throw new Error("La reserva temporal expiró. Selecciona nuevamente tus asientos.");
          }

          const heldSeats = await ReservaAsiento.query({ client: trx })
            .where("reservaId", hold.id)
            .whereIn("asientoBusId", payload.asientoIds)
            .where("estadoAsiento", "bloqueado");
          if (heldSeats.length !== payload.asientoIds.length) {
            throw new Error("La reserva temporal no contiene los asientos seleccionados.");
          }

          hold.nombrePasajero = payload.nombrePasajero;
          hold.correoPasajero = payload.correoPasajero;
          hold.telefonoPasajero = payload.telefonoPasajero ?? null;
          hold.montoTotal = String(total);
          hold.estado = "pagada";
          hold.expiraEn = null;
          await hold.save();
          await ReservaAsiento.query({ client: trx })
            .where("reservaId", hold.id)
            .whereIn("asientoBusId", payload.asientoIds)
            .update({ estadoAsiento: "pagado", bloqueadoHasta: null });
          return hold;
        }

        const occupied = await ReservaAsiento.query({ client: trx })
          .where("viajeId", viaje.id)
          .whereIn("asientoBusId", payload.asientoIds)
          .whereIn("estadoAsiento", ["bloqueado", "pagado"])
          .where((query) =>
            query.whereNull("bloqueadoHasta").orWhere("bloqueadoHasta", ">", new Date()),
          );

        if (occupied.length > 0) {
          throw new Error("Uno o más asientos ya fueron reservados.");
        }

        const reservation = new Reserva();
        reservation.useTransaction(trx);
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let code = "";
        do {
          code = "RES-";
          for (let index = 0; index < 8; index++) {
            code += chars[Math.floor(Math.random() * chars.length)];
          }
        } while (await Reserva.query({ client: trx }).where("codigoReserva", code).first());
        reservation.codigoReserva = code;
        reservation.viajeId = viaje.id;
        reservation.nombrePasajero = payload.nombrePasajero;
        reservation.correoPasajero = payload.correoPasajero;
        reservation.telefonoPasajero = payload.telefonoPasajero ?? null;
        reservation.montoTotal = String(total);
        reservation.estado = "pagada";
        await reservation.save();

        await ReservaAsiento.createMany(
          seats.map((seat) => ({
            reservaId: reservation.id,
            viajeId: viaje.id,
            asientoBusId: seat.id,
            estadoAsiento: "pagado" as const,
          })),
          { client: trx },
        );
        return reservation;
      });

      if (auth.user && auth.user.email === payload.correoPasajero) {
        auth.user.fullName = payload.nombrePasajero;
        auth.user.phoneNumber = payload.telefonoPasajero ?? auth.user.phoneNumber;
        await auth.user.save();
      }

      return response.redirect().toPath(`/factura?reservationId=${reservation.id}`);
    } catch (error) {
      return response.badRequest({
        message: error instanceof Error ? error.message : "No fue posible crear la reserva.",
      });
    }
  }
}
