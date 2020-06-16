import { Injectable } from '@angular/core';
import { DtoGetPicture, DtoSetPicture } from '@ipc';
import { BaseCardItemFactory } from '@shared';
import { PictureEditItem } from '../items/picture.edit-item';

@Injectable({
  providedIn: 'root'
})
export class PictureCardItemFactory extends BaseCardItemFactory<PictureEditItem, DtoGetPicture,  DtoSetPicture> {

  // <editor-fold desc='Constructor & C°'>
  public constructor() {
    super();
  }
  // </editor-fold>

  // <editor-fold desc='Abstract method implementations'>
  public getDtoToEditItem(dto: DtoGetPicture): PictureEditItem {
    return new PictureEditItem(dto);
  }

  public editItemToSetDto(_item: PictureEditItem): DtoGetPicture {
    return undefined;
  }
  // </editor-fold>
}
