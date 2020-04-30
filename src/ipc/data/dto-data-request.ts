export enum DataVerb {
  POST = 'POST',
  GET = 'GET',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

export interface DtoDataRequest<T> {
  verb: DataVerb,
  path: string,
  data?: T
}

export interface DtoUntypedDataRequest extends DtoDataRequest<any> { }
