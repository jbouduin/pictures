import { EventSubscriber, EntitySubscriberInterface, InsertEvent, UpdateEvent } from "typeorm";
import { Picture } from "database/entities";

@EventSubscriber()
export class PictureSubscriber implements EntitySubscriberInterface<Picture> {

  public listenTo() {
    return Picture;
  }

  public beforeInsert(event: InsertEvent<Picture>): void {
    event.entity.path = event.entity.path.replace(/\\/g, '/');
  }

  public beforeUpdate(event: UpdateEvent<Picture>) {
    event.entity.path = event.entity.path.replace(/\\/g, '/');
  }

}
