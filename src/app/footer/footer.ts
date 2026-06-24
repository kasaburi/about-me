import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  imports: [RouterModule,TranslateModule,CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {

  public kc:string="assets/kc.svg";


theme = 'light';
selectedLanguage: string = "ka";


constructor(private translate:TranslateService) {
  this.translate.setDefaultLang(this.selectedLanguage)}



switchLanguage(language: string) {
  this.translate.use(language);
   this.langMenuOpen = false;
}

langMenuOpen = false;

toggleLangMenu() {
  this.langMenuOpen = !this.langMenuOpen;
}


currentCard = 0;
isMobile = window.innerWidth <= 700;

@HostListener('window:resize')
onResize() {
  this.isMobile = window.innerWidth <= 700;

  if (!this.isMobile) {
    this.currentCard = 0;
  }
}
















nextCard() {
  if (this.currentCard < 2) {
    this.currentCard++;
  }
}

prevCard() {
  if (this.currentCard > 0) {
    this.currentCard--;
  }
}





  public img:string = 'assets/icon.png';
    public images: string[] = [
    'assets/natia.jpg',
    'assets/natia1.jpg'
  ];
changeSlide(event: MouseEvent) {

  const slider = event.currentTarget as HTMLElement;
  const clickX = event.offsetX;

  if (clickX < slider.clientWidth / 2) {
    this.prev();
  } else {
    this.next();
  }
}

currentIndex = 0;

next() {
  if (!this.images?.length) return;
  this.currentIndex = (this.currentIndex + 1) % this.images.length;
}

prev() {
  if (!this.images?.length) return;
  this.currentIndex =
    (this.currentIndex - 1 + this.images.length) % this.images.length;
}







}

