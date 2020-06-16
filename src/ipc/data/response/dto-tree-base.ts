export interface DtoTreeBase {
  label: string;
  children: Array<DtoTreeBase>;
  queryString: string;
}
