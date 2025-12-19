# ✝️ GigaFaith - Calendrier Chrétien & Saints du Jour

**GigaFaith** est une application web interactive conçue pour explorer le calendrier liturgique chrétien à travers les âges. Elle gère avec précision les complexités historiques (calendriers Romain, Julien et Grégorien) et fournit les fêtes religieuses ainsi que les saints du jour.

---

## 📖 Partie 1 : Guide Utilisateur

Cette section est destinée aux utilisateurs finaux de l'application.

### ✨ Fonctionnalités Principales

*   **Calendrier Perpétuel Historique :**
    *   **Antiquité (avant -45) :** Calendrier Romain.
    *   **Ère Julienne (-45 à 1582) :** Basé sur la réforme de Jules César.
    *   **Transition de 1582 :** Gestion précise de la réforme du Pape Grégoire XIII (suppression historique de 10 jours en octobre).
    *   **Ère Moderne :** Calendrier Grégorien actuel.
*   **Fêtes Liturgiques :** Calcul automatique des fêtes mobiles (Pâques, Ascension, Pentecôte) et affichage des fêtes fixes (Noël, Assomption).
*   **Les Saints :** Affichage quotidien du Saint à célébrer.
*   **Internationalisation (i18n) :** Interface entièrement traduite en **Français, Anglais, Espagnol, Italien, Allemand et Coréen**.
*   **Respect de la Vie Privée :** Aucune collecte de données (conforme RGPD), tout est stocké localement sur votre appareil.

### 🚀 Navigation & Interface

*   **Barre de recherche :** Entrez une année (ex: `1582` ou `-44`) pour voyager dans le temps.
*   **Légende des couleurs :**
    *   🔴 **Rouge :** Fêtes majeures (Solennités).
    *   🟢 **Vert :** Fêtes mobiles (dont la date change chaque année).
    *   🔵 **Bleu :** Fêtes fixes.
*   **Personnalisation :** Utilisez le bouton "Lune/Soleil" pour basculer entre le mode clair et le mode sombre.

---

## 🛠️ Partie 2 : Documentation Technique

Cette section détaille l'architecture du code pour les développeurs souhaitant maintenir ou faire évoluer le projet.

### 🏗️ Architecture Technique

Le projet est conçu en **Vanilla JavaScript** (ES6+), sans framework lourd (pas de React/Vue), pour assurer légèreté et performance.

*   **Stack :** HTML5, CSS3, JavaScript.
*   **Framework CSS :** [Tailwind CSS](https://tailwindcss.com/) (via CDN) pour le layout et le design system.
*   **Styles Custom :** `style.css` pour les animations spécifiques (modales, particules, easter eggs).
*   **Données :** Fichiers JSON externes pour les traductions.

### 📂 Structure des fichiers

```text
/
├── index.html       # Point d'entrée, contient la structure DOM et les templates
├── script.js        # Cœur du réacteur : logique métier, date, i18n
├── style.css        # Surcharges CSS, animations (keyframes), variables thématiques
├── fr.json          # Fichier de langue (Français)
├── ...              # Autres fichiers de langue (en, es, it, de, ko)
└── README.md        # Documentation
```

### 🧠 Analyse Détaillée du Code (`script.js`)

Le fichier JavaScript gère toute l'interactivité. Voici les blocs logiques clés :

#### 1. Gestion de l'État Global
L'application maintient un état simple pour éviter la complexité de gestionnaires d'états externes :
```javascript
let currentDate = new Date();       // Date actuelle réelle
let selectedYear = currentDate.getFullYear(); // Année visualisée
let currentHolidays = [];           // Cache des fêtes de l'année en cours
let currentTheme = 'light';         // Thème de l'interface
```

#### 2. Système d'Internationalisation (i18n)
Le système est **asynchrone** et résilient.
*   **Chargement :** La fonction `loadTranslationFile(lang)` utilise `fetch` pour récupérer le JSON correspondant.
*   **Fallback :** Si le fichier JSON échoue (ex: erreur réseau), le script bascule sur l'objet `defaultTranslations` codé en dur dans le JS.
*   **Application :** La fonction parcourt le DOM pour trouver les attributs `data-i18n` et injecte le texte traduit.

```javascript
// Exemple de logique simplifiée
async function changeLanguage(lang) {
    await loadTranslationFile(lang);
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.innerText = translations[key];
    });
}
```

#### 3. Algorithmique Calendaire (La particularité du projet)
Le projet se distingue par sa gestion des ruptures historiques.

*   **Le saut de 1582 :** Une fonction dédiée vérifie si un jour doit être "sauté" lors du passage au calendrier grégorien.
    ```javascript
    function isDaySkipped(year, month, day) {
        // En octobre 1582, le lendemain du 4 octobre était le 15 octobre.
        if (year === 1582 && month === 9 && day >= 5 && day <= 14) {
             return true; // Ce jour n'existe pas historiquement
        }
        return false;
    }
    ```
*   **Calcul de Pâques :** Le script contient l'algorithme de calcul de la date de Pâques (Comput), essentiel car il détermine les autres fêtes mobiles (Ascension, Pentecôte).

#### 4. Rendu du Calendrier (`renderCalendar`)
Cette fonction est appelée à chaque changement de mois ou d'année :
1.  Vide la grille existante.
2.  Calcule le premier jour du mois et le nombre de jours.
3.  Boucle pour créer les éléments `<div>` des jours.
4.  Applique les classes CSS selon les événements (fêtes, aujourd'hui, jour sélectionné).
5.  Gère l'affichage des tooltips (saints du jour).

#### 5. Gestion des Thèmes & Stockage
Le thème est géré via des variables CSS et des classes sur la racine `<html>`. La persistance utilise le `LocalStorage` du navigateur.

```javascript
// Dans script.js
function toggleTheme() {
    // Bascule et sauvegarde
    localStorage.setItem('gigafaith-theme', currentTheme);
    // Met à jour l'attribut data-theme pour le CSS
    document.documentElement.setAttribute('data-theme', currentTheme);
}
```

### 🎨 Styles et Animations (`style.css`)

Le fichier CSS complète Tailwind pour des besoins spécifiques :
*   **Animations :** Les keyframes `@keyframes messagePopIn` gèrent l'apparition des messages (Easter Eggs).
*   **Modales :** Classes utilitaires pour le centrage et le backdrop des mentions légales.
*   **Variables CSS :** Utilisation de `--bg-secondary`, `--text-primary` pour faciliter le basculement Dark/Light mode de manière fluide.

### 💻 Installation et Développement

Pour tester le projet localement, il est nécessaire d'utiliser un petit serveur web car les navigateurs bloquent souvent le chargement de fichiers JSON locaux (CORS Policy).

1.  **Cloner le projet :**
    ```bash
    git clone https://github.com/votre-user/gigafaith.git
    cd gigafaith
    ```

2.  **Lancer un serveur local :**
    *   Avec Node.js (npx) :
        ```bash
        npx serve .
        ```
    *   Ou avec Python :
        ```bash
        python3 -m http.server
        ```

3.  **Accéder :** Ouvrez `http://localhost:3000` (ou le port indiqué).

### 🤝 Contribuer

**Ajouter une nouvelle langue :**
1.  Copiez `fr.json` vers `xx.json` (code langue).
2.  Traduisez les valeurs.
3.  Ajoutez le code `'xx'` dans le tableau `availableLanguages` de `script.js`.
4.  Ajoutez le bouton dans le menu HTML.

**Ajouter une fête :**
Éditez le tableau des fêtes dans `script.js`. Assurez-vous de définir le `type` (major, fixed, mobile) pour que la couleur de légende s'applique correctement.

---
*© 2025 GigaFaith - Code sous licence MIT.*
```