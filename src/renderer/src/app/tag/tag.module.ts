import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagDialogComponent } from './tag-dialog/tag-dialog.component';
import { TagListComponent } from './tag-list/tag-list.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '@shared';
import { TagRoutingModule } from './tag-routing.module';
import { TagListController } from './controllers/tag.list-controller';
import { TagCardController } from './controllers/tag.card-controller';
import { TagTreeController } from './controllers/tag.tree-controller';

@NgModule({
  declarations: [
    TagDialogComponent,
    TagListComponent
  ],
  imports: [
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MatDialogModule,
    CommonModule,
    SharedModule,
    TagRoutingModule
  ],
  entryComponents: [
    TagDialogComponent
  ],
  providers: [
    TagListController,
    TagCardController,
    TagTreeController
  ]
})
export class TagModule { }
