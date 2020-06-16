import { DtoGetPicture } from '@ipc';
import { BaseItem } from '@shared';

import { Injectable } from '@angular/core';

@Injectable()
export class PictureEditItem extends BaseItem {

  // <editor-fold desc='Public properties'>
  public created: Date;
  public modified: Date;
  public version: number;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(dtoGetPicture: DtoGetPicture) {
    super(dtoGetPicture.id);
    this.name = dtoGetPicture.name;
    this.created = dtoGetPicture.created;
    this.modified = dtoGetPicture.modified;
    this.version = dtoGetPicture.version;
  }
  // </editor-fold>
}
