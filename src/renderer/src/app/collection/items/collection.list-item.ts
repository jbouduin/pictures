import { DtoListCollection } from '@ipc';
import { Injectable } from '@angular/core';
import { ListItem } from '@shared';
import { SecretService, LockStatus } from '@core';

@Injectable()
export class CollectionListItem extends ListItem {

  // <editor-fold desc='Public properties'>
  public path: string;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(dtoListCollection: DtoListCollection, secretService: SecretService) {
    super(dtoListCollection.id, dtoListCollection.name, dtoListCollection.isSecret);
    this.thumbId = dtoListCollection.thumbId;
    this.path = dtoListCollection.path;
    this.footerText = dtoListCollection.pictures.toString();
    secretService.subscribe(status => { this.setLockStatus(status); });
  }
  // </editor-fold>

  // <editor-fold desc='Private methods'>
  private setLockStatus(currentLock: LockStatus): void {
    this.overlay = this.isSecret ? currentLock : undefined;
    if (this.isSecret) {
      this.routerLink = currentLock === 'lock' ? undefined : [ `/picture/collection/${this.id}` ];
    } else {
      this.routerLink = [ `/picture/collection/${this.id}` ];
    }
  }
  // </editor-fold>

}
