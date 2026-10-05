import { BaseSeeder } from "@adonisjs/lucid/seeders";
import Destino from "#models/destino";
import Ruta from "#models/ruta";
import Bus from "#models/bus";
import AsientoBus from "#models/asiento_bus";
import Viaje from "#models/viaje";
import { DateTime } from "luxon";

export default class extends BaseSeeder {
  async run() {
    const destinos = await Destino.createMany([
      { ciudad: "Santiago", terminal: "Terminal Alameda" },
      { ciudad: "Valparaíso", terminal: "Terminal Valparaíso" },
      { ciudad: "Concepción", terminal: "Terminal Collao" },
      { ciudad: "La Serena", terminal: "Terminal La Serena" },
      { ciudad: "Temuco", terminal: "Terminal Temuco" },
      { ciudad: "Antofagasta", terminal: "Terminal Antofagasta" },
      { ciudad: "Iquique", terminal: "Terminal Iquique" },
      { ciudad: "Puerto Montt", terminal: "Terminal Puerto Montt" },
      { ciudad: "Rancagua", terminal: "Terminal Rancagua" },
      { ciudad: "Talca", terminal: "Terminal Talca" },
      { ciudad: "Chillán", terminal: "Terminal Chillán" },
      { ciudad: "Osorno", terminal: "Terminal Osorno" },
    ]);
    const byCity = new Map(destinos.map((destino) => [destino.ciudad, destino]));
    const routeData = [
      ["Santiago", "Valparaíso", 120, 8000],
      ["Valparaíso", "Santiago", 120, 8000],
      ["Santiago", "Concepción", 480, 25000],
      ["Concepción", "Santiago", 480, 25000],
      ["Santiago", "La Serena", 300, 15000],
      ["La Serena", "Santiago", 300, 15000],
      ["Santiago", "Temuco", 600, 35000],
      ["Temuco", "Santiago", 600, 35000],
      ["Santiago", "Antofagasta", 1200, 60000],
      ["Antofagasta", "Santiago", 1200, 60000],
      ["Santiago", "Puerto Montt", 900, 45000],
      ["Puerto Montt", "Santiago", 900, 45000],
      ["Concepción", "Temuco", 240, 12000],
      ["Temuco", "Concepción", 240, 12000],
      ["Concepción", "Chillán", 90, 5000],
      ["Chillán", "Concepción", 90, 5000],
      ["Temuco", "Osorno", 180, 10000],
      ["Osorno", "Temuco", 180, 10000],
      ["Santiago", "Rancagua", 90, 4000],
      ["Rancagua", "Santiago", 90, 4000],
      ["Santiago", "Talca", 180, 9000],
      ["Talca", "Santiago", 180, 9000],
      ["Santiago", "Iquique", 1500, 70000],
      ["Iquique", "Santiago", 1500, 70000],
      ["Santiago", "Chillán", 420, 22000],
      ["Chillán", "Santiago", 420, 22000],
      ["Santiago", "Osorno", 960, 50000],
      ["Osorno", "Santiago", 960, 50000],
      ["Iquique", "Antofagasta", 300, 18000],
      ["Antofagasta", "Iquique", 300, 18000],
    ] as const;
    const rutas = await Ruta.createMany(
      routeData.map(([origen, destino, duracion, precio]) => ({
        origenId: byCity.get(origen)!.id,
        destinoId: byCity.get(destino)!.id,
        duracionMinutos: duracion,
        precioBase: String(precio),
        activo: true,
      })),
    );
    const buses = await Bus.createMany([
      {
        placa: "ABCD-12",
        operador: "Tur Bus",
        modelo: "Volvo 9700",
        capacidad: 46,
        pisos: 2,
        estado: "Activo",
      },
      {
        placa: "EFGH-34",
        operador: "Pullman Bus",
        modelo: "Scania Touring",
        capacidad: 50,
        pisos: 2,
        estado: "Activo",
      },
      {
        placa: "IJKL-56",
        operador: "EME Bus",
        modelo: "Mercedes-Benz O500",
        capacidad: 40,
        pisos: 1,
        estado: "Activo",
      },
      {
        placa: "QRST-90",
        operador: "Tur Bus",
        modelo: "Irizar i6",
        capacidad: 44,
        pisos: 1,
        estado: "Activo",
      },
    ]);
    for (const bus of buses) {
      const seats = [];
      for (let floor = 1; floor <= bus.pisos; floor++) {
        const perFloor = Math.floor(bus.capacidad / bus.pisos);
        for (let index = 1; index <= perFloor; index++) {
          seats.push({
            busId: bus.id,
            numeroAsiento: (floor - 1) * perFloor + index,
            piso: floor,
            fila: Math.floor((index - 1) / 4) + 1,
            columna: ((index - 1) % 4) + 1,
            tipo: index % 5 === 0 ? "Salon Cama Light" : "Salon Cama",
          });
        }
      }
      await AsientoBus.createMany(seats);
    }
    const activeBuses = buses.filter((bus) => bus.estado === "Activo");
    for (const ruta of rutas) {
      for (let index = 0; index < 3; index++) {
        const bus = activeBuses[(rutas.indexOf(ruta) + index) % activeBuses.length];
        const salida = DateTime.now()
          .plus({ days: index })
          .startOf("day")
          .plus({ hours: 7 + index * 4 });
        await Viaje.create({
          rutaId: ruta.id,
          busId: bus.id,
          fechaSalida: salida,
          fechaLlegada: salida.plus({ minutes: ruta.duracionMinutos }),
          precio: ruta.precioBase,
          estado: "programado",
        });
      }
    }
  }
}
