export abstract class BaseTreeItem {

  // <editor-fold desc='Public properties'>
  public label: string;
  public children: Array<BaseTreeItem>;
  public queryString: string;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor() {
    this.children = new Array<BaseTreeItem>();
  }
  // </editor-fold>
}
