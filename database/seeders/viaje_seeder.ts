import { BaseSeeder } from "@adonisjs/lucid/seeders";
import Ruta from "#models/ruta";
import Bus from "#models/bus";
import Viaje from "#models/viaje";
import { DateTime } from "luxon";

export default class extends BaseSeeder {
  async run() {
    const rutas = await Ruta.query().where("activo", true);
    const buses = await Bus.query().where("estado", "Activo");

    const estados: (
      | "programado"
      | "abordando"
      | "en_viaje"
      | "finalizado"
      | "cancelado"
      | "lleno"
    )[] = [
      "programado",
      "programado",
      "programado",
      "programado",
      "finalizado",
      "finalizado",
      "en_viaje",
      "lleno",
      "cancelado",
    ];

    const viajes = [];

    for (const ruta of rutas) {
      for (let i = 0; i < 3; i++) {
        const bus = buses[Math.floor(Math.random() * buses.length)];
        const fechaBase = DateTime.now().plus({ days: i * 2, hours: 6 + i * 4 });
        const duracion = ruta.duracionMinutos;
        const estado = estados[Math.floor(Math.random() * estados.length)];

        viajes.push({
          rutaId: ruta.id,
          busId: bus.id,
          fechaSalida: fechaBase,
          fechaLlegada: fechaBase.plus({ minutes: duracion }),
          precio: String(Number(ruta.precioBase) * (0.9 + Math.random() * 0.2)),
          estado,
        });
      }
    }

    await Viaje.createMany(viajes);
  }
}
