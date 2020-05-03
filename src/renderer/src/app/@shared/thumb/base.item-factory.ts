import { ListItem } from './list-item';
import { BaseItem } from './base-item';

export abstract class BaseItemFactory<
  L extends ListItem, N extends BaseItem, E extends BaseItem,
  DtoL, DtoN, DtoE> {

  public abstract createNewItem(): N;
  public abstract getDtoToItem(dto: DtoE): E;
  public abstract listDtoToItem(dto: DtoL): L;
  public abstract newItemToDto(item: N): DtoN;
  public abstract existingItemToDto(item: E): DtoE;
}
