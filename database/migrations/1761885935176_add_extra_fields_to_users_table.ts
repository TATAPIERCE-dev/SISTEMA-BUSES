import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "users";

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string("document_type").nullable();
      table.string("document_number").nullable();
      table.string("phone_number").nullable();
      table.string("gender").nullable();
      table.string("emergency_phone").nullable();
    });
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn("document_type");
      table.dropColumn("document_number");
      table.dropColumn("phone_number");
      table.dropColumn("gender");
      table.dropColumn("emergency_phone");
    });
  }
}
