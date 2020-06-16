import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

import { SharedModule } from '@shared';
import { MaterialModule } from '../material.module';

import { PictureRoutingModule } from './picture-routing.module';
import { PictureListComponent } from './picture-list/picture-list.component';
import { PictureDialogComponent } from './picture-dialog/picture-dialog.component';
import { PictureCardController } from './controllers/picture.card-controller';
import { PictureListController } from './controllers/picture.list-controller';
import { PictureTreeController } from './controllers/picture.tree-controller';

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
    PictureDialogComponent
  ],
  providers: [
    PictureCardController,
    PictureListController,
    PictureTreeController
  ],
})
export class PictureModule {
  constructor() { }
}
