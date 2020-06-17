import { Injectable } from '@angular/core';

import { DtoListCollection, DtoNewCollection } from '@ipc';
import { BaseListItemFactory } from '@shared';
import { CollectionListItem } from '../items/collection.list-item';
import { CollectionNewItem } from '../items/collection.new-item';

@Injectable({
  providedIn: 'root'
})
export class CollectionListItemFactory extends BaseListItemFactory<
  CollectionListItem, CollectionNewItem, DtoListCollection, DtoNewCollection> {

  // <editor-fold desc='Constructor & C°'>
  public constructor() {
    super();
  }
  // </editor-fold>

  // <editor-fold desc='Abstract method implementations'>
  public createNewItem(): CollectionNewItem {
    return new CollectionNewItem();
  }

  public listDtoToListItem(dto: DtoListCollection): CollectionListItem {
    return new CollectionListItem(dto);
  }

  public newItemToNewDto(item: CollectionNewItem): DtoNewCollection {
    const result: DtoNewCollection = {
      name: item.name,
      path: item.path
    };
    return result;
  }
  // </editor-fold>
}