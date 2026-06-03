import { ReservaAsientoSchema } from "#database/schema";
import { belongsTo } from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";
import Reserva from "#models/reserva";
import Viaje from "#models/viaje";
import AsientoBus from "#models/asiento_bus";

export default class ReservaAsiento extends ReservaAsientoSchema {
  @belongsTo(() => Reserva, { foreignKey: "reservaId" })
  declare reserva: BelongsTo<typeof Reserva>;

  @belongsTo(() => Viaje, { foreignKey: "viajeId" })
  declare viaje: BelongsTo<typeof Viaje>;

  @belongsTo(() => AsientoBus, { foreignKey: "asientoBusId" })
  declare asientoBus: BelongsTo<typeof AsientoBus>;
}
