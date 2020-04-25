import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import * as path from 'path';
import { DtoConfiguration, DtoSystemInfo } from '../ipc';
import * as os from 'os';

import container from './di/inversify.config';
import { IConfigurationService } from './configuration';
import { IDatabaseService } from './database';

import SERVICETYPES from './di/service.types';

let win: BrowserWindow;


app.on('ready', createWindow);

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

function createWindow() {
  container.get<IConfigurationService>(SERVICETYPES.ConfigurationService)
    .initialize()
    .then( configuration => {
      container.get<IDatabaseService>(SERVICETYPES.DatabaseService)
        .initialize()
        .then( connection => {
          console.log(configuration);
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
          Menu.setApplicationMenu(null);

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
  console.log(JSON.stringify(configuration));
  if (win) {
    win.webContents.send('configuration', JSON.stringify(configuration));
  }
});
