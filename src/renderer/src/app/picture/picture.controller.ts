import { Injectable } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { DtoGetPicture, DtoListPicture, DtoNewPicture, DtoSetPicture } from '@ipc';

import { IpcService } from '@core';
import { DynamicDialogParams, FloatingButtonParams } from '@shared';
import { ThumbCardFooterParams, ThumbController } from '@shared';

// FIXME WARNING in Circular dependency detected:
// src\renderer\src\app\collection\collection-dialog\collection-dialog.component.ts -> src\renderer\src\app\collection\new.controller.ts -
// > src\renderer\src\app\collection\collection-dialog\collection-dialog.component.ts
import { PictureDialogComponent } from './picture-dialog/picture-dialog.component';
import { PictureEditItem } from './picture.edit-item';
import { PictureItemFactory } from './picture.item-factory';
import { PictureListItem } from './picture.list-item';
import { PictureNewItem } from './picture.new-item';

@Injectable()
export class PictureController extends ThumbController<
  PictureListItem, PictureNewItem, PictureEditItem,
  DtoListPicture, DtoGetPicture, DtoNewPicture, DtoSetPicture> {

  // <editor-fold desc='Implementation of protected abstract getters'>
  protected get deleteDialogText(): string {
    return undefined;
  }

  protected get editDialogComponent(): ComponentType<any> {
    return PictureDialogComponent;
  }

  protected get newDialogComponent(): ComponentType<any> {
    return PictureDialogComponent;
  }

  protected get root(): string { return '/collection'; }
  // </editor-fold>

  // <editor-fold desc='Implementation of public abstract getters'>
  public get cardFooterIcon(): string {
    return "local_offer";
  }

  public get floatingButtonParams(): FloatingButtonParams {
    return undefined;
  }

  public get thumbCardFooterParams(): Array<ThumbCardFooterParams> {
    return [
      new ThumbCardFooterParams(undefined, 'icon-button hover green', 'edit', this.edit.bind(this))
    ];
  }

  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  constructor(
    dialog: MatDialog,
    ipcService: IpcService,
    itemFactory: PictureItemFactory) {
    super(dialog, ipcService, itemFactory);
  }
  // </editor-fold>
}
