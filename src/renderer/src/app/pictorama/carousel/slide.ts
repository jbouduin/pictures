import { SafeStyle } from '@angular/platform-browser';

export class Slide {
  // <editor-fold desc='Private properties'>
  private _pictureId: number;
  // </editor-fold>

  // <editor-fold desc='Public properties'>
  public src: SafeStyle;

  public get pictureId(): number {
    return this._pictureId;
  }
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(pictureId: number) {
    this._pictureId = pictureId;
    this.src = undefined;
  }
  // </editor-fold>
}
