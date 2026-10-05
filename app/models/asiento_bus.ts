import { AsientosBusSchema } from "#database/schema";
import { belongsTo, hasMany } from "@adonisjs/lucid/orm";
import type { BelongsTo, HasMany } from "@adonisjs/lucid/types/relations";
import Bus from "#models/bus";
import ReservaAsiento from "#models/reserva_asiento";

export default class AsientoBus extends AsientosBusSchema {
  static table = "asientos_bus";

  @belongsTo(() => Bus, { foreignKey: "busId" })
  declare bus: BelongsTo<typeof Bus>;

  @hasMany(() => ReservaAsiento, { foreignKey: "asientoBusId" })
  declare reservaAsientos: HasMany<typeof ReservaAsiento>;
}
