import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '../material.module';
import { CollectionListComponent } from './collection-list/collection-list.component';
import { CollectionCardComponent } from './collection-card/collection-card.component';
import { CollectionRoutingModule } from './collection-routing.module';

@NgModule({
  declarations: [
    CollectionListComponent,
    CollectionCardComponent
   ],
  imports: [
    FlexLayoutModule,
    MaterialModule,
    CommonModule,
    CollectionRoutingModule
  ]
})
export class CollectionModule { }
