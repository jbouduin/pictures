import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { NgxResizableModule } from '@3dgenomes/ngx-resizable';
import { MaterialModule } from '../material.module';

import { FloatingButtonComponent } from './floating-button/floating-button.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { ThumbCardComponent } from './thumb/thumb-card/thumb-card.component';
import { ThumbListComponent } from './thumb/thumb-list/thumb-list.component';
import { DynamicDialogComponent } from './dynamic-dialog/dynamic-dialog.component';
import { PaginationComponent } from './pagination/pagination.component';
import { ThumbTreeComponent } from './thumb/thumb-tree/thumb-tree.component';
import { CoreModule } from '@core';


@NgModule({
  declarations: [
    FloatingButtonComponent,
    ConfirmationDialogComponent,
    ThumbCardComponent,
    ThumbListComponent,
    DynamicDialogComponent,
    PaginationComponent,
    ThumbTreeComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    MaterialModule,
    NgxResizableModule,
    CoreModule
  ],
  exports: [
    FloatingButtonComponent,
    CommonModule,
    ThumbCardComponent,
    ThumbListComponent
  ]
})
export class SharedModule { }
