import { Component, Injector, OnInit } from '@angular/core';
import { ThumbListComponent, BaseListController, BaseCardController, BaseTreeController } from '@shared';

import { PictureListController } from '../controllers/picture.list-controller';
import { PictureCardController } from '../controllers/picture.card-controller';
import { PictureTreeController } from '../controllers/picture.tree-controller';

@Component({
  selector: 'app-picture-list',
  templateUrl: './picture-list.component.html',
  styleUrls: ['./picture-list.component.scss']
})
export class PictureListComponent implements OnInit {

  // <editor-fold desc='Private properties'>
  public injector: Injector;
  // </editor-fold>

  // <editor-fold desc='Public properties'>
  public readonly listComponent = ThumbListComponent;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(
    private readonly inj: Injector,
    private listController: PictureListController,
    private cardController: PictureCardController,
    private treeController: PictureTreeController) { }
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
