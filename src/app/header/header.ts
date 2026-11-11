import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, TranslateModule, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit, OnDestroy {
  public currentLanguage: 'ka' | 'eng' = 'ka';
  public isLangFlipping: boolean = false;

  public kc: string = 'assets/kc.svg';
  public mobileMenu: boolean = false;
  public theme: 'light' | 'dark' = 'light';
  public selectedLanguage: string = 'ka';
  public langMenuOpen: boolean = false;
  public menuOpen: boolean = false;

  private langSub = new Subscription();

  constructor(private translate: TranslateService) {
    const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('lang') : null;
    const initialLang: 'ka' | 'eng' =
      saved === 'eng' ? 'eng' :
      saved === 'ka' ? 'ka' :
      ((this.translate.currentLang || this.translate.defaultLang || 'ka') === 'eng' ? 'eng' : 'ka');

    this.currentLanguage = initialLang;
    this.selectedLanguage = this.currentLanguage;
    this.translate.setDefaultLang('ka');
    this.translate.use(this.currentLanguage);
    this.syncDocumentLang(this.currentLanguage);

    this.langSub = this.translate.onLangChange.subscribe(event => {
      this.currentLanguage = event.lang === 'eng' ? 'eng' : 'ka';
      this.selectedLanguage = this.currentLanguage;
      this.syncDocumentLang(this.currentLanguage);
      if (typeof localStorage !== 'undefined') {
        try {
          localStorage.setItem('lang', this.currentLanguage);
        } catch {
          // ignore storage error
        }
      }
    });
  }

  private syncDocumentLang(lang: 'ka' | 'eng'): void {
    if (typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.lang = lang === 'eng' ? 'en' : 'ka';
    }
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

  ngOnDestroy(): void {
    this.langSub.unsubscribe();
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
    this.syncDocumentLang(langCode);
    this.langMenuOpen = false;
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('lang', langCode);
      } catch {
        // ignore
      }
    }
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
