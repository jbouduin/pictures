export class ThumbCardFooterParams {

  // <editor-fold desc='Constructor & C°'>
  public constructor(
    public label: string,
    public cssClass: string,
    public icon: string,
    public click: (id: number) => void) { }
  // </editor-fold>

}
