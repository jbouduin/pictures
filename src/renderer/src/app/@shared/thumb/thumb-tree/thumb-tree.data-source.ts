import { NestedTreeControl } from "@angular/cdk/tree";
import { MatTreeNestedDataSource } from "@angular/material/tree";
import { BaseTreeItem } from './base.tree-item';

// https://stackblitz.com/edit/angular-material-nested-tree-with-updates
// doesn't seem to work neither
export class ThumbTreeDataSource extends MatTreeNestedDataSource<BaseTreeItem> {
  constructor(
    private treeControl: NestedTreeControl<BaseTreeItem>,
    initialData: Array<BaseTreeItem>) {
    super();
    this._data.next(initialData);
  }

  /** Add node as child of parent */
  public add(node: BaseTreeItem, parent: BaseTreeItem) {
    // add dummy root so we only have to deal with `BaseTreeItem`s
    const newTreeData: BaseTreeItem = {
      children: this.data,
      queryString: undefined,
      id: 0,
      name: 'Dummy root',
      isNew: false
    };
    this._add(node, parent, newTreeData);
    this.data = newTreeData.children;
  }

  /** Remove node from tree */
  public remove(node: BaseTreeItem) {
    const newTreeData: BaseTreeItem = {
      children: this.data,
      queryString: undefined,
      id: 0,
      name: 'Dummy root',
      isNew: false
    };
    this._remove(node, newTreeData);
    this.data = newTreeData.children;
  }

  /*
   * For immutable update patterns, have a look at:
   * https://redux.js.org/recipes/structuring-reducers/immutable-update-patterns/
   */

  protected _add(newNode: BaseTreeItem, parent: BaseTreeItem, tree: BaseTreeItem) {
    if (tree === parent) {
      console.log(
        `replacing children array of '${parent.name}', adding ${newNode.name}`
      );
      tree.children = [...tree.children!, newNode];
      this.treeControl.expand(tree);
      return true;
    }
    if (!tree.children) {
      console.log(`reached leaf node '${tree.name}', backing out`);
      return false;
    }
    return this.update(tree, this._add.bind(this, newNode, parent));
  }

  _remove(node: BaseTreeItem, tree: BaseTreeItem): boolean {
    if (!tree.children) {
      return false;
    }
    const i = tree.children.indexOf(node);
    if (i > -1) {
      tree.children = [
        ...tree.children.slice(0, i),
        ...tree.children.slice(i + 1)
      ];
      this.treeControl.collapse(node);
      console.log(`found ${node.name}, removing it from`, tree);
      return true;
    }
    return this.update(tree, this._remove.bind(this, node));
  }

  protected update(tree: BaseTreeItem, predicate: (n: BaseTreeItem) => boolean) {
    let updatedTree: BaseTreeItem;
    let updatedIndex: number;

    tree.children!.find((node, i) => {
      if (predicate(node)) {
        console.log(`creating new node for '${node.name}'`);
        updatedTree = node;
        updatedIndex = i;
        this.moveExpansionState(node, updatedTree);
        return true;
      }
      return false;
    });

    if (updatedTree!) {
      console.log(`replacing node '${tree.children![updatedIndex!].name}'`);
      tree.children![updatedIndex!] = updatedTree!;
      return true;
    }
    return false;
  }

  moveExpansionState(from: BaseTreeItem, to: BaseTreeItem) {
    if (this.treeControl.isExpanded(from)) {
      console.log(`'${from.name}' was expanded, setting expanded on new node`);
      this.treeControl.collapse(from);
      this.treeControl.expand(to);
    }
  }
}
