import { DtoListTag } from '@ipc';
import { Injectable } from '@angular/core';
import { ListItem } from '@shared';

@Injectable()
export class TagListItem extends ListItem {

  // <editor-fold desc='Public properties'>
  public path: string;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(dtoListTag: DtoListTag) {
    super(dtoListTag.id);
    this.name = dtoListTag.name;
    this.thumbPath = dtoListTag.thumbPath;
    this.footerText = dtoListTag.pictures.toString();
    this.routerLink = [ `/picture/tag/${dtoListTag.id}` ];
  }
  // </editor-fold>
}