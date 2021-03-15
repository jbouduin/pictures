export abstract class BaseLogService {
  public abstract info(object: any, ...args: Array<any>): void;
  public abstract error(object: any, ...args: Array<any>): void;
  public abstract verbose(object: any, ...args: Array<any>): void;
  public abstract debug(object: any, ...args: Array<any>): void;
}
