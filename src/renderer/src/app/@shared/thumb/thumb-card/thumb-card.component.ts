import { Component, Input, OnInit } from '@angular/core';
import { DtoGetBase, DtoSetBase } from '@ipc';
import { ConfigurationService } from '@core';
import { BaseItem } from '../base-item';
import { ListItem } from '../thumb-list/list-item';
import { BaseCardController } from './base.card-controller';

@Component({
  selector: 'app-thumb-card',
  templateUrl: './thumb-card.component.html',
  styleUrls: ['./thumb-card.component.scss']
})
export class ThumbCardComponent implements OnInit {
  @Input() item: ListItem;
  @Input() controller: BaseCardController<BaseItem,  DtoGetBase, DtoSetBase>;

  // <editor-fold desc='Public properties'>
  public thumbnailStyle: Object;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(private configurationService: ConfigurationService) { }
  // </editor-fold>

  // <editor-fold desc='Angular interface methods'>
  public ngOnInit(): void {
    // TODO move this to main
    const imageSrc = (this.item.thumbPath ?
      `file:${this.item.thumbPath}` :
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
  public trackByIcon(_i: number, obj: any) {
    return obj.icon;
  }
  public ccc(): void {
    console.log('click')
  }
}
