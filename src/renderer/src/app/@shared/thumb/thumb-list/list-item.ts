import { BaseItem } from '../base-item';

export abstract class ListItem extends BaseItem {

  // <editor-fold desc='Public properties'>
  public footerText: string;
  public routerLink: Array<string>
  public thumbPath: string;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(id: number) {
    super(id);
  }
  // </editor-fold>
}
