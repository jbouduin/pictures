import { DtoCollection } from '@ipc';
import { BaseItem } from '@shared';

import { Injectable } from '@angular/core';

@Injectable()
export class CollectionEditItem extends BaseItem {

  // <editor-fold desc='Public properties'>
  public path: string;
  public created: Date;
  public modified: Date;
  public version: number;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(dtoCollection: DtoCollection) {
    super(dtoCollection.id);
    this.name = dtoCollection.name;
    this.path = dtoCollection.path;
    this.created = dtoCollection.created;
    this.modified = dtoCollection.modified;
    this.version = dtoCollection.version;
  }
  // </editor-fold>
}
