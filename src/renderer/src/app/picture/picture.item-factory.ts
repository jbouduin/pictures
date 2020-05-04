import { Injectable } from '@angular/core';

import { BaseItemFactory } from '@shared';
import { DtoGetPicture, DtoListPicture } from '@ipc';

import { PictureEditItem } from './picture.edit-item';
import { PictureListItem } from './picture.list-item';
import { PictureNewItem } from './picture.new-item';

@Injectable({
  providedIn: 'root' // CollectionModule gives a circular reference error, maybe we can solve this if we do not providedIn but use providers in module
})
export class PictureItemFactory extends BaseItemFactory<
  PictureListItem, PictureNewItem, PictureEditItem,
  DtoListPicture, DtoGetPicture, DtoGetPicture> {

  // <editor-fold desc='Constructor & C°'>
  public constructor() {
    super();
  }
  // </editor-fold>

  // <editor-fold desc='Abstract method implementations'>
  public createNewItem(): PictureNewItem {
    return undefined;
  }

  public getDtoToItem(dto: DtoGetPicture): PictureEditItem {
    return new PictureEditItem(dto);
  }

  public existingItemToDto(item: PictureEditItem): DtoGetPicture {
    return undefined;
    // {
    //   id: item.id,
    //   created: item.created,
    //   modified: item.modified,
    //   version: item.version,
    //   name: item.name,
    //   path: item.path
    // }
  }

  public listDtoToItem(dto: DtoListPicture): PictureListItem {
    return new PictureListItem(dto);
  }

  public newItemToDto(item: PictureNewItem): DtoGetPicture {
    // const result: DtoNewCollection = {
    //   name: item.name,
    //   path: item.path
    // };
    return undefined;
  }
  // </editor-fold>
}
