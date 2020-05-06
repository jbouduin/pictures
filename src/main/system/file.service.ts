import { inject, injectable } from 'inversify';
import * as fs from "fs";
import glob from 'glob-promise';
import 'reflect-metadata';


export interface IFileService {
  createDirSync(path: string): void;
  ensureExistsSync(path: string): void;
  fileOrDirectoryExistsSync(path: string): boolean;
  scanDirectory(path: string, fileTypes: Array<string>): Promise<Array<string>>;
}

@injectable()
export class FileService implements IFileService {

  // <editor-fold desc='Constructor & C°'>
  public constructor() { }
  // </editor-fold>

  // <editor-fold desc='IFileService interface methods'>
  public createDirSync(path: string): void {
    fs.mkdirSync(path, { recursive: true });
  }

  public ensureExistsSync(path: string): void {
    if (!this.fileOrDirectoryExistsSync(path)) {
      this.createDirSync(path);
    }
  }

  public fileOrDirectoryExistsSync(path: string): boolean {
    return fs.existsSync(path);
  }


  public scanDirectory(path: string, fileTypes: Array<string>): Promise<Array<string>> {
    const forwardSlashed = path.replace(/\\/g, '/');
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
