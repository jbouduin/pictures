import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-key-dialog',
  templateUrl: './key-dialog.component.html',
  styleUrls: ['./key-dialog.component.scss']
})
export class KeyDialogComponent implements OnInit {

  // <editor-fold desc='Private properties'>
  private dialogRef: MatDialogRef<KeyDialogComponent>;
  // </editor-fold>

  // <editor-fold desc='Public properties'>
  public hidden: boolean;
  public keyDataGroup: FormGroup;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(
    formBuilder: FormBuilder,
    dialogRef: MatDialogRef<KeyDialogComponent>) {
    this.dialogRef = dialogRef;
    this.hidden = true;
    this.keyDataGroup = formBuilder.group(
      { key: new FormControl('', [Validators.required]) }
    );
  }
  // </editor-fold>

  // <editor-fold desc='Angular interface methods'>
  public ngOnInit(): void { }
  // </editor-fold>

  // <editor-fold desc='UI triggered methods'>
  public cancel(): void {
    this.dialogRef.close();
  }

  public commit(): void {
    this.dialogRef.close(this.keyDataGroup.get('key').value);
  }
  // </editor-fold>
}
