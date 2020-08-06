import { AES } from 'crypto-ts';

import * as fs from 'fs';
import { DtoRequestEncryptFile } from "@ipc";

export class FileEncryptor {

  public async encryptFile(params: DtoRequestEncryptFile): Promise<void> {
    const source = `${params.collectionPath}/${params.picturePath}/${params.fileName}`;
    const target: string = `${source}.enc`;
    try {
      if (fs.existsSync(source) && !fs.existsSync(target)) {
        const fileContents = await fs.promises.readFile(source);
        const encrypted = AES.encrypt(fileContents.toString('base64'), params.secret);
        await fs.promises.writeFile(target, encrypted.toString(), { encoding : 'utf8'});
        if (params.deleteFile && params.backupPath) {
          const collectionDirectory = params.collectionPath.split('/').pop();
          const targetDir = `${params.backupPath}/${collectionDirectory}/${params.picturePath}`;
          const target = `${targetDir}/${params.fileName}`;
          try {
            if (!fs.existsSync(targetDir)) {
              await fs.promises.mkdir(targetDir, { recursive: true });
            }
            await fs.promises.rename(source, target);
          } catch (error) {
            console.error(error)
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
}
