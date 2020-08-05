import { BaseItem } from '@shared';

export class CollectionNewItem extends BaseItem {

  // <editor-fold desc='Public properties'>
  public path: string;
  public isSecret: boolean;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor() {
    super(undefined, undefined);
    this.path = undefined;
    this.isSecret = false;
  }
  // </editor-fold>
}
