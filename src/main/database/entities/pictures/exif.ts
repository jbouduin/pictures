import { Column, Entity, Index, ManyToOne } from 'typeorm';

import { BaseEntity } from '../base-entity';
import { Picture } from './picture';

@Entity()
export class Exif extends BaseEntity {

  @Index()
  @ManyToOne(type => Picture, picture => picture.exifs, { nullable: false })
  public picture: Picture;

  @Column('nvarchar', { length: 256, nullable: false })
  public key: string;

  @Column('nvarchar', { length: 256, nullable: false })
  public value: string;
}
