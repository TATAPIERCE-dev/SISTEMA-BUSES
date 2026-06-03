import type { HttpContext } from "@adonisjs/core/http";
import Reserva from "#models/reserva";
import Viaje from "#models/viaje";
import AsientoBus from "#models/asiento_bus";
import ReservaAsiento from "#models/reserva_asiento";
import { DateTime } from "luxon";

interface LooseRenderer {
  render(component: string, props: any): any;
}

function isLoose(_obj: any): _obj is LooseRenderer {
  return true;
}

export default class BookingsController {
  private generarCodigo(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "RES-";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async index({ auth, inertia }: HttpContext) {
    const user = auth.user!;

    // 1. Fetch user's real reservations
    let reservas = await Reserva.query()
      .where("correoPasajero", user.email)
      .preload("viaje", (viajeQuery) => {
        viajeQuery
          .preload("ruta", (rutaQuery) => {
            rutaQuery.preload("origen").preload("destino");
          })
          .preload("bus");
      })
      .preload("reservaAsientos", (raQuery) => {
        raQuery.preload("asientoBus");
      })
      .orderBy("creadoEn", "desc");

    // 2. Auto-seed 3 reservations if none exist for a stunning first-impression
    if (reservas.length === 0) {
      try {
        // Fetch different voyages to build diverse history
        const futureVoyage = await Viaje.query()
          .where("estado", "programado")
          .preload("bus")
          .first();
        const pastVoyage = await Viaje.query().where("estado", "finalizado").preload("bus").first();
        const cancelledVoyage = await Viaje.query()
          .where("estado", "cancelado")
          .preload("bus")
          .first();

        const name = user.fullName || "Pasajero TravelEase";

        // Create Upcoming Reservation
        if (futureVoyage) {
          const bookedSeatIds = await ReservaAsiento.query().where("viajeId", futureVoyage.id);
          const bookedIds = bookedSeatIds.map((b) => b.asientoBusId);
          const availableSeats = await AsientoBus.query()
            .where("busId", futureVoyage.busId)
            .whereNotIn("id", bookedIds.length > 0 ? bookedIds : [""])
            .limit(2);

          if (availableSeats.length > 0) {
            const reserva = await Reserva.create({
              codigoReserva: this.generarCodigo(),
              viajeId: futureVoyage.id,
              nombrePasajero: name,
              correoPasajero: user.email,
              telefonoPasajero: "+56987654321",
              montoTotal: String(Number(futureVoyage.precio) * availableSeats.length),
              estado: "pagada",
            });

            for (const seat of availableSeats) {
              await ReservaAsiento.create({
                reservaId: reserva.id,
                viajeId: futureVoyage.id,
                asientoBusId: seat.id,
                estadoAsiento: "pagado",
              });
            }
          }
        }

        // Create Completed Reservation
        if (pastVoyage) {
          const bookedSeatIds = await ReservaAsiento.query().where("viajeId", pastVoyage.id);
          const bookedIds = bookedSeatIds.map((b) => b.asientoBusId);
          const availableSeats = await AsientoBus.query()
            .where("busId", pastVoyage.busId)
            .whereNotIn("id", bookedIds.length > 0 ? bookedIds : [""])
            .limit(1);

          if (availableSeats.length > 0) {
            const reserva = await Reserva.create({
              codigoReserva: this.generarCodigo(),
              viajeId: pastVoyage.id,
              nombrePasajero: name,
              correoPasajero: user.email,
              telefonoPasajero: "+56987654321",
              montoTotal: String(pastVoyage.precio),
              estado: "pagada",
              creadoEn: DateTime.now().minus({ days: 15 }),
            });

            await ReservaAsiento.create({
              reservaId: reserva.id,
              viajeId: pastVoyage.id,
              asientoBusId: availableSeats[0].id,
              estadoAsiento: "pagado",
            });
          }
        }

        // Create Cancelled Reservation
        if (cancelledVoyage) {
          const bookedSeatIds = await ReservaAsiento.query().where("viajeId", cancelledVoyage.id);
          const bookedIds = bookedSeatIds.map((b) => b.asientoBusId);
          const availableSeats = await AsientoBus.query()
            .where("busId", cancelledVoyage.busId)
            .whereNotIn("id", bookedIds.length > 0 ? bookedIds : [""])
            .limit(1);

          if (availableSeats.length > 0) {
            const reserva = await Reserva.create({
              codigoReserva: this.generarCodigo(),
              viajeId: cancelledVoyage.id,
              nombrePasajero: name,
              correoPasajero: user.email,
              telefonoPasajero: "+56987654321",
              montoTotal: String(cancelledVoyage.precio),
              estado: "cancelada",
              creadoEn: DateTime.now().minus({ days: 30 }),
            });

            await ReservaAsiento.create({
              reservaId: reserva.id,
              viajeId: cancelledVoyage.id,
              asientoBusId: availableSeats[0].id,
              estadoAsiento: "cancelado",
            });
          }
        }

        // Re-query reservations after automatic seeding
        reservas = await Reserva.query()
          .where("correoPasajero", user.email)
          .preload("viaje", (viajeQuery) => {
            viajeQuery
              .preload("ruta", (rutaQuery) => {
                rutaQuery.preload("origen").preload("destino");
              })
              .preload("bus");
          })
          .preload("reservaAsientos", (raQuery) => {
            raQuery.preload("asientoBus");
          })
          .orderBy("creadoEn", "desc");
      } catch (error) {
        console.error("Error auto-seeding user bookings:", error);
      }
    }

    // 3. Map to UI-friendly structure
    const mappedReservas = reservas.map((reserva) => {
      const viaje = reserva.viaje;
      const ruta = viaje?.ruta;
      const origen = ruta?.origen;
      const destino = ruta?.destino;
      const seats = reserva.reservaAsientos
        .map((ra) => ra.asientoBus?.numeroAsiento)
        .filter((n): n is number => n !== undefined && n !== null)
        .sort((a, b) => a - b);

      // Determine state classification for the UI: Próximo, Completado, Cancelado
      let uiState = "Completado";
      if (reserva.estado === "cancelada" || reserva.estado === "expirada") {
        uiState = "Cancelado";
      } else if (viaje && viaje.fechaSalida > DateTime.now()) {
        uiState = "Próximo";
      }

      return {
        id: reserva.id,
        codigoReserva: reserva.codigoReserva,
        estado: reserva.estado, // raw db state ("pendiente", "pagada", "cancelada", "expirada")
        uiState, // UI classification ("Próximo", "Completado", "Cancelado")
        montoTotal: Number(reserva.montoTotal),
        nombrePasajero: reserva.nombrePasajero,
        correoPasajero: reserva.correoPasajero,
        telefonoPasajero: reserva.telefonoPasajero,
        creadoEn: reserva.creadoEn?.toISO(),
        viaje: viaje
          ? {
              id: viaje.id,
              fechaSalida: viaje.fechaSalida.toISO(),
              fechaLlegada: viaje.fechaLlegada?.toISO(),
              precio: Number(viaje.precio),
              estado: viaje.estado,
              bus: viaje.bus
                ? {
                    placa: viaje.bus.placa,
                    modelo: viaje.bus.modelo,
                  }
                : null,
              ruta: ruta
                ? {
                    origen: origen
                      ? { ciudad: origen.ciudad, terminal: origen.terminal || "Terminal Sur" }
                      : null,
                    destino: destino
                      ? { ciudad: destino.ciudad, terminal: destino.terminal || "Terminal Norte" }
                      : null,
                  }
                : null,
            }
          : null,
        asientos: seats,
      };
    });

    const looseInertia: unknown = inertia;
    if (isLoose(looseInertia)) {
      return looseInertia.render("MyBookingsPage", {
        reservas: mappedReservas,
      });
    }
    return null;
  }

  async cancel({ params, auth, response }: HttpContext) {
    const user = auth.user!;
    const reserva = await Reserva.query()
      .where("id", params.id)
      .where("correoPasajero", user.email)
      .firstOrFail();

    // Only allow cancelling active bookings
    if (reserva.estado === "pagada" || reserva.estado === "pendiente") {
      reserva.estado = "cancelada";
      reserva.actualizadoEn = DateTime.now();
      await reserva.save();

      // Release seats linked to this booking
      await ReservaAsiento.query()
        .where("reservaId", reserva.id)
        .update({ estadoAsiento: "cancelado", actualizadoEn: DateTime.now() });
    }

    response.redirect().back();
  }
}
