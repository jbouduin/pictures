export enum TargetType {
  PICTURES = 'pictures',
  SECRET = 'secret',
  LOG = 'log'
}

export interface DtoTarget {
  connectionName: string;
  targetType: TargetType;
}
