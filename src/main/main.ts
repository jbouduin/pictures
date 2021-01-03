import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import * as path from 'path';
import { DtoDataRequest, LogLevel, LogSource } from '@ipc';

import container from './di/inversify.config';
import { IConfigurationService, ISystemService } from './data';
import { ILogService, IDataRouterService } from './data';
import { IDatabaseService } from './database';
import { IQueueService } from './system';

import SERVICETYPES from './di/service.types';

let rendererWindow: BrowserWindow;
let logWindow: BrowserWindow;
let logService: ILogService;

app.on('ready', createWindow);

app.on('activate', () => {
  if (rendererWindow === null) {
    createWindow();
  }
});


function createWindow() {

  container.get<IConfigurationService>(SERVICETYPES.ConfigurationService)
    .initialize(app.getAppPath())
    .then(configuration => {
      logService = container.get<ILogService>(SERVICETYPES.LogService);
      container.get<IDatabaseService>(SERVICETYPES.DatabaseService)
        .initialize(logService)
        .then( connections => {
          const promises = connections.map(conn => logService.log(LogSource.Main, LogLevel.Verbose, `Connected to ${conn.name}`));
          promises.push(logService.log(LogSource.Main, LogLevel.Verbose, configuration));
          Promise.all(promises).then( () => {
            const dataRouterService = container.get<IDataRouterService>(SERVICETYPES.DataRouterService);
            dataRouterService.initialize();
            rendererWindow = new BrowserWindow({
              width: 800,
              height: 600,
              webPreferences: {
                devTools: true,
                // Disabled Node integration
                nodeIntegration: false,
                // protect against prototype pollution
                contextIsolation: true,
                // turn off remote
                enableRemoteModule: false,
                // Preload script
                preload: path.join(app.getAppPath(), 'dist/preload', 'preload.js')
              }
            });
            // https://stackoverflow.com/a/58548866/600559
            //Menu.setApplicationMenu(null);
            container.get<ISystemService>(SERVICETYPES.SystemService).injectWindow(rendererWindow);
            rendererWindow.loadFile(path.join(app.getAppPath(), 'dist/renderer', 'index.html'));
            rendererWindow.on('closed', () => {
              if (logWindow) {
                logWindow.close();
                logWindow = null;
              }
              rendererWindow = null;
            });
            container.get<IQueueService>(SERVICETYPES.QueueService).initialize(
              path.join(app.getAppPath(), 'dist/queue', 'queue.js'),
              dataRouterService,
              rendererWindow
            );
          });
        });

    });
}

ipcMain.on('dev-tools', () => {
  logService = container.get<ILogService>(SERVICETYPES.LogService);
  logService.verbose(LogSource.Main, 'toggle dev-tool');

  if (rendererWindow) {
    rendererWindow.webContents.toggleDevTools();
  }

  if (logWindow) {
    logWindow.close();
  } else {
    logWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        devTools: true,
        // Disabled Node integration
        nodeIntegration: false,
        // protect against prototype pollution
        contextIsolation: true,
        // turn off remote
        enableRemoteModule: false,
        // Preload script
        preload: path.join(app.getAppPath(), 'dist/preload', 'preload.js')
      }
    });
    logWindow.loadFile(path.join(app.getAppPath(), 'dist/log-renderer', 'index.html'));
    logService.injectWindow(logWindow);
    logWindow.on('closed', () => {
      logService.injectWindow(undefined);
      logWindow = null;
    });
  }
});

ipcMain.on('data', async (event, arg) => {
  logService.debug(LogSource.Main, arg);
  const dtoRequest: DtoDataRequest<any> = JSON.parse(arg);

  const result = await container.get<IDataRouterService>(SERVICETYPES.DataRouterService)
    .routeRequest(dtoRequest);
  logService.debug(LogSource.Main, JSON.stringify(result, null, 2))
  event.reply(`data-${dtoRequest.id}`, JSON.stringify(result));
})

ipcMain.on('data-sync', (event, arg) => {
  logService.debug(LogSource.Main, arg)
  const dtoRequest: DtoDataRequest<any> = JSON.parse(arg);
  container.get<IDataRouterService>(SERVICETYPES.DataRouterService)
    .routeRequest(dtoRequest)
    .then(result => {
      logService.debug(LogSource.Main, JSON.stringify(result, null, 2))
      event.returnValue = JSON.stringify(result);
    });
})
