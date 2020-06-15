import { inject, injectable } from 'inversify';
import * as fs from "fs";
import glob from 'glob-promise';
import 'reflect-metadata';
import { promisify } from 'util'

import { LogSource } from '@ipc';

import { ILogService } from './log.service';

import SERVICETYPES from '../di/service.types';

export interface IFileService {
  createDirSync(directory: string): void;
  emptyDir(directory: string): Promise<boolean>;
  emptyAndDeleteDir(directory: string): Promise<boolean>;
  ensureExistsSync(directory: string): void;
  fileOrDirectoryExistsSync(path: string): boolean;
  scanDirectory(directory: string, fileTypes: Array<string>): Promise<Array<string>>;
}

@injectable()
export class FileService implements IFileService {

  // <editor-fold desc='Private properties: promisified functions'>
  private dir = promisify(fs.readdir);
  private rmdir = promisify(fs.rmdir);
  private rm = promisify(fs.unlink);
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(
    @inject(SERVICETYPES.LogService) private logService: ILogService) { }
  // </editor-fold>

  // <editor-fold desc='IFileService interface methods'>
  public createDirSync(directory: string): void {
    fs.mkdirSync(directory, { recursive: true });
  }

  public async emptyDir(directory: string): Promise<boolean> {
    try {
      const files = await this.dir(directory);
      const unlinkPromises = files.map(filename => this.rm(`${directory}/${filename}`));
      try {
        await Promise.all(unlinkPromises);
        return true;
      }
      catch (error) {
        this.logService.error(LogSource.Main, error);
        return false;
      }
    }
    catch (error_1) {
      this.logService.error(LogSource.Main, error_1);
      return false;
    }
  }

  public async emptyAndDeleteDir(directory: string): Promise<boolean> {
    try {
      const isEmtpy = await this.emptyDir(directory);
      return isEmtpy ?
        this.rmdir(directory)
          .then(() => { return true; }, error => {
            this.logService.error(LogSource.Main, error);
            return false;
          }) :
        false;
    }
    catch (error_1) {
      this.logService.error(LogSource.Main, error_1);
      return false;
    }
  }

  public ensureExistsSync(path: string): void {
    if (!this.fileOrDirectoryExistsSync(path)) {
      this.createDirSync(path);
    }
  }

  public fileOrDirectoryExistsSync(path: string): boolean {
    return fs.existsSync(path);
  }

  public scanDirectory(directory: string, fileTypes: Array<string>): Promise<Array<string>> {
    const forwardSlashed = directory.replace(/\\/g, '/');
    const options = {
      nodir: true,
      nomount: true,
      nocase: true,
      cwd: forwardSlashed
    }
    const pattern = `**/*.+(${fileTypes.join('|')})`;
    return glob(pattern, options);
  }
  // </editor-fold>
}
