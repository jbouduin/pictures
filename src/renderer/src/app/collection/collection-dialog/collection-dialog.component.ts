import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { BaseItem, DynamicDialogController } from '@shared';
import { CollectionNewItem } from '../items/collection.new-item';
import { CollectionEditItem } from '../items/collection.edit-item';


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
    private controller: DynamicDialogController,
    baseItem: BaseItem) {

    this.collection = baseItem.isNew ?
      (baseItem as any) as CollectionNewItem :
      (baseItem as any) as CollectionEditItem;
    this.dialogTitle = baseItem.isNew ?
      'New collection' :
      'Edit collection';

    this.collectionData = this.formBuilder.group({
        name: new FormControl('', [Validators.required]),
        path: new FormControl( { value: '', disabled: !this.collection.isNew }, [Validators.required])
      });
  }
  // </editor-fold>

  // <editor-fold desc='Angular interface methods'>
  public ngOnInit(): void { }
  // </editor-fold>

  // <editor-fold desc='UI triggered methods'>
  public cancel(): void {
    this.controller.cancelDialog();
    // if (this.baseItem.isNew) {
    //   this.listController.cancelDialog();
    // } else {
    //   this.cardController.cancelDialog();
    // }
  }

  public save(): void {
    this.controller.commitDialog(this.collection);
    // this.cardController
    //   .commitEdit(this.collection as CollectionEditItem);
  }

  public create(): void {
    this.controller.commitDialog(this.collection);
    // this.listController
    //   .commitCreate(this.collection as CollectionNewItem);
  }

  public getErrorMessage(name: string): string | undefined {
    const formControl = this.collectionData.get(name);
    if (formControl?.hasError('required')) {
      return 'You must enter a value';
    }
    return undefined;
  }
  // </editor-fold>

}
