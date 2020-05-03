import { DtoListCollection } from '@ipc';
import { ListItem } from '@shared';
import { Injectable } from '@angular/core';

@Injectable()
export class CollectionListItem extends ListItem {

  // <editor-fold desc='Public properties'>
  public path: string;
  public pictures: number;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(dtoListCollection: DtoListCollection) {
    super(dtoListCollection.id);
    this.name = dtoListCollection.name;
    this.thumb = dtoListCollection.thumb;
    this.path = dtoListCollection.path;
    this.pictures = dtoListCollection.pictures;
  }
  // </editor-fold>
}
