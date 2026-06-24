import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, } from '@angular/router';
import { TranslateModule, } from '@ngx-translate/core';









@Component({
  selector: 'app-desing',
  imports: [RouterModule,  CommonModule,TranslateModule,],
  templateUrl: './desing.html',
  styleUrl: './desing.css',
})

export class Desing {








  public img:string = 'assets/icon.png';

   public ice: string[] = [
    'assets/sss.webp',
    'assets/swee.webp',
    'assets/table.webp',
    'assets/ht.webp',
    'assets/ic.webp',
  
  ];


  public hotel: string[] = [
    'assets/hot.png',
    'assets/1.webp',
    'assets/2.webp',
    'assets/book.webp',
   
  ];

  public shoping: string[] = [
    'assets/shop.webp',
    'assets/shopmenu.webp',
    'assets/sho.webp',
    'assets/shoping.webp',

  ];

public restoranimg:string[]=[
   'assets/ress.webp',
   'assets/restoran.webp',
   'assets/res.webp',
   

];




currentIndex1 = 0;

 public Index2: number = 0;

  next1(): void {
    this.currentIndex1 = (this.currentIndex1 + 1) % this.shoping.length;
  }

  prev1(): void {
    this.currentIndex1 =
      (this.currentIndex1 - 1 + this.shoping.length) % this.shoping.length;
  }




   public Index: number = 0;



prev() {
  this.Index = (this.Index - 1 + this.ice.length) % this.ice.length;
}

next() {
  this.Index = (this.Index + 1) % this.ice.length;
}



  Indexres: number = 0;

  resNext(): void {
    this.Indexres++;

    if (this.Indexres >= this.restoranimg.length) {
      this.Indexres = 0;
    }
  }

  resPrev(): void {
    this.Indexres--;

    if (this.Indexres < 0) {
      this.Indexres = this.restoranimg.length - 1;
    }
  }

iceIndex = 0;

iceNext() {
  if (!this.ice?.length) return;
  this.iceIndex = (this.iceIndex + 1) % this.ice.length;
}

icePrev() {
  if (!this.ice?.length) return;
  this.iceIndex =
    (this.iceIndex - 1 + this.ice.length) % this.ice.length;
}




hotelIndex = 0;

hotelNext() {
  if (!this.hotel?.length) return;
  this.hotelIndex = (this.hotelIndex + 1) % this.hotel.length;
}

hotelPrev() {
  if (!this.hotel?.length) return;
  this.hotelIndex =
    (this.hotelIndex - 1 + this.hotel.length) % this.hotel.length;
}











}
