export enum ScanStatus {
  NoScan,
  Searching,
  Processing,
  Finished,
  DirectoryNotFound
}

export interface DtoScan {
  status: ScanStatus;
  files: number;
}
