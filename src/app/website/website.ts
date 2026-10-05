import { CommonModule } from '@angular/common';
import { Component,  } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-website',
  imports: [RouterModule,TranslateModule,CommonModule,],
  templateUrl: './website.html',
  styleUrl: './website.css',
})
export class Website {
  

currentSlide = 0;


theme = 'light';
selectedLanguage: string = "ka";


constructor(private translate: TranslateService) {
  this.translate.setDefaultLang(this.selectedLanguage)}



switchLanguage(language: string) {
  this.translate.use(language);
   this.langMenuOpen = false;
}

langMenuOpen = false;







public desing: string = "assets/desing.png";


}