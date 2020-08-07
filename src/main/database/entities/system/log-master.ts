import { TraceableEntity } from "../base-entity";
import { Column, Entity, OneToMany } from "typeorm";
import { LogDetail } from "./log-detail";

@Entity()
export class LogMaster extends TraceableEntity {

  @Column()
  public source: string;

  @Column()
  public logLevel: string;

  @Column()
  public value: string;

  @OneToMany(
    _type => LogDetail,
    detail => detail.logMaster,
    { onDelete: 'CASCADE'}
  )
  public logDetails: Promise<Array<LogDetail>>;
}
