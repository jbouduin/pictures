import { Component, OnInit, Injector } from '@angular/core';
import { ThumbListComponent, BaseListController, BaseCardController, BaseTreeController } from '@shared';
import { TagListController } from '../controllers/tag.list-controller';
import { TagCardController } from '../controllers/tag.card-controller';
import { TagTreeController } from '../controllers/tag.tree-controller';

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.scss']
})
export class TagListComponent implements OnInit {

  // <editor-fold desc='Private properties'>
  public injector: Injector;
  // </editor-fold>

  // <editor-fold desc='Public properties'>
  public readonly listComponent = ThumbListComponent;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(
    private readonly inj: Injector,
    private listController: TagListController,
    private cardController: TagCardController,
    private treeController: TagTreeController) { }
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
