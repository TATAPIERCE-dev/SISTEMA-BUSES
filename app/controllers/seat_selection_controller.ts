import type { HttpContext } from "@adonisjs/core/http";
import AsientoBus from "#models/asiento_bus";
import ReservaAsiento from "#models/reserva_asiento";
import Viaje from "#models/viaje";

export default class SeatSelectionController {
  async show({ request, response, inertia }: HttpContext) {
    const viajeId = request.input("tripId");
    if (typeof viajeId !== "string") {
      return response.redirect().toPath("/search");
    }

    const viaje = await Viaje.query()
      .where("id", viajeId)
      .where("estado", "programado")
      .preload("ruta", (query) => query.preload("origen").preload("destino"))
      .preload("bus")
      .firstOrFail();

    const seats = await AsientoBus.query().where("busId", viaje.busId).orderBy("numeroAsiento");
    const reservedSeats = await ReservaAsiento.query()
      .where("viajeId", viaje.id)
      .whereIn("estadoAsiento", ["bloqueado", "pagado"])
      .where((query) =>
        query.whereNull("bloqueadoHasta").orWhere("bloqueadoHasta", ">", new Date()),
      );

    const reservedIds = new Set(reservedSeats.map((seat) => seat.asientoBusId));
    const price = Number(viaje.precio);

    return inertia.render("SeatSelectionPage", {
      trip: {
        id: viaje.id,
        departureTime: viaje.fechaSalida.toFormat("HH:mm"),
        arrivalTime: viaje.fechaLlegada?.toFormat("HH:mm") ?? "--:--",
        duration: `${Math.floor(viaje.ruta!.duracionMinutos / 60)}h ${viaje.ruta!.duracionMinutos % 60}m`,
        originTerminal: viaje.ruta!.origen!.terminal || viaje.ruta!.origen!.ciudad,
        destTerminal: viaje.ruta!.destino!.terminal || viaje.ruta!.destino!.ciudad,
        operator: viaje.bus!.modelo,
        price,
        origin: viaje.ruta!.origen!.ciudad,
        destination: viaje.ruta!.destino!.ciudad,
        date: viaje.fechaSalida.toISODate(),
      },
      seats: seats.map((seat) => ({
        id: seat.id,
        number: seat.numeroAsiento,
        type:
          seat.tipo === "Salon Cama Light"
            ? "Salón Cama Light"
            : seat.tipo === "Salon Cama"
              ? "Salón Cama"
              : "ESC",
        price: seat.tipo === "Salon Cama Light" ? Math.max(0, price - 1050) : price,
        status: reservedIds.has(seat.id) ? "occupied" : "available",
        level: seat.piso,
      })),
    });
  }
}
