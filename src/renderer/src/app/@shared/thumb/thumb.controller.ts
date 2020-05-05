import { Component, Injectable } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { IpcService } from '@core';
import { DataVerb, DtoDataRequest, DtoUntypedDataRequest } from '@ipc';
import { DtoListBase, DtoGetBase, DtoNewBase, DtoSetBase } from '@ipc';

import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogParams } from '../confirmation-dialog/confirmation-dialog.params';
import { FloatingButtonParams } from '../floating-button/floating-button.params';
import { DynamicDialogComponent } from '../dynamic-dialog/dynamic-dialog.component';
import { DynamicDialogParams } from '../dynamic-dialog/dynamic-dialog.params';
import { PaginationController } from '../pagination/pagination.controller';
import { PaginationParams } from '../pagination/pagination.params';

import { BaseItemFactory } from './base.item-factory';

import { ListItem } from './list-item';
import { BaseItem } from './base-item';
import { ThumbCardFooterParams } from './thumb-card-footer.params';

// QUESTION as this one is abstract, maybe it doesn't have to be Injectable anymore?
// @Injectable({
//   providedIn: 'root'
// })
export abstract class ThumbController<
  L extends ListItem, N extends BaseItem, E extends BaseItem,
  DtoL extends DtoListBase, DtoG extends DtoGetBase, DtoN extends DtoNewBase, DtoS extends DtoSetBase> {

  // <editor-fold desc='Private properties'>
  private listItems: Array<L>;
  private dialogRef: MatDialogRef<any>;
  // </editor-fold>

  // <editor-fold desc='Public get methods'>
  public get cards(): Array<L>{
    return this.listItems;
  }

  public get pagination(): PaginationController {
    return this.paginationController
  }
  // </editor-fold>

  // <editor-fold desc='Abstract protected getters'>
  protected abstract get editDialogComponent(): ComponentType<any>;
  protected abstract get deleteDialogText(): string;
  protected abstract get newDialogComponent(): ComponentType<any>;
  protected abstract get root(): string;
  // </editor-fold>

  // <editor-fold desc='Abstract public getters'>
  public abstract get thumbCardFooterParams(): Array<ThumbCardFooterParams>;
  public abstract get floatingButtonParams(): FloatingButtonParams;
  public abstract get cardFooterIcon(): string;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  constructor(
    protected dialog: MatDialog,
    protected ipcService: IpcService,
    protected paginationController: PaginationController,
    protected itemFactory: BaseItemFactory<L, N, E, DtoL, DtoG, DtoN, DtoS>) {
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
      data: this.itemFactory.newItemToNewDto(newItem)
    };
    return this.ipcService
      .dataRequest<DtoN, DtoL>(request)
      .then(
        result => {
          const listItem = this.itemFactory.listDtoToListItem(result.data);
          this.listItems.splice(0, 0, listItem);
          if (this.dialogRef) {
            this.dialogRef.close()
          };
          return listItem;
        },
        error => {
          const listItem = this.itemFactory.listDtoToListItem(error.data);
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
      .untypedDataRequest<DtoG>(request)
      .then(response => {
        const params: DynamicDialogParams<E> = {
          data: {
            component: this.editDialogComponent,
            item: this.itemFactory.getDtoToEditItem(response.data)
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
    const request: DtoDataRequest<DtoS> = {
      verb: DataVerb.PUT,
      path: `${this.root}/${editedItem.id}`,
      data: this.itemFactory.editItemToSetDto(editedItem)
    };
    return this.ipcService
      .dataRequest<DtoS, DtoL>(request)
      .then(
        response => {
          const listItem = this.itemFactory.listDtoToListItem(response.data);
          const index = this.listItems.findIndex( item => item.id === listItem.id);
          this.listItems[index] = listItem;
          if (this.dialogRef) {
            this.dialogRef.close()
          };
          return listItem;
        },
        error => {
          const listItem = this.itemFactory.listDtoToListItem(error.data);
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

    // TODO:
    this.paginationController.setPagination(new PaginationParams(1, 5, undefined));
    return this.ipcService
      .untypedDataRequest<Array<DtoL>>(request)
      .then(response => this.listItems = response.data.map( listItem => this.itemFactory.listDtoToListItem(listItem)));
  }

  public remove(listItem: L): void {
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
