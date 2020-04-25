export interface IService<T> {
  initialize(): Promise<T>;
}
