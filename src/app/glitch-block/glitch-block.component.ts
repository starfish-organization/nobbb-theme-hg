import { Component, Inject, OnInit, OnDestroy, ElementRef, ViewChild, Input } from '@angular/core';
import Glitcher from '../glitch.serve';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Component({
  selector: 'glitch-block',
  templateUrl: './glitch-block.component.html',
  styleUrls: ['./glitch-block.component.scss']
})
export class GlitchBlockComponent implements OnInit, OnDestroy {
  @ViewChild('canvas') canvas: ElementRef;
  @Input() text: string;
  @Input() size: string;
  @Input() silent: boolean;
  glitcher: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Client only code.
      const canvas = this.canvas.nativeElement;
      this.glitcher = new Glitcher(canvas, this.text, this.size, this.silent);
      this.glitcher.start();

      canvas.addEventListener('mouseover', event => {
        this.glitcher.start();
      });
    }
    if (isPlatformServer(this.platformId)) {
      // Server only code.
    }
  }

  ngOnDestroy() {}
}