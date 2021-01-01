import { Injectable } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialog } from '@angular/material/dialog';
import { ParamMap } from '@angular/router';

import { DtoListCollection, DtoNewCollection } from '@ipc';
import { IpcService, DataRequestFactory } from '@ipc';
import { PaginationController, BaseListController } from '@shared';
import { FloatingButtonParams } from '@shared';

import { CollectionListItem } from '../items/collection.list-item';
import { CollectionNewItem } from '../items/collection.new-item';
import { CollectionDialogComponent } from '../collection-dialog/collection-dialog.component';
import { CollectionListItemFactory } from '../factories/collection.list-item-factory';

@Injectable()
export class CollectionListController
  extends BaseListController<CollectionListItem, CollectionNewItem, DtoListCollection, DtoNewCollection> {

  // <editor-fold desc='Implementation of protected abstract getters'>
  protected get newDialogComponent(): ComponentType<any> {
    return CollectionDialogComponent;
  }

  protected get paginationRoute(): string {
    return '/home';
  }

  protected get root(): string { return '/collection'; }
  // </editor-fold>

  // <editor-fold desc='Implementation of public abstract getters'>
  public get floatingButtonParams(): FloatingButtonParams {
    return new FloatingButtonParams('Add new', 'add', 'primary', this.create.bind(this));
  }
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  constructor(
    dialog: MatDialog,
    ipcService: IpcService,
    dataRequestFactory: DataRequestFactory,
    paginationController: PaginationController,
    itemFactory: CollectionListItemFactory) {
    super(dialog, ipcService, dataRequestFactory, paginationController, itemFactory);
  }
  // </editor-fold>

  // <editor-fold desc='Implementation of abstract Public methods'>
  public processParamMap(paramMap: ParamMap): void {
    if (paramMap.has('page')) {
      try {
        this.page = Number(paramMap.get('page'));
      } catch {
        this.page = undefined;
      }
    }
  }
  // </editor-fold>
}
