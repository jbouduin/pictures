import { Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../base-entity';
import { MetadataPictureMap } from './metadata-picture-map';

@Entity()
export class MetadataKey extends BaseEntity {
  @OneToMany(_type => MetadataPictureMap, metaDataPictureMap => metaDataPictureMap.metadataKey)
  public values: Promise<Array<MetadataPictureMap>>;
}
