import { RutaSchema } from "#database/schema";
import { belongsTo, hasMany } from "@adonisjs/lucid/orm";
import type { BelongsTo, HasMany } from "@adonisjs/lucid/types/relations";
import Destino from "#models/destino";
import Viaje from "#models/viaje";

export default class Ruta extends RutaSchema {
  @belongsTo(() => Destino, { foreignKey: "origenId" })
  declare origen: BelongsTo<typeof Destino>;

  @belongsTo(() => Destino, { foreignKey: "destinoId" })
  declare destino: BelongsTo<typeof Destino>;

  @hasMany(() => Viaje, { foreignKey: "rutaId" })
  declare viajes: HasMany<typeof Viaje>;
}
