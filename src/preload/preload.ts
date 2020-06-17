import { ipcRenderer, contextBridge } from 'electron';

contextBridge.exposeInMainWorld(
  'api', {
    electronIpcSend: (channel: string, ...arg: any) => {
      ipcRenderer.send(channel, arg);
    },
    electronIpcSendSync: (channel: string, ...arg: any) => {
      return ipcRenderer.sendSync(channel, arg);
    },
    electronIpcOn: (channel: string, listener: (event: any, ...arg: any) => void) => {
      ipcRenderer.on(channel, listener);
    },
    electronIpcOnce: (channel: string, listener: (event: any, ...arg: any) => void) => {
      ipcRenderer.once(channel, listener);
    },
    electronIpcRemoveListener:  (channel: string, listener: (event: any, ...arg: any) => void) => {
      ipcRenderer.removeListener(channel, listener);
    },
    electronIpcRemoveAllListeners: (channel: string) => {
      ipcRenderer.removeAllListeners(channel);
    }
  }
);
