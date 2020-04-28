import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { DtoGetCollection, DtoNewCollection } from '@ipc';

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

  // <editor-fold desc='Constructor & C°'>
  public constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CollectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dtoCollection: DtoNewCollection | DtoGetCollection) {

    this.dialogTitle = 'id' in dtoCollection ?
      'Edit collection' :
      'New collection';

    this.collectionData = this.formBuilder.group({
        name: new FormControl('', [Validators.required]),
        path: new FormControl('', [Validators.required])
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
