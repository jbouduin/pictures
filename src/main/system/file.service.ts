import { inject, injectable } from 'inversify';
import * as fs from "fs";
import glob from 'glob-promise';
import 'reflect-metadata';
import { promisify } from 'util'

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
  public constructor() { }
  // </editor-fold>

  // <editor-fold desc='IFileService interface methods'>
  public createDirSync(directory: string): void {
    fs.mkdirSync(directory, { recursive: true });
  }

  public emptyDir(directory: string): Promise<boolean> {
    return this.dir(directory).then(
      files => {
        const unlinkPromises = files.map(filename => this.rm(`${directory}/${filename}`));
        return Promise.all(unlinkPromises)
          .then(
            () => { return true; },
            error => {
              console.error(error);
              return false;
            }
          );
      },
      error => {
        console.error(error);
        return false;
      }
    );
  }

  public emptyAndDeleteDir(directory: string): Promise<boolean> {
    return this.emptyDir(directory).then(
      isEmtpy => {
        return isEmtpy ?
          this.rmdir(directory)
            .then(
              () => { return true; },
              error => {
                console.error(error);
                return false;
              }
            ) :
            false;
      },
      error => {
        console.error(error);
        return false;
      }
    );
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
