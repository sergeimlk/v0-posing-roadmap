# CAHIER DES CHARGES — POSING EMPIRE (Landing Page)

> **Objectif :** Reproduire à l'identique la landing page "Posing Empire" de Manael en **React + Vite + Tailwind CSS v4**, avec un design premium black & gold, responsive, et **aucune erreur de marge/padding/espacement**. Le site doit être parfaitement utilisable dès la première exécution.

---

## 1. STACK TECHNIQUE

| Élément | Choix exact |
|---|---|
| Framework | **Vite** (dernière version) |
| UI Library | **React** (dernière version) |
| CSS Framework | **Tailwind CSS v4** via `@tailwindcss/vite` |
| Fonts | **Google Fonts** : `Inter` (body, 300–800) + `Outfit` (display, 400–900) |
| Fichier unique | Tout le JSX dans **un seul fichier `App.jsx`** (pas de routeur) |
| CSS custom | **Un seul fichier `index.css`** avec `@import "tailwindcss"` en première ligne |
| Déploiement | Vercel (production build avec `vite build`) |

---

## 2. DESIGN SYSTEM — TOKENS

### 2.1. Couleurs (définies dans `@theme {}`)

```css
@theme {
  --font-display: 'Outfit', sans-serif;
  --font-body: 'Inter', sans-serif;
  
  --color-gold-50: #FFFEF5;
  --color-gold-100: #FFF8E1;
  --color-gold-200: #FFECB3;
  --color-gold-300: #FFD54F;
  --color-gold-400: #FFCA28;
  --color-gold-500: #D4A843;
  --color-gold-600: #B8942D;
  --color-gold-700: #8B6914;
  --color-gold-800: #614A0E;
  --color-gold-900: #3D2E09;

  --color-bg-primary: #050505;
  --color-bg-card: #0D0D0D;
  --color-bg-elevated: #111111;
  --color-bg-surface: #1A1A1A;
}
```

### 2.2. Typographie

| Usage | Font | Weight | Tracking |
|---|---|---|---|
| H1 (hero) | Inter | 900 (black) | `tracking-tighter` |
| H2 (section titles) | Inter | 900 (black) | `tracking-tighter` |
| H3 (card titles) | Inter | 700 (bold) | normal |
| Body text | Inter | 400 | normal |
| Navbar brand | Inter | 700 (bold) | `tracking-widest` |
| Labels/badges | Inter | 500–600 | `tracking-widest` |
| Boutons | Inter | 700 | `tracking-[0.05em]` |

### 2.3. Dégradés de texte

```css
/* Gold gradient text */
.text-gold-gradient {
  background: linear-gradient(135deg, #FFD54F 0%, #D4A843 30%, #B8942D 60%, #FFD54F 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* White-to-gray gradient text */
.text-white-gradient {
  background: linear-gradient(180deg, #FFFFFF 0%, #999999 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

---

## 3. SYSTÈME DE SPACING — RÈGLES CRITIQUES

> ⚠️ **C'est LA partie la plus importante.** Tous les problèmes viennent de spacing incohérent.

### 3.1. Container principal (`.main-container`)

**Un seul container réutilisé partout**, centré horizontalement avec des paddings latéraux progressifs :

```css
.main-container {
  width: 100%;
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1.25rem;   /* 20px — base mobile */
  padding-right: 1.25rem;
}

@media (min-width: 640px) {
  .main-container { padding-left: 1.5rem; padding-right: 1.5rem; }   /* 24px */
}
@media (min-width: 768px) {
  .main-container { padding-left: 2rem; padding-right: 2rem; }       /* 32px */
}
@media (min-width: 1024px) {
  .main-container { padding-left: 3rem; padding-right: 3rem; }       /* 48px */
}
@media (min-width: 1280px) {
  .main-container { padding-left: 4rem; padding-right: 4rem; }       /* 64px */
}
```

### 3.2. Spacing vertical entre sections (`.section-padding`)

Chaque `<section>` utilise cette classe. **JAMAIS d'inline padding-top/bottom custom sur les sections.**

```css
.section-padding {
  padding-top: 4rem;     /* 64px mobile */
  padding-bottom: 4rem;
}
@media (min-width: 640px) {
  .section-padding { padding-top: 5rem; padding-bottom: 5rem; }     /* 80px */
}
@media (min-width: 768px) {
  .section-padding { padding-top: 6rem; padding-bottom: 6rem; }     /* 96px */
}
@media (min-width: 1024px) {
  .section-padding { padding-top: 7rem; padding-bottom: 7rem; }     /* 112px */
}
```

### 3.3. Hero — Calcul du padding-top

La navbar est `position: fixed`, hauteur totale ≈ **60px mobile**, **64px sm+**.  
Le hero padding-top doit être `navbar_height + desired_gap`, où `desired_gap = padding-bottom` :

| Breakpoint | Navbar | padding-bottom | **padding-top** | Espace visible au-dessus |
|---|---|---|---|---|
| Mobile | 60px | 64px (pb-16) | **124px** | 64px ✅ |
| sm (640px+) | 64px | 80px (pb-20) | **144px** | 80px ✅ |
| lg (1024px+) | 64px | 96px (pb-24) | **160px** | 96px ✅ |

```jsx
className="relative w-full pt-[124px] sm:pt-[144px] lg:pt-[160px] pb-16 sm:pb-20 lg:pb-24 overflow-hidden"
```

### 3.4. Section Heading (composant réutilisable)

```jsx
<div className="text-center mb-10 md:mb-12">
  <h2 className="font-black tracking-tighter text-[clamp(1.5rem,4.5vw,2.75rem)] leading-tight mb-3">
    <span className="text-white-gradient">{white}</span>
    <span className="text-gold-gradient">{gold}</span>
  </h2>
  {subtitle && (
    <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
      {subtitle}
    </p>
  )}
</div>
```

### 3.5. Grids — Gaps par composant

| Section | Grid | Gap |
|---|---|---|
| Programme (modules) | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` | `gap-4 sm:gap-5` |
| Poses (gallery) | `grid-cols-2 sm:grid-cols-3 md:grid-cols-4` | `gap-3.5 sm:gap-4 lg:gap-5` |
| Reviews (avis) | `grid-cols-1 md:grid-cols-3` | `gap-5 lg:gap-6` |
| Hero (text + photo) | `grid-cols-1 lg:grid-cols-2` | `gap-10 lg:gap-16` |

---

## 4. NAVBAR

- **Position** : `fixed top-0 left-0 right-0 z-1000`
- **Background** : `rgba(5, 5, 5, 0.85)` avec `backdrop-filter: blur(20px)`
- **Padding** : `0.875rem 0` (14px vertical)
- **Border-bottom** : `1px solid rgba(212, 168, 67, 0.08)`
- **Contenu** : `main-container flex items-center justify-between`

### Gauche
- Logo image : `h-8 w-8 sm:h-9 sm:w-9 rounded-md` — fichier `/clients/manael/logoPE.jpg`
- Texte : `"POSING EMPIRE"` en uppercase, `font-bold text-sm sm:text-base tracking-widest text-gold-gradient`

### Droite
- 3 liens (masqués sur mobile avec `hidden sm:block`) : "Programme" (#programme), "Poses" (#poses), "Avis" (#avis)
  - Style : `text-sm text-gray-300 hover:text-gold-400 transition-colors`
- Bouton CTA : `btn-primary-gold text-xs px-4 py-2` → texte "Rejoindre"

### Scroll behavior
- Au scroll > 50px : ajouter `shadow-lg shadow-black/30` au nav

---

## 5. SECTIONS — ORDRE ET CONTENU

L'ordre des sections de haut en bas :

1. **Navbar** (fixed)
2. **Hero** (header)
3. **Les 16 Poses Classiques** (gallery)
4. **Le Programme Complet** (modules)
5. **Ils Ont Dominé La Scène** (reviews/avis)
6. **La Transformation En Direct** (before/after slider)
7. **Footer**

### 5.1. HERO

```
┌─────────────────────────────────────────────────────┐
│  [Badge pulsant] Coaching Exclusif · Places Limitées │
│                                                       │
│  DOMINE LA SCÈNE.           │    [Photo Manael]       │
│  MAÎTRISE TON POSING.      │    border gold/20        │
│                              │    rounded-2xl          │
│  Accroche text...            │    glow derrière         │
│  ✓ 10 modules · 50+ vidéos  │    overlay nom en bas   │
│  ✓ Posing, transitions...   │                          │
│  ✓ Accompagnement 1-1       │                          │
│                              │                          │
│  [CTA primaire] [CTA secondaire]                      │
│  ● K S T A  Rejoint par 200+ athlètes                │
└─────────────────────────────────────────────────────┘
```

**Détails layout :**
- Badge : `inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold-500/30 bg-gold-900/20 mb-6`
  - Point pulsant vert : `w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse`
  - Texte : "Coaching Exclusif · Places Limitées" — `text-xs text-gold-300 font-medium`

- H1 : `font-black tracking-tighter leading-[1.08] mb-6 text-[clamp(1.75rem,5.5vw,3.25rem)]`
  - "DOMINE LA " en blanc, "SCÈNE." en `text-gold-gradient`
  - Saut de ligne `<br />`
  - "MAÎTRISE TON POSING." en `text-gold-gradient`

- Accroche : `text-gray-300 text-sm sm:text-base max-w-lg mx-auto lg:mx-0 mb-6 leading-relaxed`
  - Contient du `<strong>` en blanc et en gold-400

- Checklist : `space-y-2.5 mb-8 max-w-sm mx-auto lg:mx-0 text-left`
  - 3 items avec icône check SVG stroke `#D4A843`
  - `text-sm text-gray-300`

- CTAs : `flex flex-col sm:flex-row items-center gap-3.5 justify-center lg:justify-start`
  - Primaire : `btn-primary-gold animate-pulse-gold w-full sm:w-auto` → "Rejoindre Posing Empire →"
  - Secondaire : `btn-secondary-gold w-full sm:w-auto` → "Accès Gratuit →"

- Social proof : `mt-8 flex items-center gap-3`
  - 4 cercles -space-x-2, initiales K S T A sur gradient gold
  - Texte : "Rejoint par **200+ athlètes**"

- Photo coach : `max-w-[300px] sm:max-w-sm lg:max-w-md mx-auto lg:mx-0 animate-float`
  - Glow derrière : `absolute -inset-3 from-gold-400/20 via-gold-600/10 rounded-3xl blur-2xl`
  - Image : `/clients/manael/manael.jpg`
  - Overlay bas : gradient to-transparent, nom "Manael" + "FONDATEUR · POSING EMPIRE" en gold

### 5.2. LES 16 POSES CLASSIQUES

- Section class : `section-padding relative`
- Titre : white = "LES 16 POSES " + gold = "CLASSIQUES"
- Subtitle : "Chaque pose enseignée dans le programme avec les placements exacts, les erreurs à éviter et les corrections de symétrie."

**Pose cards grid** : `grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5`

Chaque carte :
```jsx
<div className="pose-card opacity-0 animate-fade-up" style={{ animationDelay: `${index * 50}ms` }}>
  <div className="aspect-[3/4] overflow-hidden">
    <img src={`/poses/${i + 1}.png`} className="w-full h-full object-cover" loading="lazy" />
  </div>
  <div className="py-2 px-3 text-center">
    <p className="text-xs font-semibold text-gold-400 tracking-wide">Pose {i + 1}</p>
  </div>
</div>
```

Pose card CSS :
```css
.pose-card {
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(212, 168, 67, 0.12);
  background: #0D0D0D;
}
.pose-card:hover {
  transform: translateY(-6px) scale(1.02);
  border-color: rgba(212, 168, 67, 0.5);
  box-shadow: 0 16px 48px rgba(212, 168, 67, 0.15);
}
.pose-card img { transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
.pose-card:hover img { transform: scale(1.08); }
```

- **Lightbox** au clic : overlay `fixed inset-0 bg-black/92 backdrop-blur-[12px] z-10000`
  - Flèches gauche/droite, navigation clavier (Escape, ArrowLeft, ArrowRight)
  - Compteur en bas : "Pose X (n/16)"

### 5.3. LE PROGRAMME COMPLET

- Section class : `section-padding relative bg-black/40`
- Glow décoratif : `absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-gold-600 rounded-full blur-[180px] opacity-5`
- Titre : white = "LE PROGRAMME " + gold = "COMPLET"
- Subtitle : "Du débutant au compétiteur elite — tout ce qu'il faut pour dominer chaque étape de ta carrière en bodybuilding."

**6 modules** (données exactes) :

| Level | Icon | Titre | Description |
|---|---|---|---|
| Level 1 | 🏗️ | Les Fondations | Vocabulaire du poseur, méthodologie, setup, symétrie, sangle abdominale. Les bases pour ne plus poser comme un amateur. |
| Level 2 | 💪 | Classic & Body | Placements de jambes, quarts de tour, mandatories, transitions, round d'endurance et routine libre. |
| Level 3 | 👑 | The Classic Class | Front poses, Side & ¾, Back poses, poses spécifiques et transitions artistiques de haut niveau. |
| Level 4 | 🏆 | Compétition | Déroulement d'une compétition, attitude scénique, respiration, le tan, pump pre-stage, fédérations. |
| Level 5 | 🎯 | Sessions & Accompagnement | Sessions 1-1 avec coach certifié, accompagnement Premium 3 mois, VIP avec Manael, mentoring coachs. |
| Bonus | ⚡ | Mobilité & Vacuum | Mobilité de hanche, colonne, rotations, activation musculaire complète. Et le module Vacuum — l'arme secrète. |

Chaque carte : `card-glass p-5 sm:p-6 opacity-0 animate-fade-up group`
- Stagger : `animationDelay: i * 80ms`
- Layout interne : `flex items-start gap-3`
- Icon : `text-xl leading-none mt-0.5 flex-shrink-0`
- Level label : `text-xs font-bold text-gold-500 uppercase tracking-widest mb-1 block`
- Title : `font-bold text-white text-sm sm:text-base mb-1.5 group-hover:text-gold-400 transition-colors`
- Desc : `text-gray-400 text-xs sm:text-sm leading-relaxed`

**CTA en bas** : `text-center mt-10 sm:mt-12`
- Bouton : `btn-primary-gold` → "Accéder au Programme Complet →"
- Sous-texte : `text-gray-500 text-xs mt-2` → "Accès gratuit · Sans engagement"

### 5.4. REVIEWS — "ILS ONT DOMINÉ LA SCÈNE"

- Section class : `section-padding relative bg-black/50`
- Glow : `absolute center w-[400px] h-[400px] bg-gold-600 rounded-full blur-[150px] opacity-10`
- Titre : white = "ILS ONT " + gold = "DOMINÉ LA SCÈNE"
- Subtitle : "200+ athlètes ont déjà transformé leur posing avec Posing Empire. Voici leurs retours."

**3 reviews :**

| Nom | Rôle | Avatar | Note | Commentaire |
|---|---|---|---|---|
| Karim B. | Classic Physique — Compétiteur Amateur | /clients/client_1.png | ⭐⭐⭐⭐⭐ | "Grâce à Posing Empire, j'ai compris enfin la logique derrière chaque pose. La méthode de Manael m'a permis de gagner 3 places à ma première régionale. Le module compétition est une mine d'or." |
| Sophie M. | Men's Physique — Athlète IFBB | /clients/client_2.png | ⭐⭐⭐⭐⭐ | "J'ai suivi les modules Fondations et Classic & Body en 3 semaines. Les corrections de symétrie m'ont bluffé. Manael explique avec une précision chirurgicale. Un investissement qui vaut chaque centime." |
| Thomas D. | Bodybuilder — Pro Card Holder | /clients/client_3.png | ⭐⭐⭐⭐⭐ | "Le module mobilité + activation a changé ma façon de préparer mes poses. Plus de douleurs, plus de fluidité sur scène. La section Sessions & Accompagnement avec Manael directement, c'est le top." |

Chaque carte : `card-glass p-5 sm:p-6 opacity-0 animate-fade-up flex flex-col`
- Stars : 5× SVG star icon fill `#D4A843`, `mb-3`
- Quote : `text-gray-300 text-sm sm:text-[0.9rem] leading-relaxed mb-4 flex-1`
- Footer : `flex items-center gap-3 pt-4 border-t border-white/5`
  - Avatar : `w-9 h-9 rounded-full overflow-hidden border-2 border-gold-500/40`
  - Name : `font-semibold text-sm text-white not-italic block` (dans `<cite>`)
  - Role : `text-xs text-gold-400 mt-0.5`

### 5.5. BEFORE/AFTER SLIDER

- Section class : `section-padding relative`
- Titre : white = "LA TRANSFORMATION " + gold = "EN DIRECT"
- Subtitle : "Glisse le curseur pour voir la différence. Avant vs Après le coaching Posing Empire."

**Slider** :
- Container : `relative w-full aspect-[3/4] max-w-[500px] rounded-[24px] overflow-hidden cursor-col-resize`
  - Border : `1px solid rgba(212, 168, 67, 0.2)`
  - Shadow : `0 20px 60px rgba(0, 0, 0, 0.5)`
- Image dessous : `/clients/avant/apres/apres.png` — label "Avant" (bg-black/70)
- Image dessus (clippée) : `/clients/avant/apres/avant.png` — label "Après" (bg-gold-600/80)
- Clip-path CSS : `clipPath: inset(0 ${100 - sliderPos}% 0 0)`
- Handle : ligne verticale gold gradient + cercle 44px avec chevrons `<>`

**Comportement** :
- State `sliderPos` initial = 50
- Mouse/Touch drag avec event listeners globaux (mousemove, touchmove)
- Clamp entre 2% et 98%

### 5.6. FOOTER

- `section-padding bg-black border-t border-gold-500/10`
- "POSING EMPIRE" en `font-black tracking-widest text-xl sm:text-2xl text-gold-gradient uppercase`
- Sous-titre : "Coach Posing Expert · Bodybuilding Classique · Men's Physique" — `text-gray-500 text-sm mb-6`
- CTA : `btn-primary-gold mb-6` → "Rejoindre Gratuitement →"
- Icône Instagram : cercle `p-2.5 bg-white/5 rounded-full hover:bg-gold-600/20 hover:text-gold-400`
- Copyright : `text-gray-700 text-xs` → "© 2026 Posing Empire by Manael. Tous droits réservés."

---

## 6. POPUP FORMULAIRE

### Déclenchement
- **Auto** : après 6 secondes (`setTimeout`)
- **Manuel** : chaque bouton CTA de la page appelle `setShowPopup(true)`
- **Fermeture** : clic overlay, bouton X, ou Escape

### Structure
```
.popup-overlay (fixed, bg black/88, backdrop-blur 10px, z-9999)
  └── .popup-modal (max-w-420px, max-h-90vh, overflow-y auto)
        ├── Ligne dorée top (h-px gradient gold)
        ├── Bouton X (top-3 right-3)
        ├── .popup-header (badge + titre + sous-titre)
        ├── .popup-body (formulaire 4 champs)
        └── .popup-footer (données protégées)
```

### Champs
1. **Nom complet** * — `type="text"` name="name" required
2. **Email** * — `type="email"` name="email" required
3. **Téléphone** — `type="tel"` name="phone"
4. **Instagram** — `type="text"` name="instagram" avec icône `@` absolue à gauche

### Style inputs
```css
.input-gold {
  width: 100%;
  padding: 0.7rem 0.875rem;
  font-size: 0.875rem;
  color: #E5E5E5;
  background: rgba(18, 18, 18, 0.95);
  border: 1px solid rgba(212, 168, 67, 0.18);
  border-radius: 8px;
  outline: none;
  transition: all 0.2s ease;
}
.input-gold:focus {
  border-color: rgba(212, 168, 67, 0.6);
  box-shadow: 0 0 0 2px rgba(212, 168, 67, 0.1);
  background: #1a1a1a;
}
```

### Soumission
- POST vers Google Forms via iframe cachée
- Après submit → écran "Bienvenue ! 🎉" avec lien Skool `https://www.skool.com/manael`

### Popup spacing
```css
.popup-header { padding: 1.75rem 1.5rem 0.75rem; text-align: center; }
.popup-body { padding: 0.75rem 1.5rem 1rem; }
.popup-footer { padding: 0.75rem 1.5rem 1.25rem; border-top: 1px solid rgba(255,255,255,0.04); }
```

---

## 7. ANIMATIONS

```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
@keyframes pulse-gold {
  0%, 100% { box-shadow: 0 0 0 0 rgba(212, 168, 67, 0.4); }
  50% { box-shadow: 0 0 0 12px rgba(212, 168, 67, 0); }
}
@keyframes slideInFromBottom {
  from { opacity: 0; transform: translateY(100%) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
```

| Classe | Animation | Usage |
|---|---|---|
| `.animate-fade-up` | fadeUp 0.7s ease-out forwards | Cards, sections |
| `.animate-fade-in` | fadeIn 0.5s ease-out forwards | Lightbox |
| `.animate-float` | float 6s ease-in-out infinite | Photo coach |
| `.animate-pulse-gold` | pulse-gold 2s ease-in-out infinite | CTA primaire hero |
| `.animate-slide-in` | slideInFromBottom 0.5s | Popup modal |

**Stagger** : via `style={{ animationDelay: \`${i * XXms}\` }}` avec `animationFillMode: 'forwards'`

---

## 8. BOUTONS — CSS COMPLET

### Primaire
```css
.btn-primary-gold {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 2rem;
  font-weight: 700;
  font-size: 0.875rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #050505;
  background: linear-gradient(135deg, #FFD54F 0%, #D4A843 50%, #B8942D 100%);
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}
/* Shimmer on hover */
.btn-primary-gold::before {
  content: '';
  position: absolute;
  top: 0; left: -100%; width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.5s;
}
.btn-primary-gold:hover::before { left: 100%; }
.btn-primary-gold:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(212,168,67,0.4); }
.btn-primary-gold:active { transform: translateY(0); }
```

### Secondaire
```css
.btn-secondary-gold {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 2rem;
  font-weight: 600;
  font-size: 0.875rem;
  color: #D4A843;
  background: transparent;
  border: 1.5px solid rgba(212, 168, 67, 0.5);
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.btn-secondary-gold:hover {
  background: rgba(212, 168, 67, 0.1);
  border-color: rgba(212, 168, 67, 0.8);
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(212, 168, 67, 0.2);
}
```

---

## 9. CARDS — CSS GLASSMORPHISM

```css
.card-glass {
  background: linear-gradient(145deg, rgba(17, 17, 17, 0.8), rgba(13, 13, 13, 0.95));
  border: 1px solid rgba(212, 168, 67, 0.15);
  border-radius: 16px;
  backdrop-filter: blur(12px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.card-glass:hover {
  border-color: rgba(212, 168, 67, 0.4);
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(212, 168, 67, 0.1);
}
```

---

## 10. HERO BACKGROUND

Grille décorative type Genesis :

```css
.hero-grid-bg { position: absolute; inset: 0; overflow: hidden; }
.grid-overlay {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(212, 168, 67, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(212, 168, 67, 0.08) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse 80% 70% at 50% 30%, black 20%, transparent 100%);
}
.radial-glow {
  position: absolute; top: -10%; left: 50%; transform: translateX(-50%);
  width: 800px; height: 600px;
  background: radial-gradient(ellipse, rgba(212, 168, 67, 0.15) 0%, rgba(184, 148, 45, 0.05) 40%, transparent 70%);
}
```

---

## 11. ASSETS — FICHIERS REQUIS DANS `/public`

```
public/
├── clients/
│   ├── manael/
│   │   ├── logoPE.jpg       ← Logo navbar + favicon
│   │   └── manael.jpg       ← Photo coach hero
│   ├── avant/apres/
│   │   ├── avant.png        ← Before/After "Avant"
│   │   └── apres.png        ← Before/After "Après"
│   ├── client_1.png          ← Avatar Karim B.
│   ├── client_2.png          ← Avatar Sophie M.
│   └── client_3.png          ← Avatar Thomas D.
├── poses/
│   ├── 1.png ... 16.png      ← 16 images de poses
├── favicon.svg
├── icons.svg
├── manifest.json
└── sw.js
```

---

## 12. SEO — INDEX.HTML

### Meta tags obligatoires
- `lang="fr"`
- Title : "Posing Empire — Coaching Posing Bodybuilding Classic & Men's Physique | Manael"
- Description : "Posing Empire by Manael — La méthode complète pour maîtriser les poses classiques du bodybuilding..."
- Keywords : coaching posing bodybuilding, poses classiques, posing expert, Manael coach, classic physique, men's physique, etc.
- Canonical : `https://posing-empire.fr`
- Open Graph + Twitter Card complets
- JSON-LD EducationalOrganization avec Course catalog

### PWA
- `manifest.json`
- `theme-color: #050505`
- apple-mobile-web-app-capable

### Fonts preconnect
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
```

---

## 13. CONFIGURATION JS

```js
const GOOGLE_FORM_ACTION = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse'
const FORM_ENTRIES = {
  name: 'entry.0000000001',
  email: 'entry.0000000002',
  phone: 'entry.0000000003',
  instagram: 'entry.0000000004',
}
const SKOOL_URL = 'https://www.skool.com/manael'
```

---

## 14. SCROLLBAR PERSONNALISÉE

```css
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #0A0A0A; }
::-webkit-scrollbar-thumb { background: rgba(212, 168, 67, 0.3); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: rgba(212, 168, 67, 0.5); }
```

---

## 15. ICÔNES SVG INLINE

Toutes les icônes sont des SVG inline (aucune lib externe) :
- **StarIcon** : 15×15, fill + stroke `#D4A843`
- **ArrowRight** : 16×16, stroke currentColor
- **CloseIcon** : 18×18, deux lignes en croix
- **ChevronLR** : 18×18, chevrons `< >` pour le slider
- **InstagramIcon** : 20×20, rect + circle + dot
- **Check** : 14×14, stroke `#D4A843` (hero checklist)

---

## 16. GLOBAL RESET

```css
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  font-family: var(--font-body);
  background-color: var(--color-bg-primary);
  color: #E5E5E5;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

---

## 17. COMPORTEMENT BODY OVERFLOW

Quand popup OU lightbox est ouvert :
```js
document.body.style.overflow = (showPopup || lightboxIndex !== null) ? 'hidden' : ''
```

---

## 18. CHECKLIST FINALE

- [ ] Toutes les sections utilisent `.section-padding` + `.main-container`
- [ ] Le hero padding-top compense exactement la navbar height + le même gap que le padding-bottom
- [ ] Aucune section n'a de padding inline custom qui casse la cohérence
- [ ] Tous les grids ont le bon nombre de colonnes par breakpoint
- [ ] Le popup ne touche jamais les bords sur mobile (padding overlay 1.25rem)
- [ ] Les inputs sont bien séparés (space-y-3 dans le form)
- [ ] Le lightbox est navigable au clavier (Escape, ←, →)
- [ ] À la fermeture du popup/lightbox, body.overflow est restauré
- [ ] La scrollbar custom est fine (6px) et non la scrollbar par défaut
- [ ] Le bouton "Rejoindre" dans la navbar est visible même sur mobile
- [ ] Les animations stagger fonctionnent (animationFillMode: 'forwards')
- [ ] Le before/after slider fonctionne au touch sur mobile
