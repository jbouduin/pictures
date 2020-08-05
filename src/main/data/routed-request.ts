export class RoutedRequest<T> {
  params: any;
  queryParams: any;
  path: string;
  route: string;
  secretKey: string
  data: T;
}
