import { Component, Input, OnInit } from '@angular/core';
import { DtoListCollection } from '@ipc';

import { ConfigurationService } from '@core';

@Component({
  selector: 'app-collection-card',
  templateUrl: './collection-card.component.html',
  styleUrls: ['./collection-card.component.scss']
})
export class CollectionCardComponent implements OnInit {
  @Input() collection: DtoListCollection;

  // <editor-fold desc='Public properties'>
  public thumbnailStyle: Object;
  public footerText: string;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(private configurationService: ConfigurationService) { }
  // </editor-fold>

  // <editor-fold desc='Angular interface methods'>
  public ngOnInit(): void {
    const path = this.configurationService.configuration.appPath.replace(/\\/g, '/');
    const imageSrc = `file:${path}/dist/renderer/assets/thumb_150.png`;
    this.thumbnailStyle = {
      'background-image': `url(${imageSrc})`,
      'width': '150px',
      'height': '150px',
      'background-position': 'center center',
      'margin-left': '-5px'
    };
    this.footerText = this.collection.pictures === 0 ?
      'empty' :
      this.collection.pictures > 1 ?
        `${this.collection.pictures} pictures` :
        `${this.collection.pictures} picture`;
  }
  // </editor-fold>

}
