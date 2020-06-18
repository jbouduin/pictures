import { Injectable } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialog } from '@angular/material/dialog';

import { DataVerb } from '@ipc';
import { DtoGetCollection, DtoSetCollection } from '@ipc';

import { IpcService, DataRequestFactory, IpcDataRequest } from '@core';
import { BaseCardController } from '@shared';
import { ThumbCardFooterParams } from '@shared';
import { CollectionEditItem } from '../items/collection.edit-item';
import { CollectionDialogComponent } from '../collection-dialog/collection-dialog.component';
import { CollectionListItem } from '../items/collection.list-item';
import { CollectionCardItemFactory } from '../factories/collection.card-item-factory';

// FIXME WARNING in Circular dependency detected:
// src\renderer\src\app\collection\collection-dialog\collection-dialog.component.ts -> src\renderer\src\app\collection\new.controller.ts -
// > src\renderer\src\app\collection\collection-dialog\collection-dialog.component.ts

@Injectable()
export class CollectionCardController extends BaseCardController<CollectionEditItem, DtoGetCollection, DtoSetCollection> {

  // <editor-fold desc='Implementation of protected abstract getters'>
  protected get deleteDialogText(): string {
    return `Click on 'Delete' to remove the collection. This will remove the collection and all related data from the database. Physical files on disk will remain untouched.`;
  }

  protected get editDialogComponent(): ComponentType<any> {
    return CollectionDialogComponent;
  }

  protected get root(): string { return '/collection'; }
  // </editor-fold>

  // <editor-fold desc='Implementation of public abstract getters'>
  public get cardFooterIcon(): string {
    return "camera_alt";
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
    itemFactory: CollectionCardItemFactory) {
    super(dialog, ipcService, dataRequestFactory, itemFactory);
  }
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
