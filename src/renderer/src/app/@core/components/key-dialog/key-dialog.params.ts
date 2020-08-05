export interface IKeyDialogParams {
  isInitial: boolean;
  cancelDialog: () => void;
  commitDialog: (key: string) => Promise<string>;
}
