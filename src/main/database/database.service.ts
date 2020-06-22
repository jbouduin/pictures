import { inject, injectable } from 'inversify';
import { createConnection, getConnection, TreeRepository, DeleteQueryBuilder } from 'typeorm';
import { Connection as TypeOrmConnection } from 'typeorm';
import { Repository } from 'typeorm';
import 'reflect-metadata';

import { ConnectionType, LogSource, TargetType } from '@ipc';
import { DtoConnection } from '@ipc';
import { IConfigurationService } from '../data';
import { ILogService } from '../system';

import { Collection, Picture, Tag } from './entities';
import SERVICETYPES from '../di/service.types';


export interface IDatabaseService {
  getCollectionRepository(): Repository<Collection>;
  getDeleteQueryBuilder(): DeleteQueryBuilder<any>;
  getPictureRepository(): Repository<Picture>;
  getTagRepository(): TreeRepository<Tag>;
  initialize(): Promise<TypeOrmConnection>
}

@injectable()
export class DatabaseService implements IDatabaseService {

  // <editor-fold desc='Constructor & C°'>
  public constructor(
    @inject(SERVICETYPES.LogService) private logService: ILogService,
    @inject(SERVICETYPES.ConfigurationService) private configurationService: IConfigurationService) { }
  // </editor-fold>

  // <editor-fold desc='IDatabaseService interface methods'>
  public getCollectionRepository(): Repository<Collection> {
    return this
      .getConnectionByTargetType(TargetType.PICTURES)
      .getRepository(Collection);
  }

  public getDeleteQueryBuilder(): DeleteQueryBuilder<any> {
    return this.getConnectionByTargetType(TargetType.PICTURES).createQueryBuilder().delete();
  }

  public getPictureRepository(): Repository<Picture> {
    return this
      .getConnectionByTargetType(TargetType.PICTURES)
      .getRepository(Picture);
  }

  public getTagRepository(): TreeRepository<Tag> {
    return this
      .getConnectionByTargetType(TargetType.PICTURES)
      .getTreeRepository(Tag);
  }

  public initialize(): Promise<TypeOrmConnection> {
    this.logService.debug(LogSource.Main, 'in initialize DatabaseService');
    return this.connectByName(
          this.getConnectionNameForTargetType(TargetType.PICTURES),
          [Collection, Picture, Tag]);
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
