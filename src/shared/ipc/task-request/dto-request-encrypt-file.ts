import { DtoRequestFile } from "./dto-request-file";

export interface DtoRequestEncryptFile extends DtoRequestFile {
  secret: string;
}
