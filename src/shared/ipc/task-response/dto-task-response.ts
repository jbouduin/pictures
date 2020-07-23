import { TaskType } from '../task-request/task-type';

export interface DtoTaskResponse<T> {
  taskType: TaskType,
  success: boolean,
  error: Array<any>;
  data: T
}
