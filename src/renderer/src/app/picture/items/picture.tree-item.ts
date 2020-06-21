import { BaseTreeItem } from '@shared';
import { DtoTreeBase } from '@ipc';

export class PictureTreeItem extends BaseTreeItem {
  constructor(dto: DtoTreeBase) {
    super(dto);
  }
}
