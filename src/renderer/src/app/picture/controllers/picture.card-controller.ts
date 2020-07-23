import { Injectable } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialog } from '@angular/material/dialog';

import { DtoGetPicture, DtoSetPicture, DataVerb } from '@ipc';

import { IpcService, DataRequestFactory, IpcDataRequest } from '@core';
import { BaseCardController, ThumbCardFooterParams } from '@shared';
import { PictureEditItem } from '../items/picture.edit-item';
import { PictureCardItemFactory } from '../factories/picture.card-item-factory';
import { PictureDialogComponent } from '../picture-dialog/picture-dialog.component';
import { PictureListItem } from '../items/picture.list-item';

@Injectable()
export class PictureCardController extends BaseCardController<PictureEditItem, DtoGetPicture, DtoSetPicture> {

  // <editor-fold desc='Private properties'>
  // </editor-fold>

  // <editor-fold desc='Implementation of protected abstract getters'>
  protected get deleteDialogText(): string {
    return undefined;
  }

  protected get editDialogComponent(): ComponentType<any> {
    return PictureDialogComponent;
  }

  protected get root(): string {
    return '/';
  }
  // </editor-fold>

  // <editor-fold desc='Implementation of public abstract getters'>
  public get cardFooterIcon(): string {
    return "local_offer";
  }

  public get thumbCardFooterParams(): Array<ThumbCardFooterParams> {
    return [
      new ThumbCardFooterParams(undefined, 'icon-button hover green', 'bookmark', this.setAsThumb.bind(this)),
      new ThumbCardFooterParams(undefined, 'icon-button hover green', 'edit', this.edit.bind(this))
    ];
  }
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  constructor(
    dialog: MatDialog,
    ipcService: IpcService,
    dataRequestFactory: DataRequestFactory,
    itemFactory: PictureCardItemFactory) {
    super(dialog, ipcService, dataRequestFactory, itemFactory);
  }
  // </editor-fold>

  // <editor-fold desc='Private methods'>
  public setAsThumb(listItem: PictureListItem): void {
    const request: IpcDataRequest = this.dataRequestFactory.createDataRequest<number>(
      DataVerb.PUT,
      `/collection/${listItem.collection.id}/thumbnail`,
      listItem.id);
    this.ipcService.dataRequest<any>(request);
  }
  // </editor-fold>
}
