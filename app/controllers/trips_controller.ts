import type { HttpContext } from "@adonisjs/core/http";
import Viaje from "#models/viaje";
import Destino from "#models/destino";
import { DateTime } from "luxon";

export default class TripsController {
  async index({ request, view }: HttpContext) {
    const { origen, destino, fecha } = request.qs();

    const query = Viaje.query()
      .preload("ruta", (rutaQuery) => {
        rutaQuery.preload("origen");
        rutaQuery.preload("destino");
      })
      .preload("bus")
      .where("estado", "programado");

    if (fecha) {
      const fechaObj = DateTime.fromISO(fecha);
      query
        .where("fecha_salida", ">=", fechaObj.startOf("day").toJSDate())
        .andWhere("fecha_salida", "<=", fechaObj.endOf("day").toJSDate());
    }

    const viajes = await query;

    const destinos = await Destino.all();

    const trips = viajes.map((viaje) => ({
      id: viaje.id,
      departureTime: viaje.fechaSalida.toFormat("HH:mm"),
      arrivalTime: viaje.fechaLlegada ? viaje.fechaLlegada.toFormat("HH:mm") : "--:--",
      duration: `${Math.floor(viaje.ruta!.duracionMinutos / 60)}h ${viaje.ruta!.duracionMinutos % 60}m`,
      originTerminal: viaje.ruta!.origen!.terminal || viaje.ruta!.origen!.ciudad,
      destTerminal: viaje.ruta!.destino!.terminal || viaje.ruta!.destino!.ciudad,
      operator: viaje.bus!.modelo,
      seatType: "Salón Cama",
      price: Number(viaje.precio),
      isDirect: true,
      origen: viaje.ruta!.origen!.ciudad,
      destino: viaje.ruta!.destino!.ciudad,
    }));

    return view.render("inertia", {
      page: "TripSearchPage",
      props: {
        trips,
        destinos,
        searchParams: {
          origen: origen || "",
          destino: destino || "",
          fecha: fecha || DateTime.now().toISODate(),
        },
      },
    });
  }
}
