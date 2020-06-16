import { DtoGetBase, DtoSetBase } from '@ipc';
import { BaseItem } from '../base-item';

export abstract class BaseCardItemFactory<E extends BaseItem, DtoGet extends DtoGetBase, DtoSet extends DtoSetBase> {
  public abstract getDtoToEditItem(dto: DtoGet): E;
  public abstract editItemToSetDto(item: E): DtoSet;
}
