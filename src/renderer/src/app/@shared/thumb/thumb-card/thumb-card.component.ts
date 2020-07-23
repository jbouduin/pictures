import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

import { DtoGetBase, DtoSetBase, DataVerb, DtoImage } from '@ipc';
import { BaseItem } from '../base-item';
import { ListItem } from '../thumb-list/list-item';
import { BaseCardController } from './base.card-controller';
import { IpcService, DataRequestFactory, ConfigurationService } from '@core';

@Component({
  selector: 'app-thumb-card',
  templateUrl: './thumb-card.component.html',
  styleUrls: ['./thumb-card.component.scss']
})
export class ThumbCardComponent implements OnInit {

  // <editor-fold desc='@Input properties'>
  @Input() public item: ListItem;
  @Input() public controller: BaseCardController<BaseItem, DtoGetBase, DtoSetBase>;
  // </editor-fold>

  // <editor-fold desc='Private properties'>
  private imageUrl: string;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(
    private sanitization: DomSanitizer,
    private configurationService: ConfigurationService,
    private dataRequestFactory: DataRequestFactory,
    private ipcService: IpcService) { }
  // </editor-fold>

  // <editor-fold desc='Angular interface methods'>
  public ngOnInit(): void {
    if (this.item.thumbId) {
      const request = this.dataRequestFactory.createUntypedDataRequest(DataVerb.GET, `/thumbnail/${this.item.thumbId}`);
      this.ipcService.dataRequest<DtoImage>(request).then(response => {
        this.imageUrl = response.data.image ?
          'data:image/jpeg;base64,' + response.data.image :
          this.configurationService.genericThumbUrl;
      });
    } else {
       this.imageUrl = this.configurationService.genericThumbUrl;
    }

  }
  // </editor-fold>

  // <editor-fold desc='UI Triggered method'>
  public trackByIcon(_i: number, obj: any) {
    return obj.icon;
  }

  public getThumbNail(): SafeStyle {
    // if (!this.imageUrl) {
    //   if (this.item.thumbId) {
    //     const request = this.dataRequestFactory.createUntypedDataRequest(DataVerb.GET, `/thumbnail/${this.item.thumbId}`);
    //     const response = this.ipcService.dataRequestSync<DtoImage>(request);
    //
    //     this.imageUrl = response.data.image ?
    //       'data:image/jpeg;base64,' + response.data.image :
    //       undefined;
    //       // this.configurationService.genericThumbUrl;
    //     console.log(this.item.thumbId, 'thumbnail set', this.imageUrl ? true : false);
    //   } else {
    //     this.imageUrl = undefined; //this.configurationService.genericThumbUrl;
    //   }
    // }

    return this.imageUrl ?
      this.sanitization.bypassSecurityTrustStyle(`url(${this.imageUrl})`) :
      undefined;
  }
  // </editor-fold>

}
