import { AES, enc } from 'crypto-ts';
import { Column, Entity, OneToMany, OneToOne, JoinColumn, BeforeInsert, AfterLoad, BeforeUpdate } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { BaseEntity } from '../base-entity';
import { Picture } from './picture';

@Entity()
export class Collection extends BaseEntity {

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

  @BeforeInsert()
  public beforeInsert(): void {
    if (this.isSecret) {
      const generatedKeyValue = uuidv4();
      console.log('before encryption', generatedKeyValue, 'Configuration.secretKey');
      this.encryptedKey = AES.encrypt(generatedKeyValue, 'Configuration.secretKey').toString();
      console.log('after encryption', this.encryptedKey);
    }
  }

  @BeforeUpdate()
  public beforeUpdate(): void {
    this.encryptedKey = undefined;
  }

  @AfterLoad()
  public afterLoad(): void {
    if (this.isSecret) {
      console.log('before decryption', this.encryptedKey);
      const decrypted = AES.decrypt(this.encryptedKey, 'Configuration.secretKey');
      this.encryptedKey = decrypted.toString(enc.Utf8);
      console.log('after decryption', this.encryptedKey);
    }
  }
}
