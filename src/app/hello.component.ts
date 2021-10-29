import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';
import { fromEvent,  } from 'rxjs';
import { Observable, Observer } from "rxjs";
import { map, tap, switchMap, takeUntil, finalize } from 'rxjs/operators';
@Component({
  selector: 'hello',
  template: `
  <button (click)="downloadImage()">Download Image</button>
  
  <canvas 
    #canvas #myCanvas height="400px" width="200%"></canvas>`,
})
export class HelloComponent {
  base64Image: any;

  @ViewChild('myCanvas') myCanvas: ElementRef;
  image = new Image();

  @Input() name: string;
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D;

  ngAfterViewInit() {

    this.image.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_ALoxaFEIUOErg_t2C_-Nnqni4-hhGLeo4A&usqp=CAU';
    let ctx: CanvasRenderingContext2D =
      this.myCanvas.nativeElement.getContext('2d',this.image.src);

    // showing

    ctx.fillRect(20, 20, 150, 100);

    // Not showing
    this.image.onload = () => {
      console.log('image has loaded!');
      ctx.drawImage(this.image, 0, 0);

      ctx.beginPath();
      ctx.moveTo(10, 10);
      ctx.lineTo(50, 50);
      ctx.lineTo(100, 55);
      ctx.lineTo(90, 120);
      ctx.lineTo(120, 200);
      ctx.stroke();
    };


    this.ctx = this.canvas.nativeElement.getContext('2d');
    const mouseDownStream = fromEvent(this.canvas.nativeElement, 'mousedown');
    const mouseMoveStream = fromEvent(this.canvas.nativeElement, 'mousemove');
    const mouseUpStream = fromEvent(window, 'mouseup');
    mouseDownStream
      .pipe(
        tap((event: MouseEvent) => {
          this.ctx.beginPath();
          this.ctx.strokeStyle = 'red';
          this.ctx.lineWidth = 5;
          this.ctx.lineJoin = 'round';
          this.ctx.moveTo(event.offsetX, event.offsetY);
        }),
        switchMap(() =>
          mouseMoveStream.pipe(
            tap((event: MouseEvent) => {
              this.ctx.lineTo(event.offsetX, event.offsetY);
              this.ctx.stroke();
            }),
            takeUntil(mouseUpStream),
            finalize(() => {
              this.ctx.closePath();
            })
          )
        )
      )
      .subscribe(console.log);
  }

  ngOnInit() {
    this.image.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_ALoxaFEIUOErg_t2C_-Nnqni4-hhGLeo4A&usqp=CAU';
    let ctx: CanvasRenderingContext2D =
      this.myCanvas.nativeElement.getContext('2d');

    // showing

    ctx.fillRect(20, 20, 150, 100);

    // Not showing
    this.image.onload = () => {
      console.log('image has loaded!');
      ctx.drawImage(this.image, 0, 0);

      ctx.beginPath();
      ctx.moveTo(10, 10);
      ctx.lineTo(50, 50);
      ctx.lineTo(100, 55);
      ctx.lineTo(90, 120);
      ctx.lineTo(120, 200);
      ctx.stroke();
    };
  }








  downloadImage() {
    let ctxx: CanvasRenderingContext2D =
    this.myCanvas.nativeElement.getContext('2d');
    console.log(ctxx)
    this.ngAfterViewInit()
    this.getBase64ImageFromURL( this.image.src).subscribe(base64data => {
      console.log(base64data);
      this.base64Image = "data:image/jpg;base64," + base64data;
      // save image to disk
      var link = document.createElement("a");

      document.body.appendChild(link); // for Firefox

      link.setAttribute("href", this.base64Image);
      link.setAttribute("download", "mrHankey.jpg");
      link.click();
    });
    this.image.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_ALoxaFEIUOErg_t2C_-Nnqni4-hhGLeo4A&usqp=CAU';
    let ctx: CanvasRenderingContext2D =
      this.myCanvas.nativeElement.getContext('2d');

    // showing

    ctx.fillRect(20, 20, 150, 100);

    // Not showing
    this.image.onload = () => {
      console.log('image has loaded!');
      ctx.drawImage(this.image, 0, 0);

      ctx.beginPath();
      ctx.moveTo(10, 10);
      ctx.lineTo(50, 50);
      ctx.lineTo(100, 55);
      ctx.lineTo(90, 120);
      ctx.lineTo(120, 200);
      ctx.stroke();
    };
  }

  getBase64ImageFromURL(url: string) {
    return Observable.create((observer: Observable<string>) => {
      const img: HTMLImageElement = new Image();
      img.crossOrigin = "Anonymous";
      img.src = url;
      if (!img.complete) {
        img.onload = () => {
          observer.next(this.getBase64Image(img));
          observer.complete();
        };
        img.onerror = err => {
          observer.error(err);
        };
      } else {
        observer.next(this.getBase64Image(img));
        observer.complete();
      }
    });
  }

  getBase64Image(img: HTMLImageElement) {
    const canvas: HTMLCanvasElement = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
    ctx.drawImage(img, 1, 1);
    const dataURL: string = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  }













}
