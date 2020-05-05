import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PictureListComponent } from './picture-list/picture-list.component';
import { Shell } from '../shell/shell.service';

const routes: Routes = [
  Shell.childRoutes([
    { path: 'picture/collection/:id', component: PictureListComponent}
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class PictureRoutingModule {
  constructor() {
    console.log('PictureRoutingModule constructor');
  }
}
