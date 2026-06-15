import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CommonModule } from '@angular/common';
import { Footer } from './footer/footer';
import { Header } from './header/header';

@Component({
  selector: 'app-root',
  imports: [Header ,Footer,RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('aboutme');

loading = true;

ngOnInit() {
  window.addEventListener('load', () => {
    this.loading = false;
  });

  setTimeout(() => {
    this.loading = false;
  }, 1500);
}
}