import { Injectable } from "@angular/core";
import { BaseLogService, ConfigurationService, LogLevel, LogSource } from "@ipc";
import { DtoConfiguration, DtoLogMaster } from "@ipc";
import { MainComponent } from "./shell";

@Injectable({
  providedIn: 'root'
})
export class LogService extends BaseLogService {

  private mainComponent: MainComponent;

  public constructor() {
    super();
  }

  public injectMain(mainComponent: MainComponent): void {
    this.mainComponent = mainComponent;
    window.api.electronIpcRemoveAllListeners('log');
    window.api.electronIpcOn('log', (_event, arg) => {
      try {
        const message: DtoLogMaster = JSON.parse(arg);

        this.mainComponent.addLog(message);
      } catch (error) {
        const message: DtoLogMaster = {
          created: new Date(),
          source: LogSource[LogSource.Main],
          details: undefined,
          logLevel: LogLevel[LogLevel.Error],
          value: `Error processing message received: ${arg}`
        };
        this.mainComponent.addLog(message);
      }
    });
  }
  public info(object: any, ...args: any[]): void {
    this.log(LogLevel.Info, object, args);
  }

  public error(object: any, ...args: any[]): void {
    this.log(LogLevel.Info, object, args);
  }

  public verbose(object: any, ...args: any[]): void {
    this.log(LogLevel.Info, object, args);
  }

  public debug(object: any, ...args: any[]): void {
    this.log(LogLevel.Info, object, args);
  }

  public log(logLevel: LogLevel, object: any, ...args: any[]): void {
    const logMaster: DtoLogMaster = {
      created: new Date(),
      source: 'Logger',
      logLevel: LogLevel[logLevel],
      value: JSON.stringify(object),
      details: args.map(arg => JSON.stringify(arg))
    }
    this.mainComponent.addLog(logMaster);
  }
}