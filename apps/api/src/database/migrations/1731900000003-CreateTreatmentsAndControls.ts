import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTreatmentsAndControls1731900000003 implements MigrationInterface {
  name = 'CreateTreatmentsAndControls1731900000003';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "treatments" ("id" uuid NOT NULL, "pet_id" uuid NOT NULL, "medical_record_id" uuid, "veterinarian_name" character varying(160) NOT NULL, "name" character varying(160) NOT NULL, "description" text NOT NULL, "medication" character varying(160), "dosage" character varying(120), "frequency" character varying(120), "start_date" date NOT NULL, "end_date" date, "status" character varying(20) NOT NULL DEFAULT 'active', "next_control_at" TIMESTAMPTZ, "notes" text, "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(), "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(), CONSTRAINT "PK_treatments" PRIMARY KEY ("id"), CONSTRAINT "FK_treatments_pet" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE RESTRICT ON UPDATE NO ACTION, CONSTRAINT "FK_treatments_medical_record" FOREIGN KEY ("medical_record_id") REFERENCES "medical_records"("id") ON DELETE SET NULL ON UPDATE NO ACTION)`);
    await queryRunner.query(`CREATE INDEX "IDX_treatments_pet_start_date" ON "treatments" ("pet_id", "start_date")`);
    await queryRunner.query(`CREATE TABLE "treatment_controls" ("id" uuid NOT NULL, "treatment_id" uuid NOT NULL, "control_date" TIMESTAMPTZ NOT NULL, "observations" text NOT NULL, "outcome" text NOT NULL, "next_control_at" TIMESTAMPTZ, "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(), CONSTRAINT "PK_treatment_controls" PRIMARY KEY ("id"), CONSTRAINT "FK_treatment_controls_treatment" FOREIGN KEY ("treatment_id") REFERENCES "treatments"("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
    await queryRunner.query(`CREATE INDEX "IDX_treatment_controls_treatment_date" ON "treatment_controls" ("treatment_id", "control_date")`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_treatment_controls_treatment_date"`);
    await queryRunner.query(`DROP TABLE "treatment_controls"`);
    await queryRunner.query(`DROP INDEX "IDX_treatments_pet_start_date"`);
    await queryRunner.query(`DROP TABLE "treatments"`);
  }
}
