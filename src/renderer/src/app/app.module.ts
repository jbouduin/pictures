import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxResizableModule } from '@3dgenomes/ngx-resizable';

import { CoreModule } from '@core';
import { SharedModule } from '@shared';
import { CollectionModule } from './collection';
import { PictureModule } from './picture';
import { ShellModule } from './shell';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TagModule } from './tag';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    NgxResizableModule,
    CoreModule,
    SharedModule,
    ShellModule,
    CollectionModule,
    PictureModule,
    TagModule,
    AppRoutingModule // must be imported as the last module as it contains the fallback route
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
