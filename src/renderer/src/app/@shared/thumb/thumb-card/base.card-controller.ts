import { ComponentType } from '@angular/cdk/portal';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { IpcService, IpcDataRequest, DataRequestFactory, SecretService } from '@core';
import { DataVerb } from '@ipc';
import { DtoGetBase, DtoSetBase } from '@ipc';

import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogParams } from '../../confirmation-dialog/confirmation-dialog.params';
import { DynamicDialogComponent } from '../../dynamic-dialog/dynamic-dialog.component';
import { DynamicDialogParams } from '../../dynamic-dialog/dynamic-dialog.params';

import { BaseItem } from '../base-item';
import { ThumbCardFooterParams } from './thumb-card-footer.params';
import { BaseCardItemFactory } from './base.card-item-factory';
import { EventEmitter } from '@angular/core';
import { BaseTreeItem } from '../thumb-tree/base.tree-item';

export abstract class BaseCardController<E extends BaseItem, DtoGet extends DtoGetBase, DtoSet extends DtoSetBase> {

  // <editor-fold desc='Private properties'>
  private dialogRef: MatDialogRef<any>;
  private currentTreeItem: BaseTreeItem;
  // </editor-fold>

  // <editor-fold desc='Protected properties'>
  protected dialog: MatDialog;
  protected ipcService: IpcService;
  protected secretService: SecretService;
  protected dataRequestFactory: DataRequestFactory;
  protected itemFactory: BaseCardItemFactory<E, DtoGet, DtoSet>;
  // </editor-fold>

  // <editor-fold desc='Abstract protected getters'>
  protected abstract get editDialogComponent(): ComponentType<any>;
  protected abstract get deleteDialogText(): string;
  protected abstract get root(): string;
  // </editor-fold>

  // <editor-fold desc='Abstract public getters'>
  public abstract get cardFooterIcon(): string;
  // </editor-fold>

  // <editor-fold desc='Public properties'>
  public afterUpdate: EventEmitter<number>;
  public afterDelete: EventEmitter<number>;
  // </editor-fold>

  // <editor-fold desc='Abstract public methods'>
  public abstract thumbCardFooterParams(listItem: BaseItem): Array<ThumbCardFooterParams>;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  constructor(
    dialog: MatDialog,
    ipcService: IpcService,
    secretService: SecretService,
    dataRequestFactory: DataRequestFactory,
    itemFactory: BaseCardItemFactory<E, DtoGet, DtoSet>) {

    this.currentTreeItem = undefined;
    this.dialog = dialog;
    this.ipcService = ipcService;
    this.secretService = secretService;
    this.dataRequestFactory = dataRequestFactory;
    this.itemFactory = itemFactory;
    this.dialogRef = undefined;
    this.afterUpdate = new EventEmitter<number>();
    this.afterDelete = new EventEmitter<number>();
  }
  // </editor-fold>

  // <editor-fold desc='Public Edit related methods'>
  public edit(listItem: BaseItem): void {
    const request: IpcDataRequest = this.dataRequestFactory.createUntypedDataRequest(
      DataVerb.GET,
      `${this.root}/${listItem.id}`);
    this.ipcService
      .dataRequest<DtoGet>(request)
      .then(response => {
        const params: DynamicDialogParams<E> = {
          data: {
            component: this.editDialogComponent,
            item: this.itemFactory.getDtoToEditItem(response.data),
            parent: this.currentTreeItem,
            cancelDialog: this.cancelDialog.bind(this),
            commitDialog: this.commitEdit.bind(this)
          },
          width: '600px',
          maxHeight: '100%'
        };
        this.dialogRef = this.dialog.open(DynamicDialogComponent, params);
        this.dialogRef.afterClosed().subscribe( () => this.dialogRef = undefined);
      },
      error => {
        alert(error.message);
      }
    );
  }

  public async commitEdit(editedItem: E): Promise<void> {
    const request: IpcDataRequest = this.dataRequestFactory.createDataRequest(
      DataVerb.PUT,
      `${this.root}/${editedItem.id}`,
      this.itemFactory.editItemToSetDto(editedItem));
    try {
      const response = await this.ipcService
        .dataRequest<any>(request);
      this.afterUpdate.emit(response.data.id);

      if (this.dialogRef) {
        this.dialogRef.close();
      }
    }
    catch (error) {
      alert(error.message);
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

  public toggleTreeItem(baseTreeitem: BaseTreeItem) {
    this.currentTreeItem = baseTreeitem;
  }

  public remove(listItem: BaseItem): void {
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
         const request: IpcDataRequest = this.dataRequestFactory.createUntypedDataRequest(
           DataVerb.DELETE,
           `${this.root}/${listItem.id}`);
         this.ipcService
           .dataRequest<string>(request)
           .then(
             _response => {
               this.afterDelete.emit(listItem.id);
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
