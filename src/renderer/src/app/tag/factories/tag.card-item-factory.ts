import { Injectable } from '@angular/core';

import { DtoGetTag, DtoSetTag } from '@ipc';
import { BaseCardItemFactory } from '@shared';
import { TagEditItem } from '../items/tag.edit-item';

@Injectable({
  providedIn: 'root'
})
export class TagCardItemFactory extends BaseCardItemFactory<
  TagEditItem, DtoGetTag, DtoSetTag> {

  // <editor-fold desc='Constructor & C°'>
  public constructor() {
    super();
  }
  // </editor-fold>

  // <editor-fold desc='Abstract method implementations'>
  public getDtoToEditItem(dto: DtoGetTag): TagEditItem {
    return new TagEditItem(dto);
  }

  public editItemToSetDto(item: TagEditItem): DtoSetTag {
    return {
      name: item.name,
      canAssign: item.canAssign
    }
  }
  // </editor-fold>
}
