import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "viajes";

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid("id").primary().defaultTo(this.db.rawQuery("gen_random_uuid()").knexQuery);
      table.uuid("ruta_id").notNullable().references("id").inTable("rutas");
      table.uuid("bus_id").notNullable().references("id").inTable("buses");
      table.timestamp("fecha_salida").notNullable();
      table.timestamp("fecha_llegada").nullable();
      table.decimal("precio", 10, 2).notNullable();
      table
        .enum("estado", ["programado", "abordando", "en_viaje", "finalizado", "cancelado", "lleno"])
        .notNullable()
        .defaultTo("programado");
      table.timestamp("creado_en").defaultTo(this.db.rawQuery("now()").knexQuery);
      table.timestamp("actualizado_en").defaultTo(this.db.rawQuery("now()").knexQuery);
      table.index("fecha_salida", "idx_viajes_fecha");
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
