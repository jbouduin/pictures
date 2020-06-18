import { ComponentType } from '@angular/cdk/portal';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { IpcService, IpcDataRequest, DataRequestFactory } from '@core';
import { DataVerb } from '@ipc';
import { DtoGetBase, DtoSetBase } from '@ipc';

import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogParams } from '../../confirmation-dialog/confirmation-dialog.params';
import { DynamicDialogComponent } from '../../dynamic-dialog/dynamic-dialog.component';
import { DynamicDialogParams } from '../../dynamic-dialog/dynamic-dialog.params';

import { BaseItem } from '../base-item';
import { ThumbCardFooterParams } from './thumb-card-footer.params';
import { BaseCardItemFactory } from './base.card-item-factory';

export abstract class BaseCardController<E extends BaseItem, DtoGet extends DtoGetBase, DtoSet extends DtoSetBase> {

  // <editor-fold desc='Private properties'>
  private dialogRef: MatDialogRef<any>;
  // </editor-fold>

  // <editor-fold desc='Protected properties'>
  protected dialog: MatDialog;
  protected ipcService: IpcService;
  protected dataRequestFactory: DataRequestFactory;
  protected itemFactory: BaseCardItemFactory<E, DtoGet, DtoSet>;
  // </editor-fold>

  // <editor-fold desc='Abstract protected getters'>
  protected abstract get editDialogComponent(): ComponentType<any>;
  protected abstract get deleteDialogText(): string;
  protected abstract get root(): string;
  // </editor-fold>

  // <editor-fold desc='Abstract public getters'>
  public abstract get thumbCardFooterParams(): Array<ThumbCardFooterParams>;
  public abstract get cardFooterIcon(): string;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  constructor(
    dialog: MatDialog,
    ipcService: IpcService,
    dataRequestFactory: DataRequestFactory,
    itemFactory: BaseCardItemFactory<E, DtoGet, DtoSet>) {

    this.dialog = dialog;
    this.ipcService = ipcService;
    this.dataRequestFactory = dataRequestFactory;
    this.itemFactory = itemFactory;
    this.dialogRef = undefined;
  }
  // </editor-fold>

  // <editor-fold desc='Abstract public methods'>
  // </editor-fold>

  // <editor-fold desc='Public Edit related methods'>
  public edit(id: number): void {
    console.log('edit', id);
    const request: IpcDataRequest = this.dataRequestFactory.createUntypedDataRequest(
      DataVerb.GET,
      `${this.root}/${id}`);
    this.ipcService
      .dataRequest<DtoGet>(request)
      .then(response => {
        const params: DynamicDialogParams<E> = {
          data: {
            component: this.editDialogComponent,
            item: this.itemFactory.getDtoToEditItem(response.data),
            cancelDialog: this.cancelDialog.bind(this),
            commitDialog: this.commitEdit.bind(this)
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

  public async commitEdit(editedItem: E): Promise<any> {
    const request: IpcDataRequest = this.dataRequestFactory.createDataRequest(
      DataVerb.PUT,
      `${this.root}/${editedItem.id}`,
      this.itemFactory.editItemToSetDto(editedItem));
    try {
      const response = await this.ipcService
        .dataRequest<any>(request);
      // XXX const listItem = this.itemFactory.listDtoToListItem(response.data);
      // const index = this.listItems.findIndex(item => item.id === listItem.id);
      // this.listItems[index] = listItem;
      if (this.dialogRef) {
        this.dialogRef.close();
      }
      ;
      return true; //listItem;
    }
    catch (error) {
      // const listItem_1 = this.itemFactory.listDtoToListItem(error.data);
      alert(error.message);
      return false; //listItem_1;
    }
  }
  // </editor-fold>

  // <editor-fold desc='Other methods'>
  public cancelDialog(): void {
    if (this.dialogRef) {
      // TODO check for changes
      this.dialogRef.close();
    }
  }

  public remove(_listItem: any): void {
    const dialogParams = new ConfirmationDialogParams();
    dialogParams.okButtonLabel = 'Delete';
    dialogParams.title = `Delete '${_listItem.name}'?`;
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
         const request: IpcDataRequest = this.dataRequestFactory.createUntypedDataRequest(
           DataVerb.DELETE,
           `${this.root}/${_listItem.id}`);
         this.ipcService
           .dataRequest<string>(request)
           .then(
             _response => {
    //           const index = this.listItems.findIndex( item => item.id === listItem.id);
    //           this.listItems.splice(index, 1);
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
