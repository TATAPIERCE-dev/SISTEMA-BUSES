import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "asientos_bus";

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid("id").primary().defaultTo(this.db.rawQuery("gen_random_uuid()").knexQuery);
      table.uuid("bus_id").notNullable().references("id").inTable("buses").onDelete("CASCADE");
      table.integer("numero_asiento").notNullable();
      table.integer("piso").notNullable().defaultTo(1);
      table.integer("fila").nullable();
      table.integer("columna").nullable();
      table.enum("tipo", ["Salon Cama", "Salon Cama Light", "ESC"]).notNullable();
      table.timestamp("creado_en").defaultTo(this.db.rawQuery("now()").knexQuery);
      table.timestamp("actualizado_en").defaultTo(this.db.rawQuery("now()").knexQuery);
      table.unique(["bus_id", "numero_asiento"]);
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
