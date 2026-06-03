import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "reservas";

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid("id").primary().defaultTo(this.db.rawQuery("gen_random_uuid()").knexQuery);
      table.string("codigo_reserva", 12).notNullable().unique();
      table.uuid("viaje_id").notNullable().references("id").inTable("viajes");
      table.string("nombre_pasajero", 120).notNullable();
      table.string("correo_pasajero", 120).notNullable();
      table.string("telefono_pasajero", 20).nullable();
      table.decimal("monto_total", 10, 2).notNullable();
      table.enum("estado", ["pendiente", "pagada", "cancelada", "expirada"]).defaultTo("pendiente");
      table.timestamp("expira_en").nullable();
      table.timestamp("creado_en").defaultTo(this.db.rawQuery("now()").knexQuery);
      table.timestamp("actualizado_en").defaultTo(this.db.rawQuery("now()").knexQuery);
      table.check("monto_total >= 0");
      table.index("estado", "idx_reservas_estado");
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
