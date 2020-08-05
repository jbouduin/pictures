import { BaseEntity } from "../base-entity";
import { Column, Entity } from "typeorm";

@Entity()
export class Setting extends BaseEntity {

  @Column()
  public value: string;

}
