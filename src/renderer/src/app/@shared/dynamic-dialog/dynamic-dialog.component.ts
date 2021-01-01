import { Component, Inject, Injector, OnInit } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';
import { BaseItem } from '../thumb/base-item';
import { DynamicDialogParamsData } from './dynamic-dialog.params';
import { DynamicDialogController } from './dynamic-dialog.types';
import { BaseTreeItem } from '@shared/thumb/thumb-tree/base.tree-item';

@Component({
  selector: 'app-dynamic-dialog',
  templateUrl: './dynamic-dialog.component.html',
  styleUrls: ['./dynamic-dialog.component.scss']
})
export class DynamicDialogComponent implements OnInit {

  // <editor-fold desc='Public properties'>
  public injector: Injector;
  public component: ComponentType<any>;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(
    private readonly inj: Injector,
    @Inject(MAT_DIALOG_DATA) private params: DynamicDialogParamsData<any>) {
    this.component = params.component;
    }
  // </editor-fold>

  // <editor-fold desc='Angular interface methods'>
  public ngOnInit(): void {
    const controller = new  DynamicDialogController(this.params.cancelDialog, this.params.commitDialog);
    this.injector = Injector.create(
    {
      parent: this.inj,
      providers: [
        { provide: BaseItem, useValue: this.params.item },
        { provide: BaseTreeItem, useValue: this.params.parent },
        { provide: DynamicDialogController, useValue: controller}
      ]
    });
  }
  // </editor-fold>
}
