import { Injectable } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialog } from '@angular/material/dialog';

import { SecretService } from '@core';
import { DataVerb, DtoGetTag, DtoSetTag } from '@ipc';
import { IpcService, DataRequestFactory, IpcDataRequest } from '@ipc';
import { BaseCardController, ThumbCardFooterParams } from '@shared';
import { TagEditItem } from '../items/tag.edit-item';
import { TagDialogComponent } from '../tag-dialog/tag-dialog.component';
import { TagListItem } from '../items/tag.list-item';
import { TagCardItemFactory } from '../factories/tag.card-item-factory';

@Injectable()
export class TagCardController extends BaseCardController<TagEditItem, DtoGetTag, DtoSetTag> {

  // <editor-fold desc='Implementation of protected abstract getters'>
  protected get deleteDialogText(): string {
    return `Click on 'Delete' to remove the tag. This will remove the tag and all related data from the database`;
  }

  protected get editDialogComponent(): ComponentType<any> {
    return TagDialogComponent;
  }

  protected get root(): string { return '/tag'; }
  // </editor-fold>

  // <editor-fold desc='Implementation of public abstract getters'>
  public get cardFooterIcon(): string {
    return "camera_alt";
  }
  // </editor-fold>

  // <editor-fold desc='Implementation of abstract methods'>
  public thumbCardFooterParams(_item: TagListItem): Array<ThumbCardFooterParams> {
    return [
      new ThumbCardFooterParams(undefined, 'icon-button hover green', 'edit', this.edit.bind(this), undefined),
      new ThumbCardFooterParams(undefined, 'icon-button hover red', 'delete', this.remove.bind(this), undefined)
    ]
  }
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  constructor(
    dialog: MatDialog,
    ipcService: IpcService,
    secretService: SecretService,
    dataRequestFactory: DataRequestFactory,
    itemFactory: TagCardItemFactory) {
    super(dialog, ipcService, secretService, dataRequestFactory, itemFactory);
  }
  // </editor-fold>

  // <editor-fold desc='Specific methods'>
  public scan(dtoListTag: TagListItem): void {
    const request: IpcDataRequest = this.dataRequestFactory.createUntypedDataRequest(
      DataVerb.POST,
      `/tag/${dtoListTag.id}/scan`);
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
