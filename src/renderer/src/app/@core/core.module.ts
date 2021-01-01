import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { BaseLogService } from '@ipc';
import { OnLongPressDirective } from './on-long-press.directive';
import { RouteReusableStrategy } from './route-reusable-strategy';
import { KeyDialogComponent } from './components/key-dialog/key-dialog.component';
import { LogService } from './log.service';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    CommonModule,
    RouterModule,
    MaterialModule
  ],
  declarations: [
    OnLongPressDirective,
    KeyDialogComponent
  ],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: RouteReusableStrategy
    },
    {
      provide: BaseLogService,
      useClass: LogService
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
