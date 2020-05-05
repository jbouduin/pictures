import { Component, Input, OnInit } from '@angular/core';

import { PaginationButtonType } from './pagination-button-type';
import { PaginationController } from './pagination.controller';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {

  // <editor-fold desc='Input'>
  @Input() public controller: PaginationController;
  // </editor-fold>

  // <editor-fold desc='Required to make ngswitch work'>
  public buttonType = PaginationButtonType;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  constructor() { }
  // </editor-fold>

  // <editor-fold desc='Angular interface methods'>
  ngOnInit(): void { }
  // </editor-fold>

}
