import { TaskType } from './task-type';

export interface DtoTaskRequest<T> {
  taskType: TaskType,
  data: T
}
