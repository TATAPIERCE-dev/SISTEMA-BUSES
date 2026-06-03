import { BaseSeeder } from "@adonisjs/lucid/seeders";
import Bus from "#models/bus";
import AsientoBus from "#models/asiento_bus";

export default class extends BaseSeeder {
  async run() {
    const buses = await Bus.all();
    const tipos: ("Salon Cama" | "Salon Cama Light" | "ESC")[] = [
      "Salon Cama",
      "Salon Cama Light",
      "ESC",
    ];

    for (const bus of buses) {
      const asientos: {
        busId: string;
        numeroAsiento: number;
        piso: number;
        fila: number;
        columna: number;
        tipo: (typeof tipos)[number];
      }[] = [];

      for (let piso = 1; piso <= bus.pisos; piso++) {
        const asientosPorPiso = Math.floor(bus.capacidad / bus.pisos);
        for (let i = 1; i <= asientosPorPiso; i++) {
          const numeroGlobal = (piso - 1) * asientosPorPiso + i;
          const fila = Math.floor((i - 1) / 4) + 1;
          const columna = ((i - 1) % 4) + 1;
          const tipoIndex = Math.floor(Math.random() * tipos.length);

          asientos.push({
            busId: bus.id,
            numeroAsiento: numeroGlobal,
            piso,
            fila,
            columna,
            tipo: tipos[tipoIndex],
          });
        }
      }

      await AsientoBus.createMany(asientos);
    }
  }
}
