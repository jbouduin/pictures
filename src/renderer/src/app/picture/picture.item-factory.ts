import { Injectable } from '@angular/core';

import { BaseItemFactory } from '@shared';
import { DtoGetPicture, DtoListPicture, DtoNewPicture, DtoSetPicture } from '@ipc';

import { PictureEditItem } from './picture.edit-item';
import { PictureListItem } from './picture.list-item';
import { PictureNewItem } from './picture.new-item';

@Injectable({
  providedIn: 'root' // CollectionModule gives a circular reference error, maybe we can solve this if we do not providedIn but use providers in module
})
export class PictureItemFactory extends BaseItemFactory<
  PictureListItem, PictureNewItem, PictureEditItem,
  DtoListPicture, DtoGetPicture, DtoNewPicture, DtoSetPicture> {

  // <editor-fold desc='Constructor & C°'>
  public constructor() {
    super();
  }
  // </editor-fold>

  // <editor-fold desc='Abstract method implementations'>
  public createNewItem(): PictureNewItem {
    return undefined;
  }

  public getDtoToEditItem(dto: DtoGetPicture): PictureEditItem {
    return new PictureEditItem(dto);
  }

  public editItemToSetDto(item: PictureEditItem): DtoGetPicture {
    return undefined;
  }

  public listDtoToListItem(dto: DtoListPicture): PictureListItem {
    return new PictureListItem(dto);
  }

  public newItemToNewDto(item: PictureNewItem): DtoGetPicture {
    return undefined;
  }
  // </editor-fold>
}
