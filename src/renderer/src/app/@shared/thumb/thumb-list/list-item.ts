import { ISelectable } from '@core';
import { BaseItem } from '../base-item';

export abstract class ListItem extends BaseItem implements ISelectable {

  // <editor-fold desc='Public properties'>
  public footerText: string;
  public routerLink: Array<string>;
  public onClick: (item: ListItem) => void;
  public thumbId: number;
  public overlay: string;
  public selected: boolean;
  public readonly secret: boolean;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(id: number, name: string, secret: boolean) {
    super(id, name);
    this.selected = false;
    this.secret = secret;
  }
  // </editor-fold>
}
