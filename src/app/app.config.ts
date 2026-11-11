import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';

import { provideRouter, withInMemoryScrolling, withPreloading, PreloadAllModules } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { Observable, of } from 'rxjs';
import { catchError, shareReplay, timeout } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CustomLoader implements TranslateLoader {
  private cache = new Map<string, Observable<any>>();

  constructor(private http: HttpClient) {}

  getTranslation(lang: string): Observable<any> {
    let cleanLang = (lang || 'ka').toLowerCase().trim();
    if (cleanLang === 'en') cleanLang = 'eng';
    if (cleanLang === 'ge') cleanLang = 'ka';

    if (!this.cache.has(cleanLang)) {
      const translation$ = this.http.get(`/assets/i18n/${cleanLang}.json`).pipe(
        timeout(4000),
        shareReplay(1),
        catchError((err) => {
          console.warn(`[Translate] Absolute path /assets/i18n/${cleanLang}.json failed, trying relative:`, err);
          return this.http.get(`assets/i18n/${cleanLang}.json`).pipe(
            catchError((fallbackErr) => {
              console.warn(`[Translate] Fallback translation failed for "${cleanLang}":`, fallbackErr);
              return of({});
            })
          );
        })
      );
      this.cache.set(cleanLang, translation$);
    }
    return this.cache.get(cleanLang)!;
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),

    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      }),
      withPreloading(PreloadAllModules)
    ),

    provideHttpClient(withFetch()),

    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'ka',
        loader: {
          provide: TranslateLoader,
          useClass: CustomLoader
        }
      })
    )
  ]
};
