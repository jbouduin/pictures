import { Collection } from "database";

export interface UpsertPictureParams {
  collection: Collection;
  relativePath: string;
  applicationSecret: string;
  deleteFile: boolean;
  backupPath: string;
}
