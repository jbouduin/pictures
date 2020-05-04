import { Injectable } from '@angular/core';

import { BaseItemFactory } from '@shared';
import { DtoGetCollection, DtoListCollection, DtoNewCollection, DtoSetCollection } from '@ipc';

import { CollectionEditItem } from './collection.edit-item';
import { CollectionListItem } from './collection.list-item';
import { CollectionNewItem } from './collection.new-item';

@Injectable({
  providedIn: 'root' // CollectionModule gives a circular reference error, maybe we can solve this if we do not providedIn but use providers in module
})
export class CollectionItemFactory extends BaseItemFactory<
  CollectionListItem, CollectionNewItem, CollectionEditItem,
  DtoListCollection, DtoGetCollection, DtoNewCollection, DtoSetCollection> {

  // <editor-fold desc='Constructor & C°'>
  public constructor() {
    super();
  }
  // </editor-fold>

  // <editor-fold desc='Abstract method implementations'>
  public createNewItem(): CollectionNewItem {
    return new CollectionNewItem();
  }

  public getDtoToEditItem(dto: DtoGetCollection): CollectionEditItem {
    return new CollectionEditItem(dto);
  }

  public editItemToSetDto(item: CollectionEditItem): DtoSetCollection {
    return { name: item.name }
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
