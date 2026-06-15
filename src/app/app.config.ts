// import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
// import { provideRouter } from '@angular/router';
// import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
// import { HttpClientModule, HttpClient } from '@angular/common/http';
// import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// import { routes } from './app.routes';
// import { Observable } from 'rxjs';

// // Custom loader for Angular 16
// export class CustomLoader implements TranslateLoader {
//   constructor(private http: HttpClient) {}
//   getTranslation(lang: string): Observable<any> {
//     return this.http.get(`assets/i18n/${lang}.json`);
//   }
// }

// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideBrowserGlobalErrorListeners(),
//     provideZoneChangeDetection({ eventCoalescing: true }),
//     provideRouter(routes),
//     importProvidersFrom(
//       HttpClientModule,
//       TranslateModule.forRoot({
//         loader: {
//           provide: TranslateLoader,
//           useClass: CustomLoader
//         }
//       })
//     )
//   ]
// };


 import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { routes } from './app.routes';
import { Observable } from 'rxjs';


import { Injectable } from '@angular/core';


@Injectable({ providedIn: 'root' })
export class CustomLoader implements TranslateLoader {
  constructor(private http: HttpClient) {}

  // type დასაფიქსირებელია
  getTranslation(lang: string): Observable<any> {
    return this.http.get(`assets/i18n/${lang}.json`);
  }
}



















export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(
      HttpClientModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: CustomLoader
        }
      })
    )
  ]
};


