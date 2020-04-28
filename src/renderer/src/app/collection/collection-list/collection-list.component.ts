import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataVerb, DtoListCollection, DtoNewCollection, DtoDataRequest } from '@ipc';

import { IpcService } from '@core';
import { FloatingButtonHost } from '@shared';

import { CollectionDialogComponent } from '../collection-dialog/collection-dialog.component';

@Component({
  selector: 'app-collection-list',
  templateUrl: './collection-list.component.html',
  styleUrls: ['./collection-list.component.scss']
})
export class CollectionListComponent implements FloatingButtonHost, OnInit {

  // <editor-fold desc='Public properties'>
  public collections: Array<DtoListCollection>;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(
    private dialog: MatDialog,
    private ipcService: IpcService) {
    this.collections = new Array<DtoListCollection>();
  }
  // </editor-fold>

  // <editor-fold desc='Angular interface methods'>
  public ngOnInit(): void {
    const request: DtoDataRequest<string> = {
      verb: DataVerb.GET,
      path: '/collection',
      data: ''
    };

    this.ipcService
      .dataRequest<string, Array<DtoListCollection>>(request)
      .then(result => this.collections = result.data);
  }
  // </editor-fold>

  // <editor-fold desc='FloatingButtonhost interface members'>
  public floatingButtonClick(): void {
    const dtoNewCollection: DtoNewCollection = {
      name: undefined,
      path: undefined
    };
    const dialogRef = this.dialog.open(
      CollectionDialogComponent,
      {
        width: '600px',
        data: dtoNewCollection
      }
    );
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if ('id' in result) {
          alert ('not implemented');
        } else {
          console.log(result);
          const request: DtoDataRequest<DtoNewCollection> = {
            verb: DataVerb.POST,
            path: '/collection',
            data: result
          };
          this.ipcService
            .dataRequest<DtoNewCollection, DtoListCollection>(request)
            .then(result => this.collections.splice(0, 0, result.data));
        }
      }
    });
  }

  public get floatingButtonIcon(): string {
    return 'add';
  }
  // </editor-fold>
}
