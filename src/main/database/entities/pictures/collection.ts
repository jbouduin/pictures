import { Column, Entity, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../base-entity';
import { Picture } from './picture';

@Entity()
export class Collection extends BaseEntity {

  // <editor-fold desc='Entity columns'>
  @Column('nvarchar', { length: 256, nullable: false })
  public path: string;

  @Column('boolean', { default: false, nullable: false })
  public isSecret: boolean;

  @Column({ nullable: true })
  public encryptedKey: string;

  @OneToMany(
    _type => Picture,
    picture => picture.collection,
    { onDelete: 'CASCADE'}
  )
  public pictures: Promise<Array<Picture>>;

  @OneToOne(
    _type => Picture,
    { nullable: true, onDelete: 'CASCADE'}
  )

  @JoinColumn()
  public thumb: Picture;
  // </editor-fold>

  // <editor-fold desc='Public properties'>
  public decryptedKey: string;
  // </editor-fold>

}
