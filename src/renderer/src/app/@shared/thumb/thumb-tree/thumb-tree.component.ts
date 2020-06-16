import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { TreeItem } from '../tree-item';

@Component({
  selector: 'app-thumb-tree',
  templateUrl: './thumb-tree.component.html',
  styleUrls: ['./thumb-tree.component.scss']
})
export class ThumbTreeComponent implements OnInit, OnChanges {

  @Input() public treeItems: Array<TreeItem>;
  @Output() public itemSelected: EventEmitter<TreeItem>;

  public treeControl: NestedTreeControl<TreeItem>;
  public dataSource: MatTreeNestedDataSource<TreeItem>;
  public selectedNode: TreeItem | undefined;

  constructor() {
    this.treeControl = new NestedTreeControl<TreeItem>(node => node.children);
    this.dataSource = new MatTreeNestedDataSource<TreeItem>();
    this.itemSelected = new EventEmitter<TreeItem>();
    this.selectedNode = undefined;
  }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
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

  public hasChild(_: number, node: TreeItem): boolean {
    return !!node.children && node.children.length > 0;
  }

  public clickNode(item: TreeItem) {
    if (this.selectedNode !== item) {
      this.selectedNode = item;
    } else {
      this.selectedNode = undefined;
    }
    this.itemSelected.emit(this.selectedNode);
  }
}
