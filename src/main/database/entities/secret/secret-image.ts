import { TraceableEntity } from "../base-entity";
import { Column, Index, Entity } from "typeorm";

@Entity()
export class SecretImage extends TraceableEntity {
  @Column()
  @Index({ unique: true })
  pictureId: number;

  @Column('blob', { nullable: true })
  public data: string;

}
