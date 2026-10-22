import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './footer/footer';
import { Header } from './header/header';
import { AiAssistant } from './ai-assistant/ai-assistant';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Header, Footer, RouterOutlet, AiAssistant],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  loading = signal(true);

  ngOnInit() {
    setTimeout(() => {
      this.loading.set(false);
    }, 3800);
  }
}
