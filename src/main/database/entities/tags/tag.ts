import { Entity, Tree, TreeChildren, TreeParent, Column } from 'typeorm';

import { BaseEntity } from '../base-entity';

@Entity()
@Tree("closure-table")
export class Tag extends BaseEntity {

  @Column('boolean', { default: true, nullable: false })
  canAssign: boolean;

  @Column('boolean', { default: false, nullable: false })
  public secret: string;

  @TreeChildren()
  children: Array<Tag>;

  @TreeParent()
  parent: Tag;
}
