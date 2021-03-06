import { Container } from 'inversify';

import { ICollectionService, CollectionService } from '../data';
import { IConfigurationService, ConfigurationService } from '../data';
import { IDatabaseService, DatabaseService } from '../database';
import { IDataRouterService, DataRouterService } from '../data';
import { IFileService, FileService } from '../system';
import { ILogService, LogService } from '../data';
import { IPictureService, PictureService } from '../data';
import { IQueueService, QueueService } from '../system';
import { ISecretImageService, SecretImageService } from '../data';
import { ISecretThumbService, SecretThumbService } from '../data';
import { ISettingsService, SettingsService } from '../data';
import { ISystemService, SystemService } from '../data';
import { ITagService, TagService } from '../data';
import { IThumbnailService, ThumbnailService } from '../data';

import SERVICETYPES from './service.types';

const container = new Container();

// <editor-fold desc='Services'>
container.bind<ICollectionService>(SERVICETYPES.CollectionService).to(CollectionService);
container.bind<IConfigurationService>(SERVICETYPES.ConfigurationService).to(ConfigurationService).inSingletonScope();
container.bind<IDatabaseService>(SERVICETYPES.DatabaseService).to(DatabaseService).inSingletonScope();
container.bind<IDataRouterService>(SERVICETYPES.DataRouterService).to(DataRouterService).inSingletonScope();
container.bind<IFileService>(SERVICETYPES.FileService).to(FileService);
container.bind<ILogService>(SERVICETYPES.LogService).to(LogService).inSingletonScope();
container.bind<IPictureService>(SERVICETYPES.PictureService).to(PictureService);
container.bind<IQueueService>(SERVICETYPES.QueueService).to(QueueService).inSingletonScope();
container.bind<ISecretImageService>(SERVICETYPES.SecretImageService).to(SecretImageService);
container.bind<ISecretThumbService>(SERVICETYPES.SecretThumbService).to(SecretThumbService);
container.bind<ISettingsService>(SERVICETYPES.SettingsService).to(SettingsService);
container.bind<ISystemService>(SERVICETYPES.SystemService).to(SystemService).inSingletonScope();
container.bind<ITagService>(SERVICETYPES.TagService).to(TagService);
container.bind<IThumbnailService>(SERVICETYPES.ThumbnailService).to(ThumbnailService);
// </editor-fold>

export default container;
