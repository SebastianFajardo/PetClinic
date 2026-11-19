import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInventory1731900000004 implements MigrationInterface {
  name = 'CreateInventory1731900000004';
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "inventory_items" ("id" uuid NOT NULL, "name" character varying(160) NOT NULL, "description" text, "category" character varying(100) NOT NULL, "unit" character varying(40) NOT NULL, "quantity" numeric(12,2) NOT NULL DEFAULT 0, "minimum_quantity" numeric(12,2) NOT NULL DEFAULT 0, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(), "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(), CONSTRAINT "PK_inventory_items" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE INDEX "IDX_inventory_items_name" ON "inventory_items" ("name")`);
    await queryRunner.query(`CREATE TABLE "inventory_movements" ("id" uuid NOT NULL, "item_id" uuid NOT NULL, "type" character varying(20) NOT NULL, "quantity" numeric(12,2) NOT NULL, "previous_quantity" numeric(12,2) NOT NULL, "new_quantity" numeric(12,2) NOT NULL, "reason" character varying(500) NOT NULL, "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(), CONSTRAINT "PK_inventory_movements" PRIMARY KEY ("id"), CONSTRAINT "FK_inventory_movements_item" FOREIGN KEY ("item_id") REFERENCES "inventory_items"("id") ON DELETE RESTRICT ON UPDATE NO ACTION)`);
    await queryRunner.query(`CREATE INDEX "IDX_inventory_movements_item_created" ON "inventory_movements" ("item_id", "created_at")`);
  }
  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_inventory_movements_item_created"`);
    await queryRunner.query(`DROP TABLE "inventory_movements"`);
    await queryRunner.query(`DROP INDEX "IDX_inventory_items_name"`);
    await queryRunner.query(`DROP TABLE "inventory_items"`);
  }
}
