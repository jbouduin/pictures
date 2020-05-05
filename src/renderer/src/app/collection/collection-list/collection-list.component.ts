import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ThumbController, ThumbListComponent } from '@shared';

import { CollectionController } from '../collection.controller';

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
    private activatedRoute: ActivatedRoute,
    private collectionController: CollectionController) { }
  // </editor-fold>

  // <editor-fold desc='Angular interface methods'>
  public ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      this.collectionController.processParamMap(paramMap);
    });
    this.injector = Injector.create(
    {
      parent: this.inj,
      providers: [
        { provide: ThumbController, useValue: this.collectionController }
      ]
    });
  }
  // </editor-fold>

}
