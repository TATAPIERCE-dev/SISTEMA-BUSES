import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "buses";

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid("id").primary().defaultTo(this.db.rawQuery("gen_random_uuid()").knexQuery);
      table.string("placa", 20).notNullable().unique();
      table.string("modelo", 120).notNullable();
      table.integer("capacidad").notNullable();
      table.integer("pisos").notNullable().defaultTo(1);
      table
        .enum("estado", ["Activo", "Mantenimiento", "Fuera de Servicio"])
        .notNullable()
        .defaultTo("Activo");
      table.timestamp("creado_en").notNullable().defaultTo(this.db.rawQuery("now()").knexQuery);
      table
        .timestamp("actualizado_en")
        .notNullable()
        .defaultTo(this.db.rawQuery("now()").knexQuery);
      table.check("capacidad > 0");
      table.check("pisos >= 1 AND pisos <= 2");
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
