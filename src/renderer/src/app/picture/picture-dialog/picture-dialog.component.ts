import { Component, OnInit } from '@angular/core';
import { DynamicDialogController } from '@shared/dynamic-dialog/dynamic-dialog.types';
import { BaseItem } from '@shared/thumb/base-item';
import { PictureEditItem } from '../items/picture.edit-item';

@Component({
  selector: 'app-picture-dialog',
  templateUrl: './picture-dialog.component.html',
  styleUrls: ['./picture-dialog.component.scss']
})
export class PictureDialogComponent implements OnInit {

  private controller: DynamicDialogController;

  public picture: PictureEditItem;
  public displayedColumns: Array<string>;

  public constructor(controller: DynamicDialogController, baseItem: BaseItem) {
    this.controller = controller;
    this.picture = (baseItem as any) as PictureEditItem;
    this.displayedColumns = [ 'key', 'value' ];
  }

  // <editor-fold desc='Angular interface methods'>
  public ngOnInit(): void { }
  // </editor-fold>

  // <editor-fold desc='UI triggered methods'>
  public cancel(): void {
    this.controller.cancelDialog();
  }
  // </editor-fold>

}
