import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { OnLongPressDirective } from './on-long-press.directive';
import { RouteReusableStrategy } from './route-reusable-strategy';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    OnLongPressDirective
  ],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: RouteReusableStrategy
    }
  ],
  exports: [
    OnLongPressDirective
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    // Import guard
    if (parentModule) {
      throw new Error(`${parentModule} has already been loaded. Import Core module in the AppModule only.`);
    }
  }
}
