import { Component, OnInit } from '@angular/core';
import { IpcService } from 'src/app/ipc.service';

@Component({
  selector: 'app-component2',
  templateUrl: './component2.component.html',
  styleUrls: ['./component2.component.css']
})
export class Component2Component implements OnInit {

  // <editor-fold desc='Constructor & C°'>
  public constructor(private ipcService: IpcService) { }
  // </editor-fold>

  // <editor-fold desc='Angular interface methods'>
  public ngOnInit() {
    this.ipcService.getConfigurationAsync()
      .then(configuration => console.log(configuration));
  }
  // </editor-fold>

  // <editor-fold desc='UI Trigger methods'>
  public click(): void {
    window.open('https://github.com');
  }
  // </editor-fold>
}
