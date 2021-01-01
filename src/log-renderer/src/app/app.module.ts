import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
// import { DataRequestFactory, IpcService } from '@ipc';
import { ShellModule } from './shell';
import { MaterialModule } from './material.module';
// import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

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
    // DataRequestFactory,
    // IpcService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
