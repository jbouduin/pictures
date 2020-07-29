import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { CoreModule } from '@core';
import { MaterialModule } from '../material.module';
import { CarouselComponent } from './carousel/carousel.component';

@NgModule({
  declarations: [
    CarouselComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    MaterialModule
  ]
})
export class PictoramaModule { }
