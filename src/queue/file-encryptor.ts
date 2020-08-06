import { AES } from 'crypto-ts';

import * as fs from 'fs';
import { DtoRequestEncryptFile } from "@ipc";

export class FileEncryptor {

  public async encryptFile(params: DtoRequestEncryptFile): Promise<void> {
    const target: string = `${params.source}.enc`;
    try {
      if (fs.existsSync(params.source) && !fs.existsSync(target)) {
        const fileContents = await fs.promises.readFile(params.source);
        const encrypted = AES.encrypt(fileContents.toString('base64'), params.secret);
        await fs.promises.writeFile(target, encrypted.toString(), { encoding : 'utf8'});
      }
    } catch (error) {
      console.error(error);
    }
  }
}
