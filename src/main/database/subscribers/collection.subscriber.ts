import { AES, enc } from 'crypto-ts';
import { EventSubscriber, EntitySubscriberInterface, InsertEvent } from "typeorm";
import { v4 as uuidv4 } from 'uuid';
import { Collection } from "database/entities";
import { LoadEvent } from 'typeorm/subscriber/event/LoadEvent';

@EventSubscriber()
export class CollectionSubscriber implements EntitySubscriberInterface<Collection> {

  public listenTo() {
    return Collection;
  }

  public beforeInsert(event: InsertEvent<Collection>): void {
    if (event.entity.isSecret) {
      if (!event.queryRunner.data?.key) {
        throw new Error('key is not set');
      } else {
        const generatedKeyValue = uuidv4();
        event.entity.encryptedKey = AES.encrypt(generatedKeyValue, event.queryRunner.data.key).toString();
      }
    }
  }

  public afterLoad(_entity: Collection, event?: LoadEvent<Collection>): void {
    if (event.entity.isSecret && event.entity.encryptedKey) {
      if (event.queryRunner.data?.key) {
        const decrypted = AES.decrypt(event.entity.encryptedKey, event.queryRunner.data.key);
        event.entity.decryptedKey = decrypted.toString(enc.Utf8);
      }
    }
  }
}
