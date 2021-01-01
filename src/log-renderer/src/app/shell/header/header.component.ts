import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

// import { IpcService, DtoQueueStatus } from '@ipc';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  // <editor-fold desc='Private properties'>
  public filterGroup: FormGroup;

  // private ipcService: IpcService

  // private ngZone: NgZone;
  // </editor-fold>



  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(formBuilder: FormBuilder) {
    this.buildForm(formBuilder);
    // ipcService: IpcService, ngZone: NgZone) {
    // this.ipcService = ipcService;
    // this.ngZone = ngZone;
  }
  // </editor-fold>

  // <editor-fold desc='Angular interface methods'>
  public ngOnInit(): void {
    // this.ipcService.queueStatus.subscribe((status: DtoQueueStatus) => this.ngZone.run(() => this.queueLength = status.count));
  }
  // </editor-fold>

  private buildForm(formBuilder: FormBuilder): void {
    this.filterGroup = formBuilder.group({
      mainSelected: new FormControl(true),
      rendererSelected: new FormControl(true),
      queueSelected: new FormControl(true),
      errorSelected: new FormControl(true),
      infoSelected: new FormControl(true),
      verboseSelected: new FormControl(true),
      debugSelected: new FormControl(true)
    });
  }

}
