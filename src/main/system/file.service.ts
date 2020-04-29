import { inject, injectable } from 'inversify';
import * as fs from "fs";
import * as glob from 'glob-promise';
import 'reflect-metadata';


export interface IFileService {
  directoryExists(path: string): boolean;
  scanDirectory(path: string, fileTypes: Array<string>): Promise<Array<string>>;
}

@injectable()
export class FileService implements IFileService {

  // <editor-fold desc='Constructor & C°'>
  public constructor() { }
  // </editor-fold>

  // <editor-fold desc='IFileService interface methods'>
  public directoryExists(path: string): boolean {
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
    //const pattern = `${forwardSlashed}/**/*.+(${fileTypes.join('|')})`;
    const pattern = `**/*.+(${fileTypes.join('|')})`;
    return glob(pattern, options);
    // .then(files => files.forEach(file => console.log(file)));
    // return Promise.resolve(new Array<string>());
  }
  // </editor-fold>
}
