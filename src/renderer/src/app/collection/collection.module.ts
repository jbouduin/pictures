import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

import { SharedModule } from '@shared';
import { MaterialModule } from '../material.module';
import { CollectionCardComponent } from './collection-card/collection-card.component';
import { CollectionDialogComponent } from './collection-dialog/collection-dialog.component';
import { CollectionListComponent } from './collection-list/collection-list.component';
import { CollectionRoutingModule } from './collection-routing.module';

@NgModule({
  declarations: [
    CollectionListComponent,
    CollectionCardComponent,
    CollectionDialogComponent
   ],
  imports: [
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MatDialogModule,
    CommonModule,
    SharedModule,
    CollectionRoutingModule
  ],
  entryComponents: [
    CollectionDialogComponent
  ]
})
export class CollectionModule { }
