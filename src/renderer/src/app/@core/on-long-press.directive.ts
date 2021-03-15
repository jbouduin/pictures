import { Directive, Input, Output, EventEmitter, HostBinding, HostListener, OnInit } from '@angular/core';

@Directive({
  selector: '[appLongPress]'
})
export class OnLongPressDirective implements OnInit {

  // <editor-fold desc='Input/Output'>
  @Input() duration: number = 500;

  @Output() onLongPress: EventEmitter<any> = new EventEmitter();
  @Output() onLongPressing: EventEmitter<any> = new EventEmitter();
  @Output() onLongPressEnd: EventEmitter<any> = new EventEmitter();
  @Output() onClick: EventEmitter<any> = new EventEmitter();
  // </editor-fold>

  // <editor-fold desc='Private properties'>
  private pressing: boolean;
  private longPressing: boolean;
  private timeout: any;
  private mouseX: number = 0;
  private mouseY: number = 0;
  // </editor-fold>

  // <editor-fold desc='Public getters'>
  @HostBinding('class.press')
  get press() { return this.pressing; }

  @HostBinding('class.longpress')
  get longPress() { return this.longPressing; }
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor() { }
  ngOnInit(): void { }
  // </editor-fold>

  // <editor-fold desc='Hostlisteners'>
  @HostListener('mousedown', ['$event'])
  public onMouseDown(event: MouseEvent) {
    // don't do right/middle clicks
    if(event.which !== 1) return;

    this.mouseX = event.clientX;
    this.mouseY = event.clientY;

    this.pressing = true;
    this.longPressing = false;

    this.timeout = setTimeout(() => {
      this.longPressing = true;
      this.onLongPress.emit(event);
      this.loop(event);
    }, this.duration);

    this.loop(event);
  }

  @HostListener('mousemove', ['$event'])
  public onMouseMove(event: any) {
    if(this.pressing && !this.longPressing) {
      const xThres = (event.clientX - this.mouseX) > 10;
      const yThres = (event.clientY - this.mouseY) > 10;
      if(xThres || yThres) {
        this.endPress(event, false);
      }
    }
  }

  @HostListener('mouseup', ['$event'])
  public onMouseUp(event: MouseEvent) {
    this.endPress(event, true);
  }

  private loop(event: MouseEvent) {
    if(this.longPressing) {
      this.timeout = setTimeout(() => {
        this.onLongPressing.emit(event);
        this.loop(event);
      }, 50);
    }
  }
  // </editor-fold>

  // <editor-fold desc='Private methods'>
  private endPress(event: MouseEvent, emit: boolean) {
    clearTimeout(this.timeout);
    this.pressing = false;
    if (emit) {
      if (this.longPressing) {
        this.onLongPressEnd.emit(true);
      } else if (this.onClick) {
        this.onClick.emit(event);
      }
    }
    this.longPressing = false;
  }
  // </editor-fold>
}
