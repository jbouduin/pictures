import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { BaseItem, DynamicDialogController } from '@shared';
import { TagNewItem } from '../items/tag.new-item';
import { TagEditItem } from '../items/tag.edit-item';


@Component({
  selector: 'app-tag-dialog',
  templateUrl: './tag-dialog.component.html',
  styleUrls: ['./tag-dialog.component.scss']
})
export class TagDialogComponent implements OnInit {

  // <editor-fold desc='Public properties'>
  public tag: TagNewItem | TagEditItem;
  public tagData: FormGroup;
  public dialogTitle: string;
  // </editor-fold>

  // <editor-fold desc='Public get Methods'>
  public get created(): Date {
    if (this.tag.isNew) {
      return undefined;
    } else {
      return (this.tag as TagEditItem).created;
    }
  }

  public get id(): number {
    if (this.tag.isNew) {
      return undefined;
    } else {
      return (this.tag as TagEditItem).id;
    }
  }

  public get modified(): Date {
    if (this.tag.isNew) {
      return undefined;
    } else {
      return (this.tag as TagEditItem).modified;
    }
  }

  public get version(): number {
    if (this.tag.isNew) {
      return undefined;
    } else {
      return (this.tag as TagEditItem).version;
    }
  }
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(
    private formBuilder: FormBuilder,
    private controller: DynamicDialogController,
    baseItem: BaseItem) {

    if (baseItem.isNew) {
      this.tag = (baseItem as any) as TagNewItem;
      this.dialogTitle = 'New tag';
    } else {
      this.tag = (baseItem as any) as TagEditItem;
      this.dialogTitle = 'Edit tag';
    }

    const nameControl = new FormControl( '', [Validators.required]);
    const canAssignControl = new FormControl( { value: true, disabled: !this.tag.isNew }, [Validators.required]);
    this.tagData = this.formBuilder.group({
      name: nameControl,
      canAssign: canAssignControl
    });

    if (!this.tag.isNew) {
      nameControl.patchValue(this.tag.name);
      canAssignControl.patchValue(this.tag.canAssign);
    }
  }
  // </editor-fold>

  // <editor-fold desc='Angular interface methods'>
  public ngOnInit(): void { }
  // </editor-fold>

  // <editor-fold desc='UI triggered methods'>
  public cancel(): void {
    this.controller.cancelDialog();
  }

  public save(): void {
    this.commitForm();
    this.controller.commitDialog(this.tag);
  }

  public create(): void {
    this.commitForm();
    this.controller.commitDialog(this.tag);
  }

  public getErrorMessage(name: string): string | undefined {
    const formControl = this.tagData.get(name);
    if (formControl?.hasError('required')) {
      return 'You must enter a value';
    }
    return undefined;
  }
  // </editor-fold>

  // <editor-fold desc='Private methods'>
  private commitForm(): void {
    this.tag.name = this.tagData.get('name').value;
    this.tag.canAssign = this.tagData.get('canAssign').value;
  }
  // </editor-fold>
}
