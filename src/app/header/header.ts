import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';


 @Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, TranslateModule, CommonModule],
  templateUrl: './header.html',
  styleUrl:'./header.css',
 })
export class Header {



public kc:string="assets/kc.png";

public mobileMenu = false;

theme = 'light';
selectedLanguage: string = "ka";


constructor(private translate: TranslateService) {
  this.translate.setDefaultLang(this.selectedLanguage)}



switchLanguage(language: string) {
  this.translate.use(language);
   this.langMenuOpen = false;
}

langMenuOpen = false;

toggleLangMenu() {
  this.langMenuOpen = !this.langMenuOpen;
}





menuOpen = false;

toggleMenu() {
    this.menuOpen = !this.menuOpen;
}

closeMenu() {
    this.menuOpen = false;
}

selectOption(lang: string) {
    this.switchLanguage(lang);
    this.closeMenu();  
}




toggleMobileMenu() {
    this.mobileMenu = !this.mobileMenu;
}

closeMobileMenu() {
    this.mobileMenu = false;
    this.langMenuOpen = false;
}

openLang() {
    this.langMenuOpen = !this.langMenuOpen;
}

selectLang(lang: string) {
    this.switchLanguage(lang);
    this.closeMobileMenu();
}






 ngOnInit() {
    if (typeof document !== 'undefined') {
      const mode = localStorage.getItem('theme');
      if (mode === 'dark') {
        document.body.classList.add('dark-mode');
        this.theme = 'dark';
      }
    }
  }



 
  toggleDarkMode() {
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




}
