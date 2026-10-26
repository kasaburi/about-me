import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule, TranslateModule, CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  public kc: string = 'assets/kc.svg';
  public theme = 'light';
  public selectedLanguage: string = 'ka';
  public langMenuOpen = false;
  public currentCard = 0;
  public isMobile = typeof window !== 'undefined' ? window.innerWidth <= 700 : false;

  constructor(private translate: TranslateService) {
    this.selectedLanguage = this.translate.currentLang || this.translate.defaultLang || 'ka';
    this.translate.onLangChange.subscribe((event) => {
      this.selectedLanguage = event.lang;
    });
  }

  public switchLanguage(language: string): void {
    this.translate.use(language);
    this.langMenuOpen = false;
  }

  public toggleLangMenu(): void {
    this.langMenuOpen = !this.langMenuOpen;
  }

  @HostListener('window:resize')
  onResize(): void {
    if (typeof window !== 'undefined') {
      this.isMobile = window.innerWidth <= 700;
      if (!this.isMobile) {
        this.currentCard = 0;
      }
    }
  }

  nextCard(): void {
    if (this.currentCard < 2) {
      this.currentCard++;
    }
  }

  prevCard(): void {
    if (this.currentCard > 0) {
      this.currentCard--;
    }
  }

  public img: string = 'assets/icon.png';
  public images: string[] = [
    'assets/natia.jpg',
    'assets/natia1.jpg'
  ];

  changeSlide(event: MouseEvent): void {
    const slider = event.currentTarget as HTMLElement;
    const clickX = event.offsetX;

    if (clickX < slider.clientWidth / 2) {
      this.prev();
    } else {
      this.next();
    }
  }

  currentIndex = 0;

  next(): void {
    if (!this.images?.length) return;
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prev(): void {
    if (!this.images?.length) return;
    this.currentIndex =
      (this.currentIndex - 1 + this.images.length) % this.images.length;
  }
}
