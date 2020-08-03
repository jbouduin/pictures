import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import * as Collections from 'typescript-collections';
import { ISelectable } from './selectable';
import { IIdentifiable } from './identifiable';

export type SelectionModus = 'none' | 'single' | 'multi';

@Injectable({
  providedIn: 'root'
})
export class SelectionService {

  // <editor-fold desc='Public properties'>
  private currentSelectionMode: BehaviorSubject<SelectionModus>;
  private selection: Collections.Dictionary<number, IIdentifiable & ISelectable>;
  // </editor-fold>

  // <editor-fold desc='Public get/set'>
  public set currentModus(value: SelectionModus) {
    if (value === 'none') { this.clearSelection(); }
    this.currentSelectionMode.next(value)
  }

  public get currentModus(): SelectionModus {
    return this.currentSelectionMode.value;
  }

  public get selectedItems(): Array<IIdentifiable & ISelectable> {
    return this.selection.values();
  }
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor() {
    this.selection = new Collections.Dictionary<number, IIdentifiable & ISelectable>();
    this.currentSelectionMode = new BehaviorSubject<SelectionModus>('none');
  }
  // </editor-fold>

  // <editor-fold desc='Public methods'>
  public subscribe(next: (value: SelectionModus) => void): Subscription {
    return this.currentSelectionMode.subscribe(next);
  }

  public addToSelection(item: IIdentifiable & ISelectable): void {
    item.selected = true;
    this.selection.setValue(item.id, item);
  }

  public removeFromSelection(item: IIdentifiable & ISelectable): void {
    item.selected = false;
    this.selection.remove(item.id);
  }

  public isSelected(item: IIdentifiable & ISelectable): boolean {
    return this.selection.containsKey(item.id);
  }

  public clearSelection(): void {
    this.selection.values().forEach(value => value.selected = false);
    this.selection.clear();
  }
  // </editor-fold>
}
