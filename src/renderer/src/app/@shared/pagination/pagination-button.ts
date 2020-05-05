import { PaginationButtonType } from './pagination-button-type';

export class PaginationButton {

  // <editor-fold desc='Constructor'>
  public constructor(
    public buttonType: PaginationButtonType,
    public pageNumber: number) { }
  // </editor-fold>
}
