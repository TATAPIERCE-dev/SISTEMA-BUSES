import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "reserva_asientos";

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid("id").primary().defaultTo(this.db.rawQuery("gen_random_uuid()").knexQuery);
      table
        .uuid("reserva_id")
        .notNullable()
        .references("id")
        .inTable("reservas")
        .onDelete("CASCADE");
      table.uuid("viaje_id").notNullable().references("id").inTable("viajes").onDelete("CASCADE");
      table.uuid("asiento_bus_id").notNullable().references("id").inTable("asientos_bus");
      table
        .enum("estado_asiento", ["bloqueado", "pagado", "cancelado", "expirado"])
        .defaultTo("bloqueado");
      table.timestamp("bloqueado_hasta").nullable();
      table.timestamp("creado_en").defaultTo(this.db.rawQuery("now()").knexQuery);
      table.timestamp("actualizado_en").defaultTo(this.db.rawQuery("now()").knexQuery);
      table.unique(["viaje_id", "asiento_bus_id"]);
      table.index("viaje_id", "idx_reserva_asientos_viaje");
      table.index("bloqueado_hasta", "idx_bloqueado_hasta");
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
