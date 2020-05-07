import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import * as path from 'path';
import { DtoConfiguration, DtoSystemInfo } from '@ipc';
import { DtoDataRequest } from '@ipc';
import * as os from 'os';
import { fork, spawn } from 'child_process';

import container from './di/inversify.config';
import { IConfigurationService } from './data';
import { IDataRouterService } from './data';
import { IDatabaseService } from './database';
import { IQueueService } from './system';

import SERVICETYPES from './di/service.types';

let win: BrowserWindow;


app.on('ready', createWindow);

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});


function createWindow() {
  container.get<IQueueService>(SERVICETYPES.QueueService).initialize(
    path.join(app.getAppPath(), 'dist/queue', 'queue.js')
  );
  container.get<IConfigurationService>(SERVICETYPES.ConfigurationService)
    .initialize()
    .then( configuration => {
      container.get<IDataRouterService>(SERVICETYPES.DataRouterService).initialize();
      container.get<IDatabaseService>(SERVICETYPES.DatabaseService)
        .initialize()
        .then( connection => {
          // console.log(configuration);
          win = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
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
        //   Menu.setApplicationMenu(null);

          win.loadFile(path.join(app.getAppPath(), 'dist/renderer', 'index.html'));

          win.on('closed', () => {
            win = null;
          });
      });
  });
}

ipcMain.on('dev-tools', () => {
  if (win) {
    win.webContents.toggleDevTools();
  }
});

ipcMain.on('request-systeminfo', () => {
  const systemInfo:  DtoSystemInfo = {
    arch: os.arch(),
    hostname: os.hostname(),
    platform: os.platform(),
    release: os.release()
  };
  const serializedString = JSON.stringify(systemInfo);
  if (win) {
    win.webContents.send('systeminfo', serializedString);
  }
});

ipcMain.on('request-configuration', () => {
  const configuration: DtoConfiguration = container.get<IConfigurationService>(SERVICETYPES.ConfigurationService).configuration;
  // console.log(JSON.stringify(configuration, null, 2));
  if (win) {
    win.webContents.send('configuration', JSON.stringify(configuration));
  }
});

ipcMain.on('data', async (event, arg) => {
  const dtoRequest: DtoDataRequest<any> = JSON.parse(arg);
  // console.log(`Request received ${dtoRequest}`);
  const result = await container.get<IDataRouterService>(SERVICETYPES.DataRouterService)
    .routeRequest(dtoRequest);
  // console.log(JSON.stringify(result, null, 2));
  event.reply('data', JSON.stringify(result));
})

ipcMain.on('data-sync', (event, arg) => {
  const dtoRequest: DtoDataRequest<any> = JSON.parse(arg);
  // console.log(`Request received ${dtoRequest}`);
  const result = container.get<IDataRouterService>(SERVICETYPES.DataRouterService)
    .routeRequest(dtoRequest)
    .then(result => {
      // console.log(JSON.stringify(result, null, 2));
      event.returnValue = JSON.stringify(result);
    });
})
