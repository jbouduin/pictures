import * as fs from 'fs';
import * as glob from 'glob';
import * as _ from 'lodash';
import * as path from 'path';

import { ConnectionType, DtoConnection } from '../../../ipc';

import { CfgApplication } from './application/cfg-application';
import { CfgEnvironment } from './environment/cfg-environment';
import { CfgDatabase } from './database/cfg-database';

export class Configuration {

  // <editor-fold desc='Static methods'>
  public static async loadConfiguration(): Promise<Configuration> {
    const result = new Configuration();
    const configDirectory = path.join(result.appPath, 'configuration');
    if (!fs.existsSync(configDirectory)) {
      throw new Error('Configuration directory is missing. Can not start the server');
    }
    return result.loadConfigFiles();
  }
  // </editor-fold>


  // <editor-fold desc='DtoConfiguration members'>
  // </editor-fold>
  public application: CfgApplication;
  public appPath: string;
  public environment: string;
  public current: CfgEnvironment;
  public launchedAt: Date;

  // <editor-fold desc='Constructor & C°'>
  private constructor() {
    this.appPath = process.cwd();
    if (process.env.NODE_ENV) {
      this.environment = process.env.NODE_ENV.trim().toLowerCase();
      console.info(`Using ${process.env.NODE_ENV} environment`);
    } else {
      console.info('NODE_ENV not set. Presuming development environment.');
      this.environment = 'development';
    }

    this.launchedAt = new Date();
  }
  // </editor-fold>

  // <editor-fold desc='private methods to load the configuration'>
  private async loadConfigFiles(): Promise<Configuration> {
    const pattern = 'configuration/**/*.+(js|json)';
    const root = {};

    const files = glob.sync(pattern);
    const promises = new Array<Promise<any>>();
    files
      .forEach(async file =>  {
        const absolutePath = path.resolve(process.cwd(), file);
        delete require.cache[absolutePath];

        const propPath = this.filePathToPath(file, true);
        const data = fs.readFileSync(absolutePath, 'utf8');
        const obj = JSON.parse(data);
        const mod = this.templateConfiguration(obj, '');
        if (propPath.length === 0) {
          _.merge(root, mod);
        } else {
           _.merge(root, _.setWith({}, propPath, mod, Object));
        }
      });

    const current = _.get(root, `configuration.environments.${this.environment}`);
    const result = new CfgEnvironment();
    this.current = _.merge(result, current);

    const app = new CfgApplication();
    this.application = _.merge(app, _.get(root, 'configuration.application'));
    return Promise.resolve(this);
  }

  private filePathToPath(filePath: string, useFileNameAsKey: boolean = true): string {
    const cleanPath = filePath.startsWith('./') ?
      filePath.slice(2) :
      filePath;

    const prop = cleanPath
      .replace(/(\.settings|\.json|\.js)/g, '')
      .toLowerCase()
      .split('/')
      .map(p => _.trimStart(p, '.'))
      .join('.')
      .split('.');

    const result = useFileNameAsKey === true ?
      prop :
      prop.slice(0, -1);

    return prop.join('.');
  }

  private templateConfiguration(obj: object, configPath) {
    const regex = /\$\{[^()]*\}/g;
    const excludeConfigPaths = ['info.scripts'];

    // Allow values which looks like such as an ES6 literal string without parenthesis inside (aka function call).
    // Exclude config with conflicting syntax (e.g. npm scripts).
    return Object.keys(obj).reduce((acc, key) => {

      if ((_.isPlainObject(obj[key]) || _.isArray(obj[key])) && !_.isString(obj[key])) {
        const template = this.templateConfiguration(obj[key], `${configPath}.${key}`);
        if (_.isArray(obj[key])) {
          acc[key] = new Array<any>();
          Object.keys(template).forEach(f => acc[key].push(template[f]));
        } else {
          acc[key] = template;
        }
      } else if (_.isString(obj[key]) &&
        !excludeConfigPaths.includes(configPath.substr(1)) &&
        obj[key].match(regex) !== null) {
        // tslint:disable-next-line no-eval
        acc[key] = eval('`' + obj[key] + '`');
      } else {
        acc[key] = obj[key];
      }
      return acc;
    }, {});
  }
  // </editor-fold>

}
