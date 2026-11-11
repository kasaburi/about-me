import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About implements OnInit, OnDestroy {
  public cer: string[] = [
    'assets/edy.jpeg',
    'assets/certipicat.jpg',
    'assets/certipikat2.jpg',
  ];

  currentSlide: number = 0;
  private slideTimer?: any;

  nextSlide(): void {
    if (!this.cer.length) return;
    this.currentSlide = (this.currentSlide + 1) % this.cer.length;
  }

  previousSlide(): void {
    if (!this.cer.length) return;
    this.currentSlide = (this.currentSlide - 1 + this.cer.length) % this.cer.length;
  }

  ngOnInit(): void {
    this.slideTimer = setInterval(() => {
      this.nextSlide();
    }, 16000);
  }

  ngOnDestroy(): void {
    if (this.slideTimer) {
      clearInterval(this.slideTimer);
    }
  }

  public me: string = 'assets/me.jpeg';
  public desing: string = 'assets/bb.webp';
  public mob: string = 'assets/five.webp';
  public des: string = 'assets/foure.webp';

  togglePlay(video: HTMLVideoElement): void {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }

  toggleMute(video: HTMLVideoElement): void {
    video.muted = !video.muted;
  }

  changeVolume(video: HTMLVideoElement, event: Event): void {
    const input = event.target as HTMLInputElement;
    const volume = Number(input.value);

    video.volume = volume;

    if (volume === 0) {
      video.muted = true;
    }
  }
}
