import { DtoGetPicture, DtoGetMetadata } from '@ipc';
import { BaseItem } from '@shared';

import { Injectable } from '@angular/core';

@Injectable()
export class PictureEditItem extends BaseItem {

  // <editor-fold desc='Public properties'>
  public created: Date;
  public modified: Date;
  public version: number;
  public collectionName: string;
  public path: string;
  public metadata: Array<DtoGetMetadata>;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(dtoGetPicture: DtoGetPicture) {
    super(dtoGetPicture.id, dtoGetPicture.name);
    this.created = dtoGetPicture.created;
    this.modified = dtoGetPicture.modified;
    this.version = dtoGetPicture.version;
    this.collectionName = dtoGetPicture.collection.name;
    this.path = `${dtoGetPicture.collection.path}/${dtoGetPicture.path}/${dtoGetPicture.name}`;
    this.metadata = dtoGetPicture.metadata;
  }
  // </editor-fold>
}
