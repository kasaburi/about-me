import { Injectable, OnDestroy } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

interface RouteMeta {
  titleKa: string;
  titleEn: string;
  descKa: string;
  descEn: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService implements OnDestroy {
  private routeMap: Record<string, RouteMeta> = {
    '/': {
      titleKa: 'KasCraft | UI/UX დიზაინერი & Frontend დეველოპერი',
      titleEn: 'KasCraft | UI/UX Designer & Web Developer Portfolio',
      descKa: 'KasCraft — Natia Kasaburi-ს UI/UX დიზაინისა და Frontend ვებ დეველოპმენტის პორტფოლიო. თანამედროვე ვებსაიტები, ინტერაქციული პროექტები და ციფრული გამოცდილება.',
      descEn: 'KasCraft — UI/UX Design & Frontend Web Development Portfolio by Natia Kasaburi. Modern web applications, responsive interfaces, Figma design systems, and Angular development.'
    },
    '/about': {
      titleKa: 'ჩემს შესახებ | Natia Kasaburi — KasCraft',
      titleEn: 'About Me | Natia Kasaburi — KasCraft',
      descKa: 'გაიცანით Natia Kasaburi (KasCraft) — Junior Frontend დეველოპერი და UI/UX დიზაინერი. ტექნოლოგიური უნარები, სერტიფიკატები და სამუშაო გამოცდილება.',
      descEn: 'About Natia Kasaburi (KasCraft) — Junior Frontend Developer & UI/UX Designer. Skills, certifications, design process, and professional background.'
    },
    '/desing': {
      titleKa: 'დიზაინის პროექტები & Case Studies | KasCraft',
      titleEn: 'Design Projects & Case Studies | KasCraft',
      descKa: 'გაეცანით UI/UX დიზაინისა და ვებ დეველოპმენტის ქეისებს: Discover Georgia, Elora, Restoran, Fix Georgia.',
      descEn: 'Explore UI/UX design case studies and web applications: Discover Georgia, Elora, Restoran, Fix Georgia.'
    },
    '/desing/discover': {
      titleKa: 'Discover Georgia — UI/UX Case Study | KasCraft',
      titleEn: 'Discover Georgia — UI/UX Case Study | KasCraft',
      descKa: 'საქართველოს ტურიზმისა და აღმოჩენის პლატფორმის UI/UX დიზაინის ქეისი.',
      descEn: 'Discover Georgia — UI/UX Case Study, wireframing, user persona, and design process by KasCraft.'
    },
    '/desing/elora': {
      titleKa: 'Elora Delivery App — UI/UX Case Study | KasCraft',
      titleEn: 'Elora Delivery App — UI/UX Case Study | KasCraft',
      descKa: 'Elora მიტანის სერვისის აპლიკაციის UI/UX დიზაინის პროექტი.',
      descEn: 'Elora Food & Delivery App UI/UX design case study by KasCraft.'
    },
    '/desing/restoran': {
      titleKa: 'Restoran — Modern Dining Experience | KasCraft',
      titleEn: 'Restoran — Modern Dining Experience | KasCraft',
      descKa: 'რესტორნის ვებსაიტისა და ონლაინ შეკვეთის სისტემის პროექტი.',
      descEn: 'Restoran — Modern dining and ordering web experience by KasCraft.'
    },
    '/desing/fix': {
      titleKa: 'Fix Georgia — Civic Tech Platform | KasCraft',
      titleEn: 'Fix Georgia — Civic Tech Platform | KasCraft',
      descKa: 'Fix Georgia — ურბანული პრობლემების მოგვარების პლატფორმის დიზაინი და არქიტექტურა.',
      descEn: 'Fix Georgia — Urban civic tech platform frontend and backend integration by KasCraft.'
    }
  };

  private sub = new Subscription();

  constructor(
    private title: Title,
    private meta: Meta,
    private router: Router,
    private translate: TranslateService
  ) {}

  public init(): void {
    this.updateSeo(this.router.url);

    this.sub.add(
      this.router.events
        .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
        .subscribe((event) => {
          this.updateSeo(event.urlAfterRedirects || event.url);
        })
    );

    this.sub.add(
      this.translate.onLangChange.subscribe(() => {
        this.updateSeo(this.router.url);
      })
    );
  }

  public updateSeo(url: string): void {
    const cleanUrl = (url.split('?')[0].split('#')[0] || '/').replace(/\/+$/, '') || '/';
    const isEng = (this.translate.currentLang || this.translate.defaultLang) === 'eng';
    const htmlLang = isEng ? 'en' : 'ka';

    if (typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.lang = htmlLang;
    }

    const routeData = this.routeMap[cleanUrl] || this.routeMap['/'];
    const title = isEng ? routeData.titleEn : routeData.titleKa;
    const description = isEng ? routeData.descEn : routeData.descKa;

    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: `https://kascraft.vercel.app${cleanUrl === '/' ? '' : cleanUrl}` });
    this.meta.updateTag({ property: 'og:locale', content: isEng ? 'en_US' : 'ka_GE' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
