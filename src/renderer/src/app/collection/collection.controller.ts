import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { IpcService } from '@core';
import { DataVerb, DtoDataRequest, DtoUntypedDataRequest } from '@ipc';
import { DtoCollection, DtoListCollection, DtoNewCollection } from '@ipc';
import { ConfirmationDialogComponent, ConfirmationDialogParams } from '@shared';

import { CollectionDialogComponent } from './collection-dialog/collection-dialog.component';
// import { CollectionModule } from './collection.module';

@Injectable({
  providedIn: 'root' // CollectionModule gives a circular reference error, maybe we can solve this if we do not providedIn but use providers in module
})
export class CollectionController {

  // <editor-fold desc='Private properties'>
  private collections: Array<DtoListCollection>;
  private collectionDialog: MatDialogRef<CollectionDialogComponent>;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  constructor(
    private dialog: MatDialog,
    private ipcService: IpcService) {
    this.collections = new Array<DtoListCollection>();
    this.collectionDialog = undefined;
  }
  // </editor-fold>

  // <editor-fold desc='Public get methods'>
  public get cards(): Array<DtoListCollection>{
    return this.collections;
  }
  // </editor-fold>

  // <editor-fold desc='Public methods'>

  public cancelDialog(): void {
    if (this.collectionDialog) {
      // TODO check for changes
      this.collectionDialog.close();
    }
  }
  public loadList(): Promise<Array<DtoListCollection>> {
    const request: DtoUntypedDataRequest = {
      verb: DataVerb.GET,
      path: '/collection'
    };

    return this.ipcService
      .untypedDataRequest<Array<DtoListCollection>>(request)
      .then(result => this.collections = result.data);
  }
  // </editor-fold>

  // <editor-fold desc='Public Create related methods'>
  public create(): void {
    const dtoNewCollection: DtoNewCollection = {
      name: undefined,
      path: undefined
    };

    // todo create a CollectionDialogComponent factory to avoid circular references
    this.collectionDialog = this.dialog.open(
      CollectionDialogComponent,
      {
        width: '600px',
        data: dtoNewCollection
      }
    );
    this.collectionDialog.afterClosed().subscribe( () => this.collectionDialog = undefined);
  }

  public commitCreate(newCollection: DtoNewCollection): Promise<DtoListCollection> {
    const request: DtoDataRequest<DtoNewCollection> = {
      verb: DataVerb.POST,
      path: '/collection',
      data: newCollection
    };
    return this.ipcService
      .dataRequest<DtoNewCollection, DtoListCollection>(request)
      .then(
        result => {
          this.collections.splice(0, 0, result.data);
          if (this.collectionDialog) {
            this.collectionDialog.close()
          };
          return result.data;
        },
        error => {
          alert(error.message);
          return error.data;
        }
      );
  }
  // </editor-fold>

  // <editor-fold desc='Public Edit related methods'>
  public edit(dtoListCollection: DtoListCollection): void {
    const request: DtoUntypedDataRequest = {
      verb: DataVerb.GET,
      path: `/collection/${dtoListCollection.id}`,
    };
    this.ipcService
      .untypedDataRequest<DtoCollection>(request)
      .then(
        dtoCollection => {
          this.collectionDialog = this.dialog.open(
            CollectionDialogComponent,
            {
              width: '600px',
              data: dtoCollection.data
            }
          );
          this.collectionDialog.afterClosed().subscribe( () => this.collectionDialog = undefined);
        },
        error => {
          alert(error.message);
        }
      );
  }

  public commitEdit(dtoCollection: DtoCollection): Promise<DtoListCollection> {
    const request: DtoDataRequest<DtoCollection> = {
      verb: DataVerb.PUT,
      path: `/collection/${dtoCollection.id}`,
      data: dtoCollection
    };
    return this.ipcService
      .dataRequest<DtoCollection, DtoListCollection>(request)
      .then(
        result => {
          const index = this.collections.findIndex( collection => collection.id === result.data.id);
          this.collections[index] = result.data;
          if (this.collectionDialog) {
            this.collectionDialog.close()
          };
          return result.data;
        },
        error => {
          alert(error.message);
          return error.data;
        }
      );
  }
  // </editor-fold>

  // <editor-fold desc='Delete related methods'>
  public delete(dtoListCollection: DtoListCollection): void {
    const dialogParams = new ConfirmationDialogParams();
    dialogParams.okButtonLabel = 'Delete';
    dialogParams.title = `Delete collection '${dtoListCollection.name}'?`;
    dialogParams.text =
    `Click on 'Delete' to remove the collection.
This will remove the collection and all related data from the database. Physical files on disk will remain untouched.`;

    const dialogRef = this.dialog.open(
      ConfirmationDialogComponent,
      {
        width: '600px',
        data: dialogParams
      }
    );
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const request: DtoUntypedDataRequest = {
          verb: DataVerb.DELETE,
          path: `/collection/${dtoListCollection.id}`
        };
        this.ipcService
          .untypedDataRequest<string>(request)
          .then(
            result => {
              const index = this.collections.findIndex( collection => collection.id === dtoListCollection.id);
              this.collections.splice(index, 1);
            },
            error => {
              alert(error.message);
            }
          );
      }
    });
  }
  // </editor-fold>

}
