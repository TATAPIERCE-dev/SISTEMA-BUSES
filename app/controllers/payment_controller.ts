import type { HttpContext } from "@adonisjs/core/http";
import db from "@adonisjs/lucid/services/db";
import AsientoBus from "#models/asiento_bus";
import Reserva from "#models/reserva";
import ReservaAsiento from "#models/reserva_asiento";
import Viaje from "#models/viaje";
import { DateTime } from "luxon";

export default class PaymentController {
  async show({ request, response, inertia }: HttpContext) {
    const viajeId = request.input("viajeId") || request.input("tripId");
    const rawSeatIds = request.input("seatIds");
    const seatIds = Array.isArray(rawSeatIds)
      ? rawSeatIds
      : typeof rawSeatIds === "string"
        ? rawSeatIds.includes(",")
          ? rawSeatIds.split(",")
          : [rawSeatIds]
        : [];
    let holdId = request.input("holdId");

    if (typeof viajeId !== "string" || seatIds.length === 0) {
      return response.redirect().toPath("/search");
    }

    const viaje = await Viaje.query()
      .where("id", viajeId)
      .where("estado", "programado")
      .preload("ruta", (query) => query.preload("origen").preload("destino"))
      .preload("bus")
      .firstOrFail();
    const seats = await AsientoBus.query().where("busId", viaje.busId).whereIn("id", seatIds);

    if (seats.length !== seatIds.length) {
      return response.redirect().toPath(`/seats?tripId=${viaje.id}`);
    }

    if (typeof holdId !== "string") {
      try {
        const reservation = await db.transaction(async (trx) => {
          await ReservaAsiento.query({ client: trx })
            .where("viajeId", viaje.id)
            .where("estadoAsiento", "bloqueado")
            .where("bloqueadoHasta", "<=", new Date())
            .delete();

          const activeHoldSeats = await ReservaAsiento.query({ client: trx })
            .where("viajeId", viaje.id)
            .whereIn("asientoBusId", seatIds)
            .where("estadoAsiento", "bloqueado")
            .where("bloqueadoHasta", ">", new Date());
          const sameHold =
            activeHoldSeats.length === seatIds.length
              ? activeHoldSeats.every((seat) => seat.reservaId === activeHoldSeats[0].reservaId)
              : false;

          if (sameHold) {
            return await Reserva.findOrFail(activeHoldSeats[0].reservaId, { client: trx });
          }

          const occupied = await ReservaAsiento.query({ client: trx })
            .where("viajeId", viaje.id)
            .whereIn("asientoBusId", seatIds)
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
              nombrePasajero: String(request.input("nombrePasajero", "Reserva temporal")),
              correoPasajero: String(
                request.input("correoPasajero", `${code.toLowerCase()}@hold.local`),
              ),
              telefonoPasajero: String(request.input("telefonoPasajero", "")) || null,
              montoTotal: "0",
              estado: "pendiente",
              expiraEn: DateTime.now().plus({ minutes: 10 }),
            },
            { client: trx },
          );
          await ReservaAsiento.createMany(
            seatIds.map((seatId) => ({
              reservaId: reservation.id,
              viajeId: viaje.id,
              asientoBusId: seatId,
              estadoAsiento: "bloqueado" as const,
              bloqueadoHasta: reservation.expiraEn,
            })),
            { client: trx },
          );
          return reservation;
        });
        holdId = reservation.id;
      } catch {
        return response.redirect().toPath(`/seats?tripId=${viaje.id}`);
      }
    }

    return inertia.render("PaymentPage", {
      viajeId: viaje.id,
      seatIds,
      holdId,
      passenger: {
        nombrePasajero: request.input("nombrePasajero", ""),
        correoPasajero: request.input("correoPasajero", ""),
        telefonoPasajero: request.input("telefonoPasajero", ""),
      },
      trip: {
        origin: viaje.ruta!.origen!.ciudad,
        destination: viaje.ruta!.destino!.ciudad,
        departure: viaje.fechaSalida.toFormat("dd/MM/yyyy HH:mm"),
        operator: viaje.bus!.operador,
        model: viaje.bus!.modelo,
      },
      total: seats.reduce(
        (sum, seat) =>
          sum +
          (seat.tipo === "Salon Cama Light"
            ? Math.max(0, Number(viaje.precio) - 1050)
            : Number(viaje.precio)),
        0,
      ),
    } as never);
  }

  async invoice({ request, response, inertia }: HttpContext) {
    const reservationId = request.input("reservationId");
    if (typeof reservationId !== "string") {
      return response.redirect().toPath("/search");
    }

    const reservation = await Reserva.query()
      .where("id", reservationId)
      .where("estado", "pagada")
      .preload("viaje", (query) =>
        query
          .preload("ruta", (rutaQuery) => rutaQuery.preload("origen").preload("destino"))
          .preload("bus"),
      )
      .preload("reservaAsientos", (query) => query.preload("asientoBus"))
      .firstOrFail();

    return inertia.render("InvoicePage", {
      reservation: {
        code: reservation.codigoReserva,
        passenger: reservation.nombrePasajero,
        email: reservation.correoPasajero,
        total: Number(reservation.montoTotal),
        createdAt: reservation.creadoEn?.toFormat("dd/MM/yyyy HH:mm") ?? "",
        trip: {
          origin: reservation.viaje.ruta!.origen!.ciudad,
          destination: reservation.viaje.ruta!.destino!.ciudad,
          departure: reservation.viaje.fechaSalida.toFormat("dd/MM/yyyy HH:mm"),
          operator: reservation.viaje.bus!.operador,
        },
        seats: reservation.reservaAsientos.map((item) => item.asientoBus!.numeroAsiento),
      },
    } as never);
  }
}
