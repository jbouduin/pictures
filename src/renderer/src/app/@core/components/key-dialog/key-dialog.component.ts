import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IKeyDialogParams } from './key-dialog.params';

@Component({
  selector: 'app-key-dialog',
  templateUrl: './key-dialog.component.html',
  styleUrls: ['./key-dialog.component.scss']
})
export class KeyDialogComponent implements OnInit {

  // <editor-fold desc='Private properties'>
  private cancelDialog: () => void;
  private commitDialog: (key: string) => Promise<string>;
  // </editor-fold>

  // <editor-fold desc='Public properties'>
  public isInitial: boolean
  public passwordHidden: boolean;
  public repeatHidden: boolean;
  public keyDataGroup: FormGroup;
  // </editor-fold>

  // <editor-fold desc='Public getters'>
  public get dialogTitle(): string {
    return this.isInitial ? 'Set your secret key' : 'Secret key';
  }
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(
    formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) params: IKeyDialogParams) {
    this.isInitial = params.isInitial;
    this.cancelDialog = params.cancelDialog;
    this.commitDialog = params.commitDialog;
    this.passwordHidden = true;
    this.repeatHidden = true;
    this.keyDataGroup = formBuilder.group(
      { key: new FormControl('', [Validators.required]) }
    );
    if (this.isInitial) {
      this.keyDataGroup.addControl('repeat', new FormControl('', [Validators.required]));
      this.keyDataGroup.setValidators( (group: FormGroup) => {
        if (group.get('key').value !== group.get('repeat').value) {
          return { repeat: 'Secret key and repeated secret key do not match' };
        } else {
          return undefined;
        }
      })
    }

  }
  // </editor-fold>

  // <editor-fold desc='Angular interface methods'>
  public ngOnInit(): void { }
  // </editor-fold>

  // <editor-fold desc='UI triggered methods'>
  public cancel(): void {
    if (this.cancelDialog) {
      this.cancelDialog();
    }
  }

  public commit(): void {
    this.commitDialog(this.keyDataGroup.get('key').value);
  }
  // </editor-fold>
}
