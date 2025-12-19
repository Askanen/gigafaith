// ==========================================
// GigaFaith - Calendrier des Fêtes Chrétiennes
// ==========================================

// État global de l'application
let currentDate = new Date();
let selectedYear = currentDate.getFullYear();
let currentHolidays = [];
let selectedHoliday = null;
let currentTheme = 'light';
let currentTab = 'holidays';
let currentLang = 'fr';

// ==========================================
// Système de traduction multilingue (chargement JSON)
// ==========================================
const translations = {};
const availableLanguages = ['fr', 'en', 'es', 'it', 'de', 'ko'];

// Traductions par défaut (fallback si JSON ne charge pas)
const defaultTranslations = {
    fr: {
        subtitle: "Calendrier des Fêtes Chrétiennes & Saints du Jour",
        saintOfDay: "Saint du jour",
        searchYear: "Rechercher une année",
        yearPlaceholder: "Année (-46 à 9999)",
        tabHolidays: "Fêtes",
        tabSaints: "Saints",
        emptyHolidays: "Entrez une année pour voir les fêtes chrétiennes",
        addToGoogle: "Ajouter à Google Calendar",
        legendMajor: "Fête majeure",
        legendMobile: "Fête mobile",
        legendFixed: "Fête fixe",
        legendToday: "Aujourd'hui",
        legendSaint: "Saint du jour",
        footerTitle: "Calendrier Chrétien",
        legalNotice: "Mentions légales",
        gdpr: "RGPD",
        footerCompliance: "Conforme au RGPD (UE 2016/679) et à la loi Informatique et Libertés",
        mon: "Lun", tue: "Mar", wed: "Mer", thu: "Jeu", fri: "Ven", sat: "Sam", sun: "Dim",
        months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
        isLeapYear: "est bissextile",
        isNotLeapYear: "n'est pas bissextile",
        days366: "366 jours - Février a 29 jours",
        days365: "365 jours - Février a 28 jours",
        impossible: "Impossible d'aller",
        beforeYear: "avant l'an 46 av. J.-C.",
        afterYear: "au-delà de l'an 9999",
        enterValidYear: "Veuillez entrer une année valide (-46 à 9999)",
        skippedDay: "Jour supprimé lors de la réforme grégorienne",
        churchCelebrates: "L'Église fête",
        eachDay: "Chaque jour de l'année est dédié à la mémoire d'un ou plusieurs saints qui ont témoigné de leur foi par leur vie exemplaire.",
        donateBtn: "Faire un don",
        donateTitle: "Faire un don à l'église",
        donateDescription: "Votre soutien permet de financer les activités paroissiales, la maintenance du bâtiment et les œuvres caritatives.",
        donateLinkText: "Faire un don",
        donateLinkUrl: "https://paypal.com",
        close: "Fermer",
        flag: "🇫🇷",
        calendarPreJulian: "Pré-Julien (Calendrier romain)",
        calendarJulian: "Julien",
        calendarTransition: "Transition Julien → Grégorien",
        calendarGregorianFirst: "Grégorien (1ère année complète)",
        calendarGregorian: "Grégorien",
        leapRuleRoman: "Système calendaire romain antique",
        leapRuleJulian: "Bissextile si divisible par 4",
        leapRuleTransition: "Année de transition",
        leapRuleGregorian: "Bissextile si divisible par 4, sauf les années séculaires non divisibles par 400",
        descPreJulian: "En {year}, le calendrier romain antique était en vigueur. Le calendrier Julien sera introduit en 45 av. J.-C.",
        descJulianBC: "En {year}, le calendrier Julien était en vigueur. Introduit par Jules César en 45 av. J.-C.",
        descJulianAD: "En {year}, le calendrier Julien était en vigueur. Il sera réformé en 1582.",
        descTransition: "{year} est l'année de la réforme grégorienne ! Le pape Grégoire XIII a supprimé 10 jours : on est passé du 4 octobre au 15 octobre 1582.",
        descGregorianFirst: "{year} est la première année complète du calendrier Grégorien. La différence avec le calendrier Julien était de 10 jours à cette époque.",
        descGregorian: "En {year}, le calendrier Grégorien est en vigueur.",
        easterGregorian: "Pâques (Grégorien)",
        easterJulian: "Pâques (Julien)",
        easterDaysDiff: "+{days} jours",
        noHolidaysBeforeYear0: "Pas de fêtes chrétiennes avant la naissance du Christ (25 décembre an 0)"
    }
};

// Initialiser avec les traductions par défaut
translations['fr'] = defaultTranslations.fr;

// Charger un fichier de traduction JSON
async function loadTranslationFile(lang) {
    try {
        const response = await fetch(`${lang}.json`);
        if (!response.ok) throw new Error(`Erreur chargement ${lang}.json`);
        translations[lang] = await response.json();
        return true;
    } catch (error) {
        console.warn(`Utilisation des traductions par défaut pour ${lang}`);
        // Utiliser les traductions par défaut si disponibles
        if (defaultTranslations[lang]) {
            translations[lang] = defaultTranslations[lang];
        }
        return false;
    }
}

// Charger toutes les traductions au démarrage
async function loadAllTranslations() {
    try {
        const promises = availableLanguages.map(lang => loadTranslationFile(lang));
        await Promise.all(promises);
    } catch (error) {
        console.warn('Erreur lors du chargement des traductions, utilisation du fallback');
    }
}

// Fonction pour obtenir une traduction
function t(key) {
    if (translations[currentLang] && translations[currentLang][key] !== undefined) {
        return translations[currentLang][key];
    }
    if (translations['fr'] && translations['fr'][key] !== undefined) {
        return translations['fr'][key];
    }
    return key;
}

// Fonction pour changer la langue
function setLanguage(lang) {
    if (!translations[lang]) {
        console.warn(`Traductions pour ${lang} non chargées, utilisation du français`);
        lang = 'fr';
        if (!translations[lang]) return;
    }
    
    currentLang = lang;
    localStorage.setItem('gigafaith-lang', lang);
    
    // Mettre à jour le drapeau actuel
    const currentFlagEl = document.getElementById('currentFlag');
    if (currentFlagEl) currentFlagEl.textContent = translations[lang].flag;
    
    // Mettre à jour tous les éléments avec data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key] !== undefined) {
            el.textContent = translations[lang][key];
        }
    });
    
    // Mettre à jour les placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[lang][key] !== undefined) {
            el.placeholder = translations[lang][key];
        }
    });
    
    // Mettre à jour les options de langue actives
    document.querySelectorAll('.lang-option').forEach(opt => {
        opt.classList.remove('active');
        if (opt.dataset.lang === lang) {
            opt.classList.add('active');
        }
    });
    
    // Rafraîchir le calendrier et les listes
    renderCalendar();
    if (selectedYear) {
        updateYearInfo();
    }
    
    // Fermer le dropdown
    const dropdown = document.getElementById('langDropdown');
    if (dropdown) {
        dropdown.classList.remove('show');
        dropdown.classList.add('hidden');
    }
}

// Charger la langue sauvegardée
async function loadLanguage() {
    // Charger toutes les traductions d'abord
    await loadAllTranslations();
    
    const savedLang = localStorage.getItem('gigafaith-lang') || 'fr';
    currentLang = savedLang;
    
    const currentFlagEl = document.getElementById('currentFlag');
    if (currentFlagEl && translations[savedLang]) {
        currentFlagEl.textContent = translations[savedLang].flag;
    }
    
    // Marquer l'option active
    document.querySelectorAll('.lang-option').forEach(opt => {
        if (opt.dataset.lang === savedLang) {
            opt.classList.add('active');
        }
    });
    
    // Appliquer les traductions
    setLanguage(savedLang);
}

// ==========================================
// Saints du jour (366 saints pour chaque jour de l'année)
// ==========================================
const saintsOfTheYear = {
    // Janvier
    "1-1": "Sainte Marie, Mère de Dieu",
    "1-2": "Saint Basile le Grand & Saint Grégoire de Nazianze",
    "1-3": "Sainte Geneviève",
    "1-4": "Sainte Angèle de Foligno",
    "1-5": "Saint Édouard le Confesseur",
    "1-6": "Épiphanie du Seigneur",
    "1-7": "Saint Raymond de Penyafort",
    "1-8": "Saint Lucien de Beauvais",
    "1-9": "Sainte Alix Le Clerc",
    "1-10": "Saint Guillaume de Bourges",
    "1-11": "Saint Paulin d'Aquilée",
    "1-12": "Sainte Marguerite Bourgeoys",
    "1-13": "Saint Hilaire de Poitiers",
    "1-14": "Sainte Nino",
    "1-15": "Saint Rémi",
    "1-16": "Saint Marcel Ier",
    "1-17": "Saint Antoine le Grand",
    "1-18": "Sainte Prisca",
    "1-19": "Saint Marius & Sainte Marthe",
    "1-20": "Saint Sébastien",
    "1-21": "Sainte Agnès",
    "1-22": "Saint Vincent de Saragosse",
    "1-23": "Saint Ildefonse de Tolède",
    "1-24": "Saint François de Sales",
    "1-25": "Conversion de Saint Paul",
    "1-26": "Saints Timothée et Tite",
    "1-27": "Sainte Angèle Merici",
    "1-28": "Saint Thomas d'Aquin",
    "1-29": "Saint Gildas le Sage",
    "1-30": "Sainte Martine",
    "1-31": "Saint Jean Bosco",
    // Février
    "2-1": "Sainte Ella",
    "2-2": "Présentation du Seigneur (Chandeleur)",
    "2-3": "Saint Blaise",
    "2-4": "Sainte Véronique",
    "2-5": "Sainte Agathe",
    "2-6": "Saint Paul Miki et ses compagnons",
    "2-7": "Sainte Eugénie",
    "2-8": "Sainte Jacqueline",
    "2-9": "Sainte Apolline",
    "2-10": "Sainte Scholastique",
    "2-11": "Notre-Dame de Lourdes",
    "2-12": "Saint Félix",
    "2-13": "Sainte Béatrice",
    "2-14": "Saints Cyrille et Méthode",
    "2-15": "Saint Claude La Colombière",
    "2-16": "Sainte Julienne de Nicomédie",
    "2-17": "Saint Alexis Falconieri",
    "2-18": "Sainte Bernadette Soubirous",
    "2-19": "Saint Gabin",
    "2-20": "Sainte Aimée",
    "2-21": "Saint Pierre Damien",
    "2-22": "Chaire de Saint Pierre",
    "2-23": "Saint Polycarpe",
    "2-24": "Saint Modeste",
    "2-25": "Saint Roméo",
    "2-26": "Saint Nestor",
    "2-27": "Sainte Honorine",
    "2-28": "Saint Romain",
    "2-29": "Saint Auguste Chapdelaine",
    // Mars
    "3-1": "Saint Aubin",
    "3-2": "Saint Charles le Bon",
    "3-3": "Sainte Cunégonde",
    "3-4": "Saint Casimir",
    "3-5": "Sainte Olive",
    "3-6": "Sainte Colette",
    "3-7": "Saintes Perpétue et Félicité",
    "3-8": "Saint Jean de Dieu",
    "3-9": "Sainte Françoise Romaine",
    "3-10": "Saint Vivien",
    "3-11": "Sainte Rosine",
    "3-12": "Sainte Justine",
    "3-13": "Saint Rodrigue",
    "3-14": "Sainte Mathilde",
    "3-15": "Sainte Louise de Marillac",
    "3-16": "Sainte Bénédicte",
    "3-17": "Saint Patrick",
    "3-18": "Saint Cyrille de Jérusalem",
    "3-19": "Saint Joseph",
    "3-20": "Sainte Claudia",
    "3-21": "Sainte Clémence",
    "3-22": "Sainte Léa",
    "3-23": "Saint Victorien",
    "3-24": "Sainte Catherine de Suède",
    "3-25": "Annonciation du Seigneur",
    "3-26": "Sainte Larissa",
    "3-27": "Saint Habib",
    "3-28": "Saint Gontran",
    "3-29": "Sainte Gladys",
    "3-30": "Saint Amédée",
    "3-31": "Saint Benjamin",
    // Avril
    "4-1": "Saint Hugues de Grenoble",
    "4-2": "Sainte Sandrine",
    "4-3": "Saint Richard",
    "4-4": "Saint Isidore de Séville",
    "4-5": "Sainte Irène",
    "4-6": "Saint Marcellin",
    "4-7": "Saint Jean-Baptiste de la Salle",
    "4-8": "Sainte Julie Billiart",
    "4-9": "Saint Gautier",
    "4-10": "Saint Fulbert",
    "4-11": "Saint Stanislas",
    "4-12": "Saint Jules Ier",
    "4-13": "Sainte Ida",
    "4-14": "Saint Maxime",
    "4-15": "Sainte Paterne",
    "4-16": "Saint Benoît-Joseph Labre",
    "4-17": "Saint Anicet",
    "4-18": "Saint Parfait",
    "4-19": "Sainte Emma",
    "4-20": "Sainte Odette",
    "4-21": "Saint Anselme",
    "4-22": "Saint Alexandre",
    "4-23": "Saint Georges",
    "4-24": "Saint Fidèle de Sigmaringen",
    "4-25": "Saint Marc",
    "4-26": "Sainte Alida",
    "4-27": "Sainte Zita",
    "4-28": "Saint Louis-Marie Grignion de Montfort",
    "4-29": "Sainte Catherine de Sienne",
    "4-30": "Saint Pie V",
    // Mai
    "5-1": "Saint Joseph travailleur",
    "5-2": "Saint Athanase",
    "5-3": "Saints Philippe et Jacques",
    "5-4": "Saint Sylvain",
    "5-5": "Sainte Judith",
    "5-6": "Sainte Prudence",
    "5-7": "Sainte Gisèle",
    "5-8": "Saint Désiré",
    "5-9": "Saint Pacôme",
    "5-10": "Saint Solange",
    "5-11": "Sainte Estelle",
    "5-12": "Saints Nérée et Achillée",
    "5-13": "Notre-Dame de Fatima",
    "5-14": "Saint Matthias",
    "5-15": "Sainte Denise",
    "5-16": "Saint Honoré",
    "5-17": "Saint Pascal Baylon",
    "5-18": "Saint Éric",
    "5-19": "Saint Yves",
    "5-20": "Saint Bernardin de Sienne",
    "5-21": "Saint Constantin",
    "5-22": "Sainte Rita",
    "5-23": "Saint Didier",
    "5-24": "Saint Donatien et Saint Rogatien",
    "5-25": "Sainte Sophie",
    "5-26": "Saint Philippe Néri",
    "5-27": "Saint Augustin de Cantorbéry",
    "5-28": "Saint Germain de Paris",
    "5-29": "Saint Aymard",
    "5-30": "Sainte Jeanne d'Arc",
    "5-31": "Visitation de la Vierge Marie",
    // Juin
    "6-1": "Saint Justin",
    "6-2": "Saints Marcellin et Pierre",
    "6-3": "Saint Charles Lwanga et ses compagnons",
    "6-4": "Sainte Clotilde",
    "6-5": "Saint Boniface",
    "6-6": "Saint Norbert",
    "6-7": "Saint Gilbert",
    "6-8": "Saint Médard",
    "6-9": "Saint Éphrem",
    "6-10": "Saint Landry",
    "6-11": "Saint Barnabé",
    "6-12": "Saint Guy",
    "6-13": "Saint Antoine de Padoue",
    "6-14": "Saint Élisée",
    "6-15": "Sainte Germaine Cousin",
    "6-16": "Saint Jean-François Régis",
    "6-17": "Saint Hervé",
    "6-18": "Saint Léonce",
    "6-19": "Saint Romuald",
    "6-20": "Saint Sylvère",
    "6-21": "Saint Louis de Gonzague",
    "6-22": "Saint Paulin de Nole",
    "6-23": "Sainte Audrey",
    "6-24": "Nativité de Saint Jean-Baptiste",
    "6-25": "Saint Prosper d'Aquitaine",
    "6-26": "Saint Anthelme",
    "6-27": "Saint Fernand",
    "6-28": "Saint Irénée",
    "6-29": "Saints Pierre et Paul",
    "6-30": "Premiers Martyrs de l'Église de Rome",
    // Juillet
    "7-1": "Saint Thierry",
    "7-2": "Saint Martinien",
    "7-3": "Saint Thomas apôtre",
    "7-4": "Saint Florent",
    "7-5": "Saint Antoine-Marie Zaccaria",
    "7-6": "Sainte Maria Goretti",
    "7-7": "Saint Raoul",
    "7-8": "Saint Thibaut",
    "7-9": "Sainte Amandine",
    "7-10": "Saint Ulrich",
    "7-11": "Saint Benoît de Nursie",
    "7-12": "Saint Olivier",
    "7-13": "Saint Henri II",
    "7-14": "Saint Camille de Lellis",
    "7-15": "Saint Bonaventure",
    "7-16": "Notre-Dame du Mont-Carmel",
    "7-17": "Sainte Charlotte",
    "7-18": "Saint Frédéric",
    "7-19": "Saint Arsène",
    "7-20": "Sainte Marina",
    "7-21": "Saint Victor de Marseille",
    "7-22": "Sainte Marie-Madeleine",
    "7-23": "Sainte Brigitte de Suède",
    "7-24": "Sainte Christine",
    "7-25": "Saint Jacques le Majeur",
    "7-26": "Saints Joachim et Anne",
    "7-27": "Sainte Nathalie",
    "7-28": "Saint Samson",
    "7-29": "Sainte Marthe",
    "7-30": "Saint Pierre Chrysologue",
    "7-31": "Saint Ignace de Loyola",
    // Août
    "8-1": "Saint Alphonse de Liguori",
    "8-2": "Saint Eusèbe de Verceil",
    "8-3": "Sainte Lydie",
    "8-4": "Saint Jean-Marie Vianney",
    "8-5": "Saint Abel",
    "8-6": "Transfiguration du Seigneur",
    "8-7": "Saint Gaëtan",
    "8-8": "Saint Dominique",
    "8-9": "Sainte Thérèse-Bénédicte de la Croix",
    "8-10": "Saint Laurent",
    "8-11": "Sainte Claire d'Assise",
    "8-12": "Sainte Jeanne-Françoise de Chantal",
    "8-13": "Saints Pontien et Hippolyte",
    "8-14": "Saint Maximilien Kolbe",
    "8-15": "Assomption de la Vierge Marie",
    "8-16": "Saint Roch",
    "8-17": "Sainte Hyacinthe",
    "8-18": "Sainte Hélène",
    "8-19": "Saint Jean Eudes",
    "8-20": "Saint Bernard de Clairvaux",
    "8-21": "Saint Pie X",
    "8-22": "Vierge Marie Reine",
    "8-23": "Sainte Rose de Lima",
    "8-24": "Saint Barthélemy",
    "8-25": "Saint Louis IX",
    "8-26": "Sainte Natacha",
    "8-27": "Sainte Monique",
    "8-28": "Saint Augustin d'Hippone",
    "8-29": "Martyre de Saint Jean-Baptiste",
    "8-30": "Saint Fiacre",
    "8-31": "Saint Aristide",
    // Septembre
    "9-1": "Saint Gilles",
    "9-2": "Sainte Ingrid",
    "9-3": "Saint Grégoire le Grand",
    "9-4": "Sainte Rosalie",
    "9-5": "Sainte Raïssa",
    "9-6": "Saint Bertrand",
    "9-7": "Sainte Reine",
    "9-8": "Nativité de la Vierge Marie",
    "9-9": "Saint Pierre Claver",
    "9-10": "Sainte Inès",
    "9-11": "Saint Adelphe",
    "9-12": "Saint Apollinaire",
    "9-13": "Saint Jean Chrysostome",
    "9-14": "La Croix Glorieuse",
    "9-15": "Notre-Dame des Douleurs",
    "9-16": "Saints Corneille et Cyprien",
    "9-17": "Saint Robert Bellarmin",
    "9-18": "Sainte Nadège",
    "9-19": "Saint Janvier",
    "9-20": "Saints André Kim et Paul Chong",
    "9-21": "Saint Matthieu",
    "9-22": "Saint Maurice",
    "9-23": "Saint Padre Pio",
    "9-24": "Sainte Thècle",
    "9-25": "Saint Hermann Contract",
    "9-26": "Saints Côme et Damien",
    "9-27": "Saint Vincent de Paul",
    "9-28": "Saint Venceslas",
    "9-29": "Saints Michel, Gabriel et Raphaël",
    "9-30": "Saint Jérôme",
    // Octobre
    "10-1": "Sainte Thérèse de l'Enfant-Jésus",
    "10-2": "Saints Anges Gardiens",
    "10-3": "Saint Gérard",
    "10-4": "Saint François d'Assise",
    "10-5": "Sainte Fleur",
    "10-6": "Saint Bruno",
    "10-7": "Notre-Dame du Rosaire",
    "10-8": "Sainte Pélagie",
    "10-9": "Saint Denis et ses compagnons",
    "10-10": "Saint Ghislain",
    "10-11": "Saint Firmin",
    "10-12": "Saint Wilfried",
    "10-13": "Saint Géraud d'Aurillac",
    "10-14": "Saint Calliste Ier",
    "10-15": "Sainte Thérèse d'Avila",
    "10-16": "Sainte Hedwige",
    "10-17": "Saint Ignace d'Antioche",
    "10-18": "Saint Luc",
    "10-19": "Saints Jean de Brébeuf et Isaac Jogues",
    "10-20": "Sainte Adeline",
    "10-21": "Sainte Céline",
    "10-22": "Sainte Élodie",
    "10-23": "Saint Jean de Capistran",
    "10-24": "Saint Florentin",
    "10-25": "Saint Crépin et Saint Crépinien",
    "10-26": "Saint Dimitri",
    "10-27": "Sainte Émeline",
    "10-28": "Saints Simon et Jude",
    "10-29": "Saint Narcisse",
    "10-30": "Sainte Bienvenue",
    "10-31": "Saint Quentin",
    // Novembre
    "11-1": "Toussaint",
    "11-2": "Commémoration des fidèles défunts",
    "11-3": "Saint Martin de Porrès",
    "11-4": "Saint Charles Borromée",
    "11-5": "Sainte Sylvie",
    "11-6": "Sainte Bertille",
    "11-7": "Sainte Carine",
    "11-8": "Saint Geoffroy",
    "11-9": "Dédicace de la Basilique du Latran",
    "11-10": "Saint Léon le Grand",
    "11-11": "Saint Martin de Tours",
    "11-12": "Saint Christian",
    "11-13": "Saint Brice",
    "11-14": "Saint Sidoine",
    "11-15": "Saint Albert le Grand",
    "11-16": "Sainte Marguerite d'Écosse",
    "11-17": "Sainte Élisabeth de Hongrie",
    "11-18": "Dédicace des Basiliques Saint-Pierre et Saint-Paul",
    "11-19": "Sainte Tanguy",
    "11-20": "Saint Edmond",
    "11-21": "Présentation de la Vierge Marie",
    "11-22": "Sainte Cécile",
    "11-23": "Saint Clément Ier",
    "11-24": "Sainte Flora",
    "11-25": "Sainte Catherine d'Alexandrie",
    "11-26": "Sainte Delphine",
    "11-27": "Saint Séverin",
    "11-28": "Saint Jacques de la Marche",
    "11-29": "Saint Saturnin",
    "11-30": "Saint André",
    // Décembre
    "12-1": "Saint Éloi",
    "12-2": "Sainte Viviane",
    "12-3": "Saint François Xavier",
    "12-4": "Sainte Barbara",
    "12-5": "Saint Gérald",
    "12-6": "Saint Nicolas",
    "12-7": "Saint Ambroise",
    "12-8": "Immaculée Conception",
    "12-9": "Saint Pierre Fourier",
    "12-10": "Saint Romaric",
    "12-11": "Saint Daniel le Stylite",
    "12-12": "Notre-Dame de Guadalupe",
    "12-13": "Sainte Lucie",
    "12-14": "Saint Jean de la Croix",
    "12-15": "Sainte Ninon",
    "12-16": "Sainte Adélaïde",
    "12-17": "Saint Gaël",
    "12-18": "Saint Gatien",
    "12-19": "Saint Urbain V",
    "12-20": "Saint Théophile",
    "12-21": "Saint Pierre Canisius",
    "12-22": "Sainte Françoise-Xavière Cabrini",
    "12-23": "Saint Jean de Kenty",
    "12-24": "Sainte Adèle",
    "12-25": "Nativité du Seigneur (Noël)",
    "12-26": "Saint Étienne",
    "12-27": "Saint Jean l'Évangéliste",
    "12-28": "Saints Innocents",
    "12-29": "Saint Thomas Becket",
    "12-30": "Sainte Famille",
    "12-31": "Saint Sylvestre Ier"
};

// ==========================================
// Calcul de Pâques - Calendrier Grégorien (Algorithme de Meeus/Jones/Butcher)
// ==========================================
function calculateEasterGregorian(year) {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    
    return createDate(year, month - 1, day);
}

// ==========================================
// Calcul de Pâques - Calendrier Julien (Algorithme de Meeus)
// ==========================================
function calculateEasterJulian(year) {
    const a = year % 4;
    const b = year % 7;
    const c = year % 19;
    const d = (19 * c + 15) % 30;
    const e = (2 * a + 4 * b - d + 34) % 7;
    const month = Math.floor((d + e + 114) / 31);
    const day = ((d + e + 114) % 31) + 1;
    
    // Convertir la date julienne en date grégorienne
    // Pour 1583, l'écart est de 10 jours
    // L'écart augmente avec le temps selon les années séculaires
    let gregorianOffset = 10;
    if (year >= 1700) gregorianOffset = 11;
    if (year >= 1800) gregorianOffset = 12;
    if (year >= 1900) gregorianOffset = 13;
    if (year >= 2100) gregorianOffset = 14;
    
    const julianDate = createDate(year, month - 1, day);
    julianDate.setDate(julianDate.getDate() + gregorianOffset);
    
    return {
        julianDate: createDate(year, month - 1, day),
        gregorianEquivalent: julianDate,
        julianDay: day,
        julianMonth: month
    };
}

// ==========================================
// Calcul de Pâques (fonction générale)
// ==========================================
function calculateEaster(year) {
    // Pour les années avant 1583, utiliser le calendrier julien
    // Pour les années après, utiliser le grégorien
    if (year < 1583) {
        const julianEaster = calculateEasterJulian(year);
        return julianEaster.julianDate;
    }
    return calculateEasterGregorian(year);
}

// ==========================================
// Vérification année bissextile
// ==========================================
function isLeapYearGregorian(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function isLeapYearJulian(year) {
    return year % 4 === 0;
}

function isLeapYear(year) {
    // Le calendrier grégorien a été introduit en 1582
    if (year < 1582) {
        return isLeapYearJulian(year);
    }
    return isLeapYearGregorian(year);
}

// ==========================================
// Formater une année (gestion des années av. J.-C.)
// ==========================================
function formatYear(year) {
    if (year < 0) {
        // -1 = 1 av. J.-C., -2 = 2 av. J.-C., etc.
        return `${Math.abs(year)} av. J.-C.`;
    }
    if (year === 0) {
        // L'année 0 n'existe pas historiquement, mais on peut la traiter comme "an 0"
        // ou la convertir en "1 av. J.-C." selon la convention astronomique
        return `an 0`;
    }
    return `${year}`;
}

// ==========================================
// Créer une date en gérant correctement les petites années (0-99)
// ==========================================
function createDate(year, month, day) {
    const date = new Date(2000, month, day); // Créer avec une année valide d'abord
    date.setFullYear(year); // Puis forcer l'année correcte
    return date;
}

// Obtenir le nombre de jours dans un mois donné
function getDaysInMonth(year, month) {
    // Utiliser le mois suivant, jour 0 = dernier jour du mois précédent
    // On doit créer directement avec l'année correcte pour gérer les années bissextiles
    const date = new Date(year, month + 1, 0);
    // Pour les années 0-99, JavaScript les interprète comme 1900-1999, donc on corrige
    if (year >= 0 && year < 100) {
        date.setFullYear(year);
    }
    return date.getDate();
}

// ==========================================
// Information sur le type de calendrier
// ==========================================
function getCalendarInfo(year) {
    const displayYear = formatYear(year);
    const info = {
        isGregorian: year >= 1583,
        isJulian: year < 1582,
        isTransition: year === 1582,
        description: ''
    };
    
    if (year < -44) {
        info.description = t('descPreJulian').replace('{year}', displayYear);
        info.calendar = t('calendarPreJulian');
        info.leapRule = t('leapRuleRoman');
    } else if (year <= 0) {
        info.description = t('descJulianBC').replace('{year}', displayYear);
        info.calendar = t('calendarJulian');
        info.leapRule = t('leapRuleJulian');
    } else if (year < 1582) {
        info.description = t('descJulianAD').replace('{year}', displayYear);
        info.calendar = t('calendarJulian');
        info.leapRule = t('leapRuleJulian');
    } else if (year === 1582) {
        info.description = t('descTransition').replace('{year}', displayYear);
        info.calendar = t('calendarTransition');
        info.leapRule = t('leapRuleTransition');
    } else if (year === 1583) {
        info.description = t('descGregorianFirst').replace('{year}', displayYear);
        info.calendar = t('calendarGregorianFirst');
        info.leapRule = t('leapRuleGregorian');
    } else {
        info.description = t('descGregorian').replace('{year}', displayYear);
        info.calendar = t('calendarGregorian');
        info.leapRule = t('leapRuleGregorian');
    }
    
    return info;
}

// ==========================================
// Vérifier si un jour existe (pour octobre 1582)
// ==========================================
function isDaySkipped(year, month, day) {
    // En octobre 1582, les jours du 5 au 14 n'existent pas
    if (year === 1582 && month === 9 && day >= 5 && day <= 14) {
        return true;
    }
    return false;
}

// ==========================================
// Calcul de toutes les fêtes chrétiennes
// ==========================================
function getChristianHolidays(year) {
    // Pas de fêtes chrétiennes avant l'an 0 (avant Jésus-Christ)
    if (year < 0) {
        return [];
    }
    
    const easter = calculateEaster(year);
    const holidays = [];
    
    // Fonction helper pour ajouter des jours à une date
    const addDays = (date, days) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    };
    
    // Fêtes fixes (dates constantes)
    const fixedHolidays = [
        {
            date: createDate(year, 0, 1),
            name: t('holidayMaryMotherOfGod'),
            type: "fixed",
            description: t('holidayMaryMotherOfGodDesc')
        },
        {
            date: createDate(year, 0, 6),
            name: t('holidayEpiphany'),
            type: "major",
            description: t('holidayEpiphanyDesc')
        },
        {
            date: createDate(year, 1, 2),
            name: t('holidayPresentation'),
            type: "fixed",
            description: t('holidayPresentationDesc')
        },
        {
            date: createDate(year, 2, 19),
            name: t('holidaySaintJoseph'),
            type: "fixed",
            description: t('holidaySaintJosephDesc')
        },
        {
            date: createDate(year, 2, 25),
            name: t('holidayAnnunciation'),
            type: "major",
            description: t('holidayAnnunciationDesc')
        },
        {
            date: createDate(year, 5, 24),
            name: t('holidayJohnBaptistBirth'),
            type: "fixed",
            description: t('holidayJohnBaptistBirthDesc')
        },
        {
            date: createDate(year, 5, 29),
            name: t('holidayPeterPaul'),
            type: "major",
            description: t('holidayPeterPaulDesc')
        },
        {
            date: createDate(year, 7, 6),
            name: t('holidayTransfiguration'),
            type: "fixed",
            description: t('holidayTransfigurationDesc')
        },
        {
            date: createDate(year, 7, 15),
            name: t('holidayAssumption'),
            type: "major",
            description: t('holidayAssumptionDesc')
        },
        {
            date: createDate(year, 8, 8),
            name: t('holidayMaryBirth'),
            type: "fixed",
            description: t('holidayMaryBirthDesc')
        },
        {
            date: createDate(year, 8, 14),
            name: t('holidayHolyCross'),
            type: "fixed",
            description: t('holidayHolyCrossDesc')
        },
        {
            date: createDate(year, 10, 1),
            name: t('holidayAllSaints'),
            type: "major",
            description: t('holidayAllSaintsDesc')
        },
        {
            date: createDate(year, 10, 2),
            name: t('holidayAllSouls'),
            type: "fixed",
            description: t('holidayAllSoulsDesc')
        },
        {
            date: createDate(year, 11, 8),
            name: t('holidayImmaculateConception'),
            type: "major",
            description: t('holidayImmaculateConceptionDesc')
        },
        {
            date: createDate(year, 11, 25),
            name: t('holidayChristmas'),
            type: "major",
            description: t('holidayChristmasDesc')
        },
        {
            date: createDate(year, 11, 26),
            name: t('holidaySaintStephen'),
            type: "fixed",
            description: t('holidaySaintStephenDesc')
        },
        {
            date: createDate(year, 11, 27),
            name: t('holidaySaintJohn'),
            type: "fixed",
            description: t('holidaySaintJohnDesc')
        },
        {
            date: createDate(year, 11, 28),
            name: t('holidayHolyInnocents'),
            type: "fixed",
            description: t('holidayHolyInnocentsDesc')
        }
    ];
    
    // Fêtes mobiles (dépendantes de Pâques)
    const mobileHolidays = [
        {
            date: addDays(easter, -46),
            name: t('holidayAshWednesday'),
            type: "mobile",
            description: t('holidayAshWednesdayDesc')
        },
        {
            date: addDays(easter, -7),
            name: t('holidayPalmSunday'),
            type: "mobile",
            description: t('holidayPalmSundayDesc')
        },
        {
            date: addDays(easter, -3),
            name: t('holidayHolyThursday'),
            type: "mobile",
            description: t('holidayHolyThursdayDesc')
        },
        {
            date: addDays(easter, -2),
            name: t('holidayGoodFriday'),
            type: "major",
            description: t('holidayGoodFridayDesc')
        },
        {
            date: addDays(easter, -1),
            name: t('holidayHolySaturday'),
            type: "mobile",
            description: t('holidayHolySaturdayDesc')
        },
        {
            date: easter,
            name: t('holidayEaster'),
            type: "major",
            description: t('holidayEasterDesc')
        },
        {
            date: addDays(easter, 1),
            name: t('holidayEasterMonday'),
            type: "mobile",
            description: t('holidayEasterMondayDesc')
        },
        {
            date: addDays(easter, 7),
            name: t('holidayDivineMercy'),
            type: "mobile",
            description: t('holidayDivineMercyDesc')
        },
        {
            date: addDays(easter, 39),
            name: t('holidayAscension'),
            type: "major",
            description: t('holidayAscensionDesc')
        },
        {
            date: addDays(easter, 49),
            name: t('holidayPentecost'),
            type: "major",
            description: t('holidayPentecostDesc')
        },
        {
            date: addDays(easter, 50),
            name: t('holidayPentecostMonday'),
            type: "mobile",
            description: t('holidayPentecostMondayDesc')
        },
        {
            date: addDays(easter, 56),
            name: t('holidayTrinity'),
            type: "major",
            description: t('holidayTrinityDesc')
        },
        {
            date: addDays(easter, 60),
            name: t('holidayCorpusChristi'),
            type: "major",
            description: t('holidayCorpusChristiDesc')
        },
        {
            date: addDays(easter, 68),
            name: t('holidaySacredHeart'),
            type: "major",
            description: t('holidaySacredHeartDesc')
        }
    ];
    
    // Calcul du Christ Roi (dernier dimanche avant l'Avent, donc 34e dimanche ordinaire)
    const christmasDay = createDate(year, 11, 25);
    const christmasWeekday = christmasDay.getDay();
    const fourthSundayAdvent = createDate(year, 11, 25 - christmasWeekday);
    const firstSundayAdvent = new Date(fourthSundayAdvent);
    firstSundayAdvent.setDate(firstSundayAdvent.getDate() - 21);
    const christTheKing = new Date(firstSundayAdvent);
    christTheKing.setDate(christTheKing.getDate() - 7);
    
    mobileHolidays.push({
        date: christTheKing,
        name: t('holidayChristKing'),
        type: "major",
        description: t('holidayChristKingDesc')
    });
    
    // Premier dimanche de l'Avent
    mobileHolidays.push({
        date: firstSundayAdvent,
        name: t('holidayAdvent'),
        type: "mobile",
        description: t('holidayAdventDesc')
    });
    
    // Combiner toutes les fêtes
    holidays.push(...fixedHolidays, ...mobileHolidays);
    
    // Trier par date
    holidays.sort((a, b) => a.date - b.date);
    
    // Pour l'an 0, ne garder que les fêtes à partir de Noël (25 décembre)
    // Car Jésus est né le 25 décembre de l'an 0
    if (year === 0) {
        return holidays.filter(h => h.date.getMonth() === 11 && h.date.getDate() >= 25);
    }
    
    return holidays;
}

// ==========================================
// Obtenir le saint du jour
// ==========================================
function getSaintOfDay(month, day) {
    const key = `${month}-${day}`;
    return saintsOfTheYear[key] || "Saint(e) du jour";
}

// ==========================================
// Rendu du calendrier
// ==========================================
function renderCalendar() {
    const grid = document.getElementById('calendarGrid');
    const monthDisplay = document.getElementById('currentMonth');
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Afficher le mois et l'année avec traduction
    const monthNames = t('months');
    monthDisplay.textContent = `${monthNames[month]} ${formatYear(year)}`;
    
    // Premier jour du mois (0 = Dimanche, ajusté pour commencer le Lundi)
    const firstDay = createDate(year, month, 1);
    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;
    
    // Nombre de jours dans le mois
    const daysInMonth = getDaysInMonth(year, month);
    
    // Récupérer les fêtes pour l'année courante
    const holidays = getChristianHolidays(year);
    
    // Créer la grille
    grid.innerHTML = '';
    
    // Jours vides au début
    for (let i = 0; i < startDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty rounded-lg';
        grid.appendChild(emptyDay);
    }
    
    // Jours du mois
    const today = new Date();
    
    for (let day = 1; day <= daysInMonth; day++) {
        // Vérifier si ce jour a été supprimé (octobre 1582)
        if (isDaySkipped(year, month, day)) {
            const skippedDay = document.createElement('div');
            skippedDay.className = 'calendar-day rounded-lg p-2 text-center skipped-day';
            skippedDay.innerHTML = `<span class="line-through opacity-30">${day}</span>`;
            skippedDay.title = t('skippedDay');
            grid.appendChild(skippedDay);
            continue;
        }
        
        const dayElement = document.createElement('div');
        const currentDayDate = createDate(year, month, day);
        
        // Vérifier si c'est aujourd'hui
        const isToday = today.getDate() === day && 
                       today.getMonth() === month && 
                       today.getFullYear() === year;
        
        // Trouver les fêtes pour ce jour
        const dayHolidays = holidays.filter(h => 
            h.date.getDate() === day && 
            h.date.getMonth() === month
        );
        
        // Obtenir le saint du jour
        const saintOfDay = getSaintOfDay(month + 1, day);
        
        // Classes de base
        let classes = 'calendar-day rounded-lg p-2 text-center';
        
        // Ajouter les classes selon le type de fête
        if (dayHolidays.length > 0) {
            const holiday = dayHolidays[0];
            if (holiday.type === 'major') {
                classes += ' holiday-major';
            } else if (holiday.type === 'mobile') {
                classes += ' holiday-mobile';
            } else {
                classes += ' holiday-fixed';
            }
            classes += ' has-holiday';
        }
        
        if (isToday) {
            classes += ' today';
        }
        
        dayElement.className = classes;
        
        // Contenu du jour
        let content = `<span class="font-bold">${day}</span>`;
        if (dayHolidays.length > 0) {
            content += `<div class="text-xs mt-1 truncate day-name">${dayHolidays[0].name.split(' ')[0]}...</div>`;
        }
        
        dayElement.innerHTML = content;
        
        // Event listener pour ouvrir le modal
        if (dayHolidays.length > 0) {
            dayElement.addEventListener('click', () => {
                checkEasterEgg(year, month, day);
                openModal(dayHolidays[0]);
            });
            dayElement.style.cursor = 'pointer';
            dayElement.title = dayHolidays[0].name;
        } else {
            // Afficher le saint du jour au clic
            dayElement.addEventListener('click', () => {
                checkEasterEgg(year, month, day);
                openModal({
                    name: saintOfDay,
                    date: currentDayDate,
                    type: 'saint',
                    description: `${t('churchCelebrates')} ${saintOfDay}. ${t('eachDay')}`
                });
            });
            dayElement.title = saintOfDay;
        }
        
        grid.appendChild(dayElement);
    }
    
    // Mettre à jour le saint du jour dans l'en-tête
    updateTodaySaint();
}

// ==========================================
// Mettre à jour le saint du jour affiché
// ==========================================
function updateTodaySaint() {
    const today = new Date();
    const saint = getSaintOfDay(today.getMonth() + 1, today.getDate());
    const saintElement = document.getElementById('todaySaint');
    if (saintElement) {
        saintElement.textContent = saint;
    }
}

// ==========================================
// Modal
// ==========================================
function openModal(holiday) {
    selectedHoliday = holiday;
    const modal = document.getElementById('holidayModal');
    const title = document.getElementById('modalTitle');
    const dateSpan = document.getElementById('modalDate').querySelector('span');
    const description = document.getElementById('modalDescription');
    
    title.textContent = holiday.name;
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateSpan.textContent = holiday.date.toLocaleDateString('fr-FR', options);
    
    description.textContent = holiday.description;
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    modal.querySelector('.modal-content').classList.add('modal-enter');
}

function closeModal() {
    const modal = document.getElementById('holidayModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    selectedHoliday = null;
}

// ==========================================
// Google Calendar Integration
// ==========================================
function addToGoogleCalendar() {
    if (!selectedHoliday) return;
    
    const date = selectedHoliday.date;
    const startDate = formatDateForGoogle(date);
    const endDate = formatDateForGoogle(new Date(date.getTime() + 86400000)); // +1 jour
    
    const title = encodeURIComponent(selectedHoliday.name);
    const details = encodeURIComponent(selectedHoliday.description);
    
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}`;
    
    window.open(url, '_blank');
}

function formatDateForGoogle(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}

// ==========================================
// Gestion des thèmes
// ==========================================
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

// ==========================================
// Gestion des onglets
// ==========================================
function switchTab(tab) {
    currentTab = tab;
    
    // Mettre à jour les boutons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tab) {
            btn.classList.add('active');
        }
    });
    
    // Afficher/masquer les listes
    const holidaysList = document.getElementById('holidaysList');
    const saintsList = document.getElementById('saintsList');
    
    if (tab === 'holidays') {
        holidaysList.classList.remove('hidden');
        saintsList.classList.add('hidden');
    } else {
        holidaysList.classList.add('hidden');
        saintsList.classList.remove('hidden');
    }
}

// ==========================================
// Recherche d'année et affichage des fêtes
// ==========================================
function searchYear() {
    const yearInput = document.getElementById('yearInput');
    const year = parseInt(yearInput.value);
    
    if (isNaN(year) || year < -46 || year > 9999) {
        alert(t('enterValidYear'));
        return;
    }
    
    selectedYear = year;
    
    // Mettre à jour le calendrier pour cette année
    currentDate = createDate(year, currentDate.getMonth(), 1);
    renderCalendar();
    
    // Afficher le résultat bissextile
    const leapResult = document.getElementById('leapYearResult');
    leapResult.classList.remove('hidden');
    
    const leapYearGregorian = isLeapYearGregorian(year);
    const leapYearJulian = isLeapYearJulian(year);
    const isLeap = isLeapYear(year);
    
    const displayYear = formatYear(year);
    
    if (isLeap) {
        leapResult.className = 'mb-4 p-4 rounded-lg text-center leap-yes';
        leapResult.innerHTML = `
            <i class="fas fa-check-circle leap-icon text-2xl mb-2 leap-badge"></i>
            <p class="leap-title font-bold">${displayYear} ${t('isLeapYear')}</p>
            <p class="leap-subtitle text-sm">${t('days366')}</p>
        `;
    } else {
        leapResult.className = 'mb-4 p-4 rounded-lg text-center leap-no';
        leapResult.innerHTML = `
            <i class="fas fa-times-circle leap-icon text-2xl mb-2"></i>
            <p class="leap-title font-bold">${displayYear} ${t('isNotLeapYear')}</p>
            <p class="leap-subtitle text-sm">${t('days365')}</p>
        `;
    }
    
    // Afficher les informations sur le calendrier
    displayCalendarInfo(year);
    
    // Afficher la liste des fêtes
    displayHolidaysList(year);
    
    // Afficher la liste des saints
    displaySaintsList(year);
}

// ==========================================
// Afficher les informations sur le calendrier Julien/Grégorien
// ==========================================
function displayCalendarInfo(year) {
    const calendarInfo = document.getElementById('calendarInfo');
    const info = getCalendarInfo(year);
    
    calendarInfo.classList.remove('hidden');
    calendarInfo.className = 'mb-4 p-4 rounded-lg calendar-info';
    
    let easterInfo = '';
    if (year < 1582) {
        const julianEaster = calculateEasterJulian(year);
        const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai'];
        easterInfo = `<p class="text-sm mt-2"><i class="fas fa-cross mr-1"></i> Pâques (Julien) : ${julianEaster.julianDay} ${monthNames[julianEaster.julianMonth - 1]}</p>`;
    } else if (year === 1583) {
        const gregorianEaster = calculateEasterGregorian(year);
        const julianEaster = calculateEasterJulian(year);
        const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai'];
        const options = { day: 'numeric', month: 'long' };
        easterInfo = `
            <p class="text-sm mt-2"><i class="fas fa-cross mr-1"></i> Pâques (Grégorien) : ${gregorianEaster.toLocaleDateString('fr-FR', options)}</p>
            <p class="text-sm"><i class="fas fa-cross mr-1"></i> Pâques (Julien) : ${julianEaster.julianDay} ${monthNames[julianEaster.julianMonth - 1]} (+10 jours)</p>
        `;
    }
    
    calendarInfo.innerHTML = `
        <div class="flex items-start gap-2">
            <i class="fas fa-calendar-alt calendar-info-title text-xl mt-1"></i>
            <div>
                <p class="calendar-info-title font-bold">${info.calendar}</p>
                <p class="calendar-info-text text-sm mt-1">${info.description}</p>
                <p class="calendar-info-text text-xs mt-2 italic">${info.leapRule}</p>
                ${easterInfo}
            </div>
        </div>
    `;
}

function displayHolidaysList(year) {
    const container = document.getElementById('holidaysList');
    const holidays = getChristianHolidays(year);
    
    // Message si pas de fêtes (avant l'an 0)
    if (holidays.length === 0) {
        container.innerHTML = `<p class="empty-text text-center">${t('noHolidaysBeforeYear0')}</p>`;
        return;
    }
    
    container.innerHTML = holidays.map(holiday => {
        const options = { day: 'numeric', month: 'short' };
        const dateStr = holiday.date.toLocaleDateString('fr-FR', options);
        
        let dotClass = '';
        let typeLabel = '';
        
        switch (holiday.type) {
            case 'major':
                dotClass = 'bg-amber-500';
                typeLabel = 'Majeure';
                break;
            case 'mobile':
                dotClass = 'bg-sky-500';
                typeLabel = 'Mobile';
                break;
            default:
                dotClass = 'bg-emerald-500';
                typeLabel = 'Fixe';
        }
        
        return `
            <div class="holiday-item rounded-lg p-3 cursor-pointer"
                 onclick='showHolidayFromList(${JSON.stringify(holiday).replace(/'/g, "\\'")})'> 
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <span class="holiday-dot ${dotClass}"></span>
                        <div>
                            <p class="holiday-item-name font-semibold text-sm">${holiday.name}</p>
                            <p class="holiday-item-date text-xs">${dateStr}</p>
                        </div>
                    </div>
                    <span class="text-xs px-2 py-1 rounded ${dotClass} bg-opacity-20" style="color: inherit;">${typeLabel}</span>
                </div>
            </div>
        `;
    }).join('');
}

// ==========================================
// Afficher la liste des saints
// ==========================================
function displaySaintsList(year) {
    const container = document.getElementById('saintsList');
    const monthNames = t('months');
    
    let html = '';
    
    for (let month = 1; month <= 12; month++) {
        const daysInMonth = createDate(year, month, 0).getDate();
        
        html += `<div class="mb-4">
            <h4 class="font-bold panel-title text-sm mb-2 sticky top-0 py-1" style="background: var(--panel-bg);">${monthNames[month - 1]}</h4>
        `;
        
        for (let day = 1; day <= daysInMonth; day++) {
            const saint = getSaintOfDay(month, day);
            const date = createDate(year, month - 1, day);
            
            html += `
                <div class="saint-item mb-1" onclick='showSaintFromList("${saint}", ${year}, ${month}, ${day})'>
                    <div class="flex items-center gap-2">
                        <span class="saint-item-date w-8">${day}</span>
                        <span class="saint-item-name text-sm">${saint}</span>
                    </div>
                </div>
            `;
        }
        
        html += '</div>';
    }
    
    container.innerHTML = html;
}

// Fonction pour afficher un saint depuis la liste
function showSaintFromList(saintName, year, month, day) {
    const date = createDate(year, month - 1, day);
    const monthNames = t('months');
    openModal({
        name: saintName,
        date: date,
        type: 'saint',
        description: `${t('churchCelebrates')} ${saintName} (${day} ${monthNames[month - 1]}). ${t('eachDay')}`
    });
    
    // Naviguer vers ce mois
    currentDate = createDate(year, month - 1, 1);
    renderCalendar();
}

// Fonction pour afficher une fête depuis la liste
function showHolidayFromList(holidayData) {
    // Recréer l'objet Date
    const holiday = {
        ...holidayData,
        date: new Date(holidayData.date)
    };
    
    // Naviguer vers le mois de la fête
    currentDate = new Date(holiday.date.getFullYear(), holiday.date.getMonth(), 1);
    renderCalendar();
    
    // Ouvrir le modal
    openModal(holiday);
}

// ==========================================
// Horloge temps réel
// ==========================================
function updateClock() {
    const clockElement = document.getElementById('liveTime');
    const now = new Date();
    const options = { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    };
    clockElement.textContent = now.toLocaleString('fr-FR', options);
}

// ==========================================
// Event Listeners
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Charger le thème sauvegardé
    loadTheme();
    
    // Charger la langue sauvegardée (non-bloquant)
    loadLanguage().catch(err => console.warn('Erreur chargement langue:', err));
    
    // Initialiser le calendrier
    renderCalendar();
    
    // Initialiser l'input avec l'année courante
    document.getElementById('yearInput').value = new Date().getFullYear();
    
    // Rechercher automatiquement l'année courante
    searchYear();
    
    // Navigation du calendrier
    document.getElementById('prevMonth').addEventListener('click', () => {
        // Vérifier si on ne va pas dépasser -46
        const testDate = new Date(currentDate);
        testDate.setMonth(testDate.getMonth() - 1);
        if (testDate.getFullYear() < -46) {
            showNotification(`${t('impossible')} ${t('beforeYear')}`);
            return;
        }
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
        updateYearInfo();
    });
    
    document.getElementById('nextMonth').addEventListener('click', () => {
        // Vérifier si on ne va pas dépasser 9999
        const testDate = new Date(currentDate);
        testDate.setMonth(testDate.getMonth() + 1);
        if (testDate.getFullYear() > 9999) {
            showNotification(`${t('impossible')} ${t('afterYear')}`);
            return;
        }
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
        updateYearInfo();
    });
    
    // Recherche
    document.getElementById('searchBtn').addEventListener('click', searchYear);
    document.getElementById('yearInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchYear();
    });
    
    // Modal
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('holidayModal').addEventListener('click', (e) => {
        if (e.target.id === 'holidayModal') closeModal();
    });
    
    // Google Calendar
    document.getElementById('addToGoogleCalendar').addEventListener('click', addToGoogleCalendar);
    
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Language dropdown
    document.getElementById('langToggle').addEventListener('click', (e) => {
        e.stopPropagation();
        const dropdown = document.getElementById('langDropdown');
        dropdown.classList.toggle('hidden');
        dropdown.classList.toggle('show');
    });
    
    // Language options
    document.querySelectorAll('.lang-option').forEach(opt => {
        opt.addEventListener('click', () => {
            setLanguage(opt.dataset.lang);
        });
    });
    
    // Donate button
    const donateBtn = document.getElementById('donateBtn');
    if (donateBtn) {
        donateBtn.addEventListener('click', () => {
            showDonateModal();
        });
    }

    // Close donate modal button(s)
    const closeDonateBtn = document.getElementById('closeDonateModal');
    if (closeDonateBtn) closeDonateBtn.addEventListener('click', closeDonateModal);
    const closeDonateFooterBtn = document.getElementById('closeDonateModalFooter');
    if (closeDonateFooterBtn) closeDonateFooterBtn.addEventListener('click', closeDonateModal);

    // Close donate modal by clicking overlay
    const donateModal = document.getElementById('donateModal');
    if (donateModal) donateModal.addEventListener('click', (e) => { if (e.target.id === 'donateModal') closeDonateModal(); });

    // Fermer le dropdown si on clique ailleurs
    document.addEventListener('click', () => {
        const dropdown = document.getElementById('langDropdown');
        dropdown.classList.add('hidden');
        dropdown.classList.remove('show');
    });
    
    // Tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
    
    // Horloge
    updateClock();
    setInterval(updateClock, 1000);
    
    // Actualisation automatique du calendrier toutes les minutes
    setInterval(() => {
        renderCalendar();
    }, 60000);
});

// ==========================================
// Mettre à jour les infos de l'année lors de la navigation
// ==========================================
function updateYearInfo() {
    const year = currentDate.getFullYear();
    
    // Mettre à jour l'input
    document.getElementById('yearInput').value = year;
    
    // Mettre à jour l'affichage bissextile
    const leapResult = document.getElementById('leapYearResult');
    const isLeap = isLeapYear(year);
    const displayYear = formatYear(year);
    
    leapResult.classList.remove('hidden');
    
    if (isLeap) {
        leapResult.className = 'mb-4 p-4 rounded-lg text-center leap-yes';
        leapResult.innerHTML = `
            <i class="fas fa-check-circle leap-icon text-2xl mb-2 leap-badge"></i>
            <p class="leap-title font-bold">${displayYear} ${t('isLeapYear')}</p>
            <p class="leap-subtitle text-sm">${t('days366')}</p>
        `;
    } else {
        leapResult.className = 'mb-4 p-4 rounded-lg text-center leap-no';
        leapResult.innerHTML = `
            <i class="fas fa-times-circle leap-icon text-2xl mb-2"></i>
            <p class="leap-title font-bold">${displayYear} ${t('isNotLeapYear')}</p>
            <p class="leap-subtitle text-sm">${t('days365')}</p>
        `;
    }
    
    // Mettre à jour les infos du calendrier
    displayCalendarInfo(year);
    
    // Mettre à jour les listes
    displayHolidaysList(year);
    displaySaintsList(year);
}

// ==========================================
// Notification toast
// ==========================================
function showNotification(message) {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = 'notification-toast';
    notification.innerHTML = `
        <i class="fas fa-info-circle mr-2"></i>
        ${message}
    `;
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Supprimer après 3 secondes
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ==========================================
// Easter Eggs - Animations spéciales
// ==========================================
function triggerEasterEgg(type, message = '') {
    const container = document.createElement('div');
    container.className = 'easter-egg-container';
    document.body.appendChild(container);
    
    // Afficher le message d'anniversaire si présent
    if (message) {
        const msgElement = document.createElement('div');
        msgElement.className = 'easter-egg-message';
        msgElement.innerHTML = `<span>🎂 ${message} 🎂</span>`;
        container.appendChild(msgElement);
    }
    
    let emoji, count, animation;
    
    switch(type) {
        case 'christmas':
            // 25 décembre - Guirlandes
            emoji = ['🎄', '🎁', '⭐', '🔔', '❄️', '🎅'];
            count = 50;
            animation = 'fall';
            break;
        case 'croissant':
            // 14 mars 1972 - Croissants
            emoji = ['🥐'];
            count = 40;
            animation = 'fall';
            break;
        case 'fireworks':
            // 11 août 1998 - Feux d'artifice
            emoji = ['🎆', '🎇', '✨', '💥', '🌟'];
            count = 60;
            animation = 'firework';
            break;
        case 'balloons':
            // 10 juillet 2006 - Ballons qui montent
            emoji = ['🎈', '🎈', '🎈', '⚽', '🏆'];
            count = 40;
            animation = 'rise';
            break;
        case 'dumbbells':
            // 17 décembre 1999 - Haltères
            emoji = ['🏋️', '💪', '🏋️‍♂️', '🏋️‍♀️'];
            count = 35;
            animation = 'fall';
            break;
        default:
            return;
    }
    
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = `easter-egg-particle ${animation}`;
        particle.textContent = emoji[Math.floor(Math.random() * emoji.length)];
        particle.style.fontSize = (Math.random() * 20 + 20) + 'px';
        
        if (animation === 'firework') {
            // Feux d'artifice : partir de positions aléatoires avec délais étalés
            const startX = Math.random() * 80 + 10; // 10% - 90% de la largeur
            const startY = Math.random() * 40 + 30; // 30% - 70% de la hauteur
            particle.style.left = startX + 'vw';
            particle.style.top = startY + 'vh';
            const angle = Math.random() * 360;
            const distance = Math.random() * 30 + 15;
            particle.style.setProperty('--tx', Math.cos(angle * Math.PI / 180) * distance + 'vw');
            particle.style.setProperty('--ty', Math.sin(angle * Math.PI / 180) * distance + 'vh');
            particle.style.animationDelay = (Math.random() * 3) + 's';
        } else {
            particle.style.left = Math.random() * 100 + 'vw';
            particle.style.animationDelay = Math.random() * 2 + 's';
        }
        
        container.appendChild(particle);
    }
    
    // Supprimer après l'animation
    setTimeout(() => container.remove(), 6000);
}

// Vérifier si c'est une date easter egg au clic
function checkEasterEgg(year, month, day) {
    // 25 décembre (n'importe quelle année) - Noël
    if (month === 11 && day === 25) {
        triggerEasterEgg('christmas');
        return true;
    }
    // 14 mars 1972 - Anniversaire Julien BLANC
    if (year === 1972 && month === 2 && day === 14) {
        triggerEasterEgg('croissant', 'Anniversaire Julien BLANC');
        return true;
    }
    // 11 août 1998 - Anniversaire Antoine BIANCONI
    if (year === 1998 && month === 7 && day === 11) {
        triggerEasterEgg('fireworks', 'Anniversaire Antoine BIANCONI');
        return true;
    }
    // 10 juillet 2006 - Anniversaire Doryan GOHIER
    if (year === 2006 && month === 6 && day === 10) {
        triggerEasterEgg('balloons', 'Anniversaire Doryan GOHIER');
        return true;
    }
    // 17 décembre 1999 - Anniversaire Alexandre GUILLIER
    if (year === 1999 && month === 11 && day === 17) {
        triggerEasterEgg('dumbbells', 'Anniversaire Alexandre GUILLIER');
        return true;
    }
    return false;
}

// ==========================================
// Mentions légales - Modal
// ==========================================
function showLegalNotice() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 modal-overlay flex items-center justify-center z-50 p-4';
    modal.id = 'legalModal';
    modal.onclick = function(e) { if (e.target === modal) closeLegalModal(); };
    modal.innerHTML = `
        <div class="legal-modal-content modal-content rounded-2xl max-w-2xl w-full shadow-2xl modal-enter flex flex-col" style="max-height: 90vh;">
            <div class="flex justify-between items-center p-6 pb-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-inherit rounded-t-2xl" style="background: var(--modal-bg);">
                <h3 class="text-2xl font-bold modal-title">
                    <i class="fas fa-gavel text-amber-500 mr-2"></i>
                    ${t('legalTitle')}
                </h3>
                <button onclick="closeLegalModal()" class="modal-close text-2xl transition-all hover:text-red-500 p-2">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="modal-description space-y-4 text-sm leading-relaxed p-6 overflow-y-auto flex-1 custom-scrollbar">
                <section>
                    <h4 class="font-bold text-lg mb-2 text-amber-600">${t('legalSection1Title')}</h4>
                    <p>${t('legalSection1Text1')}</p>
                    <p>${t('legalSection1Text2')}</p>
                </section>
                
                <section>
                    <h4 class="font-bold text-lg mb-2 text-amber-600">${t('legalSection2Title')}</h4>
                    <p>${t('legalSection2Text')}</p>
                </section>
                
                <section>
                    <h4 class="font-bold text-lg mb-2 text-amber-600">${t('legalSection3Title')}</h4>
                    <p>${t('legalSection3Intro')}</p>
                    <ul class="list-disc list-inside mt-2 space-y-1">
                        <li><strong>${t('legalSection3Item1').split(':')[0]}:</strong>${t('legalSection3Item1').split(':').slice(1).join(':')}</li>
                        <li><strong>${t('legalSection3Item2').split(':')[0]}:</strong>${t('legalSection3Item2').split(':').slice(1).join(':')}</li>
                        <li><strong>${t('legalSection3Item3').split(':')[0]}:</strong>${t('legalSection3Item3').split(':').slice(1).join(':')}</li>
                        <li><strong>${t('legalSection3Item4').split(':')[0]}:</strong>${t('legalSection3Item4').split(':').slice(1).join(':')}</li>
                    </ul>
                </section>
                
                <section>
                    <h4 class="font-bold text-lg mb-2 text-amber-600">${t('legalSection4Title')}</h4>
                    <p>${t('legalSection4Intro')}</p>
                    <ul class="list-disc list-inside mt-2 space-y-1">
                        <li>${t('legalSection4Item1')}</li>
                        <li>${t('legalSection4Item2')}</li>
                        <li>${t('legalSection4Item3')}</li>
                        <li>${t('legalSection4Item4')}</li>
                        <li>${t('legalSection4Item5')}</li>
                        <li>${t('legalSection4Item6')}</li>
                    </ul>
                    <p class="mt-2">${t('legalSection4Note')}</p>
                </section>
                
                <section>
                    <h4 class="font-bold text-lg mb-2 text-amber-600">${t('legalSection5Title')}</h4>
                    <p>${t('legalSection5Text')}</p>
                </section>
                
                <section>
                    <h4 class="font-bold text-lg mb-2 text-amber-600">${t('legalSection6Title')}</h4>
                    <p>${t('legalSection6Intro')}</p>
                    <ul class="list-disc list-inside mt-2 space-y-1">
                        <li>${t('legalSection6Item1')}</li>
                        <li>${t('legalSection6Item2')}</li>
                        <li>${t('legalSection6Item3')}</li>
                    </ul>
                </section>
                
                <section>
                    <h4 class="font-bold text-lg mb-2 text-amber-600">${t('legalSection7Title')}</h4>
                    <p>${t('legalSection7Intro')}</p>
                    <p class="mt-1">${t('legalSection7Authority')}</p>
                    <p>${t('legalSection7Address')}</p>
                    <p><a href="https://${t('legalSection7Website')}" target="_blank" class="text-amber-500 hover:underline">${t('legalSection7Website')}</a></p>
                </section>
            </div>
            
            <div class="p-6 pt-4 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 rounded-b-2xl" style="background: var(--modal-bg);">
                <button onclick="closeLegalModal()" class="w-full google-btn font-bold py-3 px-6 rounded-lg transition-all">
                    <i class="fas fa-check mr-2"></i>
                    ${t('legalUnderstood')}
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function closeLegalModal() {
    const modal = document.getElementById('legalModal');
    if (modal) modal.remove();
}

// Donate modal
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

function closeDonateModal() {
    const modal = document.getElementById('donateModal');
    if (modal) {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
    }
}

// Exposer les functions for onclick inline
window.showHolidayFromList = showHolidayFromList;
window.showSaintFromList = showSaintFromList;
window.showDonateModal = showDonateModal;
window.closeDonateModal = closeDonateModal;
