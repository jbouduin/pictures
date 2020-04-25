export enum ConnectionType {
  MYSQL = 'mysql',
  POSTGRES = 'postgres',
  SQLITE = 'sqlite'
}

export interface DtoConnection {
  connectionName: string;
  databaseName: string;
  connectionType: string;
  hostName: string;
  port: number;
  user: string;
  password: string;
}
