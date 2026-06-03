import { BusSchema } from "#database/schema";
import { hasMany } from "@adonisjs/lucid/orm";
import type { HasMany } from "@adonisjs/lucid/types/relations";
import Viaje from "#models/viaje";
import AsientoBus from "#models/asiento_bus";

export default class Bus extends BusSchema {
  @hasMany(() => AsientoBus, { foreignKey: "busId" })
  declare asientos: HasMany<typeof AsientoBus>;

  @hasMany(() => Viaje, { foreignKey: "busId" })
  declare viajes: HasMany<typeof Viaje>;
}
