import { Component, Injector, OnInit } from '@angular/core';
import { ThumbListComponent, BaseListController, BaseCardController, BaseTreeController } from '@shared';
import { CollectionListController } from '../controllers/collection.list-controller';
import { CollectionCardController } from '../controllers/collection.card-controller';
import { CollectionTreeController } from '../controllers/collection.tree-controller';

@Component({
  selector: 'app-collection-list',
  templateUrl: './collection-list.component.html',
  styleUrls: ['./collection-list.component.scss']
})
export class CollectionListComponent implements OnInit {

  // <editor-fold desc='Private properties'>
  public injector: Injector;
  // </editor-fold>

  // <editor-fold desc='Public properties'>
  public readonly listComponent = ThumbListComponent;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(
    private readonly inj: Injector,
    private listController: CollectionListController,
    private cardController: CollectionCardController,
    private treeController: CollectionTreeController) { }
  // </editor-fold>

  // <editor-fold desc='Angular interface methods'>
  public ngOnInit(): void {
    this.injector = Injector.create(
    {
      parent: this.inj,
      providers: [
        { provide: BaseListController, useValue: this.listController },
        { provide: BaseCardController, useValue: this.cardController},
        { provide: BaseTreeController, useValue: this.treeController}
      ]
    });
  }
  // </editor-fold>

}
