import { TargetType, DtoTarget } from '../../../../ipc';

export class CfgTarget implements DtoTarget {
  public connectionName: string;
  public targetType: TargetType;
}
