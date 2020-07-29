import { Injectable } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialog } from '@angular/material/dialog';
import { ParamMap } from '@angular/router';

import { DtoListPicture, DtoNewPicture } from '@ipc';

import { IpcService, DataRequestFactory } from '@core';
import { PaginationController, BaseListController } from '@shared';
import { FloatingButtonParams } from '@shared';
import { CarouselComponent } from '../../pictorama/carousel/carousel.component';
import { PictureNewItem } from '../items/picture.new-item';
import { PictureListItem } from '../items/picture.list-item';
import { PictureListItemFactory } from '../factories/picture.list-item-factory';
import { PictureDialogComponent } from '../picture-dialog/picture-dialog.component';
import { CarouselParams } from 'src/app/pictorama/carousel/carousel.params';

@Injectable()
export class PictureListController extends BaseListController<
  PictureListItem, PictureNewItem, DtoListPicture, DtoNewPicture> {

  // <editor-fold desc='Private properties'>
  private currentRoot: string;
  private currentPaginationRoute: string;
  // </editor-fold>

  // <editor-fold desc='Implementation of protected abstract getters'>
  protected get newDialogComponent(): ComponentType<any> {
    return PictureDialogComponent;
  }

  protected get paginationRoute(): string {
    return this.currentPaginationRoute;
  }

  protected get root(): string {
    return this.currentRoot;
  }
  // </editor-fold>

  // <editor-fold desc='Implementation of public abstract getters'>
  public get floatingButtonParams(): FloatingButtonParams {
    return undefined;
  }
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  constructor(
    dialog: MatDialog,
    ipcService: IpcService,
    dataRequestFactory: DataRequestFactory,
    paginationController: PaginationController,
    itemFactory: PictureListItemFactory) {
    super(dialog, ipcService, dataRequestFactory, paginationController, itemFactory);
    itemFactory.dtoToListItemCallBack = this.openPicturama.bind(this);
  }
  // </editor-fold>

  // <editor-fold desc='Implementation of abstract Public methods'>
  public processParamMap(paramMap: ParamMap): void {
    switch(paramMap.get('parent')) {
      case 'collection': {
        this.currentRoot = `/collection/${paramMap.get('id')}/pictures`;
        this.currentPaginationRoute = `/picture/collection/${paramMap.get('id')}`;
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
  }
  // </editor-fold>

  private openPicturama(item: PictureListItem): void {
    const params: CarouselParams = {
      currentRoot: this.currentRoot,
      currentId: item.id
    };
    this.dialog.open(CarouselComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '100%',
      panelClass: 'carousel-container',
      data: params
    })
  }
}
