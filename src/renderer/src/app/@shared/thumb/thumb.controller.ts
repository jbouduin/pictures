import { Component, Injectable } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { DataVerb, DtoDataRequest, DtoUntypedDataRequest } from '@ipc';
import { IpcService } from '@core';

import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogParams } from '../confirmation-dialog/confirmation-dialog.params';
import { DynamicDialogComponent } from '../dynamic-dialog/dynamic-dialog.component';
import { DynamicDialogParams } from '../dynamic-dialog/dynamic-dialog.params';

import { BaseItemFactory } from './base.item-factory';

import { ListItem } from './list-item';
import { BaseItem } from './base-item';

// QUESTION as this one is abstract, maybe it doesn't have to be Injectable anymore?
@Injectable({
  providedIn: 'root'
})
export abstract class ThumbController<
  L extends ListItem, N extends BaseItem, E extends BaseItem,
  DtoL, DtoN, DtoE> {

  // <editor-fold desc='Private properties'>
  private listItems: Array<L>;
  private dialogRef: MatDialogRef<any>;
  // </editor-fold>

  // <editor-fold desc='Public get methods'>
  public get cards(): Array<L>{
    return this.listItems;
  }
  // </editor-fold>

  // <editor-fold desc='Abstract getters'>
  protected abstract get editDialogComponent(): ComponentType<any>;
  protected abstract get deleteDialogText(): string;
  protected abstract get newDialogComponent(): ComponentType<any>;
  protected abstract get root(): string;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  constructor(
    protected dialog: MatDialog,
    protected ipcService: IpcService,
    protected itemFactory: BaseItemFactory<L, N, E, DtoL, DtoN, DtoE>) {
    this.listItems = new Array<L>();
    this.dialogRef = undefined;
  }
  // </editor-fold>

  // <editor-fold desc='Public Create related methods'>
  public create(): void {
    this.dialogRef = this.dialog.open(
      DynamicDialogComponent,
      {
        data: {
          component: this.newDialogComponent,
          item: this.itemFactory.createNewItem()
        },
        width: '600px'
      }
    );
    this.dialogRef.afterClosed().subscribe( () => this.dialogRef = undefined);
  }

  public commitCreate(newItem: N): Promise<L> {
    const request: DtoDataRequest<DtoN> = {
      verb: DataVerb.POST,
      path: this.root,
      data: this.itemFactory.newItemToDto(newItem)
    };
    return this.ipcService
      .dataRequest<DtoN, DtoL>(request)
      .then(
        result => {
          const listItem = this.itemFactory.listDtoToItem(result.data);
          this.listItems.splice(0, 0, listItem);
          if (this.dialogRef) {
            this.dialogRef.close()
          };
          return listItem;
        },
        error => {
          const listItem = this.itemFactory.listDtoToItem(error.data);
          alert(error.message);
          return listItem;
        }
      );
  }
  // </editor-fold>

  // <editor-fold desc='Public Edit related methods'>
  public edit(listItem: L): void {
    const request: DtoUntypedDataRequest = {
      verb: DataVerb.GET,
      path: `${this.root}/${listItem.id}`,
    };
    this.ipcService
      .untypedDataRequest<DtoE>(request)
      .then(response => {
        const params: DynamicDialogParams<E> = {
          data: {
            component: this.editDialogComponent,
            item: this.itemFactory.getDtoToItem(response.data)
          },
          width: '600px'
        };
        this.dialogRef = this.dialog.open(DynamicDialogComponent, params);
        this.dialogRef.afterClosed().subscribe( () => this.dialogRef = undefined);
      },
      error => {
        alert(error.message);
      }
    );
  }

  public commitEdit(editedItem: E): Promise<L> {
    const request: DtoDataRequest<DtoE> = {
      verb: DataVerb.PUT,
      path: `${this.root}/${editedItem.id}`,
      data: this.itemFactory.existingItemToDto(editedItem)
    };
    return this.ipcService
      .dataRequest<DtoE, DtoL>(request)
      .then(
        response => {
          const listItem = this.itemFactory.listDtoToItem(response.data);
          const index = this.listItems.findIndex( item => item.id === listItem.id);
          this.listItems[index] = listItem;
          if (this.dialogRef) {
            this.dialogRef.close()
          };
          return listItem;
        },
        error => {
          const listItem = this.itemFactory.listDtoToItem(error.data);
          alert(error.message);
          return listItem;
        }
      );
  }
  // </editor-fold>

  // <editor-fold desc='Other methods'>
  public cancelDialog(): void {
    if (this.dialogRef) {
      // TODO check for changes
      this.dialogRef.close();
    }
  }

  public loadList(): Promise<Array<L>> {
    const request: DtoUntypedDataRequest = {
      verb: DataVerb.GET,
      path: this.root
    };

    return this.ipcService
      .untypedDataRequest<Array<DtoL>>(request)
      .then(response => this.listItems = response.data.map( listItem => this.itemFactory.listDtoToItem(listItem)));
  }

  public delete(listItem: L): void {
    const dialogParams = new ConfirmationDialogParams();
    dialogParams.okButtonLabel = 'Delete';
    dialogParams.title = `Delete '${listItem.name}'?`;
    dialogParams.text = this.deleteDialogText;

    const confirmDialog = this.dialog.open(
      ConfirmationDialogComponent,
      {
        width: '600px',
        data: dialogParams
      }
    );
    confirmDialog.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        const request: DtoUntypedDataRequest = {
          verb: DataVerb.DELETE,
          path: `${this.root}/${listItem.id}`
        };
        this.ipcService
          .untypedDataRequest<string>(request)
          .then(
            response => {
              const index = this.listItems.findIndex( item => item.id === listItem.id);
              this.listItems.splice(index, 1);
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
