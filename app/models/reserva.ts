import { ReservaSchema } from "#database/schema";
import { belongsTo, hasMany } from "@adonisjs/lucid/orm";
import type { BelongsTo, HasMany } from "@adonisjs/lucid/types/relations";
import Viaje from "#models/viaje";
import ReservaAsiento from "#models/reserva_asiento";

export default class Reserva extends ReservaSchema {
  @belongsTo(() => Viaje, { foreignKey: "viajeId" })
  declare viaje: BelongsTo<typeof Viaje>;

  @hasMany(() => ReservaAsiento, { foreignKey: "reservaId" })
  declare reservaAsientos: HasMany<typeof ReservaAsiento>;
}
