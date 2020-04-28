import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DataVerb, DtoCollection, DtoDataRequest } from '@ipc';

import { IpcService } from '@core';
import { FloatingButtonHost } from '@shared';

@Component({
  selector: 'app-collection-list',
  templateUrl: './collection-list.component.html',
  styleUrls: ['./collection-list.component.scss']
})
export class CollectionListComponent implements FloatingButtonHost, OnInit {

  // <editor-fold desc='Public properties'>
  public collections: Array<DtoCollection>;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(private ipcService: IpcService) {
    this.collections = new Array<DtoCollection>();
  }
  // </editor-fold>

  // <editor-fold desc='Angular interface methods'>
  public ngAfterViewInit(): void {

  }

  public ngOnInit(): void {
    const request: DtoDataRequest<string> = {
      verb: DataVerb.GET,
      path: '/collection',
      data: ''
    };

    this.ipcService
      .dataRequest<string, Array<DtoCollection>>(request)
      .then(result => this.collections = result.data);
  }
  // </editor-fold>

  // <editor-fold desc='Floatingbuttonhost interface members'>
  public floatingButtonClick(): void {
    alert('click');
  }

  public get floatingButtonIcon(): string {
    return 'add';
  }
  // </editor-fold>
}
