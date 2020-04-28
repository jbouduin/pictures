import { Component, Input, OnInit } from '@angular/core';
import { MaterialModule } from '../../material.module';

import { FloatingButtonHost } from './floating-button-host';

@Component({
  selector: 'app-floating-button',
  templateUrl: './floating-button.component.html',
  styleUrls: ['./floating-button.component.scss']
})
export class FloatingButtonComponent implements OnInit {
  @Input() host: FloatingButtonHost;

  constructor() { }

  ngOnInit(): void {
  }

}
