import { ComponentType } from '@angular/cdk/portal';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ParamMap } from '@angular/router';

import { IpcService, IpcDataRequest, DataRequestFactory } from '@core';
import { DataVerb } from '@ipc';
import { DtoListData, DtoListBase, DtoGetBase, DtoNewBase, DtoSetBase } from '@ipc';

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
import { TreeItem } from './tree-item';

export abstract class ThumbController<
  L extends ListItem, T extends TreeItem, N extends BaseItem, E extends BaseItem,
  DtoL extends DtoListBase, DtoG extends DtoGetBase, DtoN extends DtoNewBase, DtoS extends DtoSetBase> {

  // <editor-fold desc='Private readonly properties'>
  // TODO make this configurable
  private readonly pageSize = 20;
  // </editor-fold>

  // <editor-fold desc='Private properties'>
  private listItems: Array<L>;
  private treeItems: Array<T> | undefined;
  private currentTreeItem: T | undefined;
  private dialogRef: MatDialogRef<any>;
  private currentPage: number;
  // </editor-fold>

  // <editor-fold desc='Public get/set methods'>
  public get cards(): Array<L>{
    return this.listItems;
  }

  public get pagination(): PaginationController {
    return this.paginationController
  }

  public get page(): number {
    return this.currentPage || 1;
  }

  public get treeNodes(): Array<T> | undefined {
    return this.treeItems;
  }

  public set page(value: number) {
    this.currentPage = value;
  }
  // </editor-fold>

  // <editor-fold desc='Abstract protected getters'>
  protected abstract get editDialogComponent(): ComponentType<any>;
  protected abstract get deleteDialogText(): string;
  protected abstract get newDialogComponent(): ComponentType<any>;
  protected abstract get root(): string;
  protected abstract get paginationRoute(): string;
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
    protected dataRequestFactory: DataRequestFactory,
    protected paginationController: PaginationController,
    protected itemFactory: BaseItemFactory<L, N, E, DtoL, DtoG, DtoN, DtoS>) {
    this.listItems = new Array<L>();
    this.dialogRef = undefined;
    this.currentPage = undefined;
    this.treeItems = undefined;
  }
  // </editor-fold>

  // <editor-fold desc='Abstract public methods'>
  public abstract processParamMap(paramMap: ParamMap): void;
  public abstract getTreeItems(list: Array<L>): Array<T> | undefined;
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

  public async commitCreate(newItem: N): Promise<L> {
    const request: IpcDataRequest = this.dataRequestFactory.createDataRequest(
      DataVerb.POST,
      this.root,
      this.itemFactory.newItemToNewDto(newItem));
    try {
      const result = await this.ipcService
        .dataRequest<DtoL>(request);
      const listItem = this.itemFactory.listDtoToListItem(result.data);
      this.listItems.splice(0, 0, listItem);
      if (this.dialogRef) {
        this.dialogRef.close();
      }
      ;
      return listItem;
    }
    catch (error) {
      const listItem_1 = this.itemFactory.listDtoToListItem(error.data);
      alert(error.message);
      return listItem_1;
    }
  }
  // </editor-fold>

  // <editor-fold desc='Public Edit related methods'>
  public edit(listItem: L): void {
    const request: IpcDataRequest = this.dataRequestFactory.createUntypedDataRequest(
      DataVerb.GET,
      `${this.root}/${listItem.id}`);
    this.ipcService
      .dataRequest<DtoG>(request)
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

  public async commitEdit(editedItem: E): Promise<L> {
    const request: IpcDataRequest = this.dataRequestFactory.createDataRequest(
      DataVerb.PUT,
      `${this.root}/${editedItem.id}`,
      this.itemFactory.editItemToSetDto(editedItem));
    try {
      const response = await this.ipcService
        .dataRequest<DtoL>(request);
      const listItem = this.itemFactory.listDtoToListItem(response.data);
      const index = this.listItems.findIndex(item => item.id === listItem.id);
      this.listItems[index] = listItem;
      if (this.dialogRef) {
        this.dialogRef.close();
      }
      ;
      return listItem;
    }
    catch (error) {
      const listItem_1 = this.itemFactory.listDtoToListItem(error.data);
      alert(error.message);
      return listItem_1;
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

  public async loadList(): Promise<Array<L>> {
    let url = `${this.root}?page=${this.page}&pageSize=${this.pageSize}`;
    if (this.currentTreeItem?.queryString) {
      url += `&${this.currentTreeItem.queryString}`;
    }
    const request: IpcDataRequest = this.dataRequestFactory.createUntypedDataRequest(
      DataVerb.GET,
      url);

    const response = await this.ipcService
      .dataRequest<DtoListData<DtoL>>(request);
    this.listItems = response.data.listData.map(listDto => this.itemFactory.listDtoToListItem(listDto));
    const totalPages = Math.floor(response.data.count / this.pageSize) +
      ((response.data.count % this.pageSize) > 0 ? 1 : 0);
    this.paginationController.setPagination(new PaginationParams(this.page, totalPages, this.paginationRoute));
    this.treeItems = this.getTreeItems(this.listItems);
    return this.listItems;
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
        const request: IpcDataRequest = this.dataRequestFactory.createUntypedDataRequest(
          DataVerb.DELETE,
          `${this.root}/${listItem.id}`);
        this.ipcService
          .dataRequest<string>(request)
          .then(
            _response => {
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

  public toggleTreeItem(treeItem: T) {
    this.currentTreeItem = treeItem;
  }
  // </editor-fold>
}
