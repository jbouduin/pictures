import { DtoTaskRequest, TaskType, DtoQueueStatus, DtoTaskResponse } from '@ipc';

import { ThumbCreator } from './thumb-creator';
import { MetadataReader } from './metadata-reader';
import { FileEncryptor } from 'file-encryptor';

process.on('message', (m) => {
  console.log('Got message:', m);
  main.push(m);
});

class QueueService {
  // <editor-fold desc='Private properties'>
  private queue: Array<DtoTaskRequest<any>>;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor() {
    this.queue = new Array<DtoTaskRequest<any>>();
    setTimeout(this.next.bind(this), 5000);
  }
  // </editor-fold>

  // <editor-fold desc='Public methods'>
  public push(message: any): void {
    try {
      const task: DtoTaskRequest<any> = JSON.parse(message);
      this.queue.push(task);
    } catch (error) {
      console.error('error pushing task', error);
    }
  }

  public async next(): Promise<any> {
    const status: DtoQueueStatus = { count: 0 };
    if (this.queue.length > 0) {
      const next = this.queue.shift();
      switch (next.taskType) {
        case TaskType.Ping: {
          process.send('Pong');
          break;
        }
        case TaskType.CreateThumb:
        case TaskType.CreateSecretThumb: {
          const thumbResponse = await new ThumbCreator().createThumbIm(next.taskType, next.applicationSecret, next.data);
          process.send(thumbResponse);
          break;
        }
        case TaskType.EncryptFile: {
          await new FileEncryptor().encryptFile(next.data);
        }
        case TaskType.ReadMetaData: {
          const metaResponse = await new MetadataReader().readMetaData(next.applicationSecret, next.data);
          process.send(metaResponse);
          break;
        }
        default: {
          console.error(`Unknown tasktype: ${next.taskType}`);
        }
      }
      status.count = this.queue.length;
      setTimeout(this.next.bind(this), 100);
    } else {
      setTimeout(this.next.bind(this), 5000);
    }
    const statusResponse: DtoTaskResponse<DtoQueueStatus> = {
      taskType: TaskType.StatusMessage,
      success: true,
      error: undefined,
      applicationSecret: undefined,
      data: status
    };
    process.send(statusResponse);
  }
  // </editor-fold>
}

const main = new QueueService();
