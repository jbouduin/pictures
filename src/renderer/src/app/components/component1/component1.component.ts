import { Component, OnInit, NgZone } from '@angular/core';

import { IpcService } from '@core';

@Component({
  selector: 'app-component1',
  templateUrl: './component1.component.html',
  styleUrls: ['./component1.component.css']
})
export class Component1Component implements OnInit {

  // <editor-fold desc='Public properties'>
  public arch = '-';
  public hostname = '-';
  public platform = '-';
  public release = '-';
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(private ipcService: IpcService, private ngZone: NgZone) { }
  // </editor-fold>

  // <editor-fold desc='Angular interface methods'>
  public ngOnInit() {
    this.ipcService.getSystemInfoAsync()
      .then(systemInfo => {
        this.ngZone.run(() => {
          this.arch = systemInfo.arch;
          this.hostname = systemInfo.hostname;
          this.platform = systemInfo.platform;
          this.release = systemInfo.release;
          });
      });
  }
  // </editor-fold>
}
