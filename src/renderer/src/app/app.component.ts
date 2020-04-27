import { Component } from '@angular/core';
import { IpcService } from '@core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-electron-boilerplate';

  constructor(private ipcService: IpcService) {
  }

  clickDevTools() {
    console.log('test');
    this.ipcService.openDevTools();
  }
}
