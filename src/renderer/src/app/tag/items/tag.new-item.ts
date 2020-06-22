import { BaseItem } from '@shared';

export class TagNewItem extends BaseItem {

  // <editor-fold desc='Public properties'>
  public parent: number;
  public canAssign: boolean;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor() {
    super(undefined, undefined);
    this.canAssign = true;
  }
  // </editor-fold>
}
