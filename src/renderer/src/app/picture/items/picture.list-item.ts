import { DtoListPicture, DtoListPictureCollection } from '@ipc';
import { ListItem } from '@shared';

export class PictureListItem extends ListItem {

  // <editor-fold desc='Public properties'>
  public path: string;
  public collection: DtoListPictureCollection;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(dtoListPicture: DtoListPicture) {
    super(dtoListPicture.id, dtoListPicture.name);
    this.thumbId = dtoListPicture.thumbId;
    this.footerText = '0';
    this.path = dtoListPicture.path;
    this.collection = dtoListPicture.collection;
  }
  // </editor-fold>
}
