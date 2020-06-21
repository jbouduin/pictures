import { DtoGetTag } from '@ipc';
import { BaseItem } from '@shared';

import { Injectable } from '@angular/core';

@Injectable()
export class TagEditItem extends BaseItem {

  // <editor-fold desc='Public properties'>
  public canAssign: boolean;
  public created: Date;
  public modified: Date;
  public version: number;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(dtoTag: DtoGetTag) {
    super(dtoTag.id, dtoTag.name);
    this.canAssign = dtoTag.canAssign;
    this.created = dtoTag.created;
    this.modified = dtoTag.modified;
    this.version = dtoTag.version;
  }
  // </editor-fold>
}
