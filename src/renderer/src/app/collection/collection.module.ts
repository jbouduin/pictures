import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollectionListComponent } from './collection-list/collection-list.component';
import { CollectionCardComponent } from './collection-card/collection-card.component';
import { CollectionRoutingModule } from './collection-routing.module';

@NgModule({
  declarations: [
    CollectionListComponent,
    CollectionCardComponent
   ],
  imports: [
    CommonModule,
    CollectionRoutingModule
  ]
})
export class CollectionModule { }
