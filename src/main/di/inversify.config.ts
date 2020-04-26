import { Container } from 'inversify';

import { ICollectionService, CollectionService } from '../data';
import { IConfigurationService, ConfigurationService } from '../configuration';
import { IDataRouterService, DataRouterService } from '../data';
import { IDatabaseService, DatabaseService } from '../database';
import SERVICETYPES from './service.types';

const container = new Container();

// <editor-fold desc='Services'>
container.bind<ICollectionService>(SERVICETYPES.CollectionService).to(CollectionService);
container.bind<IConfigurationService>(SERVICETYPES.ConfigurationService).to(ConfigurationService).inSingletonScope();
container.bind<IDataRouterService>(SERVICETYPES.DataRouterService).to(DataRouterService).inSingletonScope();
container.bind<IDatabaseService>(SERVICETYPES.DatabaseService).to(DatabaseService).inSingletonScope();
// </editor-fold>

export default container;
