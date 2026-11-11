import { Component, signal, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './footer/footer';
import { Header } from './header/header';
import { AiAssistant } from './ai-assistant/ai-assistant';
import { SeoService } from './services/seo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Header, Footer, RouterOutlet, AiAssistant],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private seoService = inject(SeoService);
  loading = signal(false);

  ngOnInit() {
    this.seoService.init();

    // Only show intro once per user session to avoid blocking repeated navigation
    const hasSeenIntro = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('intro_seen') : null;
    if (!hasSeenIntro) {
      this.loading.set(true);
      setTimeout(() => {
        this.loading.set(false);
        try {
          sessionStorage.setItem('intro_seen', 'true');
        } catch {
          // ignore if storage blocked
        }
      }, 3400);
    }
  }
}
