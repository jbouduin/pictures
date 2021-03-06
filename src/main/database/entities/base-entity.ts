import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn, DeleteDateColumn } from 'typeorm';

export abstract class TraceableEntity {

  @PrimaryGeneratedColumn()
  public id: number;

  @CreateDateColumn()
  public created: Date;

  @UpdateDateColumn()
  public modified: Date;

  @DeleteDateColumn()
  public deleted: Date;

  @VersionColumn()
  public version: number;
}

export abstract class BaseEntity extends TraceableEntity {
  @Column('nvarchar', { length: 256, nullable: false })
  public name: string;
}
