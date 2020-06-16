export abstract class TreeItem {

  // <editor-fold desc='Public properties'>
  public label: string;
  public children: Array<TreeItem>;
  public queryString: string;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor() {
    this.children = new Array<TreeItem>();
  }
  // </editor-fold>
}
