import { TraceableEntity } from "../base-entity";
import { Column, Entity, Index, ManyToOne } from "typeorm";
import { LogMaster } from "./log-master";

@Entity()
export class LogDetail extends TraceableEntity {

  @Column()
  public value: string;

  @Index()
  @ManyToOne(
    _type => LogMaster,
    master => master.logDetails,
    { nullable: false, onDelete: 'CASCADE'}
  )
  public logMaster: LogMaster;
}
