import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CollectionListComponent } from './collection-list/collection-list.component';
import { Shell } from '../shell/shell.service';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: CollectionListComponent }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class CollectionRoutingModule {}
