import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DtoLogFilter } from '@ipc';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit {

  @Output() filterChanged: EventEmitter<DtoLogFilter> = new EventEmitter();

  private formBuilder: FormBuilder;
  // <editor-fold desc='Private properties'>
  public filterGroup: FormGroup;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(formBuilder: FormBuilder) {
    this.formBuilder = formBuilder;
  }
  // </editor-fold>

  // <editor-fold desc='Angular interface methods'>
  public ngOnInit(): void {
    this.buildForm();
  }

  public ngAfterViewInit(): void {
    this.filterChanged.emit(this.filterGroup.value);
  }
  // </editor-fold>

  private buildForm(): void {
    this.filterGroup = this.formBuilder.group({
      mainSelected: new FormControl(true),
      rendererSelected: new FormControl(true),
      queueSelected: new FormControl(true),
      errorSelected: new FormControl(true),
      infoSelected: new FormControl(true),
      verboseSelected: new FormControl(true),
      debugSelected: new FormControl(true)
    });
    this.filterGroup.valueChanges.subscribe(x => {
      this.filterChanged.emit(x);
    });
  }

}
