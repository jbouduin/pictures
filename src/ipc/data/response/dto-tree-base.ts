export interface DtoTreeBase {
  id: number;
  name: string;
  children: Array<DtoTreeBase>;
  queryString: string;
}
