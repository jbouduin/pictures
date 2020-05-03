import { Component, Inject, Injector, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { BaseItem } from '../thumb/base-item';
import { DynamicDialogParams, DynamicDialogParamsData } from './dynamic-dialog.params';

@Component({
  selector: 'app-dynamic-dialog',
  templateUrl: './dynamic-dialog.component.html',
  styleUrls: ['./dynamic-dialog.component.scss']
})
export class DynamicDialogComponent implements OnInit {

  // <editor-fold desc='Private properties'>
  public injector: Injector;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(
    private readonly inj: Injector,
    private dialogRef: MatDialogRef<DynamicDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public params: DynamicDialogParamsData<any>) { }
  // </editor-fold>

  // <editor-fold desc='Angular interface methods'>
  public ngOnInit(): void {
    this.injector = Injector.create(
    {
      parent: this.inj,
      providers: [
        { provide: BaseItem, useValue: this.params.item }
      ]
    });
  }
  // </editor-fold>
}
