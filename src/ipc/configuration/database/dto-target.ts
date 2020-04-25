export enum TargetType {
  PICTURES = 'pictures',
  TEMP = 'temp'
}

export interface DtoTarget {
  connectionName: string;
  targetType: TargetType;
}
