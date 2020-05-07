import { DtoTaskRequest, TaskType } from '@ipc';

import { ThumbCreator } from './thumb-creator';

process.on('message', (m) => {
  console.log('Got message:', m);
  main.push(m);
});


class QueueService {
  // <editor-fold desc='Private properties'>
  private queue: Array<DtoTaskRequest<any>>;
  private timerId: any;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor() {
    this.queue = new Array<DtoTaskRequest<any>>();
    this.timerId = setTimeout(this.next.bind(this), 5000);
  }
  // </editor-fold>

  // <editor-fold desc='Public methods'>
  public push(message: any): void {
    try {
      const task: DtoTaskRequest<any> = JSON.parse(message);
      this.queue.push(task);
    } catch (error) {
      console.error(error);
    }
  }

  public next(): void {
    if (this.queue.length > 0) {
      const next = this.queue.shift();
      switch (next.taskType) {
        case TaskType.Ping: {
          process.send('Pong');
          break;
        }
        case TaskType.CreateThumb: {
          ThumbCreator.createThumb(next.data);
          break;
        }
        default: {
          console.error(`Unknown tasktype: ${next.taskType}`);
        }
      }
      this.timerId = setTimeout(this.next.bind(this), 100);
    } else {
      console.log('queue is empty');
      this.timerId = setTimeout(this.next.bind(this), 5000);
    }
  }
  // </editor-fold>
}

const main = new QueueService();
