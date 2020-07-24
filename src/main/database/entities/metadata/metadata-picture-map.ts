import { Entity, Column, ManyToOne, Index } from 'typeorm';
import { Picture } from '../pictures/picture';
import { MetadataKey } from './metadata-key';
import { TraceableEntity } from '../base-entity';

@Entity()
@Index(["picture", "metadataKey"], { unique: true })
export class MetadataPictureMap extends TraceableEntity {

  @Column('nvarchar', { length: 1024, nullable: true })
  public value: string;

  @ManyToOne(
    _type => Picture,
    picture => picture.metadata,
    { nullable: false, onDelete: 'NO ACTION'}
  )
  public picture: Picture;

  @ManyToOne(
    _type => MetadataKey,
    key => key.values,
    { nullable: false, cascade: true, onDelete: 'NO ACTION'}
  )
  public metadataKey: MetadataKey;
}
