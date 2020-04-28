import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { MatSidenav } from '@angular/material/sidenav';
import { filter } from 'rxjs/operators';

import { untilDestroyed } from '@core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav', { static: false }) sidenav!: MatSidenav;

  // <editor-fold desc='Constructor & C°'>
  public constructor(private media: MediaObserver) { }
  // </editor-fold>

  // <editor-fold desc='Angular interface methzods'>
  public ngOnInit(): void {
    // Automatically close side menu on screens > sm breakpoint
    this.media
      .asObservable()
      .pipe(
        filter((changes: Array<MediaChange>) =>
          changes.some( change => change.mqAlias !== 'xs' && change.mqAlias !== 'sm')
        ),
        untilDestroyed(this)
      )
      .subscribe(() => this.sidenav.close());
  }

  public ngOnDestroy(): void {
    // Needed for automatic unsubscribe with untilDestroyed
  }
  // </editor-fold>
}
