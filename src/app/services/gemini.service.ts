import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, timeout } from 'rxjs';

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

export interface DesignPaletteColor {
  name: string;
  hex: string;
  role: string;
}

export interface DesignConcept {
  projectName: string;
  tagline: string;
  palette: DesignPaletteColor[];
  typography: {
    heading: string;
    body: string;
    note: string;
  };
  layoutHighlights: string[];
  uxFeatures: string[];
  techStack: string[];
}

type ConversationTopic =
  | 'greeting'
  | 'general_bio'
  | 'education'
  | 'career_goal'
  | 'all_projects'
  | 'project_discover_georgia'
  | 'project_elora'
  | 'project_fix_georgia'
  | 'project_singh'
  | 'project_hotel'
  | 'project_restaurant'
  | 'project_shop'
  | 'project_jobs'
  | 'project_kripto'
  | 'skills_frontend'
  | 'skills_uiux'
  | 'all_skills'
  | 'contact';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private readonly STORAGE_KEY = 'kascraft_gemini_api_key';
  public apiKey = signal<string>('');

  // Track conversation state for contextual follow-ups in local/fallback mode
  private lastTopic: ConversationTopic = 'general_bio';
  private lastProject: string = '';

  constructor(private http: HttpClient) {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        const savedKey = localStorage.getItem(this.STORAGE_KEY) || '';
        this.apiKey.set(savedKey);
      } catch {
        // Ignore storage exceptions
      }
    }
  }

  public setApiKey(key: string): void {
    const trimmed = key.trim();
    this.apiKey.set(trimmed);
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        if (trimmed) {
          localStorage.setItem(this.STORAGE_KEY, trimmed);
        } else {
          localStorage.removeItem(this.STORAGE_KEY);
        }
      } catch {
        // Ignore storage exceptions
      }
    }
  }

  public hasApiKey(): boolean {
    return !!this.apiKey();
  }

  /**
   * Main conversational dispatch:
   * Uses Gemini API if API key is present, with automatic multi-model fallback.
   * If offline, quota-limited, or no API key, seamlessly utilizes the smart local context engine.
   */
  public async sendMessage(
    userText: string,
    history: ChatMessage[],
    currentLang: 'ka' | 'en' = 'ka'
  ): Promise<string> {
    const key = this.apiKey();
    const cleanUserText = userText.trim();

    if (!cleanUserText) {
      return currentLang === 'ka'
        ? 'გთხოვთ, მომწეროთ შეკითხვა.'
        : 'Please write your question.';
    }

    if (key) {
      try {
        return await this.callGeminiWithFallback(cleanUserText, history, key, currentLang);
      } catch (err) {
        console.warn('Gemini API call failed, seamlessly utilizing smart local knowledge engine:', err);
        return this.getLocalSmartResponse(cleanUserText, currentLang, history);
      }
    }

    // Default intelligent local knowledge engine with deep contextual understanding
    return this.getLocalSmartResponse(cleanUserText, currentLang, history);
  }

  /**
   * Calls Gemini API with fallback across current models (gemini-2.0-flash -> gemini-1.5-flash).
   */
  private async callGeminiWithFallback(
    userText: string,
    history: ChatMessage[],
    apiKey: string,
    currentLang: 'ka' | 'en'
  ): Promise<string> {
    const models = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-2.5-flash'];
    let lastError: unknown = null;

    for (const model of models) {
      try {
        return await this.executeGeminiRequest(model, userText, history, apiKey, currentLang);
      } catch (err) {
        lastError = err;
        console.warn(`Model ${model} request failed, attempting next model fallback:`, err);
      }
    }

    throw lastError || new Error('All Gemini models failed');
  }

  /**
   * Constructs payload and sends request to Google Gemini API.
   */
  private async executeGeminiRequest(
    modelName: string,
    userText: string,
    history: ChatMessage[],
    apiKey: string,
    currentLang: 'ka' | 'en'
  ): Promise<string> {
    const systemPrompt = `You are KasCraft AI, the official personal AI portfolio assistant for Natia Kasaburi (ნათია ყასაბური).
Your mission is to represent Natia's portfolio, skills, projects, and professional background in an intelligent, authentic, warm, and articulate manner.

=======================================================
ABOUT NATIA KASABURI (ნათია ყასაბური)
=======================================================
- Professional Identity: Junior Front-End Developer & UI/UX Designer.
- Location: Tbilisi, Georgia (თბილისი, საქართველო).
- Portfolio Brand: KasCraft (https://kascraft.vercel.app).
- Core Philosophy: Bridging the gap between beautiful, user-centered design in Figma and clean, responsive, robust front-end code.
- Career Objective: Seeking opportunities as a Junior Front-End Developer or Junior UI/UX Designer, internships, freelance projects, and team collaborations. Open to full-time and part-time positions.

=======================================================
EDUCATION & CERTIFICATIONS
=======================================================
1. IT Academy STEP:
   - Front-End Development certification.
   - Mastered HTML5, CSS3, modern JavaScript (ES6+), and Angular.
2. EduCity:
   - UI/UX Design Training Program.
   - Collaborated in a team on the "Create Your Digital City" (შექმენი შენი ციფრული ქალაქი) project and earned an official certification.

=======================================================
TECHNICAL SKILLS & TOOLKIT
=======================================================
- Front-End Development: Angular (v20 Standalone Components, Signals, RxJS, Routing), TypeScript, Modern JavaScript (ES6+), HTML5, Semantic Markup, CSS3, SCSS, Flexbox, CSS Grid, Responsive Web Design, Mobile-First Workflow, REST API Integration.
- UI/UX Design: Figma, Wireframing, High-Fidelity Interactive Prototyping, User Research, User Personas, User Flows, Journey Mapping, Design Systems, Typography Hierarchy, Color Theory, Accessibility (WCAG AA), Micro-interactions.
- Tools & Platforms: Git, GitHub (version control & collaboration), Vercel (deployment), VS Code, AI Workflow acceleration tools.

=======================================================
FEATURED PORTFOLIO PROJECTS
=======================================================
1. Discover Georgia (აღმოაჩინე საქართველო) [UI/UX Case Study]:
   - Concept: Digital travel and tourism platform designed to unite Georgia's hidden gems, small businesses, events, and cultural experiences in one interactive ecosystem.
   - Key Features: Community-driven spot adding, interactive map locations, photo uploads, traveler recommendations.
   - Inclusive Tourism: Specially features accessibility information for persons with disabilities (wheelchair ramps, accessible restrooms, adapted spaces).
   - Typography & Design: Inter font, clean nature-inspired aesthetic.
2. Elora [UI/UX Case Study]:
   - Concept: Premium fashion, beauty, and perfume e-commerce mobile & web concept.
   - UX Process: User personas (target age 20-45), user flow mapping, wireframing, interactive Figma prototypes designed for frictionless, elegant online shopping.
3. Fix Georgia (GeorgiaFix) [Full-Stack / Front-End Project]:
   - Concept: Civic platform allowing citizens to quickly report urban infrastructure problems (damaged roads, faulty streetlights, garbage, park damages) to local municipalities.
   - Tech: Angular, HTML, CSS. Both Front-End and full Back-End/database architecture were independently engineered by Natia.
4. Singh Ice Cream:
   - Concept: Modern visual brand landing page. Built with HTML5, CSS3, Google Fonts, refined typography, and fluid micro-animations.
5. Hotel Reservation System:
   - Concept: Comprehensive booking platform with hotel search, room filtering, and reservation management. Built with HTML, CSS, JavaScript, and a custom backend/database.
6. Kitchen / Restaurant Platform:
   - Concept: Contemporary restaurant web platform with interactive dish menu, filtering, user registration, and online ordering flow. Built with HTML, CSS, JavaScript, and animations.
7. E-Commerce Shop:
   - Concept: Online digital electronics store (smartphones, laptops) built with Angular, HTML, and CSS. Features dynamic catalog filtering, product details, and registration flow.
8. Jobs Platform:
   - Concept: Modern employment portal customized from an AI foundation. Allows job seekers to search, filter, and apply for vacancies, and employers to post opportunities.
9. Kripto:
   - Concept: Cryptocurrency-themed web project combining modern visual aesthetics with an intuitive user interface.

=======================================================
CONTACT & SOCIAL PROFILES
=======================================================
- Email: natiakasaburi2001w@gmail.com
- GitHub: https://github.com/kasaburi
- LinkedIn: https://www.linkedin.com/in/natia-kasaburi-963009383/
- Location: Tbilisi, Georgia

=======================================================
CONVERSATIONAL BEHAVIOR & RULES
=======================================================
1. Language Fluency:
   - Always respond in the language used by the user.
   - If the user writes in Georgian (even if using Latin transliteration like "gamarjoba", "proeqtebi", "rogor xar"), respond in natural, grammatically correct, native Georgian (ქართულად).
   - If the user writes in English, reply in natural, professional English.
2. Natural Conversation & Tone:
   - Speak naturally and warmly, like an intelligent, articulate colleague.
   - Avoid repetitive cliches or boilerplate robotic intros on every turn.
   - Directness: Answer the user's question directly in the opening sentence before adding relevant details.
   - Adapt Length: For simple greetings or quick questions, reply in 1-2 friendly sentences. For technical or project requests, provide well-organized, readable responses with clean formatting.
3. Context Awareness & Continuity:
   - Use the conversation history to understand follow-ups, implicit subjects ("and the second one?", "what tech stack was used for it?", "tell me more about that").
   - If the user corrects you or specifies a preference, acknowledge and adapt immediately.
4. Boundaries & Factual Integrity:
   - You are KasCraft AI, Natia's assistant. Do not pretend to be Natia herself in first person (e.g., say "ნათიამ შექმნა...", "ნათია მუშაობს...", not "მე შევქმენი...").
   - Never fabricate non-existent work experience, external employers, or false phone numbers. Only share confirmed facts.`;

    // Format conversation history for Gemini API:
    // Gemini requires alternating roles (user -> model -> user -> model) and no empty turns.
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    // Keep the most recent 12 messages from history for rich context
    const recentHistory = history.slice(-12);

    for (const msg of recentHistory) {
      const role = msg.role === 'assistant' ? 'model' : 'user';
      const text = msg.text.trim();
      if (!text) continue;

      // Prevent consecutive identical roles
      const lastItem = contents[contents.length - 1];
      if (lastItem && lastItem.role === role) {
        lastItem.parts[0].text += `\n${text}`;
      } else {
        contents.push({
          role,
          parts: [{ text }]
        });
      }
    }

    // Append current user turn
    const lastContent = contents[contents.length - 1];
    if (lastContent && lastContent.role === 'user') {
      lastContent.parts[0].text = userText;
    } else {
      contents.push({
        role: 'user',
        parts: [{ text: userText }]
      });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    const body = {
      system_instruction: {
        parts: [{ text: systemPrompt }]
      },
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800
      }
    };

    const res: any = await firstValueFrom(
      this.http.post(url, body).pipe(timeout(12000))
    );

    const answer = res?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!answer) {
      throw new Error(`Empty response from ${modelName}`);
    }

    return answer.trim();
  }

  /**
   * Highly intelligent local knowledge engine.
   * Understands Georgian (both Mkhedruli & Latin transliteration), English, follow-up context,
   * specific projects, education, skills, and natural conversation without needing an external API key.
   */
  public getLocalSmartResponse(
    userText: string,
    lang: 'ka' | 'en',
    history: ChatMessage[] = []
  ): string {
    const raw = userText.trim();
    const lower = raw.toLowerCase();
    const translit = this.transliterateToGeorgian(lower);
    const combined = `${lower} ${translit}`;

    const hasGeorgian = /[ა-ჰ]/.test(raw);
    const isTranslit = !hasGeorgian && this.detectGeorgianTransliteration(lower);
    const isKa = hasGeorgian || isTranslit || (lang === 'ka');

    // Context from previous turn
    const prevTurn = this.findLastRelevantTopic(history);

    // 1. Greetings
    if (this.matchesAny(combined, [
      'გამარჯობა', 'სალამი', 'მოგესალმები', 'დილა მშვიდობისა', 'საღამო მშვიდობისა',
      'hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening',
      'gamarjoba', 'salami', 'mogesalmebit', 'privet'
    ])) {
      this.lastTopic = 'greeting';
      return isKa
        ? '👋 გამარჯობა! მე ვარ **KasCraft AI** — ნათია კასაბურის პორტფოლიოს ასისტენტი.\n\nრით შემიძლია დაგეხმაროთ? შემიძლია დეტალურად გიამბოთ მის პროექტებზე, Front-End და UI/UX უნარებზე, განათლებასა და საკონტაქტო ინფორმაციაზე 😊'
        : '👋 Hello! I am **KasCraft AI**, Natia Kasaburi\'s portfolio assistant.\n\nHow can I help you today? I can tell you about Natia\'s projects, frontend and UI/UX skills, education, or contact details 😊';
    }

    // 2. Small talk: "how are you", "who are you"
    if (this.matchesAny(combined, [
      'როგორ ხარ', 'რას შვრები', 'როგორ მიდის', 'rogor xar', 'ras shvrebi', 'how are you', 'how is it going'
    ])) {
      return isKa
        ? 'დიდი მადლობა, შესანიშნავად! მზად ვარ გაგაცნოთ ნათიას ნამუშევრები და პროფესიული გამოცდილება. რის შესახებ გსურთ გაგება — **პროექტების**, **დიზაინის** თუ **ტექნოლოგიების**?'
        : 'Thank you, I\'m doing great! Ready to guide you through Natia Kasaburi\'s creative work and technical experience. What would you like to explore — her **projects**, **UI/UX design**, or **tech stack**?';
    }

    // 3. Compliments & Gratitude
    if (this.matchesAny(combined, [
      'მადლობა', 'დიდი მადლობა', 'გმადლობ', 'ყოჩაღ', 'მაგარია', 'კარგია', 'მომეწონა', 'ლამაზია',
      'madloba', 'didi madloba', 'magaria', 'kargia', 'thanks', 'thank you', 'awesome', 'great', 'cool', 'nice work'
    ])) {
      return isKa
        ? 'არაფრის! მოხარული ვარ, თუ დაგეხმარეთ ✨ ნათია განსაკუთრებულ ყურადღებას უთმობს დეტალებს, კოდის სისუფთავესა და მომხმარებლის გამოცდილებას. თუ კიდევ რაიმე გაინტერესებთ, სიამოვნებით გიპასუხებთ!'
        : 'You\'re very welcome! Glad I could help ✨ Natia takes great care in crafting clean code, intuitive designs, and memorable user experiences. Let me know if you\'d like to know anything else!';
    }

    // 4. Farewells
    if (this.matchesAny(combined, [
      'ნახვამდის', 'კარგად', 'დროებით', 'naxvamdis', 'kargad', 'bye', 'goodbye', 'see you'
    ])) {
      return isKa
        ? 'ნახვამდის! სასიამოვნო დღეს გისურვებთ. ნათიასთან დაკავშირება ყოველთვის შეგიძლიათ მეილზე: **natiakasaburi2001w@gmail.com** 👋'
        : 'Goodbye! Have a wonderful day. You can always reach Natia via email at **natiakasaburi2001w@gmail.com** 👋';
    }

    // 5. Specific Projects Deep-Dives
    // Discover Georgia
    if (this.matchesAny(combined, ['discover', 'აღმოაჩინე საქართველო', 'ტურიზმ', 'მოგზაურობ', 'agmoachine', 'tourism'])) {
      this.lastTopic = 'project_discover_georgia';
      this.lastProject = 'Discover Georgia';
      return isKa
        ? `🇬🇪 **Discover Georgia (აღმოაჩინე საქართველო) — UI/UX Case Study**

• **იდეა:** ციფრული ტურისტული პლატფორმა, რომელიც აერთიანებს საქართველოს დამალულ ადგილებს, ადგილობრივ ბიზნესებსა და გამოცდილებებს ერთ სივრცეში.
• **მთავარი უპირატესობა:** საზოგადოებაზე დაფუძნებული მოდელი — მომხმარებლებს თავად შეუძლიათ ახალი ლოკაციების დამატება რუკაზე, ფოტოებისა და რეკომენდაციების გაზიარება.
• **ინკლუზიური ტურიზმი (Accessibility):** პლატფორმაზე განსაკუთრებული ყურადღება ეთმობა შშმ პირებისთვის ხელმისაწვდომობის ინფორმაციას (პანდუსები, ადაპტირებული სივრცეები).
• **ტიპოგრაფია & სტილი:** Inter, სუფთა ბუნებრივი ესთეტიკა და ინტუიციური ნავიგაცია.

დეტალური UI/UX ქეისი იხილეთ მენიუში **"დიზაინი"**!`
        : `🇬🇪 **Discover Georgia — UI/UX Case Study**

• **Concept:** A digital travel ecosystem uniting Georgia's hidden gems, local businesses, and community experiences in one platform.
• **Key Innovation:** Community-powered discovery — travelers can submit locations on a live map, upload photos, and share authentic recommendations.
• **Inclusive Tourism:** Features vital accessibility data for persons with disabilities (wheelchair ramps, accessible facilities, adapted spaces).
• **Design & Typography:** Inter font, modern spacious cards, and clear visual hierarchy.

Check out the full design showcase in the **Design** section!`;
    }

    // Elora
    if (this.matchesAny(combined, ['elora', 'ელორა', 'პარფიუმერი', 'სუნამო', 'beauty', 'fashion'])) {
      this.lastTopic = 'project_elora';
      this.lastProject = 'Elora';
      return isKa
        ? `✨ **Elora — Fashion & Perfume UI/UX Case Study**

• **მიმართულება:** პრემიუმ მოდის, სილამაზისა და პარფიუმერიის ონლაინ მაღაზიის კონცეფცია.
• **UX პროცესი:** სამიზნე აუდიტორიის კვლევა (User Persona: 20–45 წელი), მომხმარებლის გზის (User Flow) დაგეგმვა და მარტივი შესყიდვის ნაკადის შექმნა.
• **დიზაინი:** მინიმალისტური, ელეგანტური ვიზუალური სტილი, ფერთა ჰარმონიული პალიტრა და ინტერაქტიული Figma პროტოტიპი.
• **მიზანი:** მომხმარებლისთვის სასურველი პროდუქტის უსწრაფესი აღმოჩენა და მარტივი შეკვეთა.

პროექტის ინტერაქტიული პროტოტიპი იხილეთ მენიუში **"დიზაინი"**!`
        : `✨ **Elora — Fashion & Perfume UI/UX Case Study**

• **Domain:** Premium beauty, fragrance, and fashion e-commerce experience.
• **UX Process:** User research targeting a 20–45 demographic, user journey mapping, and a frictionless checkout flow.
• **Design System:** Elegant typography, sophisticated color palette, and high-fidelity interactive Figma prototypes.
• **Objective:** Making luxury product discovery effortless and delightful.

Explore the case study in the **Design** section!`;
    }

    // Fix Georgia (GeorgiaFix)
    if (this.matchesAny(combined, ['fix', 'ფიქს', 'ფიქს ჯორჯია', 'გზები', 'მუნიციპალიტეტ', 'urban', 'infrastructure'])) {
      this.lastTopic = 'project_fix_georgia';
      this.lastProject = 'Fix Georgia';
      return isKa
        ? `🛠️ **Fix Georgia (GeorgiaFix) — ურბანული ინფრასტრუქტურის პლატფორმა**

• **იდეა:** ციფრული სერვისი, რომლითაც მოქალაქეებს შეუძლიათ სწრაფად და მარტივად აცნობონ მუნიციპალიტეტს ურბანული პრობლემების შესახებ (დაზიანებული გზები, გაუმართავი განათება, ნაგვის დაგროვება, დაზიანებული სკვერები).
• **ტექნოლოგიური სტეკი:**
  - **Front-End:** Angular, HTML5, CSS
  - **Back-End & Database:** სრულად ნათიას მიერ დამოუკიდებლად შემუშავებული სერვერული არქიტექტურა და მონაცემთა ბაზა.
• **შედეგი:** სწრაფი, საიმედო და მოქალაქეებზე მორგებული ინტერფეისი პრობლემების აღსარიცხად.`
        : `🛠️ **Fix Georgia (GeorgiaFix) — Civic Urban Platform**

• **Concept:** A digital platform enabling citizens to report civic infrastructure issues (potholes, broken street lights, waste accumulation, park damages) directly to local municipalities.
• **Architecture:**
  - **Front-End:** Angular, HTML5, CSS3/SCSS
  - **Back-End & DB:** Custom backend architecture and database independently developed by Natia.
• **Outcome:** A fast, intuitive, and responsive platform facilitating swift municipal problem resolution.`;
    }

    // Singh Ice Cream
    if (this.matchesAny(combined, ['singh', 'აის კრიმ', 'ნაყინ', 'ice cream'])) {
      this.lastTopic = 'project_singh';
      this.lastProject = 'Singh Ice Cream';
      return isKa
        ? `🍦 **Singh Ice Cream — Landing Page**

• **მიმართულება:** თანამედროვე, ფერადი და ვიზუალურად მიმზიდველი სარეკლამო ვებსაიტი.
• **ტექნოლოგიები:** HTML5, CSS3, Google Fonts, რესპონსიული Flexbox/Grid განლაგება.
• **დეტალები:** დახვეწილი ტიპოგრაფია, მიკრო-ინტერაქციები და მსუბუქი სითხისებრი ანიმაციები, რაც პროდუქტის პრეზენტაციას განსაკუთრებულ ხიბლს სძენს.`
        : `🍦 **Singh Ice Cream — Landing Page**

• **Concept:** A vibrant, eye-catching landing page showcasing artisanal ice cream flavors.
• **Tech Stack:** HTML5, modern CSS3 animations, Google Fonts, responsive layouts.
• **Highlights:** Fluid micro-interactions, delightful typography, and a fresh visual palette.`;
    }

    // Hotel Reservation
    if (this.matchesAny(combined, ['hotel', 'სასტუმრო', 'დაჯავშნ', 'booking', 'reservation'])) {
      this.lastTopic = 'project_hotel';
      this.lastProject = 'Hotel Reservation';
      return isKa
        ? `🏨 **Hotel Reservation Platform**

• **იდეა:** სასტუმროების ძიებისა და ოთახების დაჯავშნის სრული ფუნქციონალური სისტემა.
• **ტექნოლოგიები:** HTML5, CSS3, JavaScript (ES6+), დამოუკიდებლად აწყობილი Backend და მონაცემთა ბაზა.
• **ფუნქციონალი:** ოთახების დინამიური ფილტრაცია ფასისა და კატეგორიის მიხედვით, დაჯავშნის ფორმა და ჯავშნების მართვა.`
        : `🏨 **Hotel Reservation Platform**

• **Concept:** Full-flow hotel discovery and room booking web application.
• **Tech Stack:** HTML5, CSS3, JavaScript (ES6+), with a custom backend and database built by Natia.
• **Features:** Dynamic room filtering, live availability search, reservation flow, and booking status management.`;
    }

    // Restaurant / Kitchen
    if (this.matchesAny(combined, ['restoran', 'kitchen', 'რესტორ', 'საკვებ', 'კერძ', 'food', 'menu'])) {
      this.lastTopic = 'project_restaurant';
      this.lastProject = 'Kitchen Restaurant';
      return isKa
        ? `🍽️ **Restaurant Platform (Kitchen)**

• **იდეა:** რესტორნის ინტერაქტიული ვებსაიტი მენიუს დათვალიერებითა და ონლაინ შეკვეთით.
• **ტექნოლოგიები:** HTML5, CSS, JavaScript, Google Fonts.
• **ფუნქციონალი:** კერძების კატეგორიზაცია, ინგრედიენტებისა და ფასების ფილტრაცია, ავტორიზაცია და შეკვეთის გაფორმება.`
        : `🍽️ **Restaurant Platform (Kitchen)**

• **Concept:** Interactive dining platform with a digital menu and online ordering flow.
• **Tech Stack:** HTML5, CSS3, JavaScript, custom animations, Google Fonts.
• **Features:** Category filtering, dish customization, user registration, and streamlined checkout.`;
    }

    // E-Commerce Shop
    if (this.matchesAny(combined, ['shop', 'მაღაზი', 'ტექნიკ', 'ტელეფონ', 'ნოუთბუქ', 'store', 'ecommerce'])) {
      this.lastTopic = 'project_shop';
      this.lastProject = 'E-Commerce Shop';
      return isKa
        ? `🛍️ **E-Commerce Shop (ტექნიკის ონლაინ მაღაზია)**

• **ტექნოლოგიები:** Angular, HTML5, CSS3, Google Fonts.
• **ფუნქციონალი:** სმარტფონებისა და ნოუთბუქების კატალოგი, დინამიური ფილტრები, კალათა და რეგისტრაციის პროცესი შეკვეთის გასაფორმებლად.`
        : `🛍️ **E-Commerce Shop**

• **Tech Stack:** Angular, HTML5, CSS3, Google Fonts.
• **Features:** Device catalog (smartphones, laptops), dynamic product filtering, cart management, and user authentication flow.`;
    }

    // Jobs Platform (specific project)
    if (this.matchesAny(combined, ['jobs platform', 'პროექტი jobs', 'jobs პროექტი', 'დასაქმების პლატფორმ', 'ვაკანსიების პლატფორმ'])) {
      this.lastTopic = 'project_jobs';
      this.lastProject = 'Jobs Platform';
      return isKa
        ? `💼 **Jobs Platform — თანამედროვე დასაქმების პორტალი**

• **იდეა:** AI-ის დახმარებით შექმნილი პლატფორმა, რომლის დიზაინი, ინტერფეისი და ვიზუალური სტილი ნათიამ საკუთარი ხედვის მიხედვით გააუმჯობესა.
• **ფუნქციონალი:** ვაკანსიების ძიება და გაფილტვრა, რეზიუმეს გაგზავნა, პოზიციების შენახვა და დამსაქმებლებისთვის ვაკანსიების გამოქვეყნება.`
        : `💼 **Jobs Platform — Employment Portal**

• **Concept:** Modern hiring portal customized and refined by Natia from an AI foundation.
• **Features:** Job search and multi-criteria filtering, candidate applications, saved positions, and employer job posting.`;
    }

    // Kripto
    if (this.matchesAny(combined, ['kripto', 'crypto', 'კრიპტო'])) {
      this.lastTopic = 'project_kripto';
      this.lastProject = 'Kripto';
      return isKa
        ? `🪙 **Kripto — თანამედროვე კრიპტო ვებპროექტი**

• **იდეა:** AI შესაძლებლობების ინტეგრაციით შექმნილი კრიპტოვალუტის თემატიკის ვებსაიტი.
• **ფოკუსი:** თანამედროვე ვიზუალური დიზაინი, მუქი თემატიკა და მომხმარებელზე ორიენტირებული ინტერფეისი.`
        : `🪙 **Kripto — Crypto Web Project**

• **Concept:** Cryptocurrency web showcase developed with AI assistance and refined UI design.
• **Focus:** Sleek dark aesthetics, high visual contrast, and user-centered layout design.`;
    }

    // 6. Follow-up: "tell me more", "what tech was used", "and the other one?"
    if (this.matchesAny(combined, [
      'დაწვრილებით', 'უფრო ვრცლად', 'გააგრძელე', 'კიდევ რა', 'რა ტექნოლოგიებით', 'როგორ გააკეთა',
      'more', 'continue', 'tell me more', 'elaborate', 'what tech', 'technologies used'
    ])) {
      if (this.lastProject) {
        return isKa
          ? `პროექტი **${this.lastProject}** ნათიამ შექმნა დეტალებზე ორიენტირებული მიდგომით — განსაკუთრებული ყურადღება დაეთმო რესპონსიულობას, კოდის სტრუქტურასა და ინტუიციურ UI-ს.\n\nგსურთ გაეცნოთ სხვა პროექტებს, მაგალითად **Fix Georgia**-ს, **Elora**-ს თუ **Discover Georgia**-ს?`
          : `For **${this.lastProject}**, Natia focused heavily on responsive layouts, clean code structure, and intuitive UI interactions.\n\nWould you like to explore other projects like **Fix Georgia**, **Elora**, or **Discover Georgia**?`;
      }
    }

    // 7. Education, Courses & Training
    if (this.matchesAny(combined, [
      'სწავლ', 'განათლებ', 'კურს', 'სერტიფიკატ', 'სად ისწავლა', 'step', 'educity',
      'education', 'courses', 'certificates', 'study', 'learned', 'university'
    ])) {
      this.lastTopic = 'education';
      return isKa
        ? `🎓 **ნათია ყასაბურის განათლება და კურსები:**

1. 💻 **IT Academy STEP (Front-End Development):**
   - შეისწავლა HTML5, CSS3, JavaScript (ES6+) და Angular.
   - დაეუფლა რესპონსიულ დეველოპმენტს, ვებ-სტანდარტებსა და პრაქტიკულ პროექტებზე მუშაობას.

2. 🎨 **EduCity (UI/UX Design):**
   - წარმატებით გაიარა UI/UX გადამზადების პროგრამა.
   - გუნდთან ერთად იმუშავა პროექტზე „შექმენი შენი ციფრული ქალაქი“ და მიიღო პროფესიული სერტიფიკატი.
   - დაეუფლა User Persona-ს, User Flow-ს, Wireframe-ებსა და Figma-ში ინტერაქტიულ პროტოტიპირებას.

3. 🤖 **AI Workflow Integration:**
   - აქტიურად იყენებს თანამედროვე AI ხელსაწყოებს კოდის ოპტიმიზაციის, იდეების გენერირებისა და სამუშაო პროცესის დაჩქარებისთვის.`
        : `🎓 **Natia Kasaburi\'s Education & Certifications:**

1. 💻 **IT Academy STEP (Front-End Development):**
   - Completed professional training in HTML5, CSS3, modern JavaScript, and Angular.
   - Developed hands-on experience building interactive web applications and responsive interfaces.

2. 🎨 **EduCity (UI/UX Design):**
   - Completed the UI/UX design specialization program and earned a professional certificate.
   - Collaborated in a team on the "Create Your Digital City" project, mastering User Personas, User Flows, wireframing, and interactive Figma prototyping.

3. 🤖 **AI-Augmented Development:**
   - Proficient in leveraging modern AI tools to accelerate development workflows and ideate creative UI solutions.`;
    }

    // 8. Career Goals & Hiring Opportunities
    if (this.matchesAny(combined, [
      'ვაკანსი', 'სამსახურ', 'მუშაობ', 'ფრილანს', 'სტაჟირებ', 'ჰაირ', 'შეთავაზებ',
      'job', 'hire', 'career', 'freelance', 'internship', 'open to work', 'available', 'opportunity'
    ])) {
      this.lastTopic = 'career_goal';
      return isKa
        ? `🚀 **კარიერული მიზნები და თანამშრომლობა:**

ნათია აქტიურად ეძებს შესაძლებლობებს:
• **Junior Front-End Developer** ან **Junior UI/UX Designer**-ის პოზიციაზე.
• ღიაა როგორც სრული განაკვეთის (Full-Time), ასევე ნახევარ განაკვეთისა (Part-Time) და სტაჟირების შემოთავაზებებისთვის.
• იღებს **ფრილანს შეკვეთებს** თანამედროვე ვებსაიტების შექმნასა და UI/UX დიზაინზე.

დაკავშირება შესაძლებელია მეილზე: **natiakasaburi2001w@gmail.com** ან [LinkedIn პროფილზე](https://www.linkedin.com/in/natia-kasaburi-963009383/) 🤝`
        : `🚀 **Career Goals & Collaboration:**

Natia is actively open to opportunities as:
• **Junior Front-End Developer** or **Junior UI/UX Designer**.
• Open to full-time roles, part-time positions, internships, and dynamic team collaborations.
• Also available for **freelance projects** in web development and Figma UI/UX design.

Get in touch directly at **natiakasaburi2001w@gmail.com** or via [LinkedIn](https://www.linkedin.com/in/natia-kasaburi-963009383/) 🤝`;
    }

    // 9. All Projects Overview
    if (this.matchesAny(combined, [
      'პროექტ', 'ნამუშევარ', 'ყველა პროექტი', 'რა გააკეთა', 'portfolio', 'projects', 'works', 'case studies', 'proeqtebi'
    ])) {
      this.lastTopic = 'all_projects';
      return isKa
        ? `🚀 **ნათია ყასაბურის პორტფოლიოს პროექტები:**

🎨 **UI/UX Case Studies:**
1. **Discover Georgia (აღმოაჩინე საქართველო)** — ტურიზმისა და ინკლუზიური მოგზაურობის პლატფორმა.
2. **Elora** — სუნამოებისა და მოდის ელეგანტური ონლაინ მაღაზიის UI/UX ქეისი.

💻 **Front-End & Web Applications:**
3. **Fix Georgia (GeorgiaFix)** — ურბანული პრობლემების შეტყობინების პლატფორმა (Angular + დამოუკიდებელი Backend).
4. **Singh Ice Cream** — თანამედროვე სარეკლამო landing page HTML/CSS ანიმაციებით.
5. **Hotel Reservation** — სასტუმროების დაჯავშნის სრული სისტემა (HTML/CSS/JS + Backend).
6. **Kitchen / Restaurant** — რესტორნის ვებსაიტი მენიუთი და ონლაინ შეკვეთით.
7. **E-Commerce Shop** — ტექნიკის ონლაინ მაღაზია Angular-ზე.
8. **Jobs Platform** — დასაქმების თანამედროვე პორტალი.
9. **Kripto** — კრიპტოვალუტის თანამედროვე ვებგვერდი.

რომელიმე კონკრეტული პროექტის დეტალები გაინტერესებთ? მკითხეთ, მაგალითად: *"მომიყევი Elora-ზე"* ან *"Fix Georgia რას აკეთებს?"*`
        : `🚀 **Natia Kasaburi\'s Portfolio Projects:**

🎨 **UI/UX Case Studies:**
1. **Discover Georgia** — Tourism ecosystem featuring community discovery and accessible travel.
2. **Elora** — High-end perfume and fashion e-commerce design case study.

💻 **Front-End Web Applications:**
3. **Fix Georgia (GeorgiaFix)** — Civic infrastructure issue tracker (Angular + custom Backend).
4. **Singh Ice Cream** — Modern landing page with fluid CSS animations.
5. **Hotel Reservation** — Hotel booking flow with custom backend & filtering.
6. **Kitchen Restaurant** — Dynamic menu ordering platform.
7. **E-Commerce Shop** — Electronics online store built with Angular.
8. **Jobs Platform** — Employment board with vacancy search.
9. **Kripto** — Modern cryptocurrency web project.

Interested in a specific one? Ask me, for example: *"Tell me about Elora"* or *"What is Fix Georgia?"*`;
    }

    // 10. UI/UX Design Skills
    if (this.matchesAny(combined, ['ui', 'ux', 'დიზაინ', 'figma', 'ფიგმა', 'wireframe', 'prototype', 'design'])) {
      this.lastTopic = 'skills_uiux';
      return isKa
        ? `🎨 **UI/UX დიზაინის უნარები და გამოცდილება:**

• **Figma:** Wireframing, High-Fidelity UI დიზაინი, ინტერაქტიული პროტოტიპირება და კომპონენტების ბიბლიოთეკები.
• **UX Research:** User Personas, User Flows, მომხმარებლის გზის ანალიზი და ინფორმაციული არქიტექტურა.
• **დიზაინ-სისტემები:** ფერთა პალიტრები, ტიპოგრაფიული მასშტაბები და WCAG AA კონტრასტი.
• **ინკლუზიური დიზაინი:** განსაკუთრებული ყურადღება ხელმისაწვდომობასა და მარტივ ნავიგაციაზე (მაგალითად, Discover Georgia პროექტში).
• **საკვანძო UI/UX ქეისები:** **Discover Georgia** და **Elora** (იხილეთ მენიუში "დიზაინი").`
        : `🎨 **UI/UX Design Skills & Experience:**

• **Figma:** Wireframing, high-fidelity UI design, component systems, and interactive prototypes.
• **UX Research:** User personas, user journey mapping, information architecture, and behavioral flows.
• **Design Systems:** Scalable typography, accessible color theory (WCAG AA), and responsive layout grids.
• **Accessibility:** Special focus on inclusive and universal design (as featured in Discover Georgia).
• **Key Projects:** **Discover Georgia** and **Elora** (viewable in the "Design" section).`;
    }

    // 11. Front-End & Tech Stack Skills
    if (this.matchesAny(combined, [
      'ტექნოლოგი', 'უნარ', 'სტეკ', 'სკილ', 'ფრონტენდ', 'angular', 'typescript', 'javascript', 'html', 'css',
      'skills', 'tech', 'stack', 'frontend', 'developer'
    ])) {
      this.lastTopic = 'skills_frontend';
      return isKa
        ? `💻 **ნათია ყასაბურის ტექნოლოგიური სტეკი:**

⚡ **Front-End Development:**
• **Angular** (v20+, Standalone Components, Signals, RxJS, Declarative Routing)
• **TypeScript** & Modern **JavaScript (ES6+)**
• **HTML5 & CSS3/SCSS** (Flexbox, CSS Grid, Responsive Web Design, Animations)
• **REST API** ინტეგრაცია და მონაცემთა მართვა

🎨 **UI/UX Design:**
• **Figma**, Wireframing, Interactive Prototyping, Design Systems

🛠️ **ხელსაწყოები & დევლოპმენტი:**
• Git, GitHub, Vercel, VS Code, AI Developer Tools`
        : `💻 **Natia Kasaburi\'s Tech Stack & Skills:**

⚡ **Front-End Development:**
• **Angular** (v20+, Standalone Components, Signals, RxJS, Declarative Routing)
• **TypeScript** & Modern **JavaScript (ES6+)**
• **HTML5 & CSS3/SCSS** (Flexbox, CSS Grid, Mobile-First Responsive Design)
• **REST API** Integration and state management

🎨 **UI/UX Design:**
• **Figma**, Wireframing, High-Fidelity Prototyping, Design Systems

🛠️ **Workflow & Tooling:**
• Git, GitHub, Vercel, VS Code, AI Developer Tools`;
    }

    // 12. Contact Details & Social Links
    if (this.matchesAny(combined, [
      'კონტაქტ', 'მეილ', 'დაკავშირ', 'დაუკავშირ', 'დავუკავშირ', 'სად არის', 'თბილის', 'სოციალურ',
      'contact', 'email', 'linkedin', 'github', 'reach', 'location', 'daukavshir', 'davkavshir', 'kontaqt', 'dakavshir'
    ])) {
      this.lastTopic = 'contact';
      return isKa
        ? `📬 **როგორ დაუკავშირდეთ ნათია ყასაბურს:**

• ✉️ **Email:** [natiakasaburi2001w@gmail.com](mailto:natiakasaburi2001w@gmail.com)
• 💼 **LinkedIn:** [Natia Kasaburi](https://www.linkedin.com/in/natia-kasaburi-963009383/)
• 🐙 **GitHub:** [github.com/kasaburi](https://github.com/kasaburi)
• 📍 **ლოკაცია:** თბილისი, საქართველო

ნათია სიამოვნებით უპასუხებს თქვენს შეტყობინებას თანამშრომლობისა თუ ვაკანსიის შესახებ!`
        : `📬 **Contact Natia Kasaburi:**

• ✉️ **Email:** [natiakasaburi2001w@gmail.com](mailto:natiakasaburi2001w@gmail.com)
• 💼 **LinkedIn:** [Natia Kasaburi](https://www.linkedin.com/in/natia-kasaburi-963009383/)
• 🐙 **GitHub:** [github.com/kasaburi](https://github.com/kasaburi)
• 📍 **Location:** Tbilisi, Georgia

Feel free to connect regarding job opportunities, freelance work, or project inquiries!`;
    }

    // 13. General "Who is Natia" / About
    if (this.matchesAny(combined, ['ვინ არის', 'ნათია', 'ჩემს შესახებ', 'who is', 'about natia', 'kascraft', 'visia'])) {
      this.lastTopic = 'general_bio';
      return isKa
        ? `👋 **ნათია ყასაბური — Front-End Developer & UI/UX Designer**

ნათია არის დამწყები დეველოპერი და დიზაინერი თბილისიდან. მას გავლილი აქვს **IT Academy STEP** (Front-End) და **EduCity** (UI/UX) გადამზადების პროგრამები.

ის ქმნის სწრაფ, რესპონსიულ ვებ-აპლიკაციებს **Angular**-ითა და თანამედროვე ტექნოლოგიებით, ხოლო **Figma**-ში აპროექტებს მომხმარებელზე ორიენტირებულ, ინტუიციურ ინტერფეისებს.

გსურთ გაეცნოთ მის **პროექტებს**, **უნარებს** თუ **საკონტაქტო ინფორმაციას**?`
        : `👋 **Natia Kasaburi — Front-End Developer & UI/UX Designer**

Natia is a Junior Front-End Developer and UI/UX Designer based in Tbilisi, Georgia. She completed specialized training at **IT Academy STEP** (Front-End Development) and **EduCity** (UI/UX Design).

She crafts modern, responsive web applications using **Angular** and clean CSS/HTML, while designing user-centered interfaces in **Figma**.

Would you like to explore her **projects**, **skills**, or **contact details**?`;
    }

    // 14. Contextual Adaptive Fallback
    return isKa
      ? `გამარჯობა! მე ვარ KasCraft AI. სიამოვნებით გიამბობთ ნათია ყასაბურის შესახებ:

• 🚀 **პროექტები** — Discover Georgia, Elora, Fix Georgia, Singh Ice Cream და სხვა
• 💻 **ტექნოლოგიები** — Angular 20, TypeScript, JavaScript, CSS3/SCSS, REST API
• 🎨 **UI/UX დიზაინი** — Figma, Wireframing, Prototyping, Design Systems
• 🎓 **განათლება** — IT Academy STEP & EduCity სერტიფიკატები
• 📬 **კონტაქტი** — ელ-ფოსტა და LinkedIn თანამშრომლობისთვის

ასევე, ზედა მარჯვენა პარამეტრების ღილაკით (⚙️) შეგიძლიათ ჩართოთ საკუთარი **Google Gemini API Key** შეუზღუდავი გენერაციული საუბრისთვის!`
      : `Hello! I am KasCraft AI. I\'d love to help you discover Natia Kasaburi\'s portfolio:

• 🚀 **Featured Projects** — Discover Georgia, Elora, Fix Georgia, Singh Ice Cream, and more
• 💻 **Tech Stack** — Angular 20, TypeScript, JavaScript, CSS3/SCSS, REST APIs
• 🎨 **UI/UX Design** — Figma, Wireframing, Interactive Prototypes, Design Systems
• 🎓 **Education** — IT Academy STEP & EduCity certificates
• 📬 **Contact** — Email & LinkedIn for collaboration opportunities

You can also configure your own **Google Gemini API Key** via the settings icon (⚙️) for full generative conversation!`;
  }

  /**
   * Helper to check if text contains any of the target tokens.
   * For short words (length <= 3, e.g. 'hi', 'hey', 'job', 'ui'), requires word boundary
   * to avoid false positive substring matches inside longer words (e.g. 'hi' inside 'daukavshirde').
   */
  private matchesAny(text: string, tokens: string[]): boolean {
    return tokens.some(token => {
      const lowerToken = token.toLowerCase();
      if (lowerToken.length <= 3) {
        const regex = new RegExp(`(^|[^a-zA-Z0-9ა-ჰ])${lowerToken}([^a-zA-Z0-9ა-ჰ]|$)`, 'i');
        return regex.test(text);
      }
      return text.includes(lowerToken);
    });
  }

  /**
   * Translates Latin-script Georgian transliteration into Mkhedruli script
   * to understand informal messages like "gamarjoba", "proeqtebi", "rogor xar", "contact".
   */
  private transliterateToGeorgian(text: string): string {
    const multiMap: Array<[RegExp, string]> = [
      [/sh/g, 'შ'],
      [/ch/g, 'ჩ'],
      [/ts/g, 'ც'],
      [/dz/g, 'ძ'],
      [/zh/g, 'ჟ'],
      [/kh/g, 'ხ'],
      [/gh/g, 'ღ']
    ];

    let result = text;
    for (const [pattern, replacement] of multiMap) {
      result = result.replace(pattern, replacement);
    }

    const singleMap: Record<string, string> = {
      a: 'ა', b: 'ბ', g: 'გ', d: 'დ', e: 'ე', v: 'ვ', z: 'ზ',
      t: 'თ', i: 'ი', k: 'კ', l: 'ლ', m: 'მ', n: 'ნ', o: 'ო',
      p: 'პ', r: 'რ', s: 'ს', u: 'უ', f: 'ფ', q: 'ქ', w: 'წ',
      x: 'ხ', y: 'ყ', c: 'ც', j: 'ჯ', h: 'ჰ'
    };

    return result.split('').map(char => singleMap[char] || char).join('');
  }

  /**
   * Detects if an English/Latin text represents Georgian transliteration.
   */
  private detectGeorgianTransliteration(text: string): boolean {
    const commonTranslitWords = [
      'gamarjoba', 'salami', 'rogor', 'xar', 'proeqti', 'proeqtebi',
      'visia', 'madloba', 'kargi', 'didi', 'mitxari', 'ras', 'aketeb',
      'shemidzlia', 'daukavshirde', 'vakansia'
    ];
    return commonTranslitWords.some(w => text.includes(w));
  }

  /**
   * Inspects recent conversation history to identify the last discussed subject.
   */
  private findLastRelevantTopic(history: ChatMessage[]): ConversationTopic {
    if (!history || history.length === 0) {
      return this.lastTopic;
    }

    const recent = history.slice(-4);
    for (let i = recent.length - 1; i >= 0; i--) {
      const msg = recent[i].text.toLowerCase();
      if (msg.includes('discover') || msg.includes('აღმოაჩინე')) return 'project_discover_georgia';
      if (msg.includes('elora') || msg.includes('ელორა')) return 'project_elora';
      if (msg.includes('fix') || msg.includes('ფიქს')) return 'project_fix_georgia';
      if (msg.includes('singh')) return 'project_singh';
      if (msg.includes('hotel') || msg.includes('სასტუმრო')) return 'project_hotel';
      if (msg.includes('kitchen') || msg.includes('რესტორან')) return 'project_restaurant';
      if (msg.includes('education') || msg.includes('სწავლ') || msg.includes('step')) return 'education';
      if (msg.includes('contact') || msg.includes('კონტაქტ') || msg.includes('მეილ')) return 'contact';
      if (msg.includes('skill') || msg.includes('ტექნოლოგი')) return 'skills_frontend';
    }

    return this.lastTopic;
  }

  /**
   * Generate UI/UX Design Concept & Color Palette
   * (Preserved existing capability)
   */
  public async generateDesignConcept(
    projectName: string,
    projectType: string,
    mood: string,
    notes: string,
    currentLang: 'ka' | 'en' = 'ka'
  ): Promise<DesignConcept> {
    const key = this.apiKey();

    if (key) {
      try {
        return await this.callGeminiDesignConcept(projectName, projectType, mood, notes, key, currentLang);
      } catch (err) {
        console.warn('Gemini design generation failed, using smart generator:', err);
      }
    }

    return this.getLocalDesignConcept(projectName, projectType, mood, currentLang);
  }

  private async callGeminiDesignConcept(
    projectName: string,
    projectType: string,
    mood: string,
    notes: string,
    apiKey: string,
    lang: 'ka' | 'en'
  ): Promise<DesignConcept> {
    const prompt = `You are an expert UI/UX Design System Architect at KasCraft studio.
Generate a structured design concept for a project with the following details:
- Project Name: ${projectName || 'Modern Digital Product'}
- Project Type: ${projectType}
- Mood / Aesthetic: ${mood}
- Additional Notes: ${notes || 'None'}
- Language: ${lang === 'ka' ? 'Georgian' : 'English'}

You MUST output ONLY a valid JSON object strictly matching this TypeScript interface (no markdown fences, no explanation, just raw JSON):
{
  "projectName": "${projectName || 'KasCraft Project'}",
  "tagline": "A compelling 1-line design punchline",
  "palette": [
    { "name": "Primary Accent", "hex": "#...", "role": "Dominant brand color" },
    { "name": "Secondary Accent", "hex": "#...", "role": "Call-to-action & highlights" },
    { "name": "Dark Neutral / Background", "hex": "#...", "role": "Deep background or dark elements" },
    { "name": "Surface / Card", "hex": "#...", "role": "Card backgrounds and containers" },
    { "name": "Text Light / Border", "hex": "#...", "role": "Borders and contrast typography" }
  ],
  "typography": {
    "heading": "Recommended Google Font for Headings (e.g. Syne, Instrument Sans, Figtree, Plus Jakarta Sans)",
    "body": "Recommended Google Font for Body text (e.g. Inter, Figtree, Roboto)",
    "note": "Brief typography hierarchy tip"
  },
  "layoutHighlights": [
    "3-4 concrete UI structure highlights (e.g., Hero section with floating cards, Sticky glassmorphic navigation)"
  ],
  "uxFeatures": [
    "3-4 thoughtful UX micro-interactions or accessibility enhancements"
  ],
  "techStack": [
    "Angular 20 Standalone Components",
    "Modern CSS Glassmorphism & Custom Properties",
    "Lucide Icons",
    "Figma Design System"
  ]
}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const body = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.8,
        responseMimeType: 'application/json'
      }
    };

    const res: any = await firstValueFrom(this.http.post(url, body).pipe(timeout(10000)));
    const raw = res?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!raw) throw new Error('Empty response');

    return JSON.parse(raw);
  }

  private getLocalDesignConcept(
    projectName: string,
    projectType: string,
    mood: string,
    lang: 'ka' | 'en'
  ): DesignConcept {
    const isKa = lang === 'ka';
    const name = projectName.trim() || (isKa ? 'KasCraft ციფრული პროდუქტი' : 'KasCraft Digital Experience');

    const palettes: Record<string, DesignPaletteColor[]> = {
      minimal: [
        { name: 'Midnight', hex: '#0B0F19', role: isKa ? 'ძირითადი მუქი ფონი' : 'Primary dark background' },
        { name: 'Electric Violet', hex: '#818CF8', role: isKa ? 'მთავარი აქცენტი და ღილაკები' : 'Primary accent and buttons' },
        { name: 'Elevated Surface', hex: '#171E2E', role: isKa ? 'ბარათებისა და პანელების ფონი' : 'Cards and panels' },
        { name: 'Bright Cyan', hex: '#22D3EE', role: isKa ? 'ჰოვერი და ინტერაქტიული დეტალები' : 'Hover and interactive elements' },
        { name: 'Primary Text', hex: '#F8FAFC', role: isKa ? 'მთავარი ტექსტი' : 'Primary text' },
        { name: 'Secondary Text', hex: '#CBD5E1', role: isKa ? 'მეორეული ტექსტი და აღწერები' : 'Secondary text and descriptions' },
        { name: 'Subtle Border', hex: '#334155', role: isKa ? 'ბარათების საზღვრები' : 'Card borders' }
      ],
      luxury: [
        { name: 'Obsidian', hex: '#09090B', role: isKa ? 'ღრმა შავი ფონი' : 'Deep black background' },
        { name: 'Royal Gold', hex: '#F0CC65', role: isKa ? 'ოქროსფერი აქცენტი და ღილაკები' : 'Gold accent and buttons' },
        { name: 'Charcoal Surface', hex: '#18181B', role: isKa ? 'ბარათებისა და პანელების ფონი' : 'Cards and panels' },
        { name: 'Champagne Glow', hex: '#FDE68A', role: isKa ? 'ნაზი განათება და ჰოვერი' : 'Soft glow and hover' },
        { name: 'Ivory White', hex: '#FAFAF9', role: isKa ? 'მთავარი ტექსტი' : 'Primary text' },
        { name: 'Muted Silver', hex: '#D4D4D8', role: isKa ? 'მეორეული ტექსტი' : 'Secondary text' },
        { name: 'Gold Border', hex: '#57503B', role: isKa ? 'დახვეწილი საზღვრები' : 'Subtle borders' }
      ],
      vibrant: [
        { name: 'Deep Indigo', hex: '#0B1020', role: isKa ? 'ძირითადი მუქი ფონი' : 'Primary dark background' },
        { name: 'Neon Coral', hex: '#FF7777', role: isKa ? 'მთავარი აქცენტი და CTA ღილაკები' : 'Primary accent and CTA buttons' },
        { name: 'Sunset Amber', hex: '#FDBA74', role: isKa ? 'დამატებითი აქცენტი' : 'Secondary accent' },
        { name: 'Slate Surface', hex: '#182235', role: isKa ? 'ბარათებისა და კონტეინერების ფონი' : 'Cards and containers' },
        { name: 'Bright White', hex: '#FFFFFF', role: isKa ? 'მთავარი ტექსტი' : 'Primary text' },
        { name: 'Soft Slate', hex: '#CBD5E1', role: isKa ? 'მეორეული ტექსტი' : 'Secondary text' },
        { name: 'Border Slate', hex: '#3B4A63', role: isKa ? 'ბარათებისა და ელემენტების საზღვრები' : 'Element borders' }
      ]
    };

    const normalizedMood = mood.toLowerCase();
    const chosenKey = normalizedMood.includes('lux')
      ? 'luxury'
      : normalizedMood.includes('vibr') || normalizedMood.includes('color')
      ? 'vibrant'
      : 'minimal';

    return {
      projectName: name,
      tagline: isKa
        ? `თანამედროვე ${projectType}-ის UI/UX არქიტექტურა და დახვეწილი ვიზუალური გამოცდილება`
        : `Modern UI/UX architecture and refined visual experience for ${projectType}`,
      palette: palettes[chosenKey],
      typography: {
        heading: 'Figtree & Instrument Sans',
        body: 'Figtree (300, 400, 500, 600, 700)',
        note: isKa
          ? 'მკაფიო ტიპოგრაფიული იერარქია, ნათელი სათაურები და ადვილად წასაკითხი ტექსტი მუქ ფონზე'
          : 'Clear typographic hierarchy, bright headings, and readable body text on dark backgrounds'
      },
      layoutHighlights: isKa
        ? [
            'თანამედროვე Hero სექცია მკაფიო სათაურითა და გამოკვეთილი CTA ღილაკით',
            'Glassmorphism ნავიგაცია ზომიერი გამჭვირვალობითა და მკაფიო ტექსტით',
            'ინტერაქტიული ბარათები დახვეწილი Hover ეფექტებითა და კონტრასტული საზღვრებით',
            'Mobile-first Responsive Grid ყველა ეკრანის ზომისთვის',
            'მუქ ფონზე ვიზუალური იერარქიის შესანარჩუნებლად ფენებად განაწილებული ზედაპირები'
          ]
        : [
            'Modern hero section with bold typography and a prominent CTA',
            'Glassmorphism navigation with controlled transparency and clear text',
            'Interactive cards with refined hover effects and visible borders',
            'Mobile-first responsive grid for all screen sizes',
            'Layered surfaces to maintain visual hierarchy on dark backgrounds'
          ],
      uxFeatures: isKa
        ? [
            'ინტუიციური მომხმარებლის გზა და მკაფიო ვიზუალური მინიშნებები',
            'Dark mode-ისთვის ოპტიმიზებული ფერები და ტექსტის მაღალი კონტრასტი',
            'WCAG AA კონტრასტის გათვალისწინება ტექსტებისა და ინტერაქტიული ელემენტებისთვის',
            'Hover, Focus და Active მდგომარეობების მკაფიო ვიზუალური გამოხატვა',
            'ადაპტირებადი დიზაინი მობილურისთვის, ტაბლეტისა და დესკტოპისთვის'
          ]
        : [
            'Intuitive user journey with clear visual cues',
            'Dark-mode optimized colors and high text contrast',
            'WCAG AA contrast considerations for text and interactive elements',
            'Clearly differentiated hover, focus, and active states',
            'Responsive design for mobile, tablet, and desktop'
          ],
      techStack: [
        'Angular (Standalone Components & Signals)',
        'Modern CSS Grid, Flexbox & CSS Variables',
        'Figma Design System & Auto Layout',
        'Lucide Angular Icons'
      ]
    };
  }
}
