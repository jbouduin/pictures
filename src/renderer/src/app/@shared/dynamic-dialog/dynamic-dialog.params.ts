import { ComponentType } from '@angular/cdk/portal';
import { BaseItem } from '../thumb/base-item';
import { dynamicDialogCancel, dynamicDialogCommit } from './dynamic-dialog.types';

export interface DynamicDialogParamsData<T extends BaseItem> {
  component: ComponentType<any>;
  item: T;
  cancelDialog: dynamicDialogCancel;
  commitDialog: dynamicDialogCommit;
}

export interface DynamicDialogParams<T extends BaseItem> {
  data: DynamicDialogParamsData<T>;
  width: string;
}
