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






public img: string = "assets/pcc.webp";
public imgs: string = "assets/desktop.webp";
public desing: string = "assets/desing.png";


// ======================
// PERSON SLIDER
// ======================
public person: string[] = [
  "assets/person.webp",
  "assets/emp.webp",
  "assets/Flow.webp",
  "assets/reserch.png",
  "assets/user.webp",
  "assets/userperson.webp"
];

currentSlide1: number = 0;
currentSlide2: number = 0;
showPopup: boolean = false;

nextSlide() {
  this.currentSlide1 =
    (this.currentSlide1 + 1) % this.person.length;
}

prevSlide() {
  this.currentSlide1 =
    (this.currentSlide1 - 1 + this.person.length) % this.person.length;
}

openPopup() {
  this.currentSlide2 = this.currentSlide1;
  this.showPopup = true;
}

closePopup() {
  this.showPopup = false;
}

popnex() {
  this.currentSlide2 =
    (this.currentSlide2 + 1) % this.person.length;
}

popprev() {
  this.currentSlide2 =
    (this.currentSlide2 - 1 + this.person.length) % this.person.length;
}


// ======================
// WIREFRAME SLIDER
// ======================
public images: string[] = [
  "assets/Desktop4.webp",
  "assets/Desktop1.webp",
  "assets/Desktop3.webp",
  "assets/fram.webp",
];

public currentIndex: number = 0;

nextImage() {
  this.currentIndex =
    (this.currentIndex + 1) % this.images.length;
}

prevImage() {
  this.currentIndex =
    (this.currentIndex - 1 + this.images.length) % this.images.length;
}


// ======================
// DESKTOP SLIDER
// ======================
public imagedesktop: string[] = [
  "assets/b.webp",
  "assets/asa.webp",
  "assets/bb.webp",
  "assets/bbb.webp",
  "assets/tre.webp",
  "assets/tr.webp",
  "assets/res1.webp",
];

public deskindex: number = 0;

desknex() {
  this.deskindex =
    (this.deskindex + 1) % this.imagedesktop.length;
}

deskprev() {
  this.deskindex =
    (this.deskindex - 1 + this.imagedesktop.length) %
    this.imagedesktop.length;
}


// ======================
// MOBILE SLIDER
// ======================
public imgmob: string[] = [
  "assets/six.webp",
  "assets/foure.webp",
  "assets/one.webp",
  "assets/five.webp",
  "assets/three.webp",
  "assets/two.webp",
];

public indexmob: number = 0;

nexmob() {
  this.indexmob =
    (this.indexmob + 1) % this.imgmob.length;
}

prevmob() {
  this.indexmob =
    (this.indexmob - 1 + this.imgmob.length) %
    this.imgmob.length;
}






}




















