import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

import { SharedModule } from '@shared';
import { MaterialModule } from '../material.module';

import { PictureRoutingModule } from './picture-routing.module';
import { PictureController } from './picture.controller';
import { PictureListComponent } from './picture-list/picture-list.component';
import { PictureDialogComponent } from './picture-dialog/picture-dialog.component';

@NgModule({
  declarations: [
    PictureListComponent,
    PictureDialogComponent
   ],
  imports: [
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MatDialogModule,
    CommonModule,
    SharedModule,
    PictureRoutingModule
  ],
  entryComponents: [
    // QUESTION is this required?
    PictureDialogComponent
  ],
  providers: [
    PictureController
  ],
})
export class PictureModule {
  constructor() {
    console.log('PictureModule constructor');
  }}
