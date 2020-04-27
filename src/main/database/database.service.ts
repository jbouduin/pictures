import { inject, injectable } from 'inversify';
import { createConnection, getConnection, getRepository } from 'typeorm';
import { Connection as TypeOrmConnection } from 'typeorm';
import { Repository } from 'typeorm';
import 'reflect-metadata';

import { ConnectionType, TargetType } from '@ipc';
import { DtoConfiguration, DtoConnection } from '@ipc';
import { IConfigurationService } from '../data';
import { IService } from '../di/service';

import SERVICETYPES from '../di/service.types';

import { Collection, Exif, Picture } from './entities';

export interface IDatabaseService extends IService<any> {
  getCollectionRepository(): Repository<Collection>;
  getPictureRepository(): Repository<Picture>;
}

@injectable()
export class DatabaseService implements IDatabaseService {

  // <editor-fold desc='Constructor & C°'>
  public constructor(
    @inject(SERVICETYPES.ConfigurationService) private configurationService: IConfigurationService) { }
  // </editor-fold>

  // <editor-fold desc='IService interface methods'>
  public initialize(): Promise<TypeOrmConnection> {
    console.log('in initialize DatabaseService');
    return this.connectByName(
          this.getConnectionNameForTargetType(TargetType.PICTURES),
          [Collection, Exif, Picture]);
  }
  // </editor-fold>

  // <editor-fold desc='IDatabaseService interface methods'>
  public getCollectionRepository(): Repository<Collection> {
    return this
      .getConnectionByTargetType(TargetType.PICTURES)
      .getRepository(Collection);
  }

  public getPictureRepository(): Repository<Picture> {
    return this
      .getConnectionByTargetType(TargetType.PICTURES)
      .getRepository(Picture);
  }
  // </editor-fold>

  // <editor-fold desc='Private connection related methods'>
  private getConnectionNameForTargetType(targetType: TargetType): string {
    return this.configurationService.environment.database.targets
      .find(target => target.targetType === targetType).connectionName;
  }

  private getConnectionByTargetType(targetType: TargetType): TypeOrmConnection {
    return getConnection(this.getConnectionNameForTargetType(targetType));
  }

  private async connectByName(connectionName: string, entities: Array<any>): Promise<TypeOrmConnection> {
    let toConnect = this.configurationService.environment.database.connections.find(
      connection => connection.connectionName === connectionName
    );
    if (!toConnect) {
      toConnect = this.configurationService.environment.database.connections[0];
    }
    if (!toConnect) {
      throw new Error('could not find a database to connect');
    }
    return this.createConnection(toConnect, entities);
  }

  private async createConnection(connection: DtoConnection, entities: Array<any>): Promise<TypeOrmConnection> {

    switch (connection.connectionType) {
      case ConnectionType.MYSQL: {
        return this.createMySqlConnection(connection, entities);
      }
      case ConnectionType.POSTGRES: {
        return this.createPostgresConnection(connection, entities);
      }
      case ConnectionType.SQLITE: {
        return this.createSqliteConnection(connection, entities);
      }
    }
  }

  private async createSqliteConnection(connection: DtoConnection, entities: Array<any>): Promise<TypeOrmConnection> {
    return createConnection({
        database: connection.databaseName,
        entities,
        name: connection.connectionName,
        synchronize: true,
        type: 'sqlite'
    });
  }

  private async createMySqlConnection(connection: DtoConnection, entities: Array<any>): Promise<TypeOrmConnection> {
    return createConnection({
        database: connection.databaseName,
        entities,
        host: connection.hostName,
        name: connection.connectionName,
        password: connection.password,
        port: connection.port || 3306,
        synchronize: true,
        type: 'mysql',
        username: connection.user
    });
  }

  private async createPostgresConnection(connection: DtoConnection, entities: Array<any>): Promise<TypeOrmConnection> {
    return createConnection({
        database: connection.databaseName,
        entities,
        host: connection.hostName,
        name: connection.connectionName,
        password: connection.password,
        port: connection.port || 5432,
        synchronize: true,
        type: 'postgres',
        username: connection.user
    });
  }
  // </editor-fold>
}
