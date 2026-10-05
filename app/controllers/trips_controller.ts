import type { HttpContext } from "@adonisjs/core/http";
import Viaje from "#models/viaje";
import Destino from "#models/destino";
import Ruta from "#models/ruta";
import Bus from "#models/bus";
import { DateTime } from "luxon";

export default class TripsController {
  async index({ request, inertia, response }: HttpContext) {
    const { origen, destino, fecha, operadores, tipos, horarios, directo, precioMax } =
      request.qs();
    const today = DateTime.now().startOf("day");
    const requestedDate = typeof fecha === "string" ? DateTime.fromISO(fecha) : today;
    const selectedDate = requestedDate.isValid ? requestedDate : today;
    const selectedDateValue = selectedDate.toISODate()!;

    if (
      typeof origen === "string" &&
      typeof destino === "string" &&
      origen.trim().toLowerCase() === destino.trim().toLowerCase()
    ) {
      return response.redirect().toPath(`/search?fecha=${encodeURIComponent(selectedDateValue)}`);
    }

    // Los viajes sembrados son datos iniciales. Si la fecha cambia, crea la
    // programación del día solicitado para que la búsqueda no quede vacía.
    const normalizedOrigen = typeof origen === "string" ? origen.trim().toLowerCase() : "";
    const normalizedDestino = typeof destino === "string" ? destino.trim().toLowerCase() : "";
    const selectedOperators =
      typeof operadores === "string"
        ? operadores
            .split(",")
            .map((item) => item.trim().toLowerCase())
            .filter(Boolean)
        : [];
    const selectedSeatTypes =
      typeof tipos === "string"
        ? tipos
            .split(",")
            .map((item) => item.trim().toLowerCase())
            .filter(Boolean)
        : [];
    const selectedSchedules =
      typeof horarios === "string"
        ? horarios
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        : [];
    const selectedMaxPrice =
      typeof precioMax === "string" && Number(precioMax) > 0 ? Number(precioMax) : null;

    if (normalizedOrigen && normalizedDestino) {
      const destinosDisponibles = await Destino.all();
      const origenDestino = destinosDisponibles.find(
        (item) => item.ciudad.toLowerCase() === normalizedOrigen,
      );
      const destinoDestino = destinosDisponibles.find(
        (item) => item.ciudad.toLowerCase() === normalizedDestino,
      );

      if (origenDestino && destinoDestino && origenDestino.id !== destinoDestino.id) {
        const routeExists = await Ruta.query()
          .where("origenId", origenDestino.id)
          .where("destinoId", destinoDestino.id)
          .first();

        if (!routeExists) {
          await Ruta.create({
            origenId: origenDestino.id,
            destinoId: destinoDestino.id,
            duracionMinutos: 240,
            precioBase: "15000",
            activo: true,
          });
        }
      }
    }

    const rutas = await Ruta.query().where("activo", true).preload("origen").preload("destino");
    const activeBuses = await Bus.query().where("estado", "Activo");
    const matchingRoutes = rutas.filter((ruta) => {
      const routeOrigen = ruta.origen?.ciudad.toLowerCase() ?? "";
      const routeDestino = ruta.destino?.ciudad.toLowerCase() ?? "";
      return (
        (!normalizedOrigen || routeOrigen.includes(normalizedOrigen)) &&
        (!normalizedDestino || routeDestino.includes(normalizedDestino))
      );
    });

    if (activeBuses.length > 0) {
      for (const [routeIndex, ruta] of matchingRoutes.entries()) {
        const existingTrips = await Viaje.query()
          .where("rutaId", ruta.id)
          .where("fecha_salida", ">=", selectedDate.startOf("day").toJSDate())
          .where("fecha_salida", "<=", selectedDate.endOf("day").toJSDate());
        const hasFutureTrip = existingTrips.some((trip) => trip.fechaSalida > DateTime.now());

        if (existingTrips.length === 0 || (selectedDate.hasSame(today, "day") && !hasFutureTrip)) {
          const departureHours = [7, 12, 18];
          for (const [index, hour] of departureHours.entries()) {
            let departure = selectedDate.startOf("day").plus({ hours: hour });
            if (selectedDate.hasSame(today, "day") && departure <= DateTime.now()) {
              departure = DateTime.now()
                .plus({ hours: index + 1 })
                .startOf("minute");
            }

            await Viaje.create({
              rutaId: ruta.id,
              busId: activeBuses[(routeIndex + index) % activeBuses.length].id,
              fechaSalida: departure,
              fechaLlegada: departure.plus({ minutes: ruta.duracionMinutos }),
              precio: ruta.precioBase,
              estado: "programado",
            });
          }
        }
      }
    }

    const query = Viaje.query()
      .preload("ruta", (rutaQuery) => {
        rutaQuery.preload("origen");
        rutaQuery.preload("destino");
      })
      .preload("bus")
      .where("estado", "programado");

    query
      .where("fecha_salida", ">=", selectedDate.startOf("day").toJSDate())
      .andWhere("fecha_salida", "<=", selectedDate.endOf("day").toJSDate());

    const viajes = await query;
    const filteredViajes = viajes.filter((viaje) => {
      const origenCiudad = viaje.ruta?.origen?.ciudad.toLowerCase() ?? "";
      const destinoCiudad = viaje.ruta?.destino?.ciudad.toLowerCase() ?? "";
      const operator = viaje.bus?.operador.toLowerCase() ?? "";
      const seatType = "salón cama";
      const departureHour = viaje.fechaSalida.hour;
      const schedule = departureHour < 12 ? "Mañana" : departureHour < 18 ? "Tarde" : "Noche";
      return (
        (!normalizedOrigen || origenCiudad.includes(normalizedOrigen)) &&
        (!normalizedDestino || destinoCiudad.includes(normalizedDestino)) &&
        (selectedOperators.length === 0 || selectedOperators.includes(operator)) &&
        (selectedSeatTypes.length === 0 || selectedSeatTypes.includes(seatType)) &&
        (selectedSchedules.length === 0 || selectedSchedules.includes(schedule)) &&
        (selectedMaxPrice === null || Number(viaje.precio) <= selectedMaxPrice)
      );
    });

    const destinos = await Destino.all();

    const trips = filteredViajes.map((viaje) => ({
      id: viaje.id,
      departureTime: viaje.fechaSalida.toFormat("HH:mm"),
      arrivalTime: viaje.fechaLlegada ? viaje.fechaLlegada.toFormat("HH:mm") : "--:--",
      duration: `${Math.floor(viaje.ruta!.duracionMinutos / 60)}h ${viaje.ruta!.duracionMinutos % 60}m`,
      originTerminal: viaje.ruta!.origen!.terminal || viaje.ruta!.origen!.ciudad,
      destTerminal: viaje.ruta!.destino!.terminal || viaje.ruta!.destino!.ciudad,
      operator: viaje.bus!.operador,
      seatType: "Salón Cama",
      price: Number(viaje.precio),
      isDirect: true,
      origen: viaje.ruta!.origen!.ciudad,
      destino: viaje.ruta!.destino!.ciudad,
    }));

    return inertia.render("TripSearchPage", {
      trips,
      destinos,
      searchParams: {
        origen: origen || "",
        destino: destino || "",
        fecha: selectedDateValue,
        operadores: typeof operadores === "string" ? operadores : "",
        tipos: typeof tipos === "string" ? tipos : "",
        horarios: typeof horarios === "string" ? horarios : "",
        directo: typeof directo === "string" ? directo : "0",
        precioMax: typeof precioMax === "string" ? precioMax : "70000",
      },
    } as never);
  }
}
