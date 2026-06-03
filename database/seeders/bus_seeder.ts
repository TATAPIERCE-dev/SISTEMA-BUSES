import { BaseSeeder } from "@adonisjs/lucid/seeders";
import Bus from "#models/bus";

export default class extends BaseSeeder {
  async run() {
    await Bus.createMany([
      { placa: "ABCD-12", modelo: "Volvo 9700", capacidad: 46, pisos: 2, estado: "Activo" },
      { placa: "EFGH-34", modelo: "Scania Touring", capacidad: 50, pisos: 2, estado: "Activo" },
      { placa: "IJKL-56", modelo: "Mercedes-Benz O500", capacidad: 40, pisos: 1, estado: "Activo" },
      {
        placa: "MNOP-78",
        modelo: "Marcopolo Paradiso",
        capacidad: 48,
        pisos: 2,
        estado: "Mantenimiento",
      },
      { placa: "QRST-90", modelo: "Irizar i6", capacidad: 44, pisos: 1, estado: "Activo" },
      { placa: "UVWX-11", modelo: "Volvo 9800", capacidad: 52, pisos: 2, estado: "Activo" },
      { placa: "YZAB-22", modelo: "Scania K440", capacidad: 38, pisos: 1, estado: "Activo" },
      {
        placa: "CDEF-33",
        modelo: "Caio Millennium",
        capacidad: 46,
        pisos: 2,
        estado: "Fuera de Servicio",
      },
    ]);
  }
}
