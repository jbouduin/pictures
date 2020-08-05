import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { BaseItem, DynamicDialogController } from '@shared';
import { CollectionNewItem } from '../items/collection.new-item';
import { CollectionEditItem } from '../items/collection.edit-item';
import { SecretService } from '@core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';


@Component({
  selector: 'app-collection-dialog',
  templateUrl: './collection-dialog.component.html',
  styleUrls: ['./collection-dialog.component.scss']
})
export class CollectionDialogComponent implements OnInit {

  // <editor-fold desc='Public properties'>
  public collection: CollectionNewItem | CollectionEditItem;
  public collectionData: FormGroup;
  public dialogTitle: string;
  // </editor-fold>

  // <editor-fold desc='Public get Methods'>
  public get created(): Date {
    if (this.collection.isNew) {
      return undefined;
    } else {
      return (this.collection as CollectionEditItem).created;
    }
  }

  public get id(): number {
    if (this.collection.isNew) {
      return undefined;
    } else {
      return (this.collection as CollectionEditItem).id;
    }
  }

  public get modified(): Date {
    if (this.collection.isNew) {
      return undefined;
    } else {
      return (this.collection as CollectionEditItem).modified;
    }
  }

  public get version(): number {
    if (this.collection.isNew) {
      return undefined;
    } else {
      return (this.collection as CollectionEditItem).version;
    }
  }
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(
    private formBuilder: FormBuilder,
    private secretService: SecretService,
    private controller: DynamicDialogController,
    baseItem: BaseItem) {

    if (baseItem.isNew) {
      this.collection = (baseItem as any) as CollectionNewItem;
      this.dialogTitle = 'New collection';
    } else {
      this.collection = (baseItem as any) as CollectionEditItem;
      this.dialogTitle = 'Edit collection';
    }

    const nameControl = new FormControl('', [Validators.required]);
    const pathControl = new FormControl({ value: '', disabled: !this.collection.isNew }, [Validators.required]);
    const secretControl = new FormControl({ value: false, disabled: !this.collection.isNew } );
    this.collectionData = this.formBuilder.group({
      name: nameControl,
      path: pathControl,
      secret: secretControl
    });

    if (!this.collection.isNew) {
      nameControl.patchValue(this.collection.name);
      pathControl.patchValue(this.collection.path);
      secretControl.patchValue(this.collection.isSecret);
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
    this.controller.commitDialog(this.collection);
  }

  public create(): void {
    this.commitForm();
    this.controller.commitDialog(this.collection);
  }

  public getErrorMessage(name: string): string | undefined {
    const formControl = this.collectionData.get(name);
    if (formControl?.hasError('required')) {
      return 'You must enter a value';
    }
    return undefined;
  }

  public secretChange(event: MatSlideToggleChange) {
    if (this.collection.isNew && event.checked && !this.secretService.key) {
      this.secretService.toggleLock();
    }
  }
  // </editor-fold>

  // <editor-fold desc='Private methods'>
  private commitForm(): void {
    this.collection.name = this.collectionData.get('name').value;
    this.collection.path = this.collectionData.get('path').value;
    this.collection.isSecret = this.collectionData.get('secret').value;
    if (this.collection.isNew && this.collection.isSecret) {
      (this.collection as CollectionNewItem).key = this.secretService.key
    }
  }
  // </editor-fold>
}
