import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { DataVerb, DtoDataRequest } from '@ipc';
import { DtoCollection, DtoListCollection } from '@ipc';

import { ConfigurationService, IpcService } from '@core';
import { ConfirmationDialogComponent, ConfirmationDialogParams } from '@shared';

import { CollectionDialogComponent } from '../collection-dialog/collection-dialog.component';

import { CollectionCardParams } from './collection-card.params';

@Component({
  selector: 'app-collection-card',
  templateUrl: './collection-card.component.html',
  styleUrls: ['./collection-card.component.scss']
})
export class CollectionCardComponent implements OnInit {
  @Input() collectionCardParams: CollectionCardParams;

  // <editor-fold desc='Public properties'>
  public thumbnailStyle: Object;
  public collection: DtoListCollection;

  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(
    private dialog: MatDialog,
    private configurationService: ConfigurationService,
    private ipcService: IpcService) { }
  // </editor-fold>

  // <editor-fold desc='Angular interface methods'>
  public ngOnInit(): void {
    this.collection = this.collectionCardParams.collection;
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
    const dialogParams = new ConfirmationDialogParams();
    dialogParams.okButtonLabel = 'Delete';
    dialogParams.title = `Delete collection '${this.collection.name}'?`;
    dialogParams.text =
    `Click on 'Delete' to remove the collection.
This will remove the collection and all related data from the database. Physical files on disk will remain untouched.`;

    const dialogRef = this.dialog.open(
      ConfirmationDialogComponent,
      {
        width: '600px',
        data: dialogParams
      }
    );
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const request: DtoDataRequest<string> = {
          verb: DataVerb.DELETE,
          path: `/collection/${this.collection.id}`,
          data: undefined
        };
        this.ipcService
          .dataRequest<string, string>(request)
          .then( result => {
            this.collectionCardParams.deleteCallBack(this.collection.id);
          },
          () => {
            alert('something went wrong');
          }
        );

      }
    });
  }
  // </editor-fold>

}
