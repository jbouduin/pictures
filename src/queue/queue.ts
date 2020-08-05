import { DtoTaskRequest, TaskType } from '@ipc';

import { ThumbCreator } from './thumb-creator';
import { MetadataReader } from './metadata-reader';

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
        case TaskType.ReadMetaData: {
          const metaResponse = await new MetadataReader().readMetaData(next.applicationSecret, next.data);
          process.send(metaResponse);
          break;
        }
        default: {
          console.error(`Unknown tasktype: ${next.taskType}`);
        }
      }
      setTimeout(this.next.bind(this), 100);
    } else {
      console.debug('queue is empty');
      setTimeout(this.next.bind(this), 5000);
    }
  }
  // </editor-fold>
}

const main = new QueueService();
