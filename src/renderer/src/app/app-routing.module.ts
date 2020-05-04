import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { Shell } from './shell';

const routes: Routes = [
   Shell.childRoutes([{
     path: 'picture',
     loadChildren: () => import('./picture/picture.module').then( m => m.PictureModule)
  }]),
  // Fallback when no prior route is matched
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [ RouterModule.forRoot(
    routes,
    {
      preloadingStrategy: PreloadAllModules // , enableTracing: true
    }
  )],
  exports: [ RouterModule ],
  providers: []
})
export class AppRoutingModule {}
