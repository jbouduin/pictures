import { DtoApplication } from './application/dto-application';
import { DtoEnvironment } from './environment/dto-environment';

export interface DtoConfiguration {

 application: DtoApplication;
 appPath: string;
 environment: string;
 current: DtoEnvironment;
 launchedAt: Date;
}
