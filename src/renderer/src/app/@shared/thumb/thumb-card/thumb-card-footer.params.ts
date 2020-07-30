import { SecretService } from '@core';

export class ThumbCardFooterParams {

  // <editor-fold desc='Public properties'>
  public label: string;
  public cssClass: string;
  public icon: string;
  public click: (id: number) => void;
  public disabled: boolean;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(
    label: string,
    cssClass: string,
    icon: string,
    click: (id: number) => void,
    secretService: SecretService | undefined) {
    this.label = label;
    this.cssClass = cssClass;
    this.icon = icon;
    this.click = click;
    if (secretService) {
      secretService.lockStatus.subscribe(status => { this.disabled = status === 'lock'});
    } else {
      this.disabled = false;
    }
  }
  // </editor-fold>

}
