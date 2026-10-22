import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, TranslateModule, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  public currentLanguage: 'ka' | 'eng' = 'ka';
  public isLangFlipping: boolean = false;

  public kc: string = 'assets/kc.svg';
  public mobileMenu: boolean = false;
  public theme: 'light' | 'dark' = 'light';
  public selectedLanguage: string = 'ka';
  public langMenuOpen: boolean = false;
  public menuOpen: boolean = false;

  constructor(private translate: TranslateService) {
    const initialLang = (this.translate.currentLang || this.translate.defaultLang || 'ka') as 'ka' | 'eng';
    this.currentLanguage = initialLang === 'eng' ? 'eng' : 'ka';
    this.selectedLanguage = this.currentLanguage;
    this.translate.setDefaultLang(this.currentLanguage);
    this.translate.use(this.currentLanguage);

    this.translate.onLangChange.subscribe(event => {
      this.currentLanguage = event.lang === 'eng' ? 'eng' : 'ka';
      this.selectedLanguage = this.currentLanguage;
    });
  }

  ngOnInit() {
    if (typeof document !== 'undefined') {
      const mode = localStorage.getItem('theme');
      if (mode === 'dark') {
        document.body.classList.add('dark-mode');
        this.theme = 'dark';
      } else {
        document.body.classList.remove('dark-mode');
        this.theme = 'light';
      }
    }
  }

  /**
   * Toggles between Georgian ('ka') and English ('eng') with tactile animation.
   */
  public toggleLanguage(): void {
    const nextLang = this.currentLanguage === 'ka' ? 'eng' : 'ka';
    this.isLangFlipping = true;
    this.switchLanguage(nextLang);
    setTimeout(() => {
      this.isLangFlipping = false;
    }, 320);
  }

  public switchLanguage(language: string): void {
    const langCode = language === 'eng' ? 'eng' : 'ka';
    this.currentLanguage = langCode;
    this.selectedLanguage = langCode;
    this.translate.use(langCode);
    this.langMenuOpen = false;
  }

  public toggleDarkMode(): void {
    if (typeof document === 'undefined') return;

    const body = document.body;
    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
      localStorage.setItem('theme', 'dark');
      this.theme = 'dark';
    } else {
      localStorage.setItem('theme', 'light');
      this.theme = 'light';
    }
  }

  public toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  public closeMenu(): void {
    this.menuOpen = false;
  }

  public selectOption(lang: string): void {
    this.switchLanguage(lang);
    this.closeMenu();
  }

  public toggleLangMenu(): void {
    this.langMenuOpen = !this.langMenuOpen;
  }

  public toggleMobileMenu(): void {
    this.mobileMenu = !this.mobileMenu;
  }

  public closeMobileMenu(): void {
    this.mobileMenu = false;
    this.langMenuOpen = false;
  }

  public openLang(): void {
    this.langMenuOpen = !this.langMenuOpen;
  }

  public selectLang(lang: string): void {
    this.switchLanguage(lang);
    this.closeMobileMenu();
  }
}
