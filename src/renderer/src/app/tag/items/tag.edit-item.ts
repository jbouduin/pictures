import { DtoGetTag } from '@ipc';
import { BaseItem } from '@shared';

import { Injectable } from '@angular/core';

@Injectable()
export class TagEditItem extends BaseItem {

  // <editor-fold desc='Public properties'>
  public created: Date;
  public modified: Date;
  public version: number;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(dtotag: DtoGetTag) {
    super(dtotag.id);
    this.name = dtotag.name;
    this.created = dtotag.created;
    this.modified = dtotag.modified;
    this.version = dtotag.version;
  }
  // </editor-fold>
}
