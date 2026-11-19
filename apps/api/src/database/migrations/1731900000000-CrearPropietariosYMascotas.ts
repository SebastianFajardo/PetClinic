import { MigrationInterface, QueryRunner } from 'typeorm';

export class CrearPropietariosYMascotas1731900000000 implements MigrationInterface {
  name = 'CrearPropietariosYMascotas1731900000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "owners" ("id" uuid NOT NULL, "first_name" character varying(100) NOT NULL, "last_name" character varying(100) NOT NULL, "document_number" character varying(30) NOT NULL, "email" character varying(180) NOT NULL, "phone" character varying(30) NOT NULL, "address" character varying(250), "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(), "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(), CONSTRAINT "PK_owners" PRIMARY KEY ("id"), CONSTRAINT "UQ_owners_document" UNIQUE ("document_number"), CONSTRAINT "UQ_owners_email" UNIQUE ("email"))`);
    await queryRunner.query(`CREATE TABLE "pets" ("id" uuid NOT NULL, "owner_id" uuid NOT NULL, "name" character varying(120) NOT NULL, "species" character varying(20) NOT NULL, "breed" character varying(100), "birth_date" date, "sex" character varying(20) NOT NULL DEFAULT 'unknown', "color" character varying(80), "weight_kg" numeric(7,2), "notes" text, "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(), "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(), CONSTRAINT "PK_pets" PRIMARY KEY ("id"), CONSTRAINT "FK_pets_owner" FOREIGN KEY ("owner_id") REFERENCES "owners"("id") ON DELETE RESTRICT ON UPDATE NO ACTION)`);
    await queryRunner.query(`CREATE INDEX "IDX_pets_owner_id" ON "pets" ("owner_id")`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_pets_owner_id"`);
    await queryRunner.query(`DROP TABLE "pets"`);
    await queryRunner.query(`DROP TABLE "owners"`);
  }
}
