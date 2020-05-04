import { CreateDateColumn, Index, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

export abstract class BaseEntity {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column('nvarchar', { length: 256, nullable: false })
  public name: string;

  @CreateDateColumn()
  public created: Date;

  @UpdateDateColumn()
  public modified: Date;

  @VersionColumn()
  public version: number;

}
