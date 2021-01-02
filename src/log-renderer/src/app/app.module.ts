import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { BaseLogService, DataRequestFactory, IpcService } from '@ipc';
import { ShellModule } from './shell';
import { MaterialModule } from './material.module';
// import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LogService } from './log.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ShellModule,
    MaterialModule
    // AppRoutingModule
  ],
  providers: [
    DataRequestFactory,
    IpcService,
    {
      provide: BaseLogService,
      useClass: LogService
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
