import { DtoListCollection } from '@ipc';
import { ListItem } from '@shared';
import { Injectable } from '@angular/core';

@Injectable()
export class CollectionListItem extends ListItem {

  // <editor-fold desc='Public properties'>
  public path: string;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(dtoListCollection: DtoListCollection) {
    super(dtoListCollection.id);
    this.name = dtoListCollection.name;
    this.thumbPath = dtoListCollection.thumbPath;
    this.path = dtoListCollection.path;
    this.footerText = dtoListCollection.pictures.toString();
    this.routerLink = [ `/picture/collection/${dtoListCollection.id}` ];
  }
  // </editor-fold>
}
