import { Injectable } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialog } from '@angular/material/dialog';
import { ParamMap } from '@angular/router';

import { DtoGetPicture, DtoListPicture, DtoNewPicture, DtoSetPicture } from '@ipc';

import { IpcService, DataRequestFactory } from '@core';
import { PaginationController } from '@shared';
import { FloatingButtonParams } from '@shared';
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

  // <editor-fold desc='Private properties'>
  private currentRoot: string;
  private currentPaginationRoot: string;
  // </editor-fold>

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

  protected get paginationRoot(): string {
    return this.currentPaginationRoot;
  }

  protected get root(): string {
    return this.currentRoot;
  }
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
    dataRequestFactory: DataRequestFactory,
    paginationController: PaginationController,
    itemFactory: PictureItemFactory) {
    super(dialog, ipcService, dataRequestFactory, paginationController, itemFactory);
  }
  // </editor-fold>

  // <editor-fold desc='Implementation of abstract Public methods'>
  public processParamMap(paramMap: ParamMap): void {
    switch(paramMap.get('parent')) {
      case 'collection': {
        this.currentRoot = `/collection/${paramMap.get('id')}/pictures`;
        this.currentPaginationRoot = `/picture/collection/${paramMap.get('id')}`;
        break;
      }
      default: {
        this.currentRoot = undefined;
      }
    }

    if (paramMap.has('page')) {
      try {
        this.page = Number(paramMap.get('page'));
      } catch {
        this.page = undefined;
      }
    }
    this.loadList();
  }
  // </editor-fold>
}
