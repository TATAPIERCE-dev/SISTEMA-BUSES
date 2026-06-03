import { BaseSeeder } from "@adonisjs/lucid/seeders";
import Destino from "#models/destino";

export default class extends BaseSeeder {
  async run() {
    await Destino.createMany([
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
  }
}
