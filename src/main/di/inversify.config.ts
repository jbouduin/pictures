import { Container } from 'inversify';

import { IConfigurationService, ConfigurationService } from '../configuration';
import { IDatabaseService, DatabaseService } from '../database';
import SERVICETYPES from './service.types';

const container = new Container();

// <editor-fold desc='Services'>
container.bind<IConfigurationService>(SERVICETYPES.ConfigurationService).to(ConfigurationService).inSingletonScope();
container.bind<IDatabaseService>(SERVICETYPES.DatabaseService).to(DatabaseService).inSingletonScope();
// </editor-fold>

export default container;
