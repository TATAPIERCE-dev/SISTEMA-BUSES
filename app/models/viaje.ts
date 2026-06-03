import { ViajeSchema } from "#database/schema";
import { belongsTo, hasMany } from "@adonisjs/lucid/orm";
import type { BelongsTo, HasMany } from "@adonisjs/lucid/types/relations";
import Ruta from "#models/ruta";
import Bus from "#models/bus";
import Reserva from "#models/reserva";
import ReservaAsiento from "#models/reserva_asiento";

export default class Viaje extends ViajeSchema {
  @belongsTo(() => Ruta, { foreignKey: "rutaId" })
  declare ruta: BelongsTo<typeof Ruta>;

  @belongsTo(() => Bus, { foreignKey: "busId" })
  declare bus: BelongsTo<typeof Bus>;

  @hasMany(() => Reserva, { foreignKey: "viajeId" })
  declare reservas: HasMany<typeof Reserva>;

  @hasMany(() => ReservaAsiento, { foreignKey: "viajeId" })
  declare reservaAsientos: HasMany<typeof ReservaAsiento>;
}
