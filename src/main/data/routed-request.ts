export class RoutedRequest<T> {
  params: any;
  queryParams: any;
  path: string;
  route: string;
  applicationSecret: string
  data: T;
}
