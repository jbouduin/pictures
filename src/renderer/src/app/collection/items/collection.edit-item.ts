import { DtoGetCollection } from '@ipc';
import { BaseItem } from '@shared';

import { Injectable } from '@angular/core';

@Injectable()
export class CollectionEditItem extends BaseItem {

  // <editor-fold desc='Public properties'>
  public path: string;
  public secret: boolean;
  public created: Date;
  public modified: Date;
  public version: number;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(dtoCollection: DtoGetCollection) {
    super(dtoCollection.id, dtoCollection.name);
    this.path = dtoCollection.path;
    this.secret = dtoCollection.secret;
    this.created = dtoCollection.created;
    this.modified = dtoCollection.modified;
    this.version = dtoCollection.version;
  }
  // </editor-fold>
}
