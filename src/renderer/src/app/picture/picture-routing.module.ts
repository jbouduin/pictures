import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PictureListComponent } from './picture-list/picture-list.component';
import { Shell } from '../shell/shell.service';

const routes: Routes = [
  Shell.childRoutes([
    { path: 'picture/:parent/:id', component: PictureListComponent},
    { path: 'picture/:parent/:id/:page', component: PictureListComponent}
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class PictureRoutingModule {
  constructor() { }
}
