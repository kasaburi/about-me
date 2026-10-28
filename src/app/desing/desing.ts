import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-desing',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule
  ],
  templateUrl: './desing.html',
  styleUrl: './desing.css'
})
export class Desing {

  public img: string = 'assets/icon.svg';

  // ICE CREAM
  public ice: string[] = [
    'assets/ice.png',
    'assets/ice1.png',
    'assets/ice2.png'
  ];
  public iceWebp: string[] = [
    'assets/ice.webp',
    'assets/ice1.webp',
    'assets/ice2.webp'
  ];

  iceIndex = 0;

  iceNext(): void {
    if (!this.ice.length) return;
    this.iceIndex = (this.iceIndex + 1) % this.ice.length;
  }

  icePrev(): void {
    if (!this.ice.length) return;
    this.iceIndex =
      (this.iceIndex - 1 + this.ice.length) % this.ice.length;
  }


  // HOTEL
  public hotel: string[] = [
    'assets/hotel.png',
    'assets/hotel1.png',
    'assets/hotel2.png'
  ];
  public hotelWebp: string[] = [
    'assets/hotel.webp',
    'assets/hotel1.webp',
    'assets/hotel2.webp'
  ];

  hotelIndex = 0;

  hotelNext(): void {
    if (!this.hotel.length) return;
    this.hotelIndex = (this.hotelIndex + 1) % this.hotel.length;
  }

  hotelPrev(): void {
    if (!this.hotel.length) return;
    this.hotelIndex =
      (this.hotelIndex - 1 + this.hotel.length) % this.hotel.length;
  }


  // SHOPPING
  public shoping: string[] = [
    'assets/shop.png',
    'assets/shop1.png',
    'assets/shop2.png'
  ];
  public shopingWebp: string[] = [
    'assets/shop.webp',
    'assets/shop1.webp',
    'assets/shop2.webp'
  ];

  currentIndex1 = 0;

  next1(): void {
    if (!this.shoping.length) return;
    this.currentIndex1 =
      (this.currentIndex1 + 1) % this.shoping.length;
  }

  prev1(): void {
    if (!this.shoping.length) return;
    this.currentIndex1 =
      (this.currentIndex1 - 1 + this.shoping.length) %
      this.shoping.length;
  }


  // RESTORAN
  public restoranimg: string[] = [
    'assets/res.png',
    'assets/res1.png',
    'assets/res2.png'
  ];
  public restoranimgWebp: string[] = [
    'assets/res.webp',
    'assets/res1.webp',
    'assets/res2.webp'
  ];

  restoranIndex = 0;

  resNext(): void {
    if (!this.restoranimg.length) return;
    this.restoranIndex =
      (this.restoranIndex + 1) % this.restoranimg.length;
  }

  resPrev(): void {
    if (!this.restoranimg.length) return;
    this.restoranIndex =
      (this.restoranIndex - 1 + this.restoranimg.length) %
      this.restoranimg.length;
  }


  // KRIPTO
  public criptoimg: string[] = [
    'assets/cripto.png',
    'assets/cripto1.png'
  ];
  public criptoimgWebp: string[] = [
    'assets/cripto.webp',
    'assets/cripto1.webp'
  ];

  criptoIndex = 0;

  criptoNext(): void {
    if (!this.criptoimg.length) return;
    this.criptoIndex =
      (this.criptoIndex + 1) % this.criptoimg.length;
  }

  criptoPrev(): void {
    if (!this.criptoimg.length) return;
    this.criptoIndex =
      (this.criptoIndex - 1 + this.criptoimg.length) %
      this.criptoimg.length;
  }


  // AI
  public aiimg: string[] = [
    'assets/ai.png',
    'assets/ai1.png',
    'assets/ai2.png'
  ];
  public aiimgWebp: string[] = [
    'assets/ai.webp',
    'assets/ai1.webp',
    'assets/ai2.webp'
  ];

  aiIndex = 0;

  aiNext(): void {
    if (!this.aiimg.length) return;
    this.aiIndex =
      (this.aiIndex + 1) % this.aiimg.length;
  }

  aiPrev(): void {
    if (!this.aiimg.length) return;
    this.aiIndex =
      (this.aiIndex - 1 + this.aiimg.length) %
      this.aiimg.length;
  }


  // JOBS
  public workimg: string[] = [
    'assets/work.png',
    'assets/work1.png',
    'assets/work2.png'
  ];
  public workimgWebp: string[] = [
    'assets/work.webp',
    'assets/work1.webp',
    'assets/work2.webp'
  ];

  workIndex = 0;

  workNext(): void {
    if (!this.workimg.length) return;
    this.workIndex =
      (this.workIndex + 1) % this.workimg.length;
  }

  workPrev(): void {
    if (!this.workimg.length) return;
    this.workIndex =
      (this.workIndex - 1 + this.workimg.length) %
      this.workimg.length;
  }


  // FIX GEORGIA
  public fiximg: string[] = [
    'assets/fix.png',
    'assets/fix1.png',
    'assets/fix2.png'
  ];
  public fiximgWebp: string[] = [
    'assets/fix.webp',
    'assets/fix1.webp',
    'assets/fix2.webp'
  ];

  fixIndex = 0;

  fixNext(): void {
    if (!this.fiximg.length) return;
    this.fixIndex =
      (this.fixIndex + 1) % this.fiximg.length;
  }

  fixPrev(): void {
    if (!this.fiximg.length) return;
    this.fixIndex =
      (this.fixIndex - 1 + this.fiximg.length) %
      this.fiximg.length;
  }
}