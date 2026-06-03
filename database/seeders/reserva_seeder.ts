import { BaseSeeder } from "@adonisjs/lucid/seeders";
import Viaje from "#models/viaje";
import Reserva from "#models/reserva";
import { DateTime } from "luxon";

export default class extends BaseSeeder {
  private generarCodigo(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "RES-";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async run() {
    const viajes = await Viaje.query().whereIn("estado", ["programado", "lleno", "abordando"]);

    const nombres = [
      "Juan Pérez",
      "María González",
      "Carlos Silva",
      "Ana Martínez",
      "Pedro Rojas",
      "Laura Díaz",
      "Diego Torres",
      "Camila López",
      "Felipe Muñoz",
      "Valentina Soto",
      "Andrés Morales",
      "Sofía Contreras",
      "Matías Vargas",
      "Isabella Fuentes",
      "Sebastián Reyes",
      "Catalina Navarro",
      "Joaquín Espinoza",
      "Florencia Guzmán",
      "Benjamín Castro",
      "Antonella Figueroa",
    ];

    const estados: ("pendiente" | "pagada" | "cancelada" | "expirada")[] = [
      "pagada",
      "pagada",
      "pagada",
      "pendiente",
      "pendiente",
      "cancelada",
      "expirada",
    ];

    for (const viaje of viajes) {
      const numReservas = Math.floor(Math.random() * 8) + 1;

      for (let i = 0; i < numReservas; i++) {
        const nombre = nombres[Math.floor(Math.random() * nombres.length)];
        const estado = estados[Math.floor(Math.random() * estados.length)];
        const expiraEn = estado === "pendiente" ? DateTime.now().plus({ hours: 24 }) : null;

        await Reserva.create({
          codigoReserva: this.generarCodigo(),
          viajeId: viaje.id,
          nombrePasajero: nombre,
          correoPasajero: `${nombre.toLowerCase().replace(/\s/g, ".")}@email.com`,
          telefonoPasajero: `+569${Math.floor(10000000 + Math.random() * 90000000)}`,
          montoTotal: String(viaje.precio),
          estado,
          expiraEn,
        });
      }
    }
  }
}
