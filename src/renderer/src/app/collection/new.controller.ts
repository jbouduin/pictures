import { Injectable } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { DataVerb, DtoUntypedDataRequest } from '@ipc';

import { IpcService } from '@core';
import { DynamicDialogParams } from '@shared';
import { ThumbController } from '@shared';

import { DtoCollection, DtoListCollection, DtoNewCollection } from '@ipc';

import { CollectionDialogComponent } from './collection-dialog/collection-dialog.component';
import { CollectionEditItem } from './collection.edit-item';
import { CollectionItemFactory } from './collection.item-factory';
import { CollectionListItem } from './collection.list-item';
import { CollectionNewItem } from './collection.new-item';

@Injectable({
  providedIn: 'root' // CollectionModule gives a circular reference error, maybe we can solve this if we do not providedIn but use providers in module
})
export class NewController extends ThumbController<
  CollectionListItem, CollectionNewItem, CollectionEditItem,
  DtoListCollection, DtoNewCollection, DtoCollection> {

  // <editor-fold desc='Implementation of abstract getters'>
  protected get editDialogComponent(): ComponentType<any> {
    return CollectionDialogComponent;
  }
  protected get newDialogComponent(): ComponentType<any> {
    return CollectionDialogComponent;
  }
  protected get root(): string { return '/collection'; }
  protected get deleteDialogText(): string {
    return `Click on 'Delete' to remove the collection. This will remove the collection and all related data from the database. Physical files on disk will remain untouched.`;
  }
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  constructor(
    dialog: MatDialog,
    ipcService: IpcService,
    itemFactory: CollectionItemFactory) {
    super(dialog, ipcService, itemFactory);
  }
  // </editor-fold>

  // <editor-fold desc='Specific methods'>
  public scan(dtoListCollection: CollectionListItem): void {
    const request: DtoUntypedDataRequest = {
      verb: DataVerb.POST,
      path: `/collection/${dtoListCollection.id}/scan`
    };
    this.ipcService
      .untypedDataRequest<string>(request)
      .then(
        undefined,
        error => {
          alert(error.message);
        }
      );
  }
  // </editor-fold>
}
