import { DtoListBase, DtoGetBase, DtoNewBase, DtoSetBase } from '@ipc';

import { ListItem } from './list-item';
import { BaseItem } from './base-item';

export abstract class BaseItemFactory<
  L extends ListItem, N extends BaseItem, E extends BaseItem,
  DtoL extends DtoListBase, DtoG extends DtoGetBase, DtoN extends DtoNewBase, DtoS extends DtoSetBase> {

  public abstract createNewItem(): N;
  public abstract getDtoToEditItem(dto: DtoG): E;
  public abstract listDtoToListItem(dto: DtoL): L;
  public abstract newItemToNewDto(item: N): DtoN;
  public abstract editItemToSetDto(item: E): DtoS;

}
