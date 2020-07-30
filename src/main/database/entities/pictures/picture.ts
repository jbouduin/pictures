import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';

import { BaseEntity } from '../base-entity';
import { Collection } from './collection';
import { MetadataPictureMap } from '../metadata/metadata-picture-map';

@Entity()
@Index(['collection', 'path', 'name'], { unique: true })
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

  @OneToMany(_type => MetadataPictureMap, metaDataPictureMap => metaDataPictureMap.picture)
  public metadata: Promise<Array<MetadataPictureMap>>;
}
