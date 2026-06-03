import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "rutas";

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid("id").primary().defaultTo(this.db.rawQuery("gen_random_uuid()").knexQuery);
      table.uuid("origen_id").notNullable().references("id").inTable("destinos");
      table.uuid("destino_id").notNullable().references("id").inTable("destinos");
      table.integer("duracion_minutos").notNullable();
      table.decimal("precio_base", 10, 2).notNullable();
      table.boolean("activo").defaultTo(true);
      table.timestamp("creado_en").defaultTo(this.db.rawQuery("now()").knexQuery);
      table.timestamp("actualizado_en").defaultTo(this.db.rawQuery("now()").knexQuery);
      table.check("origen_id <> destino_id");
      table.check("duracion_minutos > 0");
      table.check("precio_base >= 0");
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
