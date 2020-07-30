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
    secretService.lockStatus.subscribe(status => { this.setLockStatus(status); });
  }
  // </editor-fold>

  // <editor-fold desc='Private methods'>
  private setLockStatus(currentLock: 'lock' | 'lock_open'): void {
    this.overlay = this.secret ? currentLock : undefined;
    if (this.secret) {
      this.routerLink = currentLock === 'lock' ? undefined : [ `/picture/collection/${this.id}` ];
    } else {
      this.routerLink = [ `/picture/collection/${this.id}` ];
    }
  }
  // </editor-fold>

}
