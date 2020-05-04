import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  // <editor-fold desc='Constructor & C°'>
  public constructor(private router: Router) { }
  // </editor-fold>

  // <editor-fold desc='Angular interface methods'>
  public ngOnInit(): void {
    console.log(this.router.config);
  }
  // </editor-fold>
}
