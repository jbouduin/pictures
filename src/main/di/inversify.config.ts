import { Container } from 'inversify';

import { IConfigurationService, ConfigurationService } from '../configuration';
import SERVICETYPES from './service.types';

const container = new Container();

// <editor-fold desc='Services'>
container.bind<IConfigurationService>(SERVICETYPES.ConfigurationService).to(ConfigurationService).inSingletonScope();
// </editor-fold>

export default container;
