import { Component, OnInit } from '@angular/core';

import { DtoListCollection } from '@ipc';
import { FloatingButtonHost } from '@shared';

import { CollectionDialogComponent } from '../collection-dialog/collection-dialog.component';
import { CollectionListItem } from '../collection.list-item';

import { NewController } from '../new.controller';

@Component({
  selector: 'app-collection-list',
  templateUrl: './collection-list.component.html',
  styleUrls: ['./collection-list.component.scss']
})
export class CollectionListComponent implements FloatingButtonHost, OnInit {

  // <editor-fold desc='Public properties'>
  public get cards(): Array<CollectionListItem> {
    return this.newController.cards;
  }
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(private newController: NewController) { }
  // </editor-fold>

  // <editor-fold desc='Angular interface methods'>
  public ngOnInit(): void {
    this.newController.loadList();
  }
  // </editor-fold>

  // <editor-fold desc='FloatingButtonhost interface members'>
  public floatingButtonClick(): void {
    this.newController.create();
  }

  public get floatingButtonIcon(): string {
    return 'add';
  }
  // </editor-fold>

}
