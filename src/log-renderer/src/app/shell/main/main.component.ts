import { Component, OnInit } from '@angular/core';
import { DataRequestFactory, DataVerb, DtoLogFilter, DtoLogMaster, IpcService } from '@ipc';
import { LogService } from 'src/app/log.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  private dataRequestFactory: DataRequestFactory;
  private ipcService: IpcService;
  private logService: LogService;
  public displayedColumns: Array<string>
  public content: Array<DtoLogMaster>;


  // <editor-fold desc='Constructor & C°'>
  public constructor(ipcService: IpcService, dataRequestFactory: DataRequestFactory, logService: LogService) {
    this.ipcService = ipcService;
    this.dataRequestFactory = dataRequestFactory;
    this.logService = logService;
    this.displayedColumns = ['created', 'source', 'level', 'value'];
    this.content = new Array<DtoLogMaster>();
  }
  // </editor-fold>

  // <editor-fold desc='Angular interface methzods'>
  public ngOnInit(): void {
    this.logService.injectMain(this);
  }
  // </editor-fold>

  public filterChanged(filterValues: DtoLogFilter): void {
    const request = this.dataRequestFactory.createUntypedDataRequest(DataVerb.GET, `/log?${this.filterValuesToQueryString(filterValues)}`);
    this.ipcService.dataRequest<Array<DtoLogMaster>>(request)
      .then(response => this.content = response.data);
  }

  public addLog(log: DtoLogMaster): void {
    // TODO this does not refresh
    this.content = this.content.concat([log]);

  }

  private filterValuesToQueryString(filterValues: DtoLogFilter): string {
    const query = new Array<string>();

    if (filterValues.errorSelected) {
      query.push("error=true");
    } else {
      query.push("error=false");
    }

    if (filterValues.infoSelected) {
      query.push("info=true");
    } else {
      query.push("info=false");
    }

    if (filterValues.verboseSelected) {
      query.push("verbose=true");
    } else {
      query.push("verbose=false");
    }

    if (filterValues.mainSelected) {
      query.push("main=true");
    } else {
      query.push("main=false");
    }

    if (filterValues.rendererSelected) {
      query.push("renderer=true");
    } else {
      query.push("renderer=false");
    }

    if (filterValues.queueSelected) {
      query.push("queue=true");
    } else {
      query.push("queue=false");
    }

    if (filterValues.debugSelected) {
      query.push("debug=true");
    } else {
      query.push("debug=false");
    }

    return query.join('&');
  }
}
