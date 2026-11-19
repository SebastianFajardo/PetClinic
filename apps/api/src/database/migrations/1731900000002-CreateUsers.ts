import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers1731900000002 implements MigrationInterface {
  name = 'CreateUsers1731900000002';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "users" (
      "id" uuid NOT NULL,
      "full_name" character varying(160) NOT NULL,
      "email" character varying(180) NOT NULL,
      "password_hash" character varying(255) NOT NULL,
      "role" character varying(30) NOT NULL DEFAULT 'assistant',
      "is_active" boolean NOT NULL DEFAULT true,
      "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
      "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
      CONSTRAINT "PK_users" PRIMARY KEY ("id"),
      CONSTRAINT "UQ_users_email" UNIQUE ("email"),
      CONSTRAINT "CHK_users_role" CHECK ("role" IN ('admin', 'veterinarian', 'assistant', 'receptionist'))
    )`);
    await queryRunner.query(`CREATE INDEX "IDX_users_role" ON "users" ("role")`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_users_role"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
