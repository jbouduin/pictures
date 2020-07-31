import { TraceableEntity } from "../base-entity";
import { Column, Index, Entity } from "typeorm";

@Entity()
export class SecretThumb extends TraceableEntity {
  @Column()
  @Index({ unique: true })
  pictureId: number;

  @Column('blob', { nullable: true })
  public data: string;

}
