import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';

import { FloatingButtonComponent } from './floating-button/floating-button.component';

@NgModule({
  declarations: [FloatingButtonComponent],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    FloatingButtonComponent,
    CommonModule
  ]
})
export class SharedModule { }
