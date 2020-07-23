import { DtoListPicture } from '@ipc';
import { ListItem } from '@shared';

export class PictureListItem extends ListItem {

  // <editor-fold desc='Public properties'>
  public path: string;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(dtoListPicture: DtoListPicture) {
    super(dtoListPicture.id, dtoListPicture.name);
    this.thumbId = dtoListPicture.thumbId;
    this.footerText = '0';
    this.path = dtoListPicture.path;
  }
  // </editor-fold>
}
