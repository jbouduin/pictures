import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { LogService } from '@core';

import { PaginationButtonType } from './pagination-button-type';
import { PaginationButton } from './pagination-button';
import { PaginationParams } from './pagination.params';

@Injectable({
  providedIn: 'root'
})
export class PaginationController {

  // <editor-fold desc='Private properties'>
  private baseRoute: string;
  // </editor-fold>


  // <editor-fold desc='Public properties'>
  public readonly buttons: Array<PaginationButton>;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(
    private router: Router,
    private logService: LogService) {
    this.buttons = new Array<PaginationButton>();
    this.baseRoute = undefined;
  }
  // </editor-fold>

  // <editor-fold desc='Public methods'>
  public setPagination(params: PaginationParams): void {
    this.baseRoute = params.baseRoute;
    this.buttons.length = 0;
    this.logService.debug(params);
    // if we are not on the first page, display a previous button
    if (params.currentPage > 1) {
      this.buttons.push(new PaginationButton(PaginationButtonType.Previous, params.currentPage - 1));
    }

    // always display page 1
    this.buttons.push(new PaginationButton(
      params.currentPage === 1 ? PaginationButtonType.Current : PaginationButtonType.Page,
      1));
    let startPage: number;
    let endPage: number;
    if (params.totalPages <= 7)
    {
      startPage = 2;
      endPage = params.totalPages - 1
    } else if (params.currentPage <= 4) {
      startPage = 2;
      endPage = 6;
    } else if (params.currentPage >= params.totalPages - 4){
      startPage = params.totalPages - 5;
      endPage = params.totalPages - 1;
    } else {
      startPage = params.currentPage - 2;
      endPage = params.currentPage + 2;
    }

    if (startPage <= params.totalPages && endPage >= startPage) {
        // fill the 5 buttons in the middle
      for (let cnt = startPage; cnt <= endPage; cnt++) {
        // if the current page is greater then 4 display the ellipsis
        // unless we have 6 or less pages
        if (cnt === startPage && startPage > 2) {
          this.buttons.push(new PaginationButton(PaginationButtonType.Ellipsis, undefined));
        }

        this.buttons.push(new PaginationButton(
          cnt === params.currentPage ? PaginationButtonType.Current : PaginationButtonType.Page,
          cnt
        ));

        if (cnt === endPage && endPage < params.totalPages - 2) {
          this.buttons.push(new PaginationButton(PaginationButtonType.Ellipsis, undefined));
        }
      }
    }
    // always display the last page unless it is 1
    if (params.totalPages !== 1) {
      this.buttons.push(new PaginationButton(
        params.totalPages === params.currentPage ? PaginationButtonType.Current : PaginationButtonType.Page,
        params.totalPages));
    }

    // if we are not on the last page, display a next button
    if (params.currentPage < params.totalPages) {
      this.buttons.push(new PaginationButton(PaginationButtonType.Next, params.currentPage + 1));
    }
  }
  // </editor-fold>

  // <editor-fold desc='UI Triggered methods'>
  public click(pageNumber: number): void {
    this.router.navigate([this.baseRoute, pageNumber]);
  }
  // </editor-fold>
}
