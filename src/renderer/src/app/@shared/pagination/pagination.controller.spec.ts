import { TestBed } from '@angular/core/testing';

import { PaginationButtonType } from './pagination-button-type';
import { PaginationButton } from './pagination-button';
import { PaginationController } from './pagination.controller';
import { PaginationParams } from './pagination.params';

// <editor-fold desc='Helper functions'>
function expectFirstButtonIsPrevious(buttons: Array<PaginationButton>, expectedPageNum: number): void {
  expect(buttons[0].pageNumber).toBe(expectedPageNum);
  expect(PaginationButtonType[buttons[0].buttonType])
    .toBe(PaginationButtonType[PaginationButtonType.Previous]);
}

function expectFirstButtonIsFirstPage(buttons: Array<PaginationButton>): void {
  expect(buttons[0].pageNumber).toBe(1);
  expect(PaginationButtonType[buttons[0].buttonType])
    .toBe(PaginationButtonType[PaginationButtonType.Page]);
}

function expectFirstButtonIsFirstPageAndCurrent(buttons: Array<PaginationButton>): void {
  expect(buttons[0].pageNumber).toBe(1);
  expect(PaginationButtonType[buttons[0].buttonType])
    .toBe(PaginationButtonType[PaginationButtonType.Current]);
}

function expectSecondButtonIsFirstPage(buttons: Array<PaginationButton>): void {
  expect(buttons[1].pageNumber).toBe(1);
  expect(PaginationButtonType[buttons[0].buttonType])
    .toBe(PaginationButtonType[PaginationButtonType.Page]);
}

function expectSecondButtonIsFirstPageAndCurrent(buttons: Array<PaginationButton>): void {
  expect(buttons[1].pageNumber).toBe(1);
  expect(PaginationButtonType[buttons[0].buttonType])
    .toBe(PaginationButtonType[PaginationButtonType.Current]);
}

function expectLastButtonIsNext(buttons: Array<PaginationButton>, expectedPageNum: number): void {
  expect(buttons[buttons.length - 1].pageNumber).toBe(expectedPageNum);
  expect(PaginationButtonType[buttons[buttons.length - 1].buttonType])
    .toBe(PaginationButtonType[PaginationButtonType.Next]);
}

function expectLastButtonIsLastPage(buttons: Array<PaginationButton>, totalPages: number): void {
  expect(buttons[buttons.length - 1].pageNumber).toBe(totalPages);
  expect(PaginationButtonType[buttons[buttons.length - 1].buttonType])
    .toBe(PaginationButtonType[PaginationButtonType.Page]);
}

function expectLastButtonIsLastPageAndCurrent(buttons: Array<PaginationButton>, totalPages: number): void {
  expect(buttons[buttons.length - 1].pageNumber).toBe(totalPages);
  expect(PaginationButtonType[buttons[buttons.length - 1].buttonType])
    .toBe(PaginationButtonType[PaginationButtonType.Current]);
}

function expectRangeConstainsPageButtons(buttons: Array<PaginationButton>, start: number, end: number, firstPageNumber: number) {
  for(let idx = start; idx <= end; idx++) {
    expect(buttons[idx].pageNumber).toBe(firstPageNumber);
    expect(PaginationButtonType[buttons[idx].buttonType])
      .toBe(PaginationButtonType[PaginationButtonType.Page]);
    firstPageNumber++;
  }
}

function expectPageButton(button: PaginationButton, expectedPageNum: number) {
  expect(button.pageNumber).toBe(expectedPageNum);
  expect(PaginationButtonType[button.buttonType])
    .toBe(PaginationButtonType[PaginationButtonType.Page]);
}

function expectCurrentButton(button: PaginationButton, expectedPageNum: number) {
  expect(button.pageNumber).toBe(expectedPageNum);
  expect(PaginationButtonType[button.buttonType])
    .toBe(PaginationButtonType[PaginationButtonType.Current]);
}

function expectEllipsisButton(button: PaginationButton) {
  expect(PaginationButtonType[button.buttonType])
    .toBe(PaginationButtonType[PaginationButtonType.Ellipsis]);
}
// </editor-fold>

describe('PaginationController', () => {
  // <editor-fold desc='Setup'>
  let controller: PaginationController;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    controller = TestBed.inject(PaginationController);
  });
  // </editor-fold>

  it('# should be created', () => {
    expect(controller).toBeTruthy();
  });

  // <editor-fold desc='single page tests'>
  it('# page 1/1', () => {
    const params = new PaginationParams(1, 1, undefined);
    controller.setPagination(params);
    expect(controller.buttons.length).toBe(1);
    expectCurrentButton(controller.buttons[0], 1);
  });
  // </editor-fold>

  // <editor-fold desc='2 pages tests'>
  it('# page 1/2', () => {
    const params = new PaginationParams(1, 2, undefined);
    controller.setPagination(params);
    expect(controller.buttons.length).toBe(3);
    expectFirstButtonIsFirstPageAndCurrent(controller.buttons);
    expectPageButton(controller.buttons[1], 2);
    expectLastButtonIsNext(controller.buttons, 2);
  });

  it('# page 2/2', () => {
    const params = new PaginationParams(2, 2, undefined);
    controller.setPagination(params);
    expect(controller.buttons.length).toBe(3);
    expectFirstButtonIsPrevious(controller.buttons, 1);
    expectPageButton(controller.buttons[1], 1);
    expectLastButtonIsLastPageAndCurrent(controller.buttons, 2)
  });
  // </editor-fold>

  // <editor-fold desc='6 pages: there should be a button for every page'>
  it('# page 1/6', () => {
    const params = new PaginationParams(1, 6, undefined);
    controller.setPagination(params);
    expect(controller.buttons.length).toBe(7);
    expectFirstButtonIsFirstPageAndCurrent(controller.buttons);
    expectRangeConstainsPageButtons(controller.buttons, 1, 5, 2);
    expectLastButtonIsNext(controller.buttons, 2);
  });

  it('# page 4/6', () => {
    const params = new PaginationParams(4, 6, undefined);
    controller.setPagination(params);
    expect(controller.buttons.length).toBe(8);
    expectFirstButtonIsPrevious(controller.buttons, 3);
    expectRangeConstainsPageButtons(controller.buttons, 1, 3, 1);
    expectCurrentButton(controller.buttons[4], 4)
    expectRangeConstainsPageButtons(controller.buttons, 5, 6, 5);
    expectLastButtonIsNext(controller.buttons, 5);
  });

  it('# page 6/6', () => {
    const params = new PaginationParams(6, 6, undefined);
    controller.setPagination(params);
    expect(controller.buttons.length).toBe(7);
    expectFirstButtonIsPrevious(controller.buttons, 5);
    expectRangeConstainsPageButtons(controller.buttons, 1, 5, 1);
    expectLastButtonIsLastPageAndCurrent(controller.buttons, 6)
  });
  // </editor-fold>

  // <editor-fold desc='7 pages: there should be a button for every page'>
  it('# page 1/7', () => {
    const params = new PaginationParams(1, 7, undefined);
    controller.setPagination(params);
    expect(controller.buttons.length).toBe(8);
    expectFirstButtonIsFirstPageAndCurrent(controller.buttons);
    expectRangeConstainsPageButtons(controller.buttons, 1, 6, 2);
    expectLastButtonIsNext(controller.buttons, 2);
  });

  it('# page 4/7', () => {
    const params = new PaginationParams(4, 7, undefined);
    controller.setPagination(params);
    expect(controller.buttons.length).toBe(9);
    expectFirstButtonIsPrevious(controller.buttons, 3);
    expectRangeConstainsPageButtons(controller.buttons, 1, 3, 1);
    expectCurrentButton(controller.buttons[4], 4)
    expectRangeConstainsPageButtons(controller.buttons, 5, 7, 5);
    expectLastButtonIsNext(controller.buttons, 5);
  });

  it('# page 7/7', () => {
    const params = new PaginationParams(7, 7, undefined);
    controller.setPagination(params);
    expect(controller.buttons.length).toBe(8);
    expectFirstButtonIsPrevious(controller.buttons, 6);
    expectRangeConstainsPageButtons(controller.buttons, 1, 6, 1);
    expectLastButtonIsLastPageAndCurrent(controller.buttons, 7);
  });
  // </editor-fold>

  // <editor-fold desc='70 pages'>
  it('# page 1/70', () => {
    const params = new PaginationParams(1, 70, undefined);
    controller.setPagination(params);
    expect(controller.buttons.length).toBe(9);
    expectFirstButtonIsFirstPageAndCurrent(controller.buttons);
    expectRangeConstainsPageButtons(controller.buttons, 1, 5, 2);
    expectEllipsisButton(controller.buttons[6]);
    expectPageButton(controller.buttons[7], 70);
    expectLastButtonIsNext(controller.buttons, 2);
  });

  it('# page 5/70', () => {
    const params = new PaginationParams(5, 70, undefined);
    controller.setPagination(params);
    expect(controller.buttons.length).toBe(11);
    expectFirstButtonIsPrevious(controller.buttons, 4)
    expectPageButton(controller.buttons[1], 1);
    expectEllipsisButton(controller.buttons[2]);
    expectRangeConstainsPageButtons(controller.buttons, 3, 4, 3);
    expectCurrentButton(controller.buttons[5], 5);
    expectRangeConstainsPageButtons(controller.buttons, 6, 7, 6);
    expectEllipsisButton(controller.buttons[8]);
    expectPageButton(controller.buttons[9], 70);
    expectLastButtonIsNext(controller.buttons, 6);
  });

  it('# page 65/70', () => {
    const params = new PaginationParams(65, 70, undefined);
    controller.setPagination(params);
    expect(controller.buttons.length).toBe(11);
    expectFirstButtonIsPrevious(controller.buttons, 64)
    expectPageButton(controller.buttons[1], 1);
    expectEllipsisButton(controller.buttons[2]);
    expectRangeConstainsPageButtons(controller.buttons, 3, 4, 63);
    expectCurrentButton(controller.buttons[5], 65);
    expectRangeConstainsPageButtons(controller.buttons, 6, 7, 66);
    expectEllipsisButton(controller.buttons[8]);
    expectPageButton(controller.buttons[9], 70);
    expectLastButtonIsNext(controller.buttons, 66);
  });

  it('# page 70/70', () => {
    const params = new PaginationParams(70, 70, undefined);
    controller.setPagination(params);
    expect(controller.buttons.length).toBe(9);
    expectFirstButtonIsPrevious(controller.buttons, 69);
    expectPageButton(controller.buttons[1], 1);
    expectEllipsisButton(controller.buttons[2]);
    expectRangeConstainsPageButtons(controller.buttons, 3, 7, 65);
    expectLastButtonIsLastPageAndCurrent(controller.buttons, 70)
  });
  // </editor-fold>
});
