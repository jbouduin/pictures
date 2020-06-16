import { BaseItem } from '@shared';

export class CollectionNewItem extends BaseItem {

  // <editor-fold desc='Public properties'>
  public path: string;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor() {
    super(undefined);
    this.name = undefined;
    this.path = undefined;
  }
  // </editor-fold>
}
