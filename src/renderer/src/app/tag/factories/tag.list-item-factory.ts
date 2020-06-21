import { Injectable } from '@angular/core';

import { DtoListTag, DtoNewTag } from '@ipc';
import { BaseListItemFactory } from '@shared';
import { TagListItem } from '../items/tag.list-item';
import { TagNewItem } from '../items/tag.new-item';

@Injectable({
  providedIn: 'root'
})
export class TagListItemFactory extends BaseListItemFactory<
  TagListItem, TagNewItem, DtoListTag, DtoNewTag> {

  // <editor-fold desc='Constructor & C°'>
  public constructor() {
    super();
  }
  // </editor-fold>

  // <editor-fold desc='Abstract method implementations'>
  public createNewItem(): TagNewItem {
    return new TagNewItem();
  }

  public listDtoToListItem(dto: DtoListTag): TagListItem {
    return new TagListItem(dto);
  }

  public newItemToNewDto(item: TagNewItem): DtoNewTag {
    const result: DtoNewTag = {
      name: item.name,
      canAssign: item.canAssign
    };
    return result;
  }
  // </editor-fold>
}
