Voici une proposition de documentation que tu peux utiliser comme base pour un dépôt GitHub (par ex. dans un `README.md`).  
Je l’écris en français, orientée open source, avec une description du code des 3 fichiers.

---

# GigaFaith – Calendrier des Fêtes Chrétiennes & Saints du Jour

Application web (HTML/CSS/JS pur) permettant de visualiser :

- les fêtes chrétiennes (fixes et mobiles),
- les saints du jour sur l’année entière,
- des informations sur le calendrier julien/grégorien,
- avec thèmes clair/sombre et traductions multilingues.

---

## ✨ Fonctionnalités principales

- **Calendrier interactif** par année (de -46 à 9999)
  - Navigation par mois
  - Mise en avant du jour courant
  - Prise en compte des jours « sautés » lors de la réforme grégorienne
- **Fêtes chrétiennes**
  - Fêtes majeures, mobiles (ex : Pâques) et autres célébrations
  - Détails dans une *modal* dédiée
  - Ajout rapide à Google Calendar
- **Saints du jour**
  - Tableau `saintsOfTheYear` avec un saint / fête pour chaque jour de l’année (366 entrées)
- **Informations calendrier**
  - Indication du type de calendrier actif pour l’année recherchée (Julien / Grégorien / année de transition)
  - Règle de calcul des années bissextiles selon la période
- **Recherche d’année**
  - Champ numérique pour saisir une année arbitraire
  - Affichage si l’année est bissextile + explication en fonction du calendrier
- **Internationalisation (i18n)**
  - Système de traductions basé sur des fichiers JSON
  - Sélecteur de langue (fr, en, es, it, de, ko…)
- **Thème clair / sombre**
  - Stockage du thème dans `localStorage`
  - Changement dynamique des icônes (lune/soleil)
- **Notifications & Easter Eggs**
  - Notifications toast en haut de l’écran
  - Easter eggs sur certaines dates (Noël, anniversaires spécifiques…)
- **Autres**
  - Bouton *Faire un don* avec modal configurable
  - Horloge en temps réel en bas à droite
  - Mentions légales & RGPD dans une modal dédiée

---

## 🗂 Structure des fichiers

### 1. `index.html`

Fichier principal contenant la structure de la page.

Éléments clés :

- **En-tête (header)**
  - Titre et sous-titre :
    ```html
    <p class="header-subtitle mt-2" data-i18n="subtitle">
      Calendrier des Fêtes Chrétiennes & Saints du Jour
    </p>
    ```
  - Bouton de don :
    ```html
    <button class="donate-btn ed-full transition-all hover:scale-105 flex items-center gap-2" onclick="showDonateModal()">
        <i class="fas fa-hand-holding-heart text-lg"></i>
        <span class="hidden sm:inline" data-i18n="donateBtn">Faire un don</span>
    </button>
    ```
  - Sélecteur de langue (bouton + dropdown, contrôlé par `script.js`)

- **Panneau droit – Recherche d’année**
  - Champ numérique :
    ```html
    <input type="number" id="yearInput"
           class="input-field ..."
           data-i18n-placeholder="yearPlaceholder"
           placeholder="Année (-46 à 9999)" min="-46" max="9999">
    ```
  - Bouton de recherche : `#searchBtn`
  - Zone de résultat :
    - `#leapYearResult` : information sur le caractère bissextile de l’année
    - `#calendarInfo` : info calendrier Julien / Grégorien / transition

- **Modal des fêtes (`#holidayModal`)**
  Affiche le détail d’une fête lorsqu’on clique sur un jour ou une entrée de liste :
  - `#modalTitle` – titre de la fête
  - `#modalDate` – date formatée
  - `#modalDescription` – description en texte riche
  - Bouton "Ajouter à Google Calendar" (`#addToGoogleCalendar`)

- **Horloge**  
  Widget fixe en bas à droite :
  ```html
  <div class="fixed bottom-4 right-4 clock-widget rounded-xl px-4 py-2">
      <span id="liveTime" class="font-mono text-lg"></span>
  </div>
  ```

- **Footer / Mentions légales**
  - Texte avec attribution :
    ```html
    © 2025 GigaFaith - Calendrier Chrétien
    ```
  - Lien pour ouvrir la modal de mentions légales :
    ```html
    <span class="legal-link" onclick="showLegalNotice()">Mentions légales & RGPD</span>
    ```

- **Modals supplémentaires (non montrés en entier dans l’extrait)**
  - `#donateModal` – pour les dons
  - `#legalModal` – pour les mentions légales (généré dynamiquement par JS)

- **Script principal**
  ```html
  <script src="script.js"></script>
  ```

---

### 2. `style.css`

Feuille de style principale, basée sur des variables CSS (`--bg-primary`, `--text-primary`, etc.) et compatible avec un thème clair/sombre.

Sections importantes :

#### Transitions globales

```css
body,
.panel,
.calendar-day,
.holiday-item,
.modal-content,
.input-field,
.nav-btn,
.tab-btn,
.clock-widget {
    transition: background-color var(--transition-speed) ease,
                color var(--transition-speed) ease,
                border-color var(--transition-speed) ease,
                box-shadow var(--transition-speed) ease;
}
```

#### Badge année bissextile

```css
.leap-badge {
    animation: bounce 1s infinite;
}

@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
}
```

#### Notification toast

```css
.notification-toast {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%) translateY(-100px);
    background: var(--bg-secondary);
    color: var(--text-primary);
    ...
}

.notification-toast.show {
    transform: translateX(-50%) translateY(0);
}
```

#### Boutons de navigation & états désactivés

Styles pour `.nav-btn`, `.nav-btn:disabled`, etc., avec gestion du `hover` désactivé lorsque le bouton est inactif.

#### Bouton de don

```css
.donate-btn {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    border: 1px solid rgba(0,0,0,0.05);
}

.donate-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(9, 21, 33, 0.08);
}
```

Responsive : sur petit écran, on masque le texte du bouton pour ne garder que l’icône.

#### Sélecteur de langue

```css
.language-selector { position: relative; }

.lang-toggle {
    background: var(--bg-secondary);
    color: var(--text-primary);
    border: 2px solid var(--border-color);
    cursor: pointer;
}

.lang-dropdown {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    min-width: 160px;
}
```

---

### 3. `script.js`

Fichier JavaScript qui contient toute la logique métier et l’interactivité.

#### État global

```js
let currentDate = new Date();
let selectedYear = currentDate.getFullYear();
let currentHolidays = [];
let selectedHoliday = null;
let currentTheme = 'light';
let currentTab = 'holidays';
let currentLang = 'fr';
```

---

#### Internationalisation (i18n)

- `translations` : objet contenant les dictionnaires de traductions.
- `availableLanguages` : `['fr', 'en', 'es', 'it', 'de', 'ko']`.

**Chargement des fichiers de traduction :**

```js
async function loadTranslationFile(lang) {
    try {
        const response = await fetch(`${lang}.json`);
        if (!response.ok) throw new Error(...);
        translations[lang] = await response.json();
        return true;
    } catch (error) {
        console.warn(`Utilisation des traductions par défaut pour ${lang}`);
        if (defaultTranslations[lang]) {
            translations[lang] = defaultTranslations[lang];
        }
        return false;
    }
}
```

**Chargement global au démarrage :**

```js
async function loadAllTranslations() {
    const promises = availableLanguages.map(lang => loadTranslationFile(lang));
    await Promise.all(promises);
}
```

**Fonction utilitaire :**

```js
function t(key) {
    if (translations[currentLang] && translations[currentLang][key] !== undefined) {
        return translations[currentLang][key];
    }
    if (translations['fr'] && translations['fr'][key] !== undefined) {
        return translations['fr'][key];
    }
    return key;
}
```

Cette fonction est utilisée partout pour récupérer les chaînes à afficher (`t('subtitle')`, `t('donateTitle')`, etc.).

---

#### Calculs calendrier & années bissextiles

Plusieurs fonctions (non montrées intégralement) gèrent :

- la détection des années bissextiles selon le calendrier Julien/Grégorien,
- la génération de texte type :
  - `descJulianBC`, `descJulianAD`, `descTransition`, `descGregorianFirst`, `descGregorian`…
- la logique de **réforme grégorienne (1582)** :
  - détection des jours « sautés » via `isDaySkipped(year, month, day)`,
  - affichage de ces jours avec une classe spéciale `skipped-day` et un `title` traduit (`t('skippedDay')`).

Exemple simplifié dans le rendu du calendrier :

```js
if (isDaySkipped(year, month, day)) {
    const skippedDay = document.createElement('div');
    skippedDay.className = 'calendar-day ... skipped-day';
    skippedDay.innerHTML = `<span class="line-through opacity-30">${day}</span>`;
    skippedDay.title = t('skippedDay');
    grid.appendChild(skippedDay);
    continue;
}
```

---

#### Saints du jour

Table de base :

```js
const saintsOfTheYear = {
    "1-1": "Sainte Marie, Mère de Dieu",
    "1-2": "Saint Basile le Grand & Saint Grégoire de Nazianze",
    ...
    "2-2": "Présentation du Seigneur (Chandeleur)",
    ...
};
```

Fonction utilitaire (non montrée entièrement ici) : `getSaintOfDay(month, day)` qui retourne le saint à partir de cette table.

Cette information est utilisée lors du rendu des cellules du calendrier et dans les listes.

---

#### Rendu du calendrier

La fonction `renderCalendar()` :

- parcourt les jours du mois,
- crée pour chacun un élément `.calendar-day`,
- vérifie :
  - si c’est aujourd’hui (`isToday`),
  - s’il y a des fêtes dans `currentHolidays`,
  - quel est le saint du jour via `getSaintOfDay`.

Elle applique des classes supplémentaires selon le type de fête :

```js
if (dayHolidays.length > 0) {
    const holiday = dayHolidays[0];
    if (holiday.type === 'major') {
        classes += ' holiday-major';
    } else if (holiday.type === 'mobile') {
        classes += ' holiday-mobile';
    } else {
        ...
    }
}
```

---

#### Gestion du thème (clair / sombre)

```js
function toggleTheme() {
    const html = document.documentElement;
    const themeIcon = document.getElementById('themeIcon');
    
    if (currentTheme === 'light') {
        currentTheme = 'dark';
        html.setAttribute('data-theme', 'dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        currentTheme = 'light';
        html.setAttribute('data-theme', 'light');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
    
    localStorage.setItem('gigafaith-theme', currentTheme);
}

function loadTheme() {
    const savedTheme = localStorage.getItem('gigafaith-theme') || 'light';
    currentTheme = savedTheme;
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const themeIcon = document.getElementById('themeIcon');
    if (savedTheme === 'dark') {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
}
```

---

#### Notification toast

```js
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification-toast';
    notification.innerHTML = `
        <i class="fas fa-info-circle mr-2"></i>
        ${message}
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
```

---

#### Easter eggs

```js
function checkEasterEgg(year, month, day) {
    if (month === 11 && day === 25) {
        triggerEasterEgg('christmas');
        return true;
    }
    if (year === 1972 && month === 2 && day === 14) {
        triggerEasterEgg('croissant', 'Anniversaire Julien BLANC');
        return true;
    }
    if (year === 1998 && month === 7 && day === 11) {
        triggerEasterEgg('fireworks', 'Anniversaire Antoine BIANCONI');
        return true;
    }
    if (year === 2006 && month === 6 && day === 10) {
        triggerEasterEgg('balloons', 'Anniversaire Doryan GOHIER');
        return true;
    }
    if (year === 1999 && month === 11 && day === 17) {
        triggerEasterEgg('dumbbells', 'Anniversaire Alexandre GUILLIER');
        return true;
    }
    return false;
}
```

`triggerEasterEgg` crée des particules/animations temporaires puis les supprime après quelques secondes.

---

#### Mentions légales & modal de don

- `showLegalNotice()` / `closeLegalModal()`  
  Génèrent une modal avec des sections **titre + texte** entièrement basées sur les traductions (`t('legalSection1Title')`, etc.).

- `showDonateModal()` / `closeDonateModal()`  
  Ouvrent / ferment une modal déjà présente dans le HTML :

```js
function showDonateModal() {
    const modal = document.getElementById('donateModal');
    if (!modal) return;
    const title = document.getElementById('donateModalTitle');
    const body = document.getElementById('donateModalBody');
    const link = document.getElementById('donateModalLink');
    
    title.textContent = t('donateTitle');
    body.textContent = t('donateDescription');
    link.textContent = t('donateLinkText');
    link.href = translations[currentLang].donateLinkUrl || translations['fr'].donateLinkUrl;
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    modal.querySelector('.modal-content').classList.add('modal-enter');
}
```

Les fonctions nécessaires aux attributs `onclick` du HTML sont exposées sur `window` :

```js
window.showHolidayFromList = showHolidayFromList;
window.showSaintFromList = showSaintFromList;
window.showDonateModal = showDonateModal;
window.closeDonateModal = closeDonateModal;
```

---

## 🔧 Installation & utilisation

1. Cloner le dépôt :
   ```bash
   git clone https://github.com/ton-compte/gigafaith-calendrier.git
   cd gigafaith-calendrier
   ```

2. Ouvrir `index.html` directement dans un navigateur  
   ou utiliser un petit serveur local (recommandé pour le chargement des fichiers JSON de traduction) :
   ```bash
   npx serve .
   ```
   puis ouvrir l’URL fournie (souvent `http://localhost:3000`).

---

## 🧩 Personnalisation

### Ajouter / modifier une langue

1. Créer un fichier `xx.json` (ex : `pt.json`) à la racine.
2. Y copier la structure de `fr.json` et traduire les chaînes.
3. Ajouter la langue dans `availableLanguages` :
   ```js
   const availableLanguages = ['fr', 'en', 'es', 'it', 'de', 'ko', 'pt'];
   ```
4. Ajouter le bouton correspondant dans le sélecteur de langue HTML (si nécessaire).

### Modifier les saints du jour

Éditer l’objet `saintsOfTheYear` dans `script.js` et ajuster ou ajouter des entrées :

```js
"3-19": "Saint Joseph, époux de la Vierge Marie",
```

### Ajouter / modifier une fête

Les fêtes sont stockées dans une structure (non intégralement visible dans l’extrait) et utilisées pour remplir `currentHolidays`.  
Pour ajouter une fête :

- Rajouter une entrée dans la liste des fêtes (fixe ou calculée),
- Vérifier que `renderCalendar()` utilise bien son `type` (`major`, `mobile`, etc.) pour l’affichage.

### Configurer le lien de don

Dans les fichiers JSON de traduction (`fr.json`, etc.) :

```json
{
  "donateLinkUrl": "https://ton-lien-de-don.com",
  "donateTitle": "Soutenir GigaFaith",
  "donateDescription": "Votre don nous aide à ...",
  "donateLinkText": "Faire un don en ligne"
}
```

---

## 🤝 Contribution

1. Fork du dépôt
2. Créer une branche :
   ```bash
   git checkout -b feature/ma-fonctionnalite
   ```
3. Commits clairs avec message descriptif
4. Pull request vers la branche principale du projet

Merci de :

- Respecter le style du code existant (naming, organisation),
- Conserver la compatibilité avec les fichiers de traductions,
- Tester au moins sur la dernière version de Chrome/Firefox.

---

## 📄 Licence

À compléter selon ton choix (ex : MIT, GPL-3.0, etc.) :

```text
MIT License
Copyright (c) 2025 ...
```

---

Si tu veux, je peux aussi te proposer une version plus courte du README ou ajouter une section “API interne” détaillant les principales fonctions (signatures + comportement) pour les contributeurs.