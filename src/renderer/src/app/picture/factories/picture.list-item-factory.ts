import { Injectable } from '@angular/core';
import { DtoListPicture, DtoNewPicture } from '@ipc';
import { BaseListItemFactory } from '@shared';
import { PictureListItem } from '../items/picture.list-item';
import { PictureNewItem } from '../items/picture.new-item';

@Injectable({
  providedIn: 'root'
})
export class PictureListItemFactory extends BaseListItemFactory<PictureListItem, PictureNewItem, DtoListPicture, DtoNewPicture> {

  // <editor-fold desc='Constructor & C°'>
  public constructor() {
    super();
  }
  // </editor-fold>

  // <editor-fold desc='Abstract method implementations'>
  public createNewItem(): PictureNewItem {
    return undefined;
  }

  public listDtoToListItem(dto: DtoListPicture): PictureListItem {
    return new PictureListItem(dto);
  }

  public newItemToNewDto(_item: PictureNewItem): DtoNewPicture {
    return undefined;
  }
  // </editor-fold>
}
