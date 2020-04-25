import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';

import { BaseEntity } from '../base-entity';
import { Collection } from './collection';
import { Exif } from './exif';

@Entity()
export class Picture extends BaseEntity {

  @Column('nvarchar', { length: 256, nullable: false })
  public fileName: string;

  @Column('nvarchar', { length: 256, nullable: false })
  public path: string;

  @Index()
  @ManyToOne(type => Collection, collection => collection.pictures, { nullable: false })
  public collection: Collection;

  @OneToMany(type => Exif, exif => exif.picture)
  public exifs: Promise<Array<Exif>>;
}