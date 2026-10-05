import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "buses";

  async up() {
    await this.db.rawQuery(
      `ALTER TABLE ${this.tableName} ADD COLUMN IF NOT EXISTS operador varchar(80) NOT NULL DEFAULT 'TravelEase'`,
    );

    await this.db.from(this.tableName).where("placa", "ABCD-12").update({ operador: "Tur Bus" });
    await this.db
      .from(this.tableName)
      .where("placa", "EFGH-34")
      .update({ operador: "Pullman Bus" });
    await this.db.from(this.tableName).where("placa", "IJKL-56").update({ operador: "EME Bus" });
    await this.db.from(this.tableName).where("placa", "QRST-90").update({ operador: "Tur Bus" });
  }

  async down() {
    await this.db.rawQuery(`ALTER TABLE ${this.tableName} DROP COLUMN IF EXISTS operador`);
  }
}
