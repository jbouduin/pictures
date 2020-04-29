import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { DtoCollection, DtoNewCollection } from '@ipc';

@Component({
  selector: 'app-collection-dialog',
  templateUrl: './collection-dialog.component.html',
  styleUrls: ['./collection-dialog.component.scss']
})
export class CollectionDialogComponent implements OnInit {

  // <editor-fold desc='Public properties'>
  public dialogTitle: string;
  public collectionData: FormGroup;
  // </editor-fold>

  // <editor-fold desc='Public get Methods'>
  public get created(): Date {
    if (this.isUpdate) {
      return (this.dtoCollection as DtoCollection).created;
    } else {
      return undefined;
    }
  }

  public get id(): number {
    if (this.isUpdate) {
      return (this.dtoCollection as DtoCollection).id;
    } else {
      return undefined;
    }
  }

  public get isUpdate(): boolean {
    return 'id' in this.dtoCollection;
  }

  public get modified(): Date {
    if (this.isUpdate) {
      return (this.dtoCollection as DtoCollection).modified;
    } else {
      return undefined;
    }
  }

  public get version(): number {
    if (this.isUpdate) {
      return (this.dtoCollection as DtoCollection).version;
    } else {
      return undefined;
    }
  }
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CollectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dtoCollection: DtoNewCollection | DtoCollection) {

    this.dialogTitle = 'id' in dtoCollection ?
      'Edit collection' :
      'New collection';

    this.collectionData = this.formBuilder.group({
        name: new FormControl('', [Validators.required]),
        path: new FormControl( { value: '', disabled: this.isUpdate }, [Validators.required])
      });
  }
  // </editor-fold>

  // <editor-fold desc='Angular interface methods'>
  public ngOnInit(): void { }
  // </editor-fold>

  // <editor-fold desc='UI triggered methods'>
  public cancel(): void {
    this.dialogRef.close();
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
