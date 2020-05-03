import { ComponentType } from '@angular/cdk/portal';
import { BaseItem } from '../thumb/base-item';

export interface DynamicDialogParamsData<T extends BaseItem> {
  component: ComponentType<any>;
  item: T;
}

export interface DynamicDialogParams<T extends BaseItem> {
  data: DynamicDialogParamsData<T>;
  width: string;
}
