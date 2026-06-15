import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
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






public img:string="assets/pcc.png";
public imgs:string="assets/desktop.png";



// public emp:string="assets/emp.png",
// public flow:string="assets/Flow.png",
// public person:string[]=[
//   "assets/person.png",
//   "assets/emp.png",
//   "assets/Flow.png",
// ];


public desing:string="assets/ph1.png";




// wiframe
public images: string[] = [
  "assets/Desktop4.png",
  "assets/Desktop1.png",
  "assets/Desktop3.png",
  "assets/Frame.png",
  "assets/fram.png",
];



// desktop


// public imagedesktop: string[] = [
//   "assets/aaa.png",
//   "assets/aaaa.png",
//   "assets/ann.png",
//   "assets/b.png",
//   "assets/bb.png",
//   "assets/bbb.png",
//   "assets/res1.png",
//   "assets/ccc.png",
//    "assets/tr.png",
// ];

public imagedesktop: string[] = [

 "assets/b.png",
  "assets/asa.png",
"assets/bb.png",
  "assets/bbb.png",
  "assets/tre.png",
 "assets/tr.png",
  "assets/res1.png",


];

public image: string[] = [
  "assets/Deskto.png",

];



public mobimg: string[] = [



]
public person:string[]=[
 "assets/person.png",
 "assets/emp.png",
 "assets/Flow.png",
 "assets/reserch.png"
];

currentSlide1:number = 0;
currentSlide2:number = 0;

showPopup:boolean = false;


nextSlide(){
 this.currentSlide1 =
 (this.currentSlide1 + 1) % this.person.length;
}

prevSlide(){
 this.currentSlide1 =
 (this.currentSlide1 - 1 + this.person.length)
 % this.person.length;
}


openPopup(){
 this.currentSlide2 = this.currentSlide1; // აი ეს აკავშირებს
 this.showPopup = true;
}

closePopup(){
 this.showPopup = false;
}


popnex(){
 this.currentSlide2 =
 (this.currentSlide2 + 1) % this.person.length;
}

popprev(){
 this.currentSlide2 =
 (this.currentSlide2 - 1 + this.person.length)
 % this.person.length;
}







// wiframe

public currentIndex: number = 0;

nextImage() {
  this.currentIndex = (this.currentIndex + 1) % this.images.length;

}

prevImage() {
  this.currentIndex =
    (this.currentIndex - 1 + this.images.length) % this.images.length;
};


// mobile

public imgmob: string[] = [
  "assets/six.png",
  "assets/foure.png",
  "assets/one.png",
  "assets/five.png",
  "assets/three.png",
  "assets/two.png",
 
];

// desktop




public deskindex: number = 0;

desknex() {
  this.deskindex = (this.deskindex + 1) % this.images.length;

}

deskprev() {
  this.deskindex =
    (this.deskindex - 1 + this.images.length) % this.images.length;
}





// mobile
public indexmob: number = 0;

nexmob() {
  this.indexmob= (this.indexmob+ 1) % this.images.length;

}

prevmob() {
  this.indexmob =
    (this.indexmob - 1 + this.images.length) % this.images.length;
}





}
