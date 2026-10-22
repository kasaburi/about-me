import {
  Component,
  ElementRef,
  ViewChild,
  signal,
  computed,
  OnDestroy
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  TranslateModule,
  TranslateService,
  LangChangeEvent
} from '@ngx-translate/core';

import { Subscription } from 'rxjs';

import {
  GeminiService,
  ChatMessage
} from '../services/gemini.service';

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule
  ],
  templateUrl: './ai-assistant.html',
  styleUrl: './ai-assistant.css'
})
export class AiAssistant implements OnDestroy {

  @ViewChild('chatScroll')
  private chatScrollContainer?: ElementRef<HTMLDivElement>;

  public isOpen = signal<boolean>(false);
  public isSettingsOpen = signal<boolean>(false);
  public isTyping = signal<boolean>(false);

  public userMessage = signal<string>('');
  public apiKeyInput = signal<string>('');

  public hasKey = computed(() =>
    this.geminiService.hasApiKey()
  );

  public currentLang = signal<'ka' | 'en'>('ka');

  public get isGeorgian(): boolean {
    return this.currentLang() === 'ka';
  }

  public messages = signal<ChatMessage[]>([]);

  private langSubscription?: Subscription;

  public quickPrompts = [
    {
      labelKa: '👋 ვინ არის ნათია?',
      labelEn: '👋 Who is Natia?',
      queryKa: 'ვინ არის ნათია?',
      queryEn: 'Who is Natia?'
    },
    {
      labelKa: '🚀 პროექტები',
      labelEn: '🚀 Projects',
      queryKa: 'რა პროექტებია პორტფოლიოში?',
      queryEn: 'What projects are in the portfolio?'
    },
    {
      labelKa: '💻 ტექნოლოგიები',
      labelEn: '💻 Tech Stack',
      queryKa: 'რა ტექნოლოგიებსა და ხელსაწყოებს ფლობ?',
      queryEn: 'What technologies and tools do you know?'
    },
    {
      labelKa: '🎨 UI/UX გამოცდილება',
      labelEn: '🎨 UI/UX Skills',
      queryKa: 'მომიყევი UI/UX და დიზაინის გამოცდილებაზე.',
      queryEn: 'Tell me about your UI/UX and design experience.'
    },
    {
      labelKa: '📬 კონტაქტი',
      labelEn: '📬 Contact',
      queryKa: 'როგორ შეიძლება თანამშრომლობისთვის დაკავშირება?',
      queryEn: 'How can I get in touch for collaboration?'
    }
  ];

  constructor(
    public geminiService: GeminiService,
    private translate: TranslateService
  ) {
    this.apiKeyInput.set(
      this.geminiService.apiKey()
    );

    const resolveLang = (lang?: string | null): 'ka' | 'en' =>
      lang === 'eng' || lang === 'en' ? 'en' : 'ka';

    const activeLang = resolveLang(
      this.translate.currentLang || this.translate.defaultLang
    );
    this.currentLang.set(activeLang);

    this.initializeWelcomeMessage();

    this.langSubscription =
      this.translate.onLangChange.subscribe(
        (event: LangChangeEvent) => {
          const newLang = resolveLang(event.lang);
          this.currentLang.set(newLang);
          const msgs = this.messages();
          if (msgs.length === 1 && msgs[0].role === 'assistant') {
            this.messages.set([
              {
                role: 'assistant',
                text: this.getWelcomeMessage(),
                timestamp: new Date()
              }
            ]);
          }
        }
      );
  }

  public ngOnDestroy(): void {
    this.langSubscription?.unsubscribe();
  }
  private initializeWelcomeMessage(): void {
    this.messages.set([
      {
        role: 'assistant',
        text: this.getWelcomeMessage(),
        timestamp: new Date()
      }
    ]);
  }

  private getWelcomeMessage(): string {
    return this.isGeorgian
      ? `👋 გამარჯობა! მე ვარ **KasCraft AI** — ნათიას   ასისტენტი.
შემიძლია დეტალურად გიამბოთ მის პროექტებზე, Front-End უნარებზე, UI/UX დიზაინზე, განათლებასა და თანამშრომლობის შესაძლებლობებზე.
რით შემიძლია დაგეხმაროთ?`
      : `👋 Hello! I am **KasCraft AI**, natia's assistant.
I can tell you about Natia's projects, front-end skills, UI/UX design experience, education, and collaboration opportunities.
How can I help you today?`;
  }

  /**
   * ჩატის გახსნა და დახურვა.
   */
  public toggleChat(): void {
    this.isOpen.update(value => !value);

    if (this.isOpen()) {
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  /**
   * პარამეტრების გახსნა და დახურვა.
   */
  public toggleSettings(): void {
    this.isSettingsOpen.update(value => !value);
  }

  /**
   * Gemini API Key-ის შენახვა.
   */
  public saveApiKey(): void {
    const key = this.apiKeyInput().trim();

    this.geminiService.setApiKey(key);
    this.apiKeyInput.set(key);

    this.isSettingsOpen.set(false);
  }

  /**
   * API Key-ის გასუფთავება.
   */
  public clearApiKey(): void {
    this.apiKeyInput.set('');
    this.geminiService.setApiKey('');
  }

  /**
   * ჩატის გასუფთავება.
   */
  public clearChat(): void {
    this.messages.set([
      {
        role: 'assistant',
        text: this.isGeorgian
          ? 'ჩატი გასუფთავდა. რით შემიძლია დაგეხმაროთ?'
          : 'Chat history cleared. How can I help you?',
        timestamp: new Date()
      }
    ]);
  }

  /**
   * სწრაფი კითხვების გაგზავნა.
   */
  public async sendQuickPrompt(
    queryKa: string,
    queryEn: string
  ): Promise<void> {
    const query = this.isGeorgian
      ? queryKa
      : queryEn;

    await this.sendMessageWithText(query);
  }

  /**
   * ფორმიდან შეტყობინების გაგზავნა.
   */
  public async onFormSubmit(): Promise<void> {
    const text = this.userMessage().trim();

    if (!text || this.isTyping()) {
      return;
    }

    this.userMessage.set('');

    await this.sendMessageWithText(text);
  }

  /**
   * შეტყობინების გაგზავნა Gemini Service-ში.
   */
  private async sendMessageWithText(
    text: string
  ): Promise<void> {
    const cleanText = text.trim();
    if (!cleanText || this.isTyping()) {
      return;
    }

    const userMsg: ChatMessage = {
      role: 'user',
      text: cleanText,
      timestamp: new Date()
    };

    // Prior history without the currently typed message
    const previousHistory = [...this.messages()];

    this.messages.update(list => [
      ...list,
      userMsg
    ]);

    this.isTyping.set(true);

    setTimeout(() => this.scrollToBottom(), 50);

    const lang = this.currentLang();

    try {
      const response =
        await this.geminiService.sendMessage(
          cleanText,
          previousHistory,
          lang
        );

      const assistantMsg: ChatMessage = {
        role: 'assistant',
        text: response,
        timestamp: new Date()
      };

      this.messages.update(list => [
        ...list,
        assistantMsg
      ]);

    } catch (error: unknown) {
      console.error(
        'Gemini API request failed:',
        error
      );

      this.messages.update(list => [
        ...list,
        {
          role: 'assistant',
          text: this.isGeorgian
            ? 'ბოდიში, პასუხის მიღებისას შეცდომა მოხდა. გთხოვთ, სცადოთ თავიდან.'
            : 'Sorry, an error occurred while fetching the response. Please try again.',
          timestamp: new Date()
        }
      ]);

    } finally {
      this.isTyping.set(false);

      setTimeout(() => this.scrollToBottom(), 60);
    }
  }

  /**
   * მარტივი და უსაფრთხო Markdown ფორმატირება.
   */
  public formatMarkdown(text: string): string {
    if (!text) {
      return '';
    }

    let formatted = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

    // Links: [Text](url)
    formatted = formatted.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="chat-link">$1</a>'
    );

    // Bold: **text**
    formatted = formatted.replace(
      /\*\*(.+?)\*\*/g,
      '<strong>$1</strong>'
    );

    // Inline code: `code`
    formatted = formatted.replace(
      /`([^`]+)`/g,
      '<code style="background:rgba(99,102,241,0.15);padding:1px 5px;border-radius:4px;font-family:monospace;font-size:0.9em;">$1</code>'
    );

    // Headings (### or ##) -> bold line
    formatted = formatted.replace(
      /^#{1,3}\s+(.+)$/gm,
      '<strong>$1</strong>'
    );

    // Bullet points: • or - or *
    formatted = formatted.replace(
      /^[ \t]*[•\-\*][ \t]+(.+)$/gm,
      '<li class="chat-li">$1</li>'
    );

    // Group adjacent li items into ul
    formatted = formatted.replace(
      /(?:<li class="chat-li">.*?<\/li>\s*)+/gs,
      '<ul class="chat-ul">$&</ul>'
    );

    // Newlines
    formatted = formatted.replace(/\n/g, '<br>');

    return formatted;
  }

  /**
   * ჩატის ბოლოში გადასვლა.
   */
  private scrollToBottom(): void {
    if (!this.chatScrollContainer) {
      return;
    }

    const element =
      this.chatScrollContainer.nativeElement;

    element.scrollTop = element.scrollHeight;
  }
}
