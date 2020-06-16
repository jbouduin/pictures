import { Injectable } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialog } from '@angular/material/dialog';
import { ParamMap } from '@angular/router';

import { DtoGetPicture, DtoSetPicture } from '@ipc';

import { IpcService, DataRequestFactory } from '@core';
import { BaseCardController, ThumbCardFooterParams } from '@shared';
import { PictureEditItem } from '../items/picture.edit-item';
import { PictureCardItemFactory } from '../factories/picture.card-item-factory';
import { PictureDialogComponent } from '../picture-dialog/picture-dialog.component';

// FIXME WARNING in Circular dependency detected:
// src\renderer\src\app\collection\collection-dialog\collection-dialog.component.ts -> src\renderer\src\app\collection\new.controller.ts -
// > src\renderer\src\app\collection\collection-dialog\collection-dialog.component.ts

@Injectable()
export class PictureCardController extends BaseCardController<PictureEditItem, DtoGetPicture, DtoSetPicture> {

  // <editor-fold desc='Private properties'>
  private currentRoot: string;
  // </editor-fold>

  // <editor-fold desc='Implementation of protected abstract getters'>
  protected get deleteDialogText(): string {
    return undefined;
  }

  protected get editDialogComponent(): ComponentType<any> {
    return PictureDialogComponent;
  }

  protected get root(): string {
    return this.currentRoot;
  }
  // </editor-fold>

  // <editor-fold desc='Implementation of public abstract getters'>
  public get cardFooterIcon(): string {
    return "local_offer";
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
    dataRequestFactory: DataRequestFactory,
    itemFactory: PictureCardItemFactory) {
    super(dialog, ipcService, dataRequestFactory, itemFactory);
  }
  // </editor-fold>
}
