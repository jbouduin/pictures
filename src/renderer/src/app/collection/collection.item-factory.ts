import { Injectable } from '@angular/core';

import { BaseItemFactory } from '@shared';
import { DtoCollection, DtoListCollection, DtoNewCollection } from '@ipc';

import { CollectionEditItem } from './collection.edit-item';
import { CollectionListItem } from './collection.list-item';
import { CollectionNewItem } from './collection.new-item';

@Injectable({
  providedIn: 'root' // CollectionModule gives a circular reference error, maybe we can solve this if we do not providedIn but use providers in module
})
export class CollectionItemFactory extends BaseItemFactory<
  CollectionListItem, CollectionNewItem, CollectionEditItem,
  DtoListCollection, DtoNewCollection, DtoCollection> {

  // <editor-fold desc='Constructor & C°'>
  public constructor() {
    super();
  }
  // </editor-fold>

  // <editor-fold desc='Abstract method implementations'>
  public createNewItem(): CollectionNewItem {
    return new CollectionNewItem();
  }

  public getDtoToItem(dto: DtoCollection): CollectionEditItem {
    return new CollectionEditItem(dto);
  }

  public existingItemToDto(item: CollectionEditItem): DtoCollection {
    return {
      id: item.id,
      created: item.created,
      modified: item.modified,
      version: item.version,
      name: item.name,
      path: item.path
    }
  }

  public listDtoToItem(dto: DtoListCollection): CollectionListItem {
    return new CollectionListItem(dto);
  }

  public newItemToDto(item: CollectionNewItem): DtoNewCollection {
    const result: DtoNewCollection = {
      name: item.name,
      path: item.path
    };
    return result;
  }
  // </editor-fold>
}
