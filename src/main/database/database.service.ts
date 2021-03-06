import { inject, injectable } from 'inversify';
import { createConnection, getConnection, TreeRepository, DeleteQueryBuilder } from 'typeorm';
import { Connection as TypeOrmConnection } from 'typeorm';
import { Repository } from 'typeorm';
import 'reflect-metadata';

import { ConnectionType, TargetType, LogSource, LogLevel } from '@ipc';
import { DtoConnection } from '@ipc';
import { IConfigurationService, ILogService } from '../data';

import { Collection, Picture } from './entities';
import { LogMaster, LogDetail } from './entities';
import { MetadataKey, MetadataPictureMap,  } from './entities';
import { SecretImage, SecretThumb } from './entities';
import { Setting } from './entities';
import { Tag } from './entities';
import { CollectionSubscriber, PictureSubscriber } from './subscribers';

import SERVICETYPES from '../di/service.types';

export interface IDatabaseService {
  getCollectionRepository(): Repository<Collection>;
  getDeleteQueryBuilder(targetType: TargetType): DeleteQueryBuilder<any>;
  getLogMasterRepository(): Repository<LogMaster>;
  getLogDetailRepository(): Repository<LogDetail>;
  getMetaDataKeyRepository(): Repository<MetadataKey>;
  getMetaDataPictureMapRepository(): Repository<MetadataPictureMap>;
  getPictureRepository(): Repository<Picture>;
  getSecretImageRepository(): Repository<SecretImage>;
  getSecretThumbRepository(): Repository<SecretThumb>;
  getSettingRepository(): Repository<Setting>;
  getTagRepository(): TreeRepository<Tag>;
  initialize(logService: ILogService): Promise<Array<TypeOrmConnection>>;
}

@injectable()
export class DatabaseService implements IDatabaseService {

  // <editor-fold desc=''>
  private logService: ILogService;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(
    @inject(SERVICETYPES.ConfigurationService) private configurationService: IConfigurationService) { }
  // </editor-fold>

  // <editor-fold desc='IDatabaseService interface methods'>
  public getCollectionRepository(): Repository<Collection> {
    return this
      .getConnectionByTargetType(TargetType.PICTURES)
      .getRepository(Collection);
  }

  public getDeleteQueryBuilder(targetType: TargetType): DeleteQueryBuilder<any> {
    return this.getConnectionByTargetType(targetType).createQueryBuilder().delete();
  }

  public getLogDetailRepository(): Repository<LogDetail> {
    return this
      .getConnectionByTargetType(TargetType.LOG)
      .getRepository(LogDetail);
  }

  public getLogMasterRepository(): Repository<LogMaster> {
    return this
      .getConnectionByTargetType(TargetType.LOG)
      .getRepository(LogMaster);
  }

  public getMetaDataKeyRepository(): Repository<MetadataKey> {
    return this
      .getConnectionByTargetType(TargetType.PICTURES)
      .getRepository(MetadataKey);
  }

  public getMetaDataPictureMapRepository(): Repository<MetadataPictureMap> {
    return this
      .getConnectionByTargetType(TargetType.PICTURES)
      .getRepository(MetadataPictureMap);
  }

  public getPictureRepository(): Repository<Picture> {
    return this
      .getConnectionByTargetType(TargetType.PICTURES)
      .getRepository(Picture);
  }

  public getSecretImageRepository(): Repository<SecretImage> {
    return this
      .getConnectionByTargetType(TargetType.SECRET)
      .getRepository(SecretImage);
  }

  public getSecretThumbRepository(): Repository<SecretThumb> {
    return this
      .getConnectionByTargetType(TargetType.SECRET)
      .getRepository(SecretThumb);
  }

  public getSettingRepository(): Repository<Setting> {
    return this
      .getConnectionByTargetType(TargetType.PICTURES)
      .getRepository(Setting);
  }

  public getTagRepository(): TreeRepository<Tag> {
    return this
      .getConnectionByTargetType(TargetType.PICTURES)
      .getTreeRepository(Tag);
  }

  public async initialize(logService: ILogService): Promise<Array<TypeOrmConnection>> {
    this.logService = logService;

    const result = await Promise.all([
      this.connectByName(
        this.getConnectionNameForTargetType(TargetType.SECRET),
        [ SecretImage, SecretThumb ]),
      this.connectByName(
        this.getConnectionNameForTargetType(TargetType.PICTURES),
        [ Collection, MetadataKey, MetadataPictureMap, Picture, Setting, Tag ],
        [ CollectionSubscriber, PictureSubscriber ]),
      this.connectByName(
          this.getConnectionNameForTargetType(TargetType.LOG),
          [ LogMaster, LogDetail ]),
    ]);
    if (this.configurationService.fullConfiguration.current.clearLogsAtStartup) {
      await this.logService.clearLogs(this.configurationService.fullConfiguration.launchedAt);
    }
    await this.logService.log(LogSource.Main, LogLevel.Verbose, 'Initialized database service');
    return result;
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

  private async connectByName(connectionName: string, entities: Array<any>, subscribers?: Array<any>): Promise<TypeOrmConnection> {
    let toConnect = this.configurationService.environment.database.connections.find(
      connection => connection.connectionName === connectionName
    );
    if (!toConnect) {
      toConnect = this.configurationService.environment.database.connections[0];
    }
    if (!toConnect) {
      throw new Error('could not find a database to connect');
    }
    return this.createConnection(toConnect, entities, subscribers);
  }

  private async createConnection(connection: DtoConnection, entities: Array<any>, subscribers?: Array<any>): Promise<TypeOrmConnection> {

    switch (connection.connectionType) {
      case ConnectionType.MYSQL: {
        return this.createMySqlConnection(connection, entities, subscribers);
      }
      case ConnectionType.POSTGRES: {
        return this.createPostgresConnection(connection, entities, subscribers);
      }
      case ConnectionType.SQLITE: {
        return this.createSqliteConnection(connection, entities, subscribers);
      }
    }
  }

  private async createSqliteConnection(connection: DtoConnection, entities: Array<any>, subscribers?: Array<any>): Promise<TypeOrmConnection> {
    return createConnection({
        database: connection.databaseName,
        entities,
        subscribers,
        name: connection.connectionName,
        synchronize: true,
        type: 'sqlite'
    });
  }

  private async createMySqlConnection(connection: DtoConnection, entities: Array<any>, subscribers?: Array<any>): Promise<TypeOrmConnection> {
    return createConnection({
        database: connection.databaseName,
        entities,
        subscribers,
        host: connection.hostName,
        name: connection.connectionName,
        password: connection.password,
        port: connection.port || 3306,
        synchronize: true,
        type: 'mysql',
        username: connection.user
    });
  }

  private async createPostgresConnection(connection: DtoConnection, entities: Array<any>, subscribers?: Array<any>): Promise<TypeOrmConnection> {
    return createConnection({
        database: connection.databaseName,
        entities,
        subscribers,
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
