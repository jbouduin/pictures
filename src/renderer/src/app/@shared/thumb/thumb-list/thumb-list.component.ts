import { Component, OnInit } from '@angular/core';
import { DtoListBase, DtoGetBase, DtoNewBase, DtoSetBase, DtoTreeBase } from '@ipc';
import { FloatingButtonParams } from '../../floating-button/floating-button.params';
import { PaginationController} from '../../pagination/pagination.controller';
import { BaseItem } from '../base-item';
import { ListItem } from './list-item';
import { ActivatedRoute } from '@angular/router';
import { BaseTreeController } from '../thumb-tree/base.tree-controller';
import { BaseCardController } from '../thumb-card/base.card-controller';
import { BaseListController } from './base.list-controller';
import { BaseTreeItem } from '../thumb-tree/base.tree-item';

@Component({
  selector: 'app-thumb-list',
  templateUrl: './thumb-list.component.html',
  styleUrls: ['./thumb-list.component.scss']
})
export class ThumbListComponent implements OnInit {

  // <editor-fold desc='Public getter methods'>
  public get listItems(): Array<ListItem> {
    return this.listController.cards;
  }

  public get floatingButtonParams(): FloatingButtonParams {
    return this.listController.floatingButtonParams;
  }

  public get paginationController(): PaginationController {
    return this.listController.pagination;
  }

  public get rszDirection(): Array<string> {
    return this.treeController.treeNodes ? ['right'] : ['none'];
  }

  public get treeItems(): Array<BaseTreeItem> {
    return this.treeController.treeNodes;
  }
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(
    private activatedRoute: ActivatedRoute,
    private treeController: BaseTreeController<BaseTreeItem, DtoTreeBase>,
    public cardController: BaseCardController<BaseItem, DtoGetBase, DtoSetBase>,
    private listController: BaseListController<ListItem, BaseItem, DtoListBase, DtoNewBase>) { }
  // </editor-fold>

  // <editor-fold desc='Angular interface methods'>
  public ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      this.treeController.processParamMap(paramMap);
      this.listController.processParamMap(paramMap);
      console.log('processed parammaps');
      this.treeController
        .loadTree()
        .finally(() => this.listController.loadList(this.treeController.currentQueryString));
    });
  }

  public treeItemSelected(node: BaseTreeItem) {
    console.log(node);
    this.treeController.toggleTreeItem(node);
  }
}
