import { Container } from 'inversify';

import { ICollectionService, CollectionService } from '../data';
import { IConfigurationService, ConfigurationService } from '../data';
import { IDatabaseService, DatabaseService } from '../database';
import { IDataRouterService, DataRouterService } from '../data';
import { IFileService, FileService } from '../system';
import { IImageService, ImageService } from '../system';
import { ILogService, LogService } from '../system';
import { IPictureService, PictureService } from '../data';
import { IQueueService, QueueService } from '../system';

import SERVICETYPES from './service.types';

const container = new Container();

// <editor-fold desc='Services'>
container.bind<ICollectionService>(SERVICETYPES.CollectionService).to(CollectionService);
container.bind<IConfigurationService>(SERVICETYPES.ConfigurationService).to(ConfigurationService).inSingletonScope();
container.bind<IDatabaseService>(SERVICETYPES.DatabaseService).to(DatabaseService).inSingletonScope();
container.bind<IDataRouterService>(SERVICETYPES.DataRouterService).to(DataRouterService).inSingletonScope();
container.bind<IFileService>(SERVICETYPES.FileService).to(FileService);
container.bind<IImageService>(SERVICETYPES.ImageService).to(ImageService);
container.bind<ILogService>(SERVICETYPES.LogService).to(LogService).inSingletonScope();
container.bind<IPictureService>(SERVICETYPES.PictureService).to(PictureService);
container.bind<IQueueService>(SERVICETYPES.QueueService).to(QueueService).inSingletonScope();
// </editor-fold>

export default container;
