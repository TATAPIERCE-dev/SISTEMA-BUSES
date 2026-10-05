import type { HttpContext } from "@adonisjs/core/http";
import Reserva from "#models/reserva";
import ReservaAsiento from "#models/reserva_asiento";
import { DateTime } from "luxon";

export default class BookingsController {
  async index({ auth, inertia }: HttpContext) {
    const user = auth.user!;
    const reservas = await Reserva.query()
      .where("correoPasajero", user.email)
      .preload("viaje", (viajeQuery) => {
        viajeQuery
          .preload("ruta", (rutaQuery) => rutaQuery.preload("origen").preload("destino"))
          .preload("bus");
      })
      .preload("reservaAsientos", (query) => query.preload("asientoBus"))
      .orderBy("creadoEn", "desc");

    return inertia.render("MyBookingsPage", {
      reservas: reservas.map((reserva) => {
        const viaje = reserva.viaje;
        const seats = reserva.reservaAsientos
          .map((seat) => seat.asientoBus?.numeroAsiento)
          .filter((number): number is number => number !== undefined && number !== null)
          .sort((a, b) => a - b);
        const uiState =
          reserva.estado === "cancelada" || reserva.estado === "expirada"
            ? "Cancelado"
            : viaje && viaje.fechaSalida > DateTime.now()
              ? "Próximo"
              : "Completado";

        return {
          id: reserva.id,
          codigoReserva: reserva.codigoReserva,
          estado: reserva.estado,
          uiState,
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
                bus: viaje.bus ? { placa: viaje.bus.placa, modelo: viaje.bus.modelo } : null,
                ruta: viaje.ruta
                  ? {
                      origen: viaje.ruta.origen
                        ? {
                            ciudad: viaje.ruta.origen.ciudad,
                            terminal: viaje.ruta.origen.terminal ?? "",
                          }
                        : null,
                      destino: viaje.ruta.destino
                        ? {
                            ciudad: viaje.ruta.destino.ciudad,
                            terminal: viaje.ruta.destino.terminal ?? "",
                          }
                        : null,
                    }
                  : null,
              }
            : null,
          asientos: seats,
        };
      }),
    } as never);
  }

  async cancel({ params, auth, response }: HttpContext) {
    const reserva = await Reserva.query()
      .where("id", params.id)
      .where("correoPasajero", auth.user!.email)
      .firstOrFail();

    if (["pagada", "pendiente"].includes(reserva.estado ?? "")) {
      reserva.estado = "cancelada";
      reserva.actualizadoEn = DateTime.now();
      await reserva.save();
      await ReservaAsiento.query()
        .where("reservaId", reserva.id)
        .update({ estadoAsiento: "cancelado", actualizadoEn: DateTime.now() });
    }

    return response.redirect().back();
  }
}
