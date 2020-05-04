import { Column, Entity, Index, OneToMany } from 'typeorm';

import { BaseEntity } from '../base-entity';
import { Picture } from './picture';

@Entity()
export class Collection extends BaseEntity {

  @Column('nvarchar', { length: 256, nullable: false })
  public path: string;

  @OneToMany(type => Picture, picture => picture.collection)
  public pictures: Promise<Array<Picture>>;
}
