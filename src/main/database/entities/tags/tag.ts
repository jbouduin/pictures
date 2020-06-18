import { Entity, Tree, TreeChildren, TreeParent, Column } from 'typeorm';

import { BaseEntity } from '../base-entity';

@Entity()
@Tree("closure-table")
export class Tag extends BaseEntity {

  @Column()
  canAssign: boolean;

  @TreeChildren()
  children: Array<Tag>;

  @TreeParent()
  parent: Tag;
}
