import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { BaseTreeItem } from './base.tree-item';

@Component({
  selector: 'app-thumb-tree',
  templateUrl: './thumb-tree.component.html',
  styleUrls: ['./thumb-tree.component.scss']
})
export class ThumbTreeComponent implements OnInit, OnChanges {

  // <editor-fold desc='@Input/@Output properties'>
  @Input() public treeItems: Array<BaseTreeItem>;
  @Output() public itemSelected: EventEmitter<BaseTreeItem>;
  // </editor-fold>

  // <editor-fold desc='Public properties'>
  public treeControl: NestedTreeControl<BaseTreeItem>;
  public dataSource: MatTreeNestedDataSource<BaseTreeItem>;
  public selectedNode: BaseTreeItem | undefined;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor() {
    this.treeControl = new NestedTreeControl<BaseTreeItem>(node => node.children);
    this.dataSource = new MatTreeNestedDataSource<BaseTreeItem>();
    this.itemSelected = new EventEmitter<BaseTreeItem>();
    this.selectedNode = undefined;
  }
  // </editor-fold>

  // <editor-fold desc='Angular interface methods'>
  public ngOnInit(): void { }

  public ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnChanges');
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'treeItems': {
            this.dataSource.data = changes[propName].currentValue;
            this.selectedNode = this.dataSource.data[0];
          }
        }
      }
    }
  }
  // </editor-fold>

  // <editor-fold desc='UI Triggered methods'>
  public hasChild(_: number, node: BaseTreeItem): boolean {
    return !!node.children && node.children.length > 0;
  }

  public clickNode(item: BaseTreeItem) {
    if (this.selectedNode !== item) {
      this.selectedNode = item;
    } else {
      this.selectedNode = undefined;
    }
    this.itemSelected.emit(this.selectedNode);
  }
  // </editor-fold>
}
