import { BaseItem } from '@shared';

export class CollectionNewItem extends BaseItem {

  // <editor-fold desc='Public properties'>
  public path: string;
  public secret: boolean;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor() {
    super(undefined, undefined);
    this.path = undefined;
    this.secret = false;
  }
  // </editor-fold>
}
