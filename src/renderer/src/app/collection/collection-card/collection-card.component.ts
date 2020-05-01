import { Component, Input, OnInit } from '@angular/core';
import { DtoListCollection } from '@ipc';
import { ConfigurationService, IpcService } from '@core';
import { CollectionController } from '../collection.controller';

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
    private configurationService: ConfigurationService,
    private collectionController: CollectionController) { }
  // </editor-fold>

  // <editor-fold desc='Angular interface methods'>
  public ngOnInit(): void {
    const imageSrc = (this.collection.thumb ?
      `file:${this.collection.path}/${this.collection.thumb}` :
      `file:${this.configurationService.configuration.appPath}/dist/renderer/assets/thumb.png`).replace(/\\/g, '/')
    this.thumbnailStyle = {
      'background-image': `url(${encodeURI(imageSrc)})`,
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
    this.collectionController.edit(this.collection);
  }

  public delete(): void {
    this.collectionController.delete(this.collection);
  }

  public scan(): void {
    this.collectionController.scan(this.collection);
  }
  // </editor-fold>

}
