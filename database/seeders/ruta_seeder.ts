import { BaseSeeder } from "@adonisjs/lucid/seeders";
import Destino from "#models/destino";
import Ruta from "#models/ruta";

export default class extends BaseSeeder {
  async run() {
    const destinos = await Destino.all();

    const rutasData = [
      { origen: "Santiago", destino: "Valparaíso", duracion: 120, precio: 8000 },
      { origen: "Valparaíso", destino: "Santiago", duracion: 120, precio: 8000 },
      { origen: "Santiago", destino: "Concepción", duracion: 480, precio: 25000 },
      { origen: "Concepción", destino: "Santiago", duracion: 480, precio: 25000 },
      { origen: "Santiago", destino: "La Serena", duracion: 300, precio: 15000 },
      { origen: "La Serena", destino: "Santiago", duracion: 300, precio: 15000 },
      { origen: "Santiago", destino: "Temuco", duracion: 600, precio: 35000 },
      { origen: "Temuco", destino: "Santiago", duracion: 600, precio: 35000 },
      { origen: "Santiago", destino: "Antofagasta", duracion: 1200, precio: 60000 },
      { origen: "Antofagasta", destino: "Santiago", duracion: 1200, precio: 60000 },
      { origen: "Santiago", destino: "Puerto Montt", duracion: 900, precio: 45000 },
      { origen: "Puerto Montt", destino: "Santiago", duracion: 900, precio: 45000 },
      { origen: "Concepción", destino: "Temuco", duracion: 240, precio: 12000 },
      { origen: "Temuco", destino: "Concepción", duracion: 240, precio: 12000 },
      { origen: "Concepción", destino: "Chillán", duracion: 90, precio: 5000 },
      { origen: "Chillán", destino: "Concepción", duracion: 90, precio: 5000 },
      { origen: "Temuco", destino: "Osorno", duracion: 180, precio: 10000 },
      { origen: "Osorno", destino: "Temuco", duracion: 180, precio: 10000 },
      { origen: "Santiago", destino: "Rancagua", duracion: 90, precio: 4000 },
      { origen: "Rancagua", destino: "Santiago", duracion: 90, precio: 4000 },
      { origen: "Santiago", destino: "Talca", duracion: 180, precio: 9000 },
      { origen: "Talca", destino: "Santiago", duracion: 180, precio: 9000 },
      { origen: "Iquique", destino: "Antofagasta", duracion: 300, precio: 18000 },
      { origen: "Antofagasta", destino: "Iquique", duracion: 300, precio: 18000 },
    ];

    for (const r of rutasData) {
      const origen = destinos.find((d) => d.ciudad === r.origen);
      const destino = destinos.find((d) => d.ciudad === r.destino);

      if (origen && destino) {
        await Ruta.create({
          origenId: origen.id,
          destinoId: destino.id,
          duracionMinutos: r.duracion,
          precioBase: String(r.precio),
          activo: true,
        });
      }
    }
  }
}
