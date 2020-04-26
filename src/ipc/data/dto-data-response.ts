export enum DataStatus {
  Ok = 200,
  Created = 201,
  NoContent = 204,
  NotFound = 404,
  NotAllowed = 405,
  Conflict = 409,
  Error = 500
}

export interface DtoDataResponse<T> {
  status: DataStatus,
  data: T
}
