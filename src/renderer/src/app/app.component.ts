import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
import { ConfigurationService } from '@core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  // <editor-fold desc='Constructor & C°'>
  public constructor(configurationService: ConfigurationService) {
    configurationService.configuration;
  }
  // </editor-fold>

  // <editor-fold desc='Angular interface methods'>
  public ngOnInit(): void { }
  // </editor-fold>
}
