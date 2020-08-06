import { DtoRequestFile } from "./dto-request-file";

export interface DtoRequestCreateThumb extends DtoRequestFile {
  secret: boolean;
}
