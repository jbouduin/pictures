import { CreateDateColumn, Index, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

export abstract class BaseEntity {

  @PrimaryGeneratedColumn()
  public id: number;

  @CreateDateColumn()
  public created: Date;

  @UpdateDateColumn()
  public modified: Date;

  @VersionColumn()
  public version: number;

}
