import { Injectable } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialog } from '@angular/material/dialog';
import { ParamMap } from '@angular/router';

import { DtoListTag, DtoNewTag } from '@ipc';

import { IpcService, DataRequestFactory } from '@ipc';
import { PaginationController, BaseListController } from '@shared';
import { FloatingButtonParams } from '@shared';
import { TagListItem } from '../items/tag.list-item';
import { TagNewItem } from '../items/tag.new-item';
import { TagDialogComponent } from '../tag-dialog/tag-dialog.component';
import { TagListItemFactory } from '../factories/tag.list-item-factory';

@Injectable()
export class TagListController
  extends BaseListController<TagListItem, TagNewItem, DtoListTag, DtoNewTag> {

  // <editor-fold desc='Implementation of protected abstract getters'>
  protected get newDialogComponent(): ComponentType<any> {
    return TagDialogComponent;
  }

  protected get paginationRoute(): string {
    return '/tag';
  }

  protected get root(): string { return '/tag'; }
  // </editor-fold>

  // <editor-fold desc='Implementation of public abstract getters'>
  public get floatingButtonParams(): FloatingButtonParams {
    return new FloatingButtonParams('Add new', 'add', 'primary', this.create.bind(this));
  }
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  constructor(
    dialog: MatDialog,
    ipcService: IpcService,
    dataRequestFactory: DataRequestFactory,
    paginationController: PaginationController,
    itemFactory: TagListItemFactory) {
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
  }
  // </editor-fold>
}
