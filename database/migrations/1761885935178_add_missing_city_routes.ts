import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "rutas";

  async up() {
    await this.db
      .rawQuery(`
      WITH nuevas_rutas(origen, destino, duracion, precio) AS (
        VALUES
          ('Santiago', 'Iquique', 1500, 70000),
          ('Iquique', 'Santiago', 1500, 70000),
          ('Santiago', 'Chillán', 420, 22000),
          ('Chillán', 'Santiago', 420, 22000),
          ('Santiago', 'Osorno', 960, 50000),
          ('Osorno', 'Santiago', 960, 50000)
      )
      INSERT INTO rutas (origen_id, destino_id, duracion_minutos, precio_base, activo)
      SELECT origen.id, destino.id, nuevas.duracion, nuevas.precio, true
      FROM nuevas_rutas nuevas
      JOIN destinos origen ON origen.ciudad = nuevas.origen
      JOIN destinos destino ON destino.ciudad = nuevas.destino
      WHERE NOT EXISTS (
        SELECT 1 FROM rutas existente
        WHERE existente.origen_id = origen.id AND existente.destino_id = destino.id
      )
    `)
      .exec();
  }

  async down() {}
}
