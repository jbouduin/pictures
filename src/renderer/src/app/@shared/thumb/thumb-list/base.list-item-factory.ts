import { DtoListBase, DtoNewBase } from '@ipc';

import { ListItem } from './list-item';
import { BaseItem } from '../base-item';

export abstract class BaseListItemFactory<
  L extends ListItem, N extends BaseItem,
  DtoList extends DtoListBase, DtoNew extends DtoNewBase> {

  public abstract createNewItem(): N;
  public abstract listDtoToListItem(dto: DtoList): L;
  public abstract newItemToNewDto(item: N): DtoNew;

}
