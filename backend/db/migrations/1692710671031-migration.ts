import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1692710671031 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // create column at auth table
    await queryRunner.query(`ALTER TABLE "auth" ADD COLUMN password varchar(64)`);
    await queryRunner.query(`ALTER TABLE "auth" ADD COLUMN account_id varchar(32)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // drop column from auth table
    await queryRunner.query(`ALTER TABLE "auth" DROP COLUMN account_id`);
    await queryRunner.query(`ALTER TABLE "auth" DROP COLUMN password`);
  }
}
