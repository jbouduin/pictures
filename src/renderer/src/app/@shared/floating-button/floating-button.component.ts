import { Component, Input, OnInit } from '@angular/core';

import { FloatingButtonParams } from './floating-button.params';

@Component({
  selector: 'app-floating-button',
  templateUrl: './floating-button.component.html',
  styleUrls: ['./floating-button.component.scss']
})
export class FloatingButtonComponent implements OnInit {
  // <editor-fold desc='@Input'>
  @Input() params: FloatingButtonParams;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  constructor() { }
  // </editor-fold>

  // <editor-fold desc='Angular interface methods'>
  ngOnInit(): void { }
  // </editor-fold>

}
