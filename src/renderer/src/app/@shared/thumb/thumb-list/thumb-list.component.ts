import { Component, OnInit } from '@angular/core';

import { DtoListBase, DtoGetBase, DtoNewBase, DtoSetBase } from '@ipc';

import { FloatingButtonParams } from '../../floating-button/floating-button.params';
import { PaginationController} from '../../pagination/pagination.controller';
import { BaseItem } from '../base-item';
import { ListItem } from '../list-item';
import { ThumbController } from '../thumb.controller';
import { TreeItem } from '../tree-item';
import { ActivatedRoute } from '@angular/router';

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

  public get rszDirection(): Array<string> {
    return this.controller.treeNodes ? ['right'] : ['none'];
  }

  public get treeItems(): Array<TreeItem> {
    return this.controller.treeNodes;
  }
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(
    private activatedRoute: ActivatedRoute,
    private controller:
      ThumbController<ListItem, TreeItem, BaseItem, BaseItem, DtoListBase, DtoGetBase, DtoNewBase, DtoSetBase>) { }
  // </editor-fold>

  // <editor-fold desc='Angular interface methods'>
  public ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      this.controller.processParamMap(paramMap);
      console.log('processed parammap');
      this.controller.loadList();
      console.log('loaded list');
    });
  }

  public treeItemSelected(node: TreeItem) {
    console.log(node);
    this.controller.toggleTreeItem(node);
  }
}
