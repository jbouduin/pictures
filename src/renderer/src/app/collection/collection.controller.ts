import { Injectable } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialog } from '@angular/material/dialog';
import { ParamMap } from '@angular/router';

import { DataVerb } from '@ipc';
import { DtoGetCollection, DtoListCollection, DtoNewCollection, DtoSetCollection } from '@ipc';

import { IpcService, DataRequestFactory, IpcDataRequest } from '@core';
import { PaginationController } from '@shared';
import { FloatingButtonParams } from '@shared';
import { ThumbCardFooterParams, ThumbController } from '@shared';

// FIXME WARNING in Circular dependency detected:
// src\renderer\src\app\collection\collection-dialog\collection-dialog.component.ts -> src\renderer\src\app\collection\new.controller.ts -
// > src\renderer\src\app\collection\collection-dialog\collection-dialog.component.ts
import { CollectionDialogComponent } from './collection-dialog/collection-dialog.component';
import { CollectionEditItem } from './collection.edit-item';
import { CollectionItemFactory } from './collection.item-factory';
import { CollectionListItem } from './collection.list-item';
import { CollectionNewItem } from './collection.new-item';

@Injectable()
export class CollectionController extends ThumbController<
  CollectionListItem, any, CollectionNewItem, CollectionEditItem,
  DtoListCollection, DtoGetCollection, DtoNewCollection, DtoSetCollection> {

  // <editor-fold desc='Implementation of protected abstract getters'>
  protected get deleteDialogText(): string {
    return `Click on 'Delete' to remove the collection. This will remove the collection and all related data from the database. Physical files on disk will remain untouched.`;
  }

  protected get editDialogComponent(): ComponentType<any> {
    return CollectionDialogComponent;
  }

  protected get newDialogComponent(): ComponentType<any> {
    return CollectionDialogComponent;
  }

  protected get paginationRoute(): string {
    return '/home';
  }

  protected get root(): string { return '/collection'; }
  // </editor-fold>

  // <editor-fold desc='Implementation of public abstract getters'>
  public get cardFooterIcon(): string {
    return "camera_alt";
  }

  public get floatingButtonParams(): FloatingButtonParams {
    return new FloatingButtonParams('Add new', 'add', 'primary', this.create.bind(this));
  }

  public get thumbCardFooterParams(): Array<ThumbCardFooterParams> {
    return [
      new ThumbCardFooterParams(undefined, 'icon-button hover green', 'refresh', this.scan.bind(this)),
      new ThumbCardFooterParams(undefined, 'icon-button hover green', 'edit', this.edit.bind(this)),
      new ThumbCardFooterParams(undefined, 'icon-button hover red', 'delete', this.remove.bind(this))
    ]
  }

  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  constructor(
    dialog: MatDialog,
    ipcService: IpcService,
    dataRequestFactory: DataRequestFactory,
    paginationController: PaginationController,
    itemFactory: CollectionItemFactory) {
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
    // this.loadList();
  }

  public getTreeItems(_list: Array<CollectionListItem>): Array<any> | undefined {
    return undefined;
  };
  // </editor-fold>

  // <editor-fold desc='Specific methods'>
  public scan(dtoListCollection: CollectionListItem): void {
    const request: IpcDataRequest = this.dataRequestFactory.createUntypedDataRequest(
      DataVerb.POST,
      `/collection/${dtoListCollection.id}/scan`);
    this.ipcService
      .dataRequest<string>(request)
      .then(
        undefined,
        error => {
          alert(error.message);
        }
      );
  }
  // </editor-fold>
}
