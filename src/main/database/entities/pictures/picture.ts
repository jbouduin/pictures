import { Column, Entity, Index, ManyToOne } from 'typeorm';

import { BaseEntity } from '../base-entity';
import { Collection } from './collection';

@Entity()
export class Picture extends BaseEntity {

  // TODO unique index on filename + pathname
  @Column('nvarchar', { length: 256, nullable: false })
  public path: string;

  @Column('blob', { nullable: true })
  public thumb: string;

  @Index()
  @ManyToOne(
    _type => Collection,
    collection => collection.pictures,
    { nullable: false, onDelete: 'CASCADE'})
  public collection: Collection;

  // @OneToMany(type => Exif, exif => exif.picture)
  // public exifs: Promise<Array<Exif>>;
}
