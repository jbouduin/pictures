import { Container } from 'inversify';

import { ICollectionService, CollectionService } from '../data';
import { IConfigurationService, ConfigurationService } from '../data';
import { IDataRouterService, DataRouterService } from '../data';
import { IPictureService, PictureService } from '../data';
import { IDatabaseService, DatabaseService } from '../database';
import { IFileService, FileService } from '../system';

import SERVICETYPES from './service.types';

const container = new Container();

// <editor-fold desc='Services'>
container.bind<ICollectionService>(SERVICETYPES.CollectionService).to(CollectionService);
container.bind<IConfigurationService>(SERVICETYPES.ConfigurationService).to(ConfigurationService).inSingletonScope();
container.bind<IDataRouterService>(SERVICETYPES.DataRouterService).to(DataRouterService).inSingletonScope();
container.bind<IDatabaseService>(SERVICETYPES.DatabaseService).to(DatabaseService).inSingletonScope();
container.bind<IFileService>(SERVICETYPES.FileService).to(FileService);
container.bind<IPictureService>(SERVICETYPES.PictureService).to(PictureService);
// </editor-fold>

export default container;
