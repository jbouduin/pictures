import { Component, OnInit } from '@angular/core';

import { DtoListBase, DtoGetBase, DtoNewBase, DtoSetBase } from '@ipc';

import { FloatingButtonParams } from '../../floating-button/floating-button.params';
import { PaginationController} from '../../pagination/pagination.controller';
import { BaseItem } from '../base-item';
import { ListItem } from '../list-item';
import { ThumbController } from '../thumb.controller';

@Component({
  selector: 'app-thumb-list',
  templateUrl: './thumb-list.component.html',
  styleUrls: ['./thumb-list.component.scss']
})
export class ThumbListComponent implements OnInit {

  // <editor-fold desc='Public getter methods'>
  public get listItems(): Array<ListItem> {
    return this.controller.cards;
  }

  public get floatingButtonParams(): FloatingButtonParams {
    return this.controller.floatingButtonParams;
  }

  public get paginationController(): PaginationController {
    return this.controller.pagination;
  }
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(private controller:
    ThumbController<ListItem, BaseItem, BaseItem, DtoListBase, DtoGetBase, DtoNewBase, DtoSetBase>) { }
  // </editor-fold>

  // <editor-fold desc='Angular interface methods'>
  public ngOnInit(): void {
    this.controller.loadList();
  }
}
