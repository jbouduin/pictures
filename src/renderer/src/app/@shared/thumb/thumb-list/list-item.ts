import { BaseItem } from '../base-item';

export abstract class ListItem extends BaseItem {

  // <editor-fold desc='Public properties'>
  public footerText: string;
  public routerLink: Array<string>
  public thumbPath: string;
  public thumbId: number;
  public image: string;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(id: number, name: string) {
    super(id, name);
  }
  // </editor-fold>
}
