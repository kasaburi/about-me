import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-website',
  standalone: true,
  imports: [RouterModule, TranslateModule, CommonModule],
  templateUrl: './website.html',
  styleUrl: './website.css',
})
export class Website {
  currentSlide = 0;
  theme = 'light';
  selectedLanguage: string = 'ka';
  langMenuOpen = false;

  public desing: string = 'assets/desing.png';

  constructor(private translate: TranslateService) {
    this.selectedLanguage = this.translate.currentLang || this.translate.defaultLang || 'ka';
    this.translate.onLangChange.subscribe((event) => {
      this.selectedLanguage = event.lang;
    });
  }

  switchLanguage(language: string) {
    this.translate.use(language);
    this.langMenuOpen = false;
  }
}
