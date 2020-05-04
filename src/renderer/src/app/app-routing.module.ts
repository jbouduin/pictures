import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { Shell } from './shell';

const trysomething = 'trysomething';
const routes: Routes = [
  // Shell.childRoutes([{
  //    path: 'collection',
  //    loadChildren: //'./collection/collection.module#CollectionModule'
  //    // () => import('./collection/collection.module').then( m => m.CollectionModule)
  //    () => import(`${trysomething}/collection/collection.module`).then( m => m.CollectionModule)
  // }]),
  // Shell.childRoutes([{
  //    path: 'picture',
  //    loadChildren: //'./picture/picture.module#PictureModule'
  //    () => import(`${trysomething}/picture/picture.module`).then( m => m.PictureModule)
  // }]),
  // Fallback when no prior route is matched
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [ RouterModule.forRoot(
    routes,
    {
      preloadingStrategy: PreloadAllModules, enableTracing: true
    }
  )],
  exports: [ RouterModule ],
  providers: []
})
export class AppRoutingModule {}
