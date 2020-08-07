import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import * as path from 'path';
import { DtoDataRequest, LogSource } from '@ipc';

import container from './di/inversify.config';
import { IConfigurationService, ISystemService } from './data';
import { ILogService, IDataRouterService } from './data';
import { IDatabaseService } from './database';
import { IQueueService } from './system';

import SERVICETYPES from './di/service.types';

let win: BrowserWindow;
let logService: ILogService;

app.on('ready', createWindow);

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});


function createWindow() {

  container.get<IConfigurationService>(SERVICETYPES.ConfigurationService)
    .initialize(app.getAppPath())
    .then( configuration => {
      logService = container.get<ILogService>(SERVICETYPES.LogService);
      logService.verbose(LogSource.Main, configuration);
      const dataRouterService = container.get<IDataRouterService>(SERVICETYPES.DataRouterService)
      dataRouterService.initialize();
      container.get<IDatabaseService>(SERVICETYPES.DatabaseService)
        .initialize(logService)
        .then( _connections => {
          win = new BrowserWindow({
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
          Menu.setApplicationMenu(null);
          container.get<ISystemService>(SERVICETYPES.SystemService).injectWindow(win);
          logService.injectWindow(win);
          win.loadFile(path.join(app.getAppPath(), 'dist/renderer', 'index.html'));
          win.on('closed', () => {
            win = null;
          });
          container.get<IQueueService>(SERVICETYPES.QueueService).initialize(
            path.join(app.getAppPath(), 'dist/queue', 'queue.js'),
            dataRouterService,
            win
          );
      });
  });
}

ipcMain.on('dev-tools', () => {
  if (win) {
    win.webContents.toggleDevTools();
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
