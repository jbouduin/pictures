import { Component, Inject, OnInit } from "@angular/core";
import { trigger, transition, useAnimation } from '@angular/animations';
import { fadeIn, fadeOut } from './carousel.animations';
import { CarouselParams } from './carousel.params';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IpcService, DataRequestFactory } from '@core';
import { DataVerb, DtoListData, DtoListPicture, DtoImage } from '@ipc';
import { Slide } from './slide';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: "carousel",
  templateUrl: "./carousel.component.html",
  styleUrls: ["./carousel.component.scss"],
  animations: [
    trigger('carouselAnimation', [
      transition("void => *", [useAnimation(fadeIn, {params: { time: '1300ms' }} )]),
      transition("* => void", [useAnimation(fadeOut, {params: { time: '1300ms' }} )]),
    ])
  ]
})
export class CarouselComponent implements OnInit {

  // <editor-fold desc='Private properties'>
  private params: CarouselParams;
  private sanitization: DomSanitizer;
  private ipcService: IpcService;
  private dataRequestFactory: DataRequestFactory;
  private _currentSlide: number;
  // </editor-fold>

  // <editor-fold desc='Public properties'>
  public slides: Array<Slide>;
  // </editor-fold>

  // <editor-fold desc='Public getters/setters'>
  public get currentSlide(): number {
    return this._currentSlide;
  }

  public set currentSlide(value: number) {
    this.setPictureSource(value);
    this._currentSlide = value;
    this.setPictureSource(this.next());
    this.setPictureSource(this.previous());
  }
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  public constructor(
    sanitization: DomSanitizer,
    ipcService: IpcService,
    dataRequestFactory: DataRequestFactory,
    @Inject(MAT_DIALOG_DATA) params: CarouselParams) {
    this.sanitization = sanitization;
    this.ipcService = ipcService;
    this.dataRequestFactory = dataRequestFactory;
    this.params = params;
    this._currentSlide = undefined;
  }
  // </editor-fold>

  // <editor-fold desc='Angular interface methods'>
  public ngOnInit(): void {
    const request = this.dataRequestFactory.createUntypedDataRequest(
      DataVerb.GET,
      this.params.currentRoot);
    this.ipcService
      .dataRequest<DtoListData<DtoListPicture>>(request)
      .then(result => {
        this.slides = result.data.listData.map(picture => new Slide(picture.id));
        this.currentSlide = this.slides.findIndex(picture => picture.pictureId === this.params.currentId);
      });
  }
  // </editor-fold>

  // <editor-fold desc='UI Triggered methods'>
  public onPreviousClick() {
    this.currentSlide = this.previous();
  }

  public onNextClick() {
    this.currentSlide = this.next();
  }
  // </editor-fold>

  // <editor-fold desc='Private methods'>
  private setPictureSource(index: number): void {
    const toSet = this.slides[index];
    if (!toSet || toSet.src) {
      return;
    }
    const request = this.dataRequestFactory.createUntypedDataRequest(DataVerb.GET, `/picture/${toSet.pictureId}/raw`);
    this.ipcService.dataRequest<DtoImage>(request).then(response => {
      toSet.src = this.sanitization.bypassSecurityTrustStyle(
          `url(data:image/jpeg;base64,${response.data.image})`);
    });
  }

  private previous(): number {
    const previous = this.currentSlide - 1;
    return previous < 0 ? this.slides.length - 1 : previous;
  }

  private next(): number {
    const next = this.currentSlide + 1;
    return next === this.slides.length ? 0 : next;
  }
  // </editor-fold>
}
