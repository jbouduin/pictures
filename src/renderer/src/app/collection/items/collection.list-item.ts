import { DtoListCollection } from '@ipc';
import { Injectable } from '@angular/core';
import { ListItem } from '@shared';
import { SecretService } from '@core';

@Injectable()
export class CollectionListItem extends ListItem {

  // <editor-fold desc='Public properties'>
  public path: string;
  public secret: boolean;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(dtoListCollection: DtoListCollection, secretService: SecretService) {
    super(dtoListCollection.id, dtoListCollection.name);
    this.thumbId = dtoListCollection.thumbId;
    this.path = dtoListCollection.path;
    this.secret = dtoListCollection.secret;
    this.footerText = dtoListCollection.pictures.toString();
    this.routerLink = [ `/picture/collection/${dtoListCollection.id}` ];
    secretService.lockStatus.subscribe(status => { this.setOverlay(status); });
  }
  // </editor-fold>

  // <editor-fold desc='Private methods'>
  private setOverlay(currentLock: 'lock' | 'lock_open'): void {
    this.overlay = this.secret ? currentLock : undefined;
  }
  // </editor-fold>

}
