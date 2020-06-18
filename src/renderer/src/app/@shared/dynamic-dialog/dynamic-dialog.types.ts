export type dynamicDialogCancel = () => void;
export type dynamicDialogCommit = (item: any) => void;

export class DynamicDialogController {
  public cancelDialog: dynamicDialogCancel;
  public commitDialog: dynamicDialogCommit;

  public constructor(cancelDialog: dynamicDialogCancel, commitDialog: dynamicDialogCommit) {
    this.cancelDialog = cancelDialog;
    this.commitDialog = commitDialog;
  }
}
