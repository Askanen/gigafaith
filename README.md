# ✝️ GigaFaith - Calendrier Chrétien & Saints du Jour

Une application web interactive dédiée au calendrier liturgique chrétien. Elle permet d'explorer les fêtes majeures, les saints du jour et de naviguer à travers l'histoire, depuis l'époque romaine jusqu'au futur lointain, en gérant les complexités des réformes calendaires (Julien vs Grégorien).

---

## 📖 Partie 1 : Guide Utilisateur

Bienvenue sur la documentation utilisateur. Cette section vous explique ce que l'application peut faire pour vous.

### ✨ Fonctionnalités Principales

*   **Calendrier Liturgique Complet :** Visualisez les fêtes chrétiennes (Pâques, Noël, Ascension, etc.) avec des indicateurs de couleur selon leur importance (Fête majeure, mobile ou fixe).
*   **Saints du Jour :** Découvrez quel Saint est célébré à une date précise.
*   **Voyage dans le Temps Historique :**
    *   **Avant 45 av. J.-C. :** Calendrier Romain.
    *   **De -45 à 1582 :** Calendrier Julien (introduit par Jules César).
    *   **1582 (Transition) :** Gestion de l'année historique où 10 jours ont été supprimés par le Pape Grégoire XIII.
    *   **Après 1582 :** Calendrier Grégorien moderne.
*   **Internationalisation :** Disponible en **Français, Anglais, Espagnol, Italien, Allemand et Coréen**.
*   **Personnalisation :**
    *   Thème **Clair / Sombre** (sauvegardé automatiquement).
    *   Horloge en temps réel.

### 🚀 Comment l'utiliser ?

1.  **Changement d'année :** Utilisez la barre de recherche ou les flèches de navigation pour aller à n'importe quelle année (de -46 à 9999).
2.  **Détails des fêtes :** Les points de couleur sous les dates indiquent le type de fête. Référez-vous à la légende en bas de page.
3.  **Mentions Légales :** Accessibles via le pied de page, elles respectent les normes RGPD (aucune collecte de donnée personnelle, stockage local des préférences uniquement).

---

## 🛠️ Partie 2 : Documentation Technique

Cette section est destinée aux développeurs souhaitant comprendre l'architecture, contribuer ou modifier le projet.

### 🏗️ Architecture Technique

*   **Frontend :** HTML5, CSS3, JavaScript (Vanilla ES6+).
*   **Styling :** [Tailwind CSS](https://tailwindcss.com/) (chargé via CDN) + `style.css` pour les animations personnalisées et les surcharges.
*   **Icônes :** FontAwesome (via CDN).
*   **Données :** Fichiers JSON pour les traductions (`fr.json`, `ko.json`, etc.).

### 📂 Structure des Fichiers

```text
/
├── index.html       # Structure DOM principale et templates
├── script.js        # Logique métier, calculs de date, gestion i18n
├── style.css        # Styles spécifiques (animations, modales, Easter eggs)
├── fr.json          # Fichier de traduction (Français)
├── en.json          # Fichier de traduction (Anglais)
├── ...              # Autres langues
└── README.md        # Documentation
```

### ⚙️ Logique Métier (`script.js`)

Le cœur de l'application repose sur plusieurs mécanismes clés :

#### 1. Gestion du Temps et Calendriers
Le script gère la complexité historique des dates :
*   **Fonction `isDaySkipped(year, month, day)` :** Gère spécifiquement le mois d'octobre 1582 où les jours du 5 au 14 n'existent pas (passage Julien -> Grégorien).
*   **Calcul de Pâques :** Algorithmes distincts pour le calcul de la date de Pâques selon le calendrier (Julien vs Grégorien).
*   **Année 0 :** Gestion spéciale pour l'affichage de la Nativité.

#### 2. Système d'Internationalisation (i18n)
*   Chargement asynchrone des fichiers JSON via `fetch`.
*   Variable `availableLanguages` : `['fr', 'en', 'es', 'it', 'de', 'ko']`.
*   Fallback automatique sur des valeurs par défaut si le chargement JSON échoue.

#### 3. Gestion de l'État et Stockage
*   Utilisation de `localStorage` pour persister le choix du thème (`gigafaith-theme`).
*   Aucun cookie de traçage tiers (conforme RGPD "Privacy by Design").

### 💻 Installation et Développement

Aucune étape de compilation (build) n'est nécessaire. C'est du "Vanilla JS".

**Pré-requis :**
Un navigateur web moderne ou un serveur statique local (recommandé pour éviter les erreurs CORS lors du chargement des JSON).

**Lancer le projet :**

1.  Cloner le dépôt :
    ```bash
    git clone https://github.com/votre-repo/gigafaith.git
    cd gigafaith
    ```

2.  Lancer un serveur local (exemple avec Node.js/npx) :
    ```bash
    npx serve .
    ```
    *Note : Ouvrir `index.html` directement peut bloquer le chargement des fichiers de langue `.json` à cause des politiques de sécurité des navigateurs (CORS).*

### 🧩 Guide de Personnalisation

#### Ajouter une nouvelle langue
1.  Dupliquez `fr.json` et renommez-le (ex: `pt.json`).
2.  Traduisez les valeurs.
3.  Dans `script.js`, ajoutez le code langue à la liste :
    ```javascript
    const availableLanguages = ['fr', 'en', 'es', 'it', 'de', 'ko', 'pt'];
    ```
4.  Dans `index.html`, ajoutez le bouton correspondant dans le menu déroulant.

#### Ajouter une fête ou un saint
Modifiez l'objet `saintsOfTheYear` ou le tableau des fêtes dans `script.js`.
*   **Type `major` :** Point rouge (fête importante).
*   **Type `fixed` :** Point bleu (date fixe).
*   **Type `mobile` :** Point vert (date calculée, comme Pâques).

---

## 📄 Licence et Contribution

**Licence :** MIT License.
**Contributions :** Les Pull Requests sont les bienvenues. Merci de respecter la structure existante et de tester la compatibilité 1582 (réforme grégorienne) lors modification des fonctions de date.

*© 2025 GigaFaith - Développé avec foi et code.*