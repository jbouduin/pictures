export enum DataStatus {
  Ok = 200,
  Created = 201,
  NoContent = 204,
  BadRequest = 400,
  NotFound = 404,
  NotAllowed = 405,
  Conflict = 409,
  Gone = 410,
  Error = 500,
  RendererError = 900
}

export interface DtoDataResponse<T> {
  status: DataStatus,
  data?: T,
  message?: string
}

export interface DtoUntypedDataResponse extends DtoDataResponse<any> { }
