import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { DataVerb, DtoDataRequest } from '@ipc';
import { DtoCollection, DtoListCollection } from '@ipc';

import { ConfigurationService, IpcService } from '@core';

import { CollectionDialogComponent } from '../collection-dialog/collection-dialog.component';

@Component({
  selector: 'app-collection-card',
  templateUrl: './collection-card.component.html',
  styleUrls: ['./collection-card.component.scss']
})
export class CollectionCardComponent implements OnInit {
  @Input() collection: DtoListCollection;

  // <editor-fold desc='Public properties'>
  public thumbnailStyle: Object;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(
    private dialog: MatDialog,
    private configurationService: ConfigurationService,
    private ipcService: IpcService) { }
  // </editor-fold>

  // <editor-fold desc='Angular interface methods'>
  public ngOnInit(): void {
    const path = this.configurationService.configuration.appPath.replace(/\\/g, '/');
    const imageSrc = `file:${path}/dist/renderer/assets/thumb.png`;
    this.thumbnailStyle = {
      'background-image': `url(${imageSrc})`,
      'width': '180px',
      'height': '180px',
      'background-position': 'center center',
      'background-size': 'cover',
      'margin-left': '-5px'
    };
  }
  // </editor-fold>

  // <editor-fold desc='UI Trigger methods'>
  public edit(): void {
    const request: DtoDataRequest<string> = {
      verb: DataVerb.GET,
      path: `/collection/${this.collection.id}`,
      data: ''
    };
    this.ipcService
      .dataRequest<string, DtoCollection>(request)
      .then(dtoCollection => {
        const dialogRef = this.dialog.open(
          CollectionDialogComponent,
          {
            width: '600px',
            data: dtoCollection.data
          }
        );
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            if ('id' in result) {
              console.log(result);
              const request: DtoDataRequest<DtoCollection> = {
                verb: DataVerb.PUT,
                path: `/collection/${this.collection.id}`,
                data: result
              };
              this.ipcService
                .dataRequest<DtoCollection, DtoListCollection>(request)
                .then(result => this.collection = result.data);
            } else {
              alert ('not implemented');
            }
          }
        });
    });
  }

  public delete(): void {
    alert('delete clicked');
  }
  // </editor-fold>

}
