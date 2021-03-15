export interface DtoLogMaster {
  created: Date,
  source: string,
  logLevel: string,
  value: string,
  details: Array<string>
}