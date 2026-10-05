import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-about',
  imports: [CommonModule,RouterModule,TranslateModule],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {


  public cer: string[] = [
    'assets/edy.jpeg',
    'assets/certipicat.jpg',
    'assets/certipikat2.jpg',
   
  ];

currentSlide: number = 0;

nextSlide(): void {
  this.currentSlide = (this.currentSlide + 1) % this.cer.length;
}

previousSlide(): void {
  this.currentSlide =
    (this.currentSlide - 1 + this.cer.length) % this.cer.length;
}


ngOnInit(): void {
  setInterval(() => {
    this.nextSlide();
  }, 16000);
}







public me: string = "assets/me.jpeg";
public desing: string = "assets/bb.webp";
public mob: string = "assets/five.webp";
public des: string = "assets/foure.webp";











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

  // თუ volume 0-მდე ჩამოიყვანა
  if (volume === 0) {
    video.muted = true;
  }
}
}
