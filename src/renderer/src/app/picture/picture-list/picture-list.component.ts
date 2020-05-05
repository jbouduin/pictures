import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ThumbController, ThumbListComponent } from '@shared';

import { PictureController } from '../picture.controller';

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
    private activatedRoute: ActivatedRoute,
    private pictureController: PictureController) { }
  // </editor-fold>

  // <editor-fold desc='Angular interface methods'>
  public ngOnInit(): void {
    this.activatedRoute.url
      .subscribe(urlSegments => this.pictureController.setCurrentRoot(urlSegments));
    this.injector = Injector.create(
    {
      parent: this.inj,
      providers: [
        { provide: ThumbController, useValue: this.pictureController }
      ]
    });
  }

}
