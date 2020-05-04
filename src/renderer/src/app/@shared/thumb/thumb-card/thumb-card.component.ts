import { Component, Input, OnInit } from '@angular/core';

import { ConfigurationService } from '@core';
import { BaseItem } from '../base-item';
import { ListItem } from '../list-item';
import { ThumbController } from '../thumb.controller';

@Component({
  selector: 'app-thumb-card',
  templateUrl: './thumb-card.component.html',
  styleUrls: ['./thumb-card.component.scss']
})
export class ThumbCardComponent implements OnInit {
  @Input() item: ListItem;
  @Input() controller: ThumbController<ListItem, BaseItem, BaseItem, any, any, any>;

  // <editor-fold desc='Public properties'>
  public thumbnailStyle: Object;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(private configurationService: ConfigurationService) { }
  // </editor-fold>

  // <editor-fold desc='Angular interface methods'>
  public ngOnInit(): void {
    const imageSrc = (this.item.thumb ?
      `file:${this.item.thumb}` :
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
  // public edit(): void {
  //   this.controller.edit(this.item);
  // }
  //
  // public delete(): void {
  //   this.controller.remove(this.item);
  // }
  //
  // public scan(): void {
  //   // this.controller.scan(this.item);
  // }
  // </editor-fold>
}
