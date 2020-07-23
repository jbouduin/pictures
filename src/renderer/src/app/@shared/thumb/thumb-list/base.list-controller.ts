import { ComponentType } from '@angular/cdk/portal';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ParamMap } from '@angular/router';

import { IpcService, IpcDataRequest, DataRequestFactory } from '@core';
import { DataVerb } from '@ipc';
import { DtoListData, DtoListBase, DtoNewBase } from '@ipc';

import { FloatingButtonParams } from '../../floating-button/floating-button.params';
import { DynamicDialogComponent } from '../../dynamic-dialog/dynamic-dialog.component';
import { PaginationController } from '../../pagination/pagination.controller';
import { PaginationParams } from '../../pagination/pagination.params';
import { BaseTreeItem } from '../thumb-tree/base.tree-item';
import { BaseItem } from '../base-item';
import { ListItem } from './list-item';
import { BaseListItemFactory } from './base.list-item-factory';
import { DynamicDialogParams } from '@shared';
import { EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';

export abstract class BaseListController<
  L extends ListItem, N extends BaseItem,
  DtoList extends DtoListBase, DtoNew extends DtoNewBase> {

  // <editor-fold desc='Private readonly properties'>
  // TODO make this configurable
  private readonly pageSize = 20;
  // </editor-fold>

  // <editor-fold desc='Private properties'>
  private listItems: Array<L>;
  private dialogRef: MatDialogRef<any>;
  private currentPage: number;
  private currentTreeItem: BaseTreeItem;
  private afterDeleteSubscription: Subscription;
  private afterUpdateSubscription: Subscription;
  // </editor-fold>

  // <editor-fold desc='Protected properties'>
  protected dialog: MatDialog;
  protected ipcService: IpcService;
  protected dataRequestFactory: DataRequestFactory;
  protected paginationController: PaginationController;
  protected itemFactory: BaseListItemFactory<L, N, DtoList, DtoNew>;
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

  public set page(value: number) {
    this.currentPage = value;
  }
  // </editor-fold>

  // <editor-fold desc='Abstract protected getters'>
  protected abstract get newDialogComponent(): ComponentType<any>;
  protected abstract get root(): string;
  protected abstract get paginationRoute(): string;
  // </editor-fold>

  // <editor-fold desc='Abstract public getters'>
  public abstract get floatingButtonParams(): FloatingButtonParams;
  // </editor-fold>

  // <editor-fold desc='Public properties'>
  public afterCreate: EventEmitter<number>;
  // </editor-fold>
  //
  // <editor-fold desc='Constructor & C°'>
  constructor(
    dialog: MatDialog,
    ipcService: IpcService,
    dataRequestFactory: DataRequestFactory,
    paginationController: PaginationController,
    itemFactory: BaseListItemFactory<L, N, DtoList, DtoNew>) {

    this.dialog = dialog;
    this.ipcService = ipcService;
    this.dataRequestFactory = dataRequestFactory;
    this.paginationController = paginationController;
    this.itemFactory = itemFactory;
    this.listItems = new Array<L>();
    this.dialogRef = undefined;
    this.currentPage = undefined;
    this.afterCreate = new EventEmitter<number>();
  }
  // </editor-fold>

  // <editor-fold desc='Abstract public methods'>
  public abstract processParamMap(paramMap: ParamMap): void;
  // </editor-fold>

  // <editor-fold desc='Public Create related methods'>
  public create(): void {
    const params: DynamicDialogParams<N> = {
      data: {
        component: this.newDialogComponent,
        item: this.itemFactory.createNewItem(),
        parent: this.currentTreeItem,
        cancelDialog: this.cancelDialog.bind(this),
        commitDialog: this.commitCreate.bind(this)
      },
      width: '600px'

    }
    this.dialogRef = this.dialog.open(DynamicDialogComponent, params);
    this.dialogRef.afterClosed().subscribe( () => this.dialogRef = undefined);
  }

  public async commitCreate(newItem: N): Promise<L> {
    const request: IpcDataRequest = this.dataRequestFactory.createDataRequest(
      DataVerb.POST,
      this.root,
      this.itemFactory.newItemToNewDto(newItem));
    try {
      const result = await this.ipcService
        .dataRequest<DtoList>(request);
      const listItem = this.itemFactory.listDtoToListItem(result.data);
      this.listItems.splice(0, 0, listItem);
      if (this.dialogRef) {
        this.dialogRef.close();
      }
      this.afterCreate.emit(listItem.id);
      return listItem;
    }
    catch (error) {
      const listItem_1 = this.itemFactory.listDtoToListItem(error.data);
      alert(error.message);
      return listItem_1;
    }
  }
  // </editor-fold>

  // <editor-fold desc='Private subscribe methods'>
  private afterDelete(id: number) {
    const index = this.listItems.findIndex( item => item.id === id);
    if (index >= 0) {
      this.listItems.splice(index, 1);
    }
  }

  private async afterUpdate(id: number) {
    const listItem = await this.loadListItem(id);
    const index = this.listItems.findIndex(item => item.id === listItem.id);
    this.listItems[index] = listItem;
  }
  // </editor-fold>

  // <editor-fold desc='Other methods'>
  public subscribeAfterDelete(emitter: EventEmitter<number>): void {
    if (!this.afterDeleteSubscription) {
      this.afterDeleteSubscription = emitter.subscribe(this.afterDelete.bind(this));
    }
  }

  public subscribeAfterUpdate(emitter: EventEmitter<number>) {
    if (!this.afterUpdateSubscription) {
      this.afterUpdateSubscription = emitter.subscribe(this.afterUpdate.bind(this));
    }
  }

  public cancelDialog(): void {
    if (this.dialogRef) {
      // TODO check for changes
      this.dialogRef.close();
    }
  }

  public toggleTreeItem(baseTreeitem: BaseTreeItem) {
    this.currentTreeItem = baseTreeitem;
    this.loadList();
  }

  public async loadList(): Promise<Array<L>> {
    let url = `${this.root}?page=${this.page}&pageSize=${this.pageSize}`;
    if (this.currentTreeItem?.queryString) {
      url += `&${this.currentTreeItem.queryString}`;
    }
    const request: IpcDataRequest = this.dataRequestFactory.createUntypedDataRequest(
      DataVerb.GET,
      url);

    const response = await this.ipcService.dataRequest<DtoListData<DtoList>>(request);
    this.listItems = response.data.listData.map(listDto => this.itemFactory.listDtoToListItem(listDto));
    const totalPages = Math.floor(response.data.count / this.pageSize) +
      ((response.data.count % this.pageSize) > 0 ? 1 : 0);
    this.paginationController.setPagination(new PaginationParams(this.page, totalPages, this.paginationRoute));
    return this.listItems;
  }

  public async loadListItem(id: number): Promise<L> {
    const request: IpcDataRequest = this.dataRequestFactory.createUntypedDataRequest(
      DataVerb.GET,
      `${this.root}/list/${id}`);

    const response = await this.ipcService.dataRequest<DtoList>(request);
    return this.itemFactory.listDtoToListItem(response.data);
  }
  // </editor-fold>


}
