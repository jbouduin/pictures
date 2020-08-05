import { TaskType } from './task-type';

export interface DtoTaskRequest<T> {
  taskType: TaskType,
  secretKey: string,
  data: T
}
