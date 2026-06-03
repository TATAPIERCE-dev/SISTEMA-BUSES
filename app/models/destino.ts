import { DestinoSchema } from "#database/schema";
import { hasMany } from "@adonisjs/lucid/orm";
import type { HasMany } from "@adonisjs/lucid/types/relations";
import Ruta from "#models/ruta";

export default class Destino extends DestinoSchema {
  @hasMany(() => Ruta, { foreignKey: "origenId" })
  declare rutasOrigen: HasMany<typeof Ruta>;

  @hasMany(() => Ruta, { foreignKey: "destinoId" })
  declare rutasDestino: HasMany<typeof Ruta>;
}
