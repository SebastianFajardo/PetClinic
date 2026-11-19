import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMedicalRecordsAndAppointments1731900000001 implements MigrationInterface {
  name = 'CreateMedicalRecordsAndAppointments1731900000001';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "medical_records" ("id" uuid NOT NULL, "pet_id" uuid NOT NULL, "veterinarian_name" character varying(160) NOT NULL, "reason" character varying(500) NOT NULL, "symptoms" text NOT NULL, "diagnosis" text NOT NULL, "treatment" text NOT NULL, "notes" text, "recorded_at" TIMESTAMPTZ NOT NULL, "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(), CONSTRAINT "PK_medical_records" PRIMARY KEY ("id"), CONSTRAINT "FK_medical_records_pet" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE RESTRICT ON UPDATE NO ACTION)`);
    await queryRunner.query(`CREATE INDEX "IDX_medical_records_pet_recorded_at" ON "medical_records" ("pet_id", "recorded_at")`);
    await queryRunner.query(`CREATE TABLE "appointments" ("id" uuid NOT NULL, "pet_id" uuid NOT NULL, "scheduled_at" TIMESTAMPTZ NOT NULL, "duration_minutes" smallint NOT NULL, "reason" character varying(500) NOT NULL, "status" character varying(20) NOT NULL DEFAULT 'scheduled', "notes" text, "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(), "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(), CONSTRAINT "PK_appointments" PRIMARY KEY ("id"), CONSTRAINT "FK_appointments_pet" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE RESTRICT ON UPDATE NO ACTION)`);
    await queryRunner.query(`CREATE INDEX "IDX_appointments_pet_scheduled_at" ON "appointments" ("pet_id", "scheduled_at")`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_appointments_pet_scheduled_at"`);
    await queryRunner.query(`DROP TABLE "appointments"`);
    await queryRunner.query(`DROP INDEX "IDX_medical_records_pet_recorded_at"`);
    await queryRunner.query(`DROP TABLE "medical_records"`);
  }
}
