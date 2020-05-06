import { DtoListPicture } from '@ipc';
import { ListItem } from '@shared';

export class PictureListItem extends ListItem {

  // <editor-fold desc='Public properties'>

  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(dtoListPicture: DtoListPicture) {
    super(dtoListPicture.id);
    this.name = dtoListPicture.name;
    this.thumbPath = dtoListPicture.thumbPath;
    this.footerText = '0';
  }
  // </editor-fold>
}
