import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

import { DtoGetBase, DtoSetBase, DataVerb, DtoImage } from '@ipc';
import { SelectionService, SelectionModus } from '@core';
import { SecretService, LockStatus } from '@core';
import { IpcService, DataRequestFactory, ConfigurationService } from '@core';
import { BaseItem } from '../base-item';
import { ListItem } from '../thumb-list/list-item';
import { BaseCardController } from './base.card-controller';
import { Router } from '@angular/router';

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
  private sanitization: DomSanitizer;
  private router: Router;
  private configurationService: ConfigurationService;
  private dataRequestFactory: DataRequestFactory;
  private secretService: SecretService;
  private selectionService: SelectionService;
  private ipcService: IpcService;
  // </editor-fold>

  // <editor-fold desc='Public properties'>
  public currentSelectionModus: SelectionModus;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(
    sanitization: DomSanitizer,
    router: Router,
    configurationService: ConfigurationService,
    dataRequestFactory: DataRequestFactory,
    secretService: SecretService,
    selectionService: SelectionService,
    ipcService: IpcService) {
    this.sanitization = sanitization;
    this.router = router;
    this.configurationService = configurationService;
    this.dataRequestFactory = dataRequestFactory;
    this.secretService = secretService;
    this.selectionService = selectionService;
    this.ipcService = ipcService;
  }
  // </editor-fold>

  // <editor-fold desc='Angular interface methods'>
  public ngOnInit(): void {
    this.secretService.subscribe( (status: LockStatus) => this.loadThumbNail(status));
    this.selectionService.subscribe( (modus: SelectionModus) => this.currentSelectionModus = modus);
  }
  // </editor-fold>

  // <editor-fold desc='UI Triggered method'>
  public trackByIcon(_i: number, obj: any) {
    return obj.icon;
  }

  public getThumbNail(): SafeStyle {
    return this.imageUrl ?
      this.sanitization.bypassSecurityTrustStyle(`url(${this.imageUrl})`) :
      undefined;
  }

  public onLongPress(_event: any): void {
    if (this.selectionService.currentModus === 'none') {
      this.selectionService.currentModus = 'multi'
    } else {
      this.selectionService.currentModus = 'none'
    }
  }

  public onClick(event: any): void {
    // we are only interested in left-click

    if(event.which === 1) {
      if (this.selectionService.currentModus === 'none') {
        if (this.item.routerLink) {
          this.router.navigate(this.item.routerLink);
        } else if (this.item.onClick) {
          this.item.onClick(this.item);
        }
      } else {
        this.setSelection(!this.item.selected);
      }
    }
  }

  public setSelection(checked: boolean) {
    this.item.selected = checked;
    if (checked) {
      this.selectionService.addToSelection(this.item);
    } else {
      this.selectionService.removeFromSelection(this.item);
    }
  }
  // </editor-fold>

  // <editor-fold desc='Private methods'>
  private loadThumbNail(lockStatus: LockStatus) {
    if (this.item.thumbId) {
      const url = lockStatus === 'lock' || !this.item.secret ?
        `/thumbnail/${this.item.thumbId}` :
        `/secret/thumb/${this.item.thumbId}`;
      const request = this.dataRequestFactory.createUntypedDataRequest(DataVerb.GET, url);
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
}
