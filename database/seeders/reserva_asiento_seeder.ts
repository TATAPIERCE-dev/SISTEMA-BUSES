import { BaseSeeder } from "@adonisjs/lucid/seeders";
import Reserva from "#models/reserva";
import Viaje from "#models/viaje";
import AsientoBus from "#models/asiento_bus";
import ReservaAsiento from "#models/reserva_asiento";
import { DateTime } from "luxon";

export default class extends BaseSeeder {
  async run() {
    const reservas = await Reserva.query().whereIn("estado", ["pagada", "pendiente"]);
    const estados: ("bloqueado" | "pagado" | "cancelado" | "expirado")[] = [
      "bloqueado",
      "pagado",
      "pagado",
      "pagado",
    ];

    for (const reserva of reservas) {
      const viaje = await Viaje.findOrFail(reserva.viajeId);
      const asientosDisponibles = await AsientoBus.query().where("busId", viaje.busId);

      const numAsientos = Math.min(Math.floor(Math.random() * 3) + 1, asientosDisponibles.length);

      const asientosSeleccionados = asientosDisponibles
        .sort(() => Math.random() - 0.5)
        .slice(0, numAsientos);

      for (const asiento of asientosSeleccionados) {
        const estadoAsiento =
          reserva.estado === "pagada"
            ? estados[Math.floor(Math.random() * estados.length)]
            : "bloqueado";

        const bloqueadoHasta =
          estadoAsiento === "bloqueado" ? DateTime.now().plus({ minutes: 30 }) : null;

        await ReservaAsiento.create({
          reservaId: reserva.id,
          viajeId: viaje.id,
          asientoBusId: asiento.id,
          estadoAsiento,
          bloqueadoHasta,
        });
      }
    }
  }
}
