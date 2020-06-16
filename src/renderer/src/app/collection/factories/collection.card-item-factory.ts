import { Injectable } from '@angular/core';

import { DtoGetCollection, DtoSetCollection } from '@ipc';
import { BaseCardItemFactory } from '@shared';
import { CollectionEditItem } from '../items/collection.edit-item';

@Injectable({
  providedIn: 'root'
})
export class CollectionCardItemFactory extends BaseCardItemFactory<
  CollectionEditItem, DtoGetCollection, DtoSetCollection> {

  // <editor-fold desc='Constructor & C°'>
  public constructor() {
    super();
  }
  // </editor-fold>

  // <editor-fold desc='Abstract method implementations'>
  public getDtoToEditItem(dto: DtoGetCollection): CollectionEditItem {
    return new CollectionEditItem(dto);
  }

  public editItemToSetDto(item: CollectionEditItem): DtoSetCollection {
    return { name: item.name }
  }
  // </editor-fold>
}
