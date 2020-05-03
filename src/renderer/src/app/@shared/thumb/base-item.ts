export abstract class BaseItem {
  // <editor-fold desc='Public properties'>
  public readonly id: number;
  public name: string;
  // </editor-fold>

  // <editor-fold desc='Public getter methods'>
  public get isNew(): boolean {
    return this.id ? false : true;
  }
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(id: number) {
    this.id = id;
  }
  // </editor-fold>

}
