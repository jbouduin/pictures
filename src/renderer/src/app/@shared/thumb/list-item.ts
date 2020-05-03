import { BaseItem } from './base-item';
import { Injectable } from '@angular/core';

// @Injectable()
export abstract class ListItem extends BaseItem {

  // <editor-fold desc='Public properties'>
  public thumb: string;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(id: number) {
    super(id);
  }
  // </editor-fold>
}
