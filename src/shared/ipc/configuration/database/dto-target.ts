export enum TargetType {
  PICTURES = 'pictures',
  SECRET = 'secret'
}

export interface DtoTarget {
  connectionName: string;
  targetType: TargetType;
}
