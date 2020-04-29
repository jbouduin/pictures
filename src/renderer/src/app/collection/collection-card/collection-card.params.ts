import { DtoListCollection } from '@ipc';

export type DeleteCallBack = (id: number) => void;

export class CollectionCardParams {

  // <editor-fold desc='Constructor & C°'>
  public constructor(
    public readonly collection: DtoListCollection,
    public readonly deleteCallBack: DeleteCallBack
  ) { }
  // </editor-fold>
}
