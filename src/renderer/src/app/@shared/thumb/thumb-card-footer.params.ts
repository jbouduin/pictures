import { ListItem } from './list-item';

export class ThumbCardFooterParams {

  // <editor-fold desc='Constructor & C°'>
  public constructor(
    public label: string,
    public cssClass: string,
    public icon: string,
    public click: (listItem: ListItem) => void) { }
  // </editor-fold>

}
