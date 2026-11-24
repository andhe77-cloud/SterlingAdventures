import type { DialogLine, GameCase } from '../types/game';

export const F4_FINALE_INTRO_LINES: DialogLine[] = [
  {
    speakerId: 'cruisemanager',
    emotion: 'confident',
    sfx: 'alarm',
    text: 'MEINE DAMEN UND HERREN!! Willkommen zurück an Bord im Großen Ballsaal zur großen ABENDVERHANDLUNG!! Morgen endet unsere Mittelmeerreise im Heimathafen Athen — heute Abend fällt hier das endgültige Urteil!!',
  },
  {
    speakerId: 'pendelton',
    emotion: 'neutral',
    animation: 'slam',
    sfx: 'gavel_double',
    text: 'Ruhe im Ballsaal! Die vor Malta vertagte Hauptverhandlung gegen Mr. Andrew Higginson wird hiermit fortgesetzt. Verteidiger Sterling — Sie haben um Gehör zu Anklagepunkt 4 und zu den Beweisen aus Fall 1 gebeten.',
  },
  {
    speakerId: 'falk',
    emotion: 'smug',
    text: 'Einen Moment, Euer Ehren! Drei Randpunkte mögen gestern gewackelt haben — doch der 45.000-€-Brief an „A. H.“ steht nach wie vor wie ein Fels! Ich rufe den leitenden Ermittler Detective Frank Marston in den Zeugenstand, um dies ein für alle Mal zu bestätigen!',
    startsTestimonyId: 'testimony_f4_marston',
  },
];

export const F4_EPILOG_INTRO_LINES: DialogLine[] = [
  {
    speakerId: 'maya',
    emotion: 'confident',
    sfx: 'foghorn',
    text: 'Athen!! Spürst du diesen warmen Hafenwind im Gesicht, Nate?! Wir haben tatsächlich wieder festen griechischen Boden unter den Füßen — Ausschiffung erfolgreich überstanden!',
  },
  {
    speakerId: 'nate',
    emotion: 'confident',
    text: 'Ein echtes Wunder… zehn Schritte noch bis zum Taxi, diesmal wirklich OHNE Krimi-Notizblock und ohne Zeugenpult. Atmen wir noch einmal kurz durch, bevor die Koffer ins Auto wandern.',
  },
];

export const CASE4_MALTA: GameCase = {
  id: 'fall4_malta',
  title: 'Fall 4: Die Spur nach Malta',
  subtitle: 'Tag 6–7 · Valletta & Heimathafen Athen',
  badgeLabel: 'Fall 4 · Kurs auf Malta',
  description:
    'Vor den goldenen Bastionen von Valletta bleiben nur noch wenige Stunden bis zur Rückkehr nach Athen. Zwischen Hafenpromenade, alten Bordakten und einem unscheinbaren Andenkenladen stößt Nate auf eine Fährte, die alles auf der MS Aurora in neuem Licht erscheinen lässt.',
  victoryTitle: 'AKTE MS AURORA ABGESCHLOSSEN',
  victorySummary:
    'Alle vier Fälle auf hoher See sind gelöst: Der gefälschte 45.000-€-Brief, der Chronometer-Tausch und Kapitän Brammers Tragödie sind vollständig aufgeklärt – Familie Higginson kehrt frei nach Hause zurück.',
  supportsOutro: true,
  initialChapterId: 'f4_teil1_malta',
  chapters: {
    f4_teil1_malta: {
      id: 'f4_teil1_malta',
      dayLabel: 'Tag 6 · Hafen von Valletta (Malta)',
      timeOfDay: 'tag',
      title: 'Die Spur nach Malta',
      subtitle: 'Brief-Forensik, Landgang in Valletta & Chronometer-Geheimnis',
    },
    f4_finale_verhandlung: {
      id: 'f4_finale_verhandlung',
      dayLabel: 'Tag 6 · Abend · Großer Ballsaal',
      timeOfDay: 'abend',
      title: 'Die letzte Verhandlung',
      subtitle: 'Beweis 4, die Fälschung & die Wahrheit hinter der Bühne',
    },
    f4_epilog_athen: {
      id: 'f4_epilog_athen',
      dayLabel: 'Tag 7 · Ausschiffung im Hafen von Athen',
      timeOfDay: 'tag',
      title: 'Epilog: Abschied von der MS Aurora',
      subtitle: 'Heimathafen Athen · Rückblick & Sabines Show-Angebot',
    },
  },
  initialLocationId: 'promenade',
  initialUnlockedLocations: ['promenade'],
  initialEvidenceIds: [
    'ausweis_f4_nate',
    'akte_45k_brief',
    'notiz_f4_chrono_fall1',
  ],
  initialThoughtIds: ['thought_f4_offener_punkt4'],
  introSlides: [
    {
      id: 'f4_intro_1',
      imageUrl: '/src/assets/images/bg_f4_malta_harbor_1795445472467.jpg',
      kicker: 'Tag 6 · Früher Morgen · Hafen von Valletta (Malta)',
      caption:
        'Goldene Kalkstein-Bastionen leuchten in der Morgensonne, als die MS Aurora langsam in den Naturhafen von Valletta einläuft. Heute Abend geht das vertagte Verfahren gegen Andrew Higginson weiter.',
      sfx: 'foghorn',
      durationMs: 5600,
      panFrom: { scale: 1.0, x: -8, y: 0 },
      panTo: { scale: 1.08, x: 8, y: -3 },
    },
    {
      id: 'f4_intro_2',
      imageUrl: '/src/assets/images/bg_f4_security_room_1795445472437.jpg',
      kicker: 'Letzte offene Flanke · Aufgabe 4',
      caption:
        'Drei Anklagepunkte hat Nate bereits zerlegt. Nur ein letztes Beweisstück aus Fall 1 liegt noch wie ein Schatten über Andrew: der weingetränkte 45.000-€-Brief an „A. H.“ – und Detective Marstons Konto-Anfrage.',
      sfx: 'tension',
      durationMs: 5400,
      panFrom: { scale: 1.06, x: 6, y: 0 },
      panTo: { scale: 1.0, x: -6, y: -2 },
    },
    {
      id: 'f4_intro_title',
      kicker: 'Advokat-Engine · Fall 4 (Teil 1)',
      caption: 'DIE SPUR NACH MALTA',
      sfx: 'gavel',
      durationMs: 4200,
      panFrom: { scale: 0.96, x: 0, y: 0 },
      panTo: { scale: 1.02, x: 0, y: 0 },
      isTitleCard: true,
    },
  ],
  introLines: [
    {
      speakerId: 'maya',
      emotion: 'confident',
      text: 'Guten Morgen, Nate! Schau dir nur diese gewaltigen goldenen Festungsmauern von Valletta an — endlich wieder Land unter den Füßen, strahlende Sonne und eine frische Brise!',
    },
    {
      speakerId: 'nate',
      emotion: 'thinking',
      text: 'Wunderschön hier auf Malta… aber wir dürfen nicht vergessen, warum das Seegericht gestern Abend überhaupt vertagt hat. Schlagen wir gedanklich ein frisches Blatt für diesen Morgen auf — noch bleibt genau ein offenes Rätsel.',
    },
    {
      speakerId: 'maya',
      emotion: 'thinking',
      text: 'Genau: Punkt 4 aus Falks Anklage! Der weingetränkte 45.000-€-Brief aus Arthur Morgans Nachlass mit „An: A. H.“ und der geheimen Konto-Referenz „KRETA-77“.',
    },
    {
      speakerId: 'nate',
      emotion: 'confident',
      text: 'Und sieh mal dort vorne an der Reling — Detective Marston wartet schon auf uns. Fragen wir ihn sofort, was bei seiner Bank- und Kontoabfrage über Nacht herausgekommen ist!',
    },
  ],
  characters: {
    nate: {
      id: 'nate',
      name: 'Nate Sterling',
      role: 'Strafverteidiger · Frisches Team vor Malta',
      bio: 'Hat den Blick geschärft: Nach drei entkräfteten Punkten prüft er heute endlich die alten Fall-1-Asservate – und stolpert in Valletta über ein noch viel größeres Geheimnis.',
      accentColor: '#3b82f6',
      portraitUrl: '/src/assets/images/sprite_nate_neutral_1795080943216.jpg',
      portraits: {
        confident: '/src/assets/images/sprite_nate_confident_1795080941029.jpg',
      },
      side: 'left',
    },
    maya: {
      id: 'maya',
      name: 'Maya',
      role: 'Kanzlei-Assistentin (Wieder mit frischer Bluse)',
      bio: 'Hat die Dino-Sticker und Multivitamin-Flecken erfolgreich überstanden und brennt darauf, neben der Beweisprüfung auch ein echtes Malta-Souvenir aufzutreiben.',
      accentColor: '#f59e0b',
      portraitUrl: '/src/assets/images/sprite_maya_neutral_1795080941915.jpg',
      side: 'left',
    },
    marston: {
      id: 'marston',
      name: 'Detective Marston',
      role: 'Chef-Ermittler & Widerwilliger Babysitter',
      bio: 'Bürgt vor Richter Pendelton für Andrew Higginson und muss daher auf dem Malta-Landgang höchstpersönlich den Aufpasser für die gesamte fünfköpfige Familie spielen.',
      accentColor: '#64748b',
      portraitUrl: '/src/assets/images/sprite_marston_detective_1795080940855.jpg',
      portraits: {
        grumpy: '/src/assets/images/marston_grumpy_chroma_1795426716136.jpg',
        headshake: '/src/assets/images/marston_grumpy_chroma_1795426716136.jpg',
        sweating: '/src/assets/images/marston_grumpy_chroma_1795426716136.jpg',
      },
      side: 'right',
    },
    pendelton: {
      id: 'pendelton',
      name: 'Judge Pendelton',
      role: 'Vorsitzender Richter (Auf Landgang in Valletta)',
      bio: 'Genießt am Hafen von Valletta zwischen Espresso und Hafenblick ein paar ruhige Stunden vor der abendlichen Wiederaufnahme.',
      accentColor: '#1e3a8a',
      portraitUrl: '/src/assets/images/sprite_pendelton_neutral_1795080941377.jpg',
      portraits: {
        headshake: '/src/assets/images/sprite_pendelton_disappointed_1795091176237.jpg',
      },
      side: 'right',
    },
    cruisemanager: {
      id: 'cruisemanager',
      name: 'Sabine Lindemann',
      role: 'Kreuzfahrtmanagerin (Landausflug Valletta)',
      bio: 'Wirbelt auch auf der Festungsmauer von Valletta mit Event-Klemmbrett und Kamera umher und plant schon die finale Gala im Ballsaal.',
      accentColor: '#ec4899',
      portraitUrl: '/src/assets/images/sprite_cruise_manager_chroma_1795294462722.jpg',
      side: 'right',
    },
    andrew: {
      id: 'andrew',
      name: 'Andrew Higginson',
      role: 'Vorläufig auf freiem Fuß (Unter Aufsicht)',
      bio: 'Atmet nach dem Schiffsarrest endlich wieder Sonne und Meeresluft zusammen mit Eleonore und den drei Söhnen.',
      accentColor: '#f97316',
      portraitUrl: '/src/assets/images/sprite_andrew_friendly_1795181599060.jpg',
      portraits: {
        grumpy: '/src/assets/images/sprite_andrew_higginson_1795164436947.jpg',
        shocked: '/src/assets/images/sprite_andrew_shocked_1795299265347.jpg',
      },
      side: 'right',
    },
    eleonore: {
      id: 'eleonore',
      name: 'Eleonore Higginson',
      role: 'Ehefrau & Familien-Kapitänin',
      bio: 'Hält mit Engelsgeduld drei kleine Piraten und einen leicht zerzausten Detective im Zitroneneis-Chaos zusammen.',
      accentColor: '#14b8a6',
      portraitUrl: '/src/assets/images/eleonore_friendly_chroma_1795426716556.jpg',
      portraits: {
        neutral: '/src/assets/images/eleonore_friendly_chroma_1795426716556.jpg',
        sweating: '/src/assets/images/eleonore_worried_chroma_1795426716488.jpg',
        shocked: '/src/assets/images/eleonore_worried_chroma_1795426716488.jpg',
        thinking: '/src/assets/images/sprite_eleonore_higginson_1795164438099.jpg',
        confident: '/src/assets/images/sprite_eleonore_higginson_1795164438099.jpg',
      },
      side: 'right',
    },
    shopkeeper: {
      id: 'shopkeeper',
      name: 'Matteo Borg',
      role: 'Inhaber · Maritimer Andenken- & Replikenladen',
      bio: 'Maltesischer Kunsthandwerker mit Herzblut für detailgetreue Nachbauten legendärer Schiffe, Kompasse und historischer See-Uhren.',
      accentColor: '#d97706',
      portraitUrl: '/src/assets/images/sprite_malta_shopkeeper_chroma_1795445500560.jpg',
      side: 'right',
    },
    falk: {
      id: 'falk',
      name: 'Staatsanwalt von Falk',
      role: 'Ankläger vor dem Seegericht',
      bio: 'Hält stur am 45.000-€-Brief aus Fall 1 fest, bis ihm vor dem ganzen Ballsaal sämtliche Indizien entgleiten.',
      accentColor: '#991b1b',
      portraitUrl: '/src/assets/images/sprite_falk_neutral_1795080942096.jpg',
      portraits: {
        shocked: '/src/assets/images/sprite_falk_shocked_1795080941650.jpg',
        sweating: '/src/assets/images/sprite_falk_shocked_1795080941650.jpg',
        facepalm: '/src/assets/images/sprite_falk_facepalm_1795091158455.jpg',
      },
      side: 'right',
    },
    captain: {
      id: 'captain',
      name: 'Kapitän A. W. Brammer',
      role: 'Kapitän der MS Aurora (40 Dienstjahre)',
      bio: 'Albert Werner Brammer – vierzig Jahre lang unbescholtener Kommandant auf See, dessen verzweifelter Kampf um das Erbstück seines Großvaters außer Kontrolle geriet.',
      accentColor: '#0f766e',
      portraitUrl: '/src/assets/images/sprite_captain_brammer_1795164437466.jpg',
      side: 'right',
    },
    electrician: {
      id: 'electrician',
      name: 'Lars Kowalski',
      role: 'Chef-Elektriker & Technik-Leitung',
      bio: 'Kennt jedes Kabel und jedes MS-400-Handbuch im Schiffs-Maschinenraum – hat aber zu medizinischen Safes oder der Asservatenkammer keinerlei Zugang.',
      accentColor: '#eab308',
      portraitUrl: '/src/assets/images/sprite_electrician_chroma_1795294462693.jpg',
      side: 'right',
    },
    vance: {
      id: 'vance',
      name: 'Dr. Helena Vance',
      role: 'Leitende Schiffsärztin',
      bio: 'Verwaltet allein den verschlossenen Betäubungsmittel-Schrank der Krankenstation und legt vor Gericht präzise Rechenschaft ab.',
      accentColor: '#0d9488',
      portraitUrl: '/src/assets/images/sprite_dr_vance_1795164436449.jpg',
      side: 'right',
    },
    miriam: {
      id: 'miriam',
      name: 'Miriam König',
      role: 'Leiterin Rezeption & Fundbüro',
      bio: 'Verwahrt die Schlüssel für Rezeption und Fundbüro F-418, besitzt aber keinerlei Zutrittsrechte für Zellen, Technik oder Asservatenkammer.',
      accentColor: '#8b5cf6',
      portraitUrl: '/src/assets/images/sprite_receptionist_chroma_1795345216266.jpg',
      side: 'right',
    },
    brandt: {
      id: 'brandt',
      name: 'Officer Lukas Brandt',
      role: 'Leiter Schiffs-Sicherheit (Security)',
      bio: 'Bewacht Zellenbereich und Asservatenkammer – kommt aber weder an den Betäubungsmittel-Safe noch in die Technik-Werkstatt oder das Fundbüro.',
      accentColor: '#475569',
      portraitUrl: '/src/assets/images/sprite_brandt_security_1795164437396.jpg',
      side: 'right',
    },
  },
  evidence: {
    ausweis_f4_nate: {
      id: 'ausweis_f4_nate',
      name: 'Nates Anwaltsabzeichen',
      category: 'profile',
      iconName: 'user',
      summary: 'Verteidiger-Abzeichen für das letzte Verfahren vor Valletta.',
      detail:
        'Frisch poliert am Sakko. Heute gilt es, noch die letzte offene Flanke aus Fall 1 zu schließen – oder eine noch größere Wahrheit zu entdecken.',
    },
    akte_45k_brief: {
      id: 'akte_45k_brief',
      name: 'Asservaten-Kopie: 45.000-€-Brief (Fall 1)',
      category: 'evidence',
      iconName: 'file',
      summary: 'Weingetränkter Zahlungsbrief aus Arthur Morgans Nachlass.',
      detail:
        'Die Aktennotiz zum alten Fund aus Fall 1: „An: A. H. — Konto-Ref: KRETA-77 — 45.000 Euro bei Übergabe“. Liegt unter Verschluss im Sicherheits- & Asservatenraum der MS Aurora.',
    },
    notiz_f4_chrono_fall1: {
      id: 'notiz_f4_chrono_fall1',
      name: 'Asservat #01: Goldener Schiffs-Chronometer (Fall 1)',
      category: 'evidence',
      iconName: 'clock',
      summary: 'Das berühmte Erbstück aus dem VIP-Salon — derzeit in der Sicherheitskammer.',
      detail:
        'Angeblich ein jahrhundertealtes Einzelstück aus reinem Vollgold, das in Fall 1 aus der Vitrine verschwand und später in Kabine 312 wieder auftauchte.',
    },
    notiz_f4_marston_konto: {
      id: 'notiz_f4_marston_konto',
      name: 'Marstons Bericht: Keine Konto-Spur',
      category: 'evidence',
      iconName: 'receipt',
      summary: 'Konto-Ref „KRETA-77“ führt zu keinerlei verwertbarem Ergebnis.',
      detail:
        'Detective Marston hat über Nacht Hafenbehörden und Bankstellen kontaktiert: Unter „KRETA-77“ liegt keine verwertbare Kontoverbindung zu Andrew Higginson vor – die Spur verläuft komplett im Sand.',
    },
    beweis_brief_manipuliert: {
      id: 'beweis_brief_manipuliert',
      name: 'Forensik-Befund: Manipulierter 45.000-€-Brief',
      category: 'evidence',
      iconName: 'search',
      summary: 'Initialen nachträglich überschrieben – „A. W.“, „A. M.“ oder „A. H.“ nicht unterscheidbar!',
      detail:
        'Unter 2,5-facher Lupe und UV-Streiflicht zeigt das Original: Während „Konto-Ref: KRETA-77“ in derselben alten, verblassten Tinte wie der Haupttext steht, wurde das Empfänger-Kürzel hinten auf dem bereits angetrockneten Weinrand nachträglich überkratzt und überschrieben. Ob ursprünglich „A. W.“, „A. M.“ oder „A. H.“ dort stand, ist vor Ort noch nicht zweifelsfrei erkennbar – als Beweis vor Gericht ist das Schreiben so wertlos!',
    },
    notiz_andenkenladen_replik: {
      id: 'notiz_andenkenladen_replik',
      name: 'Andenkenladen-Notiz: Repliken für einen Kapitän',
      category: 'evidence',
      iconName: 'file',
      summary: 'Matteo Borg fertigte vor Kurzem eine täuschend echte Chronometer-Replika für einen echten Kapitän an!',
      detail:
        'Ladenbesitzer Matteo Borg in Valletta stellt berühmte Nachbauten historischer Schiffe und Schiffs-Raritäten her (Titanic, Nautilus, Jack Sparrows Schiff) – sogar als Maßanfertigung auf Kundenwunsch. Vor wenigen Wochen bestellte bei ihm ein echter Kapitän eine Chronometer-Replika, dessen Namen Borg leider vergessen hat.',
    },
    beweis_flottenbuch_merkmale: {
      id: 'beweis_flottenbuch_merkmale',
      name: 'Chronik der Aurora-Linie (1924): 3 Echtheitsmerkmale',
      category: 'evidence',
      iconName: 'file',
      summary: '1. 18k-Vollgold · 2. Kardanische Aufhängung · 3. Stempel „Horloge Genève · Nr. 1924-A“.',
      detail:
        'Aus der historischen Flotten-Chronik in der Schiffsbibliothek gesichert: Ein echter Aurora-Schiffs-Chronometer muss (1) massives 18-Karat-Vollgold besitzen, (2) in einer beweglichen doppelten kardanischen Aufhängung gelagert sein und (3) innen den Tiefstempel „Chronométrie Horloge Genève · Nr. 1924-A“ tragen.',
    },
    beweis_chronometer_faelschung: {
      id: 'beweis_chronometer_faelschung',
      name: 'Entlarvt: Der Chronometer ist eine FÄLSCHUNG!',
      category: 'evidence',
      iconName: 'clock',
      summary: 'Aufgemaltes Gold · starre Schrauben-Attrappe · Stempel „REPLIKA · VALLETTA M-09“!',
      detail:
        'Direkter Vergleich am Asservat aus Fall 1: Alle drei Echtheitsmerkmale der 1924er Chronik sind falsch! Das Gold ist bloß dünn auf graues Zinn gemalt, die kardanische Aufhängung starr vernietet und im Inneren prangt der eingravierte Stempel „REPLIKA · VALLETTA M-09“!',
    },
    beweis_aw_original: {
      id: 'beweis_aw_original',
      name: 'Freigelegt: Original-Kürzel „A. W.“',
      category: 'evidence',
      iconName: 'search',
      summary: 'Das „A. H.“ war aufgeschmiert — ursprünglich adressiert an „A. W.“!',
      detail:
        'Im hellen Ballsaal-Vergleich mit den UV-Spuren steht fest: Die ursprünglichen Federstriche unter der nachträglichen Überkratzung gehören zu „A. W.“ – der Brief galt niemals Andrew Higginson („A. H.“).',
    },
    notiz_zugangsmatrix: {
      id: 'notiz_zugangsmatrix',
      name: 'Zeugen-Protokoll: Zugang zu allen 5 Bereichen',
      category: 'evidence',
      iconName: 'file',
      summary: 'Technik, Ärztin, Rezeption & Security: Niemand kommt überall hinein!',
      detail:
        'Aussagen der vier Bereichsleiter unter Eid: (1) Krankenzimmer-Betäubungsmittel: nur Ärztin · (2) Zellenbereich: Sicherheit & Technik · (3) Technik-Handbuch MS-400: nur Technik · (4) Fundbüro F-418: nur Rezeption · (5) Asservatenkammer: nur Sicherheit/Leitung. Kein einzelnes Crew-Mitglied hat Zugang zu allen fünf Orten – außer dem General-Zugang der Schiffsführung!',
    },
  },
  thoughts: {
    thought_f4_offener_punkt4: {
      id: 'thought_f4_offener_punkt4',
      title: 'Offener Punkt: Konto & 45.000-€-Brief',
      detail:
        'Bevor das Tribunal am Abend fortgesetzt wird, müssen wir Detective Marston fragen, ob er über Nacht etwas über das Konto „KRETA-77“ herausbekommen hat, und den Original-Brief prüfen.',
      kind: 'question',
    },
    thought_f4_brief_gefaelscht: {
      id: 'thought_f4_brief_gefaelscht',
      title: 'Brief entwertet — Punkt 4 für heute Abend erledigt!',
      detail:
        'Keine Kontoverbindung durch Marston, und der Brief wurde nachträglich überschrieben (A. W. / A. M. / A. H. nicht mehr unterscheidbar). Damit hat Falk für heute Abend kein gültiges Motiv-Indiz mehr!',
      kind: 'deduction',
    },
    thought_f4_chronometer_billig: {
      id: 'thought_f4_chronometer_billig',
      title: 'Seltsamer Eindruck beim Rausgehen…',
      detail:
        'Irgendetwas irritiert Nate beim Verlassen des Sicherheitsraums: Für all den Wirbel in Fall 1 sah der Goldene Chronometer in der Vitrine aus der Nähe erstaunlich stumpf und billig aus.',
      kind: 'observation',
    },
    thought_f4_kapitaen_replik: {
      id: 'thought_f4_kapitaen_replik',
      title: 'Ein Kapitän bestellte eine Replika?!',
      detail:
        'In Vallettas Andenkenladen fertigte Matteo Borg Repliken auf Kundenwunsch — neulich sogar für einen echten Kapitän! Was bedeutet das für unser billig wirkendes Asservat an Bord?',
      kind: 'question',
    },
    thought_f4_chronometer_pruefen: {
      id: 'thought_f4_chronometer_pruefen',
      title: 'Chronometer anhand der Schiffs-Chronik prüfen!',
      detail:
        'Wir müssen Marston überzeugen, die Asservatenkammer noch einmal aufzumachen – und in der Schiffsbibliothek die genauen Echtheitsmerkmale des Schiffs-Chronometers nachschlagen.',
      kind: 'question',
    },
    thought_f4_drei_merkmale: {
      id: 'thought_f4_drei_merkmale',
      title: '3 Merkmale gefunden -> Ab in die Asservatenkammer!',
      detail:
        'Vollgold (18k), doppelte kardanische Aufhängung und Stempel „Horloge Genève · Nr. 1924-A“. Jetzt direkt in der Kammer gegen das Asservat vergleichen!',
      kind: 'deduction',
    },
    thought_f4_aw_stimmt: {
      id: 'thought_f4_aw_stimmt',
      title: '„A. W.“ stimmt – Beweis 4 endgültig zerlegt!',
      detail:
        'Der 45.000-€-Brief wurde nachträglich zu „A. H.“ umgeschrieben. Ursprünglich galt er „A. W.“ – und Arthur hielt den echten Chronometer als Sicherheit!',
      kind: 'deduction',
    },
    thought_f4_keiner_hat_alle_5: {
      id: 'thought_f4_keiner_hat_alle_5',
      title: 'Kein Crew-Mitglied hat alle 5 Zugänge…',
      detail:
        'Weder Ärztin, Technik, Rezeption noch Security kommen gleichzeitig an Betäubungsmittel, Zellen, Handbuch, Fundbüro UND Asservatenkammer. Nur die oberste Schiffsführung trägt den General-Schlüssel!',
      kind: 'deduction',
    },
  },
  logicCombinations: [],
  locations: {
    promenade: {
      id: 'promenade',
      name: 'Promenadendeck · Hafenblick Valletta',
      subtitle: 'Tag 6 · Vor dem Landgang & nach der Rückkehr an Bord',
      backgroundUrl: '/src/assets/images/cruise_deck_promenade_1795039844574.jpg',
      charactersPresent: [
        {
          characterId: 'marston',
          hideIfFlag: 'flag_f4_marston_deck_gesprochen',
        },
        {
          characterId: 'maya',
          visibleIfFlag: 'flag_f4_marston_deck_gesprochen',
        },
      ],
      hotspots: [
        {
          id: 'hs_f4_deck_valletta_panorama',
          label: 'Festungsmauern von Valletta',
          x: 68,
          y: 28,
          width: 24,
          height: 24,
          lines: [
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Schau dir nur diese alten ockerfarbenen Bastionen und Kuppeln drüben in Valletta an! Nach Tagen voller Seekrankheit und Zellentüren tut dieser Hafenblick richtig gut.',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Sobald wir im Sicherheitsraum den alten Brief aus Fall 1 abgehakt haben, können wir dort unten wirklich guten Gewissens etwas Malteser Luft schnappen!',
            },
          ],
        },
      ],
      talkTopics: [
        {
          id: 't_f4_marston_konto_und_beweise',
          title: 'Konto-Recherche & Beweise aus Fall 1',
          speakerId: 'marston',
          hideIfFlag: 'flag_f4_marston_deck_gesprochen',
          lines: [
            {
              speakerId: 'marston',
              emotion: 'grumpy',
              text: 'Morgen, Nate. Morgen, Maya. Spar dir den hoffnungsvollen Blick — ich mach’s kurz: Ich hab die halbe Nacht lang telefoniert, Hafenbüros genervt und meine Kontakte wegen diesem verdammten „KRETA-77“-Konto abgeklappert.',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Und? Gibt es irgendeine Verbindung zu Arthur Morgan oder Andrew Higginson?',
            },
            {
              speakerId: 'marston',
              emotion: 'headshake',
              text: 'Null. Gar nichts! Keine einzige nützliche Information über das Konto. Lauter verschachtelte Briefkästen im Nichts, keine Kontonummer, kein Inhaber, keine Überweisung auf Andrew.',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Moment — das heißt ja eigentlich, Staatsanwalt von Falk hat zu dieser Konto-Referenz überhaupt nichts Greifbares in der Hand!',
            },
            {
              speakerId: 'marston',
              emotion: 'neutral',
              text: 'Das allein reicht Falk aber nicht, solange dieser weingetränkte 45.000-€-Brief in unserer Asservatenkammer liegt. Und hört zu: Ich hab gleich verdammt wenig Zeit.',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Wie, musst du etwa sofort wieder zu Judge Pendelton?',
            },
            {
              speakerId: 'marston',
              emotion: 'grumpy',
              animation: 'headshake',
              text: 'Schlimmer! Pendelton hat Andrew ja nur unter meiner persönlichen Aufsicht freigelassen. Also darf ich jetzt gleich mit der kompletten Familie Higginson – inklusive aller drei Wirbelwinde – auf Landausflug nach Malta mitdackeln, um auf Andrew „aufzupassen“!',
            },
            {
              speakerId: 'marston',
              emotion: 'neutral',
              setsFlag: 'flag_f4_marston_deck_gesprochen',
              unlocksEvidence: 'notiz_f4_marston_konto',
              unlocksLocation: 'security_room',
              switchesLocationId: 'security_room',
              text: 'Bevor Eleonore mich gleich unten an der Gangway einsammelt, hab ich aber genau zehn Minuten Luft. Kommt sofort mit in den Sicherheits- und Asservatenraum — schauen wir uns die Original-Beweise aus Fall 1 jetzt gemeinsam an!',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Alles klar! Hier drin im Sicherheitsraum liegt also alles von Fall 1 unter Verschluss. Werfen wir sofort einen genauen Blick auf den 45.000-€-Brief auf dem Asservatentisch!',
            },
          ],
        },
        {
          id: 't_f4_maya_recap_hint',
          title: 'Mit Maya die Lage besprechen',
          speakerId: 'maya',
          requiredFlag: 'flag_f4_recap_fertig',
          hideIfFlag: 'flag_f4_faelschung_bewiesen',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Also gut, fassen wir kurz zusammen, damit wir keine Zeit verlieren: Zuerst müssen wir Frank in Kabine 917 erreichen.',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Genau! Wenn er die Andenkenladen-Spur ernst nimmt, holen wir in der Bibliothek die echten Chronometer-Merkmale und prüfen das gute Stück im Asservatenraum noch einmal aus nächster Nähe!',
            },
          ],
        },
      ],
      presentRules: [],
      fallbackPresentLines: [
        {
          speakerId: 'maya',
          emotion: 'thinking',
          text: 'Dafür haben wir auf dem Deck gerade keinen Ansprechpartner — lass uns direkt zum nächsten Schauplatz reisen!',
        },
      ],
    },

    security_room: {
      id: 'security_room',
      name: 'Sicherheits- & Asservatenraum',
      subtitle: 'Streng gesicherte Beweisstücke aus Fall 1',
      backgroundUrl: '/src/assets/images/bg_f4_security_room_1795445472437.jpg',
      charactersPresent: [
        {
          characterId: 'marston',
          hideIfFlag: 'flag_f4_brief_geprueft',
        },
        {
          characterId: 'marston',
          visibleIfFlag: 'flag_f4_buecher_gefunden',
        },
      ],
      hotspots: [
        {
          id: 'hs_f4_brief_tisch',
          label: 'Weingetränkter 45.000-€-Brief (Fall 1)',
          x: 56,
          y: 63,
          width: 19,
          height: 20,
          hideIfFlag: 'flag_f4_brief_geprueft',
          lines: [
            {
              speakerId: 'marston',
              emotion: 'neutral',
              text: 'Hier auf dem Tisch liegt das Original-Beweisstück aus Arthur Morgans Dienstjacke. Alles noch genau im Zustand wie am Morgen von Fall 1.',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Dann holen wir jetzt Lupe und UV-Streiflicht heraus, Maya! Sehen wir uns Tinte, Weinrand und diese berühmten Initialen „A. H.“ unter Vergrößerung an!',
              startsMiniGameId: 'letter_forensics',
            },
          ],
        },
        {
          id: 'hs_f4_vitrine_chronometer',
          label: 'Vitrine: Goldener Schiffs-Chronometer',
          x: 55,
          y: 40,
          width: 15,
          height: 21,
          hideIfFlag: 'flag_f4_buecher_gefunden',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Da drinnen ruht er also auf rotem Samt… das gute Stück aus Fall 1, für das Arthur Morgan beinahe die ganze Crew vorgeführt hat.',
            },
            {
              speakerId: 'maya',
              emotion: 'neutral',
              text: 'Ziemlich protzig hinter diesem dicken Sicherheitsglas! Lass uns jetzt erst einmal auf die Spuren auf dem Asservatentisch achten.',
            },
          ],
        },
        {
          id: 'hs_f4_vitrine_hinweis',
          label: 'Chronometer mit den 3 Buch-Merkmalen abgleichen',
          x: 55,
          y: 40,
          width: 16,
          height: 22,
          visibleIfFlag: 'flag_f4_buecher_gefunden',
          hideIfFlag: 'flag_f4_faelschung_bewiesen',
          lines: [
            {
              speakerId: 'marston',
              emotion: 'neutral',
              text: 'Ich hab die Panzerglas-Haube bereits entriegelt. Auf den Tisch mit dem Chronometer — zeigen Sie mir Ihre drei Merkmale aus der 1924er Flotten-Chronik, Nate!',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Jetzt schlägt die Stunde der Wahrheit, Maya! Vollgold, kardanische Aufhängung und Manufaktur-Stempel — prüfen wir jeden Millimeter!',
              startsMiniGameId: 'chronometer_compare',
            },
          ],
        },
      ],
      talkTopics: [
        {
          id: 't_f4_marston_sicherheitsraum',
          title: 'Ablauf der Beweisprüfung',
          speakerId: 'marston',
          hideIfFlag: 'flag_f4_brief_geprueft',
          lines: [
            {
              speakerId: 'marston',
              emotion: 'neutral',
              text: 'Unten auf der Tischmitte liegt der versiegelte 45.000-€-Brief. Tippt ihn einfach an und nehmt euch Lupe und UV-Lampe vor — solange halte ich hier drin noch kurz die Tür offen.',
            },
          ],
        },
        {
          id: 't_f4_marston_chronometer_vergleich',
          title: 'Chronometer jetzt gegen Chronik vergleichen',
          speakerId: 'marston',
          requiredFlag: 'flag_f4_buecher_gefunden',
          hideIfFlag: 'flag_f4_faelschung_bewiesen',
          lines: [
            {
              speakerId: 'marston',
              emotion: 'thinking',
              text: 'Ich bin wirklich gespannt auf das Buch aus der Bibliothek. Lass uns die Vitrine aufmachen und alle drei Punkte direkt nebeneinanderhalten!',
              startsMiniGameId: 'chronometer_compare',
            },
          ],
        },
      ],
      presentRules: [
        {
          evidenceId: 'beweis_flottenbuch_merkmale',
          targetCharacterId: 'marston',
          requiredFlag: 'flag_f4_buecher_gefunden',
          hideIfFlag: 'flag_f4_faelschung_bewiesen',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Hier, Frank — schwarz auf weiß aus der Chronik der Aurora-Linie von 1924! Drei eindeutige Merkmale, die der echte Schiffs-Chronometer haben MUSS.',
            },
            {
              speakerId: 'marston',
              emotion: 'neutral',
              text: 'Saubere Recherche. Dann legen wir die Punkte direkt neben das Asservat auf den Tisch!',
              startsMiniGameId: 'chronometer_compare',
            },
          ],
        },
      ],
      fallbackPresentLines: [
        {
          speakerId: 'marston',
          emotion: 'neutral',
          text: 'Dafür hab ich hier in der Kammer keine Verwendung — schau dir direkt den Brief bzw. die Vitrine auf dem Tisch an.',
        },
      ],
    },

    malta_harbor: {
      id: 'malta_harbor',
      name: 'Hafenpromenade von Valletta (Malta)',
      subtitle: 'Maltesischer Landgang · Sonnenschein & Luzzu-Boote',
      backgroundUrl: '/src/assets/images/bg_f4_malta_harbor_1795445472467.jpg',
      charactersPresent: [
        {
          characterId: 'pendelton',
          hideIfFlag: 'flag_f4_pendelton_getroffen',
        },
      ],
      hotspots: [
        {
          id: 'hs_f4_valletta_boote',
          label: 'Bunte Malteser Luzzu-Boote',
          x: 26,
          y: 66,
          width: 22,
          height: 18,
          lines: [
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Ooh, guck mal die kleinen Augen vorne an den hölzernen Fischerbooten! Hab mal gelesen, das sind traditionelle maltesische Luzzu-Boote gegen böse Geister auf See!',
            },
            {
              speakerId: 'nate',
              emotion: 'smug',
              text: 'Gegen Staatsanwälte mit gefälschten Briefen hätten wir solche Schutzaugen schon in Fall 1 auf dem Schiff gebrauchen können.',
            },
          ],
        },
        {
          id: 'hs_f4_valletta_festung',
          label: 'Alte Kalkstein-Bastion',
          x: 68,
          y: 28,
          width: 24,
          height: 22,
          lines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Was für ein Panorama… Nach der ganzen Aufregung um Andrew tut es richtig gut, für einen Moment nur den warmen Wind und diese goldenen Festungsmauern zu genießen.',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Und das Wasser glitzert so tiefblau – da vergisst man fast für fünf Minuten, dass heute Abend noch die Fortsetzung im Ballsaal wartet.',
            },
          ],
        },
      ],
      talkTopics: [
        {
          id: 't_f4_pendelton_malta',
          title: 'Begegnung mit Judge Pendelton',
          speakerId: 'pendelton',
          hideIfFlag: 'flag_f4_pendelton_getroffen',
          lines: [
            {
              speakerId: 'pendelton',
              emotion: 'confident',
              text: 'Ah, Mr. Sterling und Miss Maya! Welch angenehme Abwechslung, Sie beide zur Abwechslung einmal nicht hinter einem Mahagonipult anzutreffen!',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Guten Tag, Euer Ehren! Genießen Sie Ihren Landgang in Valletta?',
            },
            {
              speakerId: 'pendelton',
              emotion: 'neutral',
              text: 'In vollen Zügen — ein starker Espresso, ein frisches Pastizzi-Blätterteiggebäck und ausnahmsweise kein einziger „EINSPRUCH!“ in Hörweite. Ihre gestrige Beweisführung war übrigens äußerst präzise, Mr. Sterling.',
            },
            {
              speakerId: 'pendelton',
              emotion: 'confident',
              text: 'Aber ich verordne uns allen strenges Verhandlungs-Verbot bis zur Abendsitzung! Wenn Sie noch etwas mehr von der Stadt sehen wollen: Unsere unermüdliche Kreuzfahrtmanagerin Lindemann marschierte eben Richtung Oberer Bastions-Platz dort oben voraus.',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              setsFlag: 'flag_f4_pendelton_getroffen',
              unlocksLocation: 'malta_bastion',
              text: 'Vielen Dank, Euer Ehren! Kommst du mit hinauf auf den Bastions-Platz, Nate? Von dort hat man bestimmt eine Wahnsinns-Aussicht!',
            },
          ],
        },
      ],
      presentRules: [],
      fallbackPresentLines: [
        {
          speakerId: 'pendelton',
          emotion: 'headshake',
          text: 'Kein Papierkram während meines Hafen-Espressos, Mr. Sterling! Heben Sie sich Akten bitte für heute Abend im Ballsaal auf.',
        },
      ],
    },

    malta_bastion: {
      id: 'malta_bastion',
      name: 'Bastions-Platz · Altstadt Valletta',
      subtitle: 'Sightseeing hoch über dem Hafenbecken',
      backgroundUrl: '/src/assets/images/bg_f4_malta_plaza_1795445472494.jpg',
      charactersPresent: [
        {
          characterId: 'cruisemanager',
          hideIfFlag: 'flag_f4_sabine_malta_getroffen',
        },
        {
          characterId: 'eleonore',
          visibleIfFlag: 'flag_f4_sabine_malta_getroffen',
          hideIfFlag: 'flag_f4_higginson_malta_getroffen',
        },
        {
          characterId: 'andrew',
          visibleIfFlag: 'flag_f4_sabine_malta_getroffen',
          hideIfFlag: 'flag_f4_higginson_malta_getroffen',
        },
        {
          characterId: 'marston',
          visibleIfFlag: 'flag_f4_sabine_malta_getroffen',
          hideIfFlag: 'flag_f4_higginson_malta_getroffen',
        },
      ],
      hotspots: [
        {
          id: 'hs_f4_valletta_balkone',
          label: 'Traditionelle maltesische Holzbalkone',
          x: 78,
          y: 34,
          width: 18,
          height: 24,
          lines: [
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Schau mal diese grünen und roten Holz-Erker drüben an den Gassen-Häusern! Wie aus einem alten Abenteuerfilm!',
            },
            {
              speakerId: 'nate',
              emotion: 'smug',
              text: 'Fehlt nur noch, dass gleich jemand auf einem Balkon ein geheimes Geständnis flüstert – aber heute schauen wir einfach mal nur Touristen-Kram an.',
            },
          ],
        },
        {
          id: 'hs_f4_valletta_kanonen',
          label: 'Alte Hafen-Kanonen auf der Mauer',
          x: 24,
          y: 52,
          width: 20,
          height: 20,
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Solche Batterien haben jahrhundertelang den Hafen bewacht… gut zu wissen, dass heute höchstens um Souvenirs gefeilscht wird.',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Solange nicht gleich wieder Leo, Rick und Conrad versuchen, hier oben auf dem Lafetten-Rohr herumzuturnen!',
            },
          ],
        },
      ],
      talkTopics: [
        {
          id: 't_f4_sabine_bastion',
          title: 'Kreuzfahrtmanagerin auf Landgang',
          speakerId: 'cruisemanager',
          hideIfFlag: 'flag_f4_sabine_malta_getroffen',
          lines: [
            {
              speakerId: 'cruisemanager',
              emotion: 'confident',
              text: 'Hallo, Herr Verteidiger!! Hallo, Maya!! Ist dieses Licht hier oben nicht absolut traumhaft für unser Bord-Social-Media?!',
            },
            {
              speakerId: 'nate',
              emotion: 'sweating',
              text: 'Guten Morgen, Frau Lindemann. Machen Sie etwa selbst im Hafen von Malta Werbung für den Prozess heute Abend?',
            },
            {
              speakerId: 'cruisemanager',
              emotion: 'confident',
              text: 'Aber natürlich!! „Das vertagte Kreuzfahrt-Tribunal: Die Entscheidung nach Malta“ — unsere Buchungen für die nächste Mittelmeer-Route schießen schon durch die Decke! Oh, und raten Sie mal, wer zwei Straßenecken weiter vor der Gelateria steht!',
            },
            {
              speakerId: 'maya',
              emotion: 'smug',
              text: 'Lassen Sie mich raten: Drei Jungs mit Eis in der Hand und ein völlig entnervter Detective dazwischen?',
            },
            {
              speakerId: 'cruisemanager',
              emotion: 'confident',
              setsFlag: 'flag_f4_sabine_malta_getroffen',
              text: 'Auf die Sekunde genau erraten! Ich husche schnell weiter zum Souvenir-Stand mit Postkarten — da hinten kommen sie gerade über den Platz!',
            },
          ],
        },
        {
          id: 't_f4_higginson_marston_malta',
          title: 'Familie Higginson & Aufpasser Marston',
          speakerId: 'andrew',
          requiredFlag: 'flag_f4_sabine_malta_getroffen',
          hideIfFlag: 'flag_f4_higginson_malta_getroffen',
          lines: [
            {
              speakerId: 'eleonore',
              emotion: 'neutral',
              text: 'Nate! Maya! Wie schön, euch in der Sonne zu sehen — ohne Gitterstäbe und ohne Verhandlungsprotokoll!',
            },
            {
              speakerId: 'andrew',
              emotion: 'confident',
              text: 'Ich sage Ihnen, Nate: Frische Luft in Malta fühlt sich an wie ein zweiter Geburtstag. Sogar die Jungs sind gerade ausnahmsweise friedlich – zumindest solange ihre Eiswaffeln nicht tropfen.',
            },
            {
              speakerId: 'marston',
              emotion: 'grumpy',
              animation: 'headshake',
              text: '„Nicht tropfen“?! Meine Trenchcoat-Manschette klebt komplett nach Zitrone und Stracciatella! Und warum genau musste der Jüngste vorhin versuchen, auf eine echte Kanone zu klettern?!',
            },
            {
              speakerId: 'marston',
              emotion: 'sweating',
              text: 'Leo! Rick! Conrad! Nicht hinter die Brüstung!! Wenn Pendelton merkt, dass mir ein Higginson abhandenkommt — verzeihen Sie, ich muss hinterher! Bis später an Bord, Nate!',
            },
            {
              speakerId: 'eleonore',
              emotion: 'confident',
              text: 'Komm, Andrew, helfen wir dem armen Frank beim Zählen! Ach übrigens, Maya — direkt rechts in der kühlen Nebengasse gibt es einen alten maritimen Andenkenladen, falls ihr noch eine kleine Erinnerung an unsere wilde Reise sucht!',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              setsFlag: 'flag_f4_higginson_malta_getroffen',
              unlocksLocation: 'malta_souvenir_shop',
              text: 'Oh ja, ein schönes Schiffs-Souvenir von diesem Abenteuer! Lass uns da noch kurz hineinschauen, Nate, bevor es wieder zurück aufs Schiff geht!',
            },
          ],
        },
      ],
      presentRules: [],
      fallbackPresentLines: [
        {
          speakerId: 'maya',
          emotion: 'confident',
          text: 'Lass die Beweise im Rucksack, Nate — wir sind hier auf dem Bastions-Platz kurz im Urlaub!',
        },
      ],
    },

    malta_souvenir_shop: {
      id: 'malta_souvenir_shop',
      name: 'Maritimer Andenkenladen · Valletta',
      subtitle: 'Historische Schiffsmodelle, Kompasse & Raritäten',
      backgroundUrl: '/src/assets/images/bg_f4_malta_souvenir_shop_1795445472266.jpg',
      charactersPresent: [
        {
          characterId: 'shopkeeper',
        },
      ],
      hotspots: [
        {
          id: 'hs_f4_laden_vitrinen',
          label: 'Preisschilder & Schiffs-Chronometer ansehen',
          x: 24,
          y: 44,
          width: 24,
          height: 30,
          lines: [
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Oh, schau mal hier auf die polierten Sextanten, Taschenkompasse und goldenen Schiffs-Uhren! So ein kleines Erinnerungsstück an unser Kreuzfahrt-Abenteuer wäre echt stark.',
            },
            {
              speakerId: 'nate',
              emotion: 'shocked',
              sfx: 'thought_pop',
              setsFlag: 'flag_f4_preise_geprueft',
              text: 'Moment mal… schau mal auf die kleinen Pappschilder darunter! 24 Euro?! 35 Euro?! 60 Euro für einen vergoldeten Schiffs-Chronometer?! Warum in aller Welt sind diese ganzen Stücke hier gar nicht teuer?!',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Stimmt eigentlich — die sehen aus wie teure Museumsstücke aus einem Palast! Fragen wir doch mal den Ladenbesitzer drüben am Tresen, wie der Preis zustande kommt!',
            },
          ],
        },
        {
          id: 'hs_f4_laden_modelle',
          label: 'Detailreiche Schiffsmodelle an der Wand',
          x: 68,
          y: 38,
          width: 24,
          height: 30,
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Dreimaster, U-Boote und vergoldete Messing-Gehäuse bis unter die Decke… der Mann versteht offenbar sein Handwerk bis ins kleinste Detail.',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Und alles sieht so herrlich echt aus! Kein Wunder, dass sich Touristen hier sofort wie Schatzjäger fühlen.',
            },
          ],
        },
      ],
      talkTopics: [
        {
          id: 't_f4_ladenbesitzer_repliken',
          title: 'Mit dem Ladenbesitzer über Schätze & Preise sprechen',
          speakerId: 'shopkeeper',
          hideIfFlag: 'flag_f4_laden_gesprochen',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Entschuldigen Sie, Signore — wir suchen ein kleines Souvenir von unserer Seereise und sind über Ihre Auslage gestolpert. Die Kompasse und Schiffs-Uhren hier sehen aus wie echte Schiffs-Antiquitäten… wie können die bloß so günstig sein?',
            },
            {
              speakerId: 'shopkeeper',
              emotion: 'confident',
              text: 'Haha, grazie mille für das Kompliment, Signore! Das liegt an meinem Handwerk: Alles, was Sie hier in den Regalen bewundern, sind täuschend echte Repliken berühmter historischer Schiffe und Bord-Raritäten!',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Echt?! Wie zum Beispiel von der Titanic oder aus bekannten Filmen?!',
            },
            {
              speakerId: 'shopkeeper',
              emotion: 'confident',
              text: 'Genau richtig, Signorina! Ob ein Bordinstrument der Titanic, Messingteile von Kapitän Nemos Nautilus oder Nachbauten vom Schiff von Jack Sparrow — ich bin auf ganz Malta für meine originalgetreue Alterungstechnik berühmt!',
            },
            {
              speakerId: 'shopkeeper',
              emotion: 'smug',
              text: 'Mit aufgemalter Blattgold-Optik, gealtertem Zinn und stilvollen Schau-Ringen statt teurer Mechanik sieht selbst für geübte Augen jedes Stück aus wie ein Millionen-Erbe — und bleibt trotzdem bezahlbar. Ich fertige die sogar ganz individuell auf Kundenwunsch an!',
            },
            {
              speakerId: 'shopkeeper',
              emotion: 'thinking',
              sfx: 'evidence_chime',
              text: 'Erst neulich — warten Sie — vor ein paar Wochen kam sogar ein leibhaftiger, echter Kapitän eines großen Kreuzfahrtschiffs in mein Geschäft und ließ sich eine ganz spezielle Chronometer-Replika maßanfertigen!',
            },
            {
              speakerId: 'nate',
              emotion: 'shocked',
              shout: 'MOMENT MAL!',
              shake: true,
              text: 'EIN ECHTER KAPITÄN?! Hier in Valletta hat sich ein echter Kapitän eine Chronometer-Fälschung auf Kundenwunsch bauen lassen?! Wie war sein Name?!',
            },
            {
              speakerId: 'shopkeeper',
              emotion: 'sweating',
              text: 'Madonna mia… verzeihen Sie, Signore! Es herrschte damals reges Treiben im Hafen, er zahlte direkt bar in Scheinen und bat um Diskretion — an den Namen des Kapitäns kann ich mich beim besten Willen nicht mehr erinnern!',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              unlocksEvidence: 'notiz_andenkenladen_replik',
              unlocksThought: 'thought_f4_kapitaen_replik',
              setsFlag: 'flag_f4_laden_gesprochen',
              text: 'Ein Kapitän ohne Namen… und eine maßgeschneiderte Chronometer-Replika?! Nate, das schreiben wir uns SOFORT genau als Notiz auf — und dann nichts wie zurück an Bord der MS Aurora!!',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              setsFlag: 'flag_f4_zurueck_an_bord',
              switchesLocationId: 'promenade',
              text: 'Vielen Dank für Ihre Hilfe, Signore! Komm, Maya — wir gehen auf direktem Weg wieder an Deck!',
            },
            // Wieder an Bord: Kurzes Recap mit Maya
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Puh… wieder zurück an Bord der MS Aurora! Nate, dreht sich dir auch gerade der Kopf? Was hat dieser Besuch in Valletta bitte zu bedeuten?!',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Fassen wir unsere Entdeckungen zusammen: Zuerst fiel mir vorhin beim Rausgehen aus dem Sicherheitsraum auf, dass unser Goldener Schiffs-Chronometer irgendwie erstaunlich billig wirkt…',
            },
            {
              speakerId: 'maya',
              emotion: 'shocked',
              text: '…und dann treffen wir in Malta einen berühmten Repliken-Bauer, der neulich für einen echten Kapitän eine täuschend echte Chronometer-Kopie angefertigt hat?!',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Maya… wir sollten uns den Goldenen Chronometer aus Fall 1 unbedingt NOCH EINMAL ganz genau anschauen — nicht bloß durch das Glas hindurch!',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              setsFlag: 'flag_f4_recap_fertig',
              unlocksThought: 'thought_f4_chronometer_pruefen',
              unlocksLocation: 'marston_cabin',
              text: 'Aber Detective Marston hat den Sicherheitsraum vor dem Landgang wieder verriegelt! Er dürfte längst zurück in seiner Kabine 917 sein — versuchen wir sofort, ihn dort zu überzeugen, uns die Kammer noch einmal aufzuschließen!',
            },
          ],
        },
        {
          id: 't_f4_ladenbesitzer_nachfrage',
          title: 'Wegen des Kapitäns nochmal nachfragen',
          speakerId: 'shopkeeper',
          requiredFlag: 'flag_f4_laden_gesprochen',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Sind Sie sicher, dass Sie beim Namen des Kapitäns oder seiner Reederei überhaupt keinen Hinweis mehr im Kopf haben?',
            },
            {
              speakerId: 'shopkeeper',
              emotion: 'sweating',
              text: 'Es tut mir wirklich leid, Signore — so sehr ich mein Gedächtnis auch anstrenge, der Name fällt mir nicht mehr ein. Nur das markante Wappen der MS Aurora-Linie auf seinem alten Zettel kam mir damals bekannt vor…',
            },
          ],
        },
      ],
      presentRules: [],
      fallbackPresentLines: [
        {
          speakerId: 'shopkeeper',
          emotion: 'neutral',
          text: 'Sehr interessantes Papier, Signore — falls Sie eine Schiffs-Replika brauchen, stehe ich jederzeit zur Verfügung!',
        },
      ],
    },

    marston_cabin: {
      id: 'marston_cabin',
      name: 'Kabine 917 · Detective Marstons Zimmer',
      subtitle: 'Deck 9 · Nach dem Familien-Landgang in Valletta',
      backgroundUrl: '/src/assets/images/bg_f3_marston_cabin_1795345218230.jpg',
      charactersPresent: [
        {
          characterId: 'marston',
        },
      ],
      hotspots: [
        {
          id: 'hs_f4_marston_eis_trenchcoat',
          label: 'Marstons klebriger Trenchcoat',
          x: 68,
          y: 44,
          width: 18,
          height: 30,
          lines: [
            {
              speakerId: 'maya',
              emotion: 'smug',
              text: 'Hihi, drei Sorten Eis, Konfetti und eine verknitterte Postkarte aus dem Hafen — dieser Landausflug hat eindeutig Spuren an Franks Garderobe hinterlassen!',
            },
            {
              speakerId: 'nate',
              emotion: 'sweating',
              text: 'Lass ihn bloß nicht merken, dass wir grinsen… drei Higginson-Jungs gleichzeitig zu hüten kostet wahrscheinlich mehr Nerven als eine ganze Mordermittlung.',
            },
          ],
        },
      ],
      talkTopics: [
        {
          id: 't_f4_marston_abenteuer_und_chrono',
          title: 'Vom Malta-Ausflug erzählen & Chronometer ansprechen',
          speakerId: 'marston',
          hideIfFlag: 'flag_f4_marston_ueberzeugt',
          lines: [
            {
              speakerId: 'marston',
              emotion: 'grumpy',
              text: '*stöhnt tief auf* Nie wieder… hörst du, Nate?! Nie wieder lasse ich mich darauf ein, gleichzeitig drei Kinder, zwei Eistüten, einen Familienvater und eine Hafen-Bastion im Auge zu behalten!',
            },
            {
              speakerId: 'maya',
              emotion: 'smug',
              text: 'Ach komm, Frank! So schlimm kann es mit Leo, Rick und Conrad in der Sonne doch gar nicht gewesen sein!',
            },
            {
              speakerId: 'marston',
              emotion: 'sweating',
              text: 'Nicht schlimm?! Conrad wollte in einer Seitengasse einen echten Straßenkater adoptieren, Rick hat fünf Minuten lang den Kanonen auf dem Platz technische Verbesserungen vorgeschlagen, und Leo hat meine komplette Ermittlungsakte als Schiffskarte zum Schatzsuchen missbraucht! Meine Nerven liegen blank!',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Dann setz dich kurz hin, Frank — denn was wir dir jetzt sagen müssen, macht dich sofort wieder hellwach: Wir müssen uns den Goldenen Chronometer aus Fall 1 in der Asservatenkammer noch einmal ganz genau anschauen!',
            },
            {
              speakerId: 'marston',
              emotion: 'headshake',
              text: 'Den Chronometer aus Fall 1?! Nate, dieses Verfahren liegt seit Tagen abgeschlossen in den Akten! Warum sollte ich jetzt wieder die Sicherheitskammer aufschließen, bloß weil du vorhin ein komisches Bauchgefühl an der Vitrine hattest?',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              setsFlag: 'flag_f4_marston_will_grund',
              text: 'Weil wir aus Malta einen handfesten Hinweis mitgebracht haben, Frank! (Zeigen wir Marston unsere Notiz aus dem Andenkenladen — oder erklären ihm unseren Verdacht direkt!)',
            },
          ],
        },
        {
          id: 't_f4_marston_ueberzeugen_fallback',
          title: 'Mit der Andenkenladen-Spur überzeugen',
          speakerId: 'nate',
          requiredFlag: 'flag_f4_marston_will_grund',
          hideIfFlag: 'flag_f4_marston_ueberzeugt',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Hör zu, Frank: Unten in Valletta haben wir einen berühmten Kunsthandwerker gesprochen, der Repliken berühmter Schiffe anfertigt — und der erst kürzlich für einen echten Kapitän eine täuschend echte Chronometer-Replika auf Bestellung gebaut hat!',
            },
            {
              speakerId: 'marston',
              emotion: 'sweating',
              animation: 'shock',
              sfx: 'thought_pop',
              text: 'Was?! Eine… maßgefertigte Chronometer-Replika für einen echten Kapitän?!',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Und genau deshalb sah unser Prachtstück in der Vitrine für Nate vorhin plötzlich so merkwürdig billig aus! Öffne uns bitte den Sicherheitsraum noch einmal!',
            },
            {
              speakerId: 'marston',
              emotion: 'thinking',
              text: 'Verdammt… wenn an eurer Theorie auch nur ein Funken Wahrheit dran ist, stürzt unser ganzes Weltbild über Fall 1 ein. Ich mache euch die Kammer wieder auf — aber unter einer Bedingung!',
            },
            {
              speakerId: 'marston',
              emotion: 'neutral',
              setsFlag: 'flag_f4_marston_ueberzeugt',
              unlocksLocation: 'ship_library',
              text: 'Wir raten nicht ins Blaue! Oben in der Schiffsbibliothek gibt es alte Chroniken über die Geschichte unseres Schiffs und der gesamten Reederei-Flotte. Sucht zuerst das richtige Werk mit den exakten Echtheitsmerkmalen des Originals heraus — dann prüfen wir die drei Punkte direkt am Asservat!',
            },
          ],
        },
        {
          id: 't_f4_marston_bibliothek_erinnerung',
          title: 'Wo liegt die Schiffsbibliothek?',
          speakerId: 'marston',
          requiredFlag: 'flag_f4_marston_ueberzeugt',
          lines: [
            {
              speakerId: 'marston',
              emotion: 'neutral',
              text: 'Die Schiffsbibliothek liegt oben auf Deck 7 — schnappt euch dort das Buch zur Geschichte des Schiffs und der Flotte und notiert die drei Merkmale des echten Chronometers.',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Verstanden, Frank — wir holen die Chronik sofort und treffen dich danach direkt im Sicherheitsraum!',
            },
          ],
        },
      ],
      presentRules: [
        {
          evidenceId: 'notiz_andenkenladen_replik',
          targetCharacterId: 'marston',
          hideIfFlag: 'flag_f4_marston_ueberzeugt',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              shout: 'MOMENT MAL!',
              shake: true,
              text: 'Schau dir genau diese Notiz aus Vallettas Maritimem Andenkenladen an, Frank! Ein Spezialist für täuschend echte Schiffs-Repliken hat vor Kurzem für einen echten Kapitän eine maßgeschneiderte Chronometer-Fälschung gebaut!',
            },
            {
              speakerId: 'marston',
              emotion: 'sweating',
              animation: 'shock',
              sfx: 'thought_pop',
              text: 'Eine… maßgeschneiderte Kopie?! Und deshalb kam dir der Chronometer vorhin in der Kammer so seltsam billig vor?!',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Genau! Schließ uns den Sicherheitsraum noch einmal auf — wir müssen wissen, ob in unserer Vitrine etwa nur so eine Attrappe liegt!',
            },
            {
              speakerId: 'marston',
              emotion: 'thinking',
              setsFlag: 'flag_f4_marston_ueberzeugt',
              unlocksLocation: 'ship_library',
              text: 'In Ordnung, ihr habt mich überzeugt! Aber bevor wir einfach das Siegel brechen, besorgt mir echte Vergleichskriterien: Sucht in der Schiffsbibliothek in den Büchern zur Geschichte des Schiffs und der Flotte die offiziellen Merkmale des Originals heraus. Ich warte dann mit offenem Panzerglas im Sicherheitsraum!',
            },
          ],
        },
      ],
      fallbackPresentLines: [
        {
          speakerId: 'marston',
          emotion: 'grumpy',
          text: 'Nach dem Eistüten-Marathon in Valletta brauchst du mir das nicht unter die Nase zu halten — zeig mir lieber einen triftigen Grund aus Malta, warum wir nochmal in die Kammer sollen!',
        },
      ],
    },

    ship_library: {
      id: 'ship_library',
      name: 'Schiffsbibliothek · Deck 7',
      subtitle: 'Mahagoni-Regale & Reederei-Archiv der MS Aurora',
      backgroundUrl: '/src/assets/images/bg_f4_ship_library_1795445497220.jpg',
      charactersPresent: [],
      hotspots: [
        {
          id: 'hs_f4_bibliothek_regal',
          label: 'Bücher zu Geschichte von Schiff & Flotte suchen',
          x: 42,
          y: 44,
          width: 34,
          height: 36,
          hideIfFlag: 'flag_f4_buecher_gefunden',
          lines: [
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Whoa, was für eine urige Bibliothek! Überall zwischen Globen und Leitern liegen verstreute Geschichtsbände — sammeln wir alle 8 Bücher über Schiff & Flotte zusammen und finden heraus, welches das Richtige über den Chronometer ist!',
              startsMiniGameId: 'library_books_hidden',
            },
          ],
        },
        {
          id: 'hs_f4_bibliothek_lesetisch',
          label: 'Grüne Leselampe & Eichentisch',
          x: 50,
          y: 68,
          width: 24,
          height: 18,
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Gemütliches Leselicht… eigentlich genau der richtige Ort für unseren ruhigen Urlaub – wenn nicht draußen ein ganzes Verbrechen auf Aufklärung warten würde.',
            },
            {
              speakerId: 'maya',
              emotion: 'smug',
              text: 'Gib’s zu, Nate – selbst im Urlaub würdest du doch heimlich nach irgendeiner verschwundenen Kriminalakte suchen, wenn wir länger als eine Stunde stillsitzen!',
            },
          ],
        },
      ],
      talkTopics: [
        {
          id: 't_f4_maya_bibliothek_hilfe',
          title: 'Mit Maya in der Bibliothek umschauen',
          speakerId: 'maya',
          lines: [
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Schau dich einfach an den Bücherregalen und Sesseln um! Sobald wir die 8 verstreuten Bände gefunden haben, picken wir uns die echte Flotten-Chronik mit den 3 Merkmalen heraus!',
            },
          ],
        },
      ],
      presentRules: [],
      fallbackPresentLines: [
        {
          speakerId: 'maya',
          emotion: 'thinking',
          text: 'Hier in der Bibliothek steht niemand zum Vorlegen — durchsuche einfach die Regale nach den Geschichts- und Flottenbüchern!',
        },
      ],
    },

    courtroom: {
      id: 'courtroom',
      name: 'Großer Ballsaal · Letzte Verhandlung',
      subtitle: 'Tag 6 · Abend · Finale des Seegerichts vor Athen',
      backgroundUrl: '/src/assets/images/cruise_court_ballroom_1795039845955.jpg',
      charactersPresent: [],
      hotspots: [],
      talkTopics: [
        {
          id: 't_f4_courtroom_fortsetzen',
          title: 'Zur Verhandlung mit Detective Marston',
          speakerId: 'marston',
          hideIfFlag: 'flag_f4_backstage_aktiv',
          lines: [
            {
              speakerId: 'pendelton',
              emotion: 'neutral',
              text: 'Detective Marston erwartet nun die Fragen der Verteidigung im Zeugenstand!',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Alles klar, Euer Ehren — dann bringen wir diesen letzten offenen Punkt endlich zu Ende!',
              startsTestimonyId: 'testimony_f4_marston',
            },
          ],
        },
      ],
      presentRules: [],
      fallbackPresentLines: [
        {
          speakerId: 'pendelton',
          emotion: 'headshake',
          text: 'Bitte legen Sie Beweise ausschließlich während der laufenden Vernehmung oder auf direkte Aufforderung des Gerichts vor!',
        },
      ],
    },

    backstage: {
      id: 'backstage',
      name: 'Hinter der Bühne · Großer Ballsaal',
      subtitle: 'Kapitän Brammer, Sabine Lindemann & Detective Marston',
      backgroundUrl: '/src/assets/images/bg_f3_backstage_1795345218370.jpg',
      charactersPresent: [
        {
          characterId: 'captain',
        },
        {
          characterId: 'cruisemanager',
        },
        {
          characterId: 'marston',
        },
      ],
      hotspots: [],
      talkTopics: [
        {
          id: 't_f4_backstage_abschluss',
          title: 'Mit Kapitän Brammer sprechen',
          speakerId: 'captain',
          hideIfFlag: 'flag_f4_kapitaen_gestanden',
          lines: [
            {
              speakerId: 'captain',
              emotion: 'sweating',
              text: 'Es gibt nichts mehr zu verbergen, Mr. Sterling… es war mein Fehler, und morgen im Heimathafen Athen stelle ich mich der Verantwortung.',
            },
            {
              speakerId: 'marston',
              emotion: 'neutral',
              setsFlag: 'flag_f4_kapitaen_gestanden',
              triggersOutro: true,
              text: 'Andrew und Eleonore erhalten sofort Bescheid, dass jeder Vorwurf vom Tisch ist. Komm, Nate — gehen wir vor den letzten Sonnenaufgang.',
            },
          ],
        },
      ],
      presentRules: [],
      fallbackPresentLines: [
        {
          speakerId: 'marston',
          emotion: 'neutral',
          text: 'Wir brauchen keine Akten mehr vorzulegen, Nate — hier hinter dem Vorhang zählt nur noch die volle Wahrheit.',
        },
      ],
    },

    athens_harbor: {
      id: 'athens_harbor',
      name: 'Hafen von Athen · Ausschiffung',
      subtitle: 'Tag 7 · Sonniger Pier vor der MS Aurora',
      backgroundUrl: '/src/assets/images/bg_f4_athens_disembark_1795455836534.jpg',
      charactersPresent: [
        {
          characterId: 'cruisemanager',
          visibleIfFlag: 'flag_f4_epilog_maya_fertig',
        },
      ],
      hotspots: [
        {
          id: 'hs_f4_athen_aurora',
          label: 'Ein letzter Blick auf die MS Aurora',
          x: 56,
          y: 22,
          width: 34,
          height: 36,
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Da liegt sie in der Morgensonne… Wer hätte gedacht, dass hinter dieser weißen Luxusfassade vom ersten bis zum letzten Tag so viele Schicksale stecken würden?',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Und trotzdem — wir haben keinen einzigen Unschuldigen im Stich gelassen, Nate! Erst Anya, dann Andrew und Eleonore mit ihren drei Wirbelwinden… darauf können wir verdammt stolz sein!',
            },
          ],
        },
        {
          id: 'hs_f4_athen_koffer',
          label: 'Nates & Mayas Kofferwagen',
          x: 18,
          y: 62,
          width: 24,
          height: 26,
          lines: [
            {
              speakerId: 'maya',
              emotion: 'smug',
              text: 'Unsere Schwimmbrillen, deine Badehose und drei ungelesene Urlaubsromane — absolut unbenutzt wieder eingepackt!',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Na komm, wenigstens ein einziger Nachmittag an einem ruhigen griechischen Strand ohne Tatortabsperrung muss jetzt noch drin sein!',
            },
          ],
        },
      ],
      talkTopics: [
        {
          id: 't_f4_epilog_maya_rueckblick',
          title: 'Mit Maya über alles Erlebte an Bord sprechen',
          speakerId: 'maya',
          hideIfFlag: 'flag_f4_epilog_maya_fertig',
          lines: [
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Puh… da stehen wir nun wieder in Athen, Nate. Kommt es dir auch so vor, als läge unsere Einschiffung auf diesem Kahn schon drei ganze Monate zurück?!',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Allerdings… denk nur an den allerersten Abend zurück: Ich wollte bloß nicht mein Sakko-Abzeichen verlegen und höchstens am Gala-Buffet vorbeischauen – und keine Stunde später zertrümmert jemand im VIP-Salon eine Vitrine!',
            },
            {
              speakerId: 'maya',
              emotion: 'smug',
              text: 'Von Anyas unschuldiger Notenmappe und dem eiskalten Oberkellner Arthur… bis hin zu Kommissar Dimitri auf Kreta, der uns einfach per Pantomime den ganzen Schiffsrumpf hat umgraben lassen!',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Und denk an unseren freien Seetag: Ohne dich als tapfere Kinderbändigerin mit Multivitamin-Flecken, ohne Eleonores unermüdlichen Notizblock und Kalles frische Walkman-Batterien hätten wir Andrews Unschuld nie bewiesen.',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Und dann erst der kleine Andenkenladen in Valletta, die Flotten-Chronik von 1924… und am Ende Kapitän Brammer. Es war irgendwie tragisch und doch heilsam, wie alles ans Licht kam.',
            },
            {
              speakerId: 'nate',
              emotion: 'neutral',
              text: 'Ja. Der wahre Chronometer geht zurück an die Reederei, Anya kann weiter frei aufspielen, und Andrew hat vor Gericht keinen einzigen Makel mehr. Was für eine unvergessliche Reise…',
            },
            {
              speakerId: 'maya',
              emotion: 'shocked',
              sfx: 'thought_pop',
              setsFlag: 'flag_f4_epilog_maya_fertig',
              text: 'Oh, schau mal da vorne an der Gangway, Nate! Kommt da nicht gerade Sabine Lindemann noch einmal im Stechschritt auf uns zu?!',
            },
          ],
        },
        {
          id: 't_f4_epilog_sabine',
          title: 'Mit Kreuzfahrtmanagerin Sabine Lindemann sprechen',
          speakerId: 'cruisemanager',
          requiredFlag: 'flag_f4_epilog_maya_fertig',
          hideIfFlag: 'flag_f4_epilog_fertig',
          lines: [
            {
              speakerId: 'cruisemanager',
              emotion: 'sweating',
              text: 'Mr. Sterling! Miss Maya! Wie gut, dass ich Sie beide noch vor den Taxis erwische — die Abwicklung oben im Hafen hat mich noch festgehalten…',
            },
            {
              speakerId: 'nate',
              emotion: 'neutral',
              text: 'Guten Morgen, Frau Lindemann. Wie ist die Übergabe oben auf der Brücke denn gelaufen?',
            },
            {
              speakerId: 'cruisemanager',
              emotion: 'sweating',
              text: '*seufzt leise* Ruhig, würdevoll… und unendlich traurig. Detective Marston hat ihn persönlich begleitet, als er freiwillig von Bord ging. Ach, glauben Sie mir – es bricht mir wirklich das Herz um unseren Kapitän.',
            },
            {
              speakerId: 'cruisemanager',
              emotion: 'neutral',
              text: 'Alle an Bord – jeder Matrose, jede Stewardess, jeder Offizier – haben den alten Seebären geliebt. Vierzig Jahre lang hat er Stürme abgefangen und keinem Menschen je ein Haar gekrümmt… bis dieser unglückselige Stolz um das Erbstück seines Großvaters alles zerstört hat.',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Es ist wirklich bitter… Aber immerhin hat er gestern Abend rechtzeitig eingelenkt und niemandem mehr länger geschadet.',
            },
            {
              speakerId: 'cruisemanager',
              emotion: 'confident',
              animation: 'nod',
              sfx: 'evidence_chime',
              text: 'So ist es, Miss Maya. Und wissen Sie, was mitten in diesem ganzen Wirbel heute Morgen geschehen ist?! Die gesamte Reederei- und Flottenleitung hat die Passagierzahlen und das unglaubliche Echo aus dem Ballsaal ausgewertet!',
            },
            {
              speakerId: 'cruisemanager',
              emotion: 'confident',
              text: 'Ich habe die Flottenleitung heute früh restlos davon überzeugt, dass es ab sofort auf JEDER einzelnen Reise unserer Schiffe eine feste Live-Gerichtsshow im Abendprogramm geben wird!! Spannung, Justiz-Feeling, große Wendungen – die Gäste sind völlig aus dem Häuschen!',
            },
            {
              speakerId: 'nate',
              emotion: 'shocked',
              text: 'Eine… feste Live-Gerichtsshow?! Auf jeder Kreuzfahrt?!',
            },
            {
              speakerId: 'cruisemanager',
              emotion: 'confident',
              text: 'GANZ GENAU!! Und genau deshalb stehe ich hier außer Atem auf der Pier: Ich hätte Sie beide unbedingt gerne als unsere festen Haupt-Stars dabei!! Verteidiger Nate Sterling & Meister-Assistentin Maya — Luxus-Suite, Vollpension und jeden Abend tosender Applaus!',
            },
            {
              speakerId: 'nate',
              emotion: 'shocked',
              animation: 'headshake',
              shake: true,
              text: 'NEIN!! AUF GAR KEINEN FALL — tut mir furchtbar leid, Frau Lindemann, wirklich!!',
            },
            {
              speakerId: 'maya',
              emotion: 'sweating',
              animation: 'headshake',
              text: 'Ich unterschreibe SOFORT bei Nate! Vielen Dank für das großzügige Angebot — aber nach sechs Tagen Hochspannung brauchen wir erst einmal mindestens ein halbes Jahr Urlaub AN LAND, ganz ohne Zeugenstand!',
            },
            {
              speakerId: 'cruisemanager',
              emotion: 'smug',
              text: 'Haha… wissen Sie was? Irgendwie dachte ich mir das beinahe schon, als ich vorhin Ihren Blick Richtung Taxi gesehen habe!',
            },
            {
              speakerId: 'cruisemanager',
              emotion: 'confident',
              setsFlag: 'flag_f4_epilog_fertig',
              triggersOutro: true,
              text: 'Kein Problem, meine Lieben — genießen Sie Ihren echten Land-Urlaub! Und machen Sie sich um meine neue Show bloß keine Sorgen… ich habe hier auf der Pier schon andere gesehen, die ich da sofort fragen kann! Auf Wiedersehen!!',
            },
          ],
        },
      ],
      presentRules: [],
      fallbackPresentLines: [
        {
          speakerId: 'maya',
          emotion: 'confident',
          text: 'Die Gerichtsakte hat ab heute Feierabend, Nate! Sprich einfach mit mir oder schau dir noch einmal unsere MS Aurora an.',
        },
      ],
    },
  },
  testimonies: {
    testimony_f4_marston: {
      id: 'testimony_f4_marston',
      title: 'Letzte Verhandlung · Detective Marston im Zeugenstand',
      witnessId: 'marston',
      introLines: [
        {
          speakerId: 'marston',
          emotion: 'neutral',
          text: 'Euer Ehren, meine Damen und Herren: Als letzter verbliebener Belastungspunkt aus Fall 1 liegt weiterhin der weingetränkte 45.000-€-Brief aus Arthur Morgans Nachlass vor Gericht.',
        },
        {
          speakerId: 'nate',
          emotion: 'confident',
          text: 'Alles klar, Frank! Zeigen wir dem gesamten Ballsaal jetzt Stück für Stück, was in diesem Schreiben – und in der Asservatenkammer – wirklich steckt!',
        },
      ],
      statements: [
        {
          id: 'f4_m_s1',
          text: 'Anklagepunkt 4 stützt sich auf den Text des Schreibens: „Letzte Frist: 45.000 Euro bis zum Einlaufen auf Kreta. Bis dahin bleibt der Chronometer als Sicherheit.“',
          pressLines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'An diesem Wortlaut hat niemand gerüttelt, Frank – die Frage ist nur: An WEN sollte dieses Erpresserschreiben eigentlich wirklich gehen?!',
            },
            {
              speakerId: 'marston',
              emotion: 'neutral',
              text: 'Genau dazu komme ich gleich bei den Empfänger-Initialen im Rotweinring…',
            },
          ],
        },
        {
          id: 'f4_m_s2',
          text: 'Meine Übernacht-Abfrage zur Konto-Referenz „KRETA-77“ ergab zwar keinerlei Verbindung zu Andrew Higginson — doch auf dem Asservat selbst steht nun einmal eindeutig „An: A. H.“ geschrieben!',
          pressLines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: '„Eindeutig“?! Hast du das Original in der Sicherheitskammer heute Morgen wirklich selbst durch eine Lupe unter UV-Licht gesehen, Frank?!',
            },
            {
              speakerId: 'marston',
              emotion: 'sweating',
              text: 'Äh… genau dafür hatten wir heute Morgen unsere gemeinsame Forensik-Prüfung am Tisch! Wenn Sie diesen „A. H.“-Schriftzug widerlegen können, Nate – legen Sie Ihren Befund jetzt auf den Tisch!',
            },
          ],
          contradiction: {
            requiredEvidenceId: 'beweis_brief_manipuliert',
            successLines: [
              {
                speakerId: 'nate',
                emotion: 'confident',
                shout: 'EINSPRUCH!',
                shake: true,
                sfx: 'objection',
                text: 'DIESES „AN: A. H.“ IST EINE NACHTRÄGLICHE MANIPULATION, EUER EHREN!!',
              },
              {
                speakerId: 'nate',
                emotion: 'confident',
                text: 'Detective Marston selbst öffnete uns heute Morgen den versiegelten Asservatenraum! Unter 2,5-facher Lupe und UV-Streiflicht hat sich am angetrockneten Weinrand etwas Ungeheuerliches gezeigt:',
              },
              {
                speakerId: 'maya',
                emotion: 'confident',
                text: 'Die Zeile „Konto-Ref: KRETA-77“ stammt aus derselben verblassten Tinte wie der restliche Erpresserbrief — aber hinten beim Empfänger-Kürzel wurde auf dem schon trockenen Rotweinfleck mit jüngerer Tinte herumgekratzt und überschrieben!!',
              },
              {
                speakerId: 'falk',
                emotion: 'shocked',
                shake: true,
                text: 'WAS?! Überkratzt?! N-na und?! Selbst wenn ein feuchter Korken oder irgendein Schreiber dort gekleckst hat — wer auf diesem ganzen Luxusdampfer sollte es denn sonst gewesen sein?! „A. M.“ für Arthur Morgan ergibt ja wohl keinen Sinn, wenn Arthur die Forderung bei sich trug!!',
              },
              {
                speakerId: 'nate',
                emotion: 'confident',
                text: 'Genau deshalb schauen wir jetzt noch einmal mit vollem Saal-Scheinwerfer auf die freigelegten Grundstriche unter diesem überschmierten „H.“! Welches ursprüngliche Monogramm stand wirklich dort?!',
                choices: [
                  {
                    label: '„A. W.“ – Die senkrechten Federstriche darunter gehören eindeutig zu einem „W.“!',
                    nextLines: [
                      {
                        speakerId: 'nate',
                        emotion: 'confident',
                        shout: 'VOLLTREFFER!',
                        shake: true,
                        sfx: 'deduction',
                        unlocksEvidence: 'beweis_aw_original',
                        unlocksThought: 'thought_f4_aw_stimmt',
                        setsFlag: 'flag_f4_fin_brief_entkraeftet',
                        text: 'GANZ GENAU: „A. W.“ STIMMT!! Ein unbekannter Täter hat auf dem angetrockneten Weinrand aus einem ursprünglichen „W.“ nachträglich ein „H.“ zurechtgekratzt, um den Verdacht auf Andrew Higginson („A. H.“) zu lenken!',
                      },
                    ],
                  },
                  {
                    label: '„A. M.“ – Arthur hat wohl versucht, sich selbst zu erpressen.',
                    nextLines: [
                      {
                        speakerId: 'falk',
                        emotion: 'smug',
                        text: 'Lächerlich, Sterling! Warum sollte Morgan sich selbst 45.000 Euro Frist setzen?! Schauen Sie gefälligst auf den gezackten Grundstrich rechts neben dem „A.“!',
                      },
                      {
                        speakerId: 'nate',
                        emotion: 'confident',
                        shout: 'VOLLTREFFER!',
                        shake: true,
                        sfx: 'deduction',
                        unlocksEvidence: 'beweis_aw_original',
                        unlocksThought: 'thought_f4_aw_stimmt',
                        setsFlag: 'flag_f4_fin_brief_entkraeftet',
                        text: 'Stimmt – diese doppelte Zickzack-Spur unter der frischen „H.“-Tinte ist kein „M.“ und kein „H.“! Es ist ein klares „W.“ – „A. W.“ STIMMT!! Jemand hat aus „A. W.“ nachträglich „A. H.“ gemacht, um Andrew zu belasten!',
                      },
                    ],
                  },
                  {
                    label: '„A. H.“ – Trotz Überschreibung war wohl schon Andrew gemeint.',
                    nextLines: [
                      {
                        speakerId: 'maya',
                        emotion: 'sweating',
                        text: 'Nate!! Nicht aufgeben — genau dieses „H.“ war doch erst mit der jüngeren Tinte oben draufgesetzt! Schau dir die tiefere, alte Zackenspur direkt darunter an!',
                      },
                      {
                        speakerId: 'nate',
                        emotion: 'confident',
                        shout: 'VOLLTREFFER!',
                        shake: true,
                        sfx: 'deduction',
                        unlocksEvidence: 'beweis_aw_original',
                        unlocksThought: 'thought_f4_aw_stimmt',
                        setsFlag: 'flag_f4_fin_brief_entkraeftet',
                        text: 'Du hast völlig recht, Maya! Die echte alte Tinte darunter bildet eindeutige schräge Balken – „A. W.“! Das „A. H.“ war bloß nachträglich aufgeschmiert — „A. W.“ STIMMT!!',
                      },
                    ],
                  },
                ],
              },
              {
                speakerId: 'pendelton',
                emotion: 'confident',
                sfx: 'gavel',
                text: 'Beweis 4 – der weingetränkte 45.000-€-Brief – ist damit als manipuliert und gegen Andrew Higginson völlig wertlos aus den Gerichtsakten gestrichen!! Sämtliche vier Anklagepunkte gegen Mr. Higginson sind zusammengebrochen!',
              },
              {
                speakerId: 'falk',
                emotion: 'facepalm',
                animation: 'facepalm',
                sfx: 'facepalm',
                text: 'N-NEIN!! ALL MEINE VIER SÄULEN?! Aber Moment!! Wenn Sie schon so klug tun, Sterling — WARUM überhaupt hätte irgendjemand ein simples „A. W.“ in „A. H.“ fälschen und dafür heimlich in die Asservatenkammer einsteigen sollen?!',
              },
              {
                speakerId: 'falk',
                emotion: 'confident',
                text: 'In dieser Kammer lag seit Fall 1 doch nichts weiter als dieser Zettel und der sichergestellte, längst geklärte Goldene Schiffs-Chronometer!',
              },
              {
                speakerId: 'nate',
                emotion: 'confident',
                text: 'Genau DA liegt die Antwort, Mr. von Falk! Wenn in dem Brief steht: „Bis dahin bleibt der Chronometer als Sicherheit“, dann fragen Sie sich doch endlich einmal, was in jener Vitrine in der Asservatenkammer WIRKLICH liegt!',
                requiresFinalEvidencePrompt: {
                  question:
                    'Zeige Staatsanwalt von Falk und dem Seegericht den entscheidenden Befund über den Goldenen Chronometer aus Fall 1!',
                  correctEvidenceId: 'beweis_chronometer_faelschung',
                  successLines: [
                    {
                      speakerId: 'nate',
                      emotion: 'confident',
                      shout: 'EINSPRUCH!',
                      shake: true,
                      sfx: 'deduction',
                      text: 'WEIL UNSER „GOLDENER CHRONOMETER“ AUS FALL 1 IN WAHRHEIT EINE BILLIGE FÄLSCHUNG AUS MALTA IST!!',
                    },
                    {
                      speakerId: 'nate',
                      emotion: 'confident',
                      text: 'Schauen Sie sich diesen Direktvergleich gegen die echte Flotten-Chronik von 1924 an!! Statt 18-Karat-Vollgold nur dünn bemaltes Zinn, eine starr verschraubte Aufhängungs-Attrappe — und auf der Innenseite eingraviert: „REPLIKA · VALLETTA M-09“!!',
                    },
                    {
                      speakerId: 'maya',
                      emotion: 'confident',
                      text: 'Und der maltesische Repliken-Bauer Matteo Borg hat uns heute persönlich bestätigt: Vor einigen Wochen bestellte genau diese maßgefertigte Chronometer-Kopie ein echter Kapitän!!',
                    },
                    {
                      speakerId: 'pendelton',
                      emotion: 'shocked',
                      animation: 'shock',
                      sfx: 'tension',
                      text: 'WAS?! Eine Replik in der Vitrine der MS Aurora?! Dann befand sich der echte, unersetzliche Schiffs-Chronometer überhaupt nicht dort – und jemand hat die Initialen „A. W.“ in „A. H.“ geändert, um jeden Verdacht von „A. W.“ abzulenken!!',
                    },
                    {
                      speakerId: 'marston',
                      emotion: 'sweating',
                      text: 'Moment… haltet mal alle den Atem an!! Wenn wir fünf Tage zurückblicken: Der Täter hat nicht bloß in der verschlossenen Asservatenkammer den Brief umgeschrieben…',
                    },
                    {
                      speakerId: 'nate',
                      emotion: 'thinking',
                      text: 'Richtig, Frank! Er besorgte sich das Betäubungsmittel im Krankenzimmer, knackte Zelle 08, riss die Seite im Technik-Handbuch heraus, holte Andrews Schal aus dem Fundbüro F-418 — UND manipulierte diesen Brief in der streng bewachten Asservatenkammer!',
                    },
                    {
                      speakerId: 'pendelton',
                      emotion: 'neutral',
                      animation: 'slam',
                      sfx: 'gavel',
                      text: 'Eine entscheidende Frage vor diesem Gericht, Mr. Sterling: WER auf diesem Schiff konnte überhaupt unbemerkt in diese verschlossene Asservatenkammer – und in all die anderen Räume – gelangen?!',
                      choices: [
                        {
                          label: 'Nur Crew-Mitglieder mit Schiffs-Schlüsseln!',
                          nextLines: [
                            {
                              speakerId: 'nate',
                              emotion: 'thinking',
                              text: 'Kein normaler Passagier besitzt auch nur eine einzige Schlüsselkarte für solche Bereiche — es muss jemand mit offiziellem Bord-Zugang sein! Aber… kommt wirklich irgendein Crew-Mitglied überall hinein?',
                            },
                          ],
                        },
                        {
                          label: 'Nur die Schiffs-Sicherheit (Security) verwaltet solche Räume!',
                          nextLines: [
                            {
                              speakerId: 'brandt',
                              emotion: 'shocked',
                              text: 'Moment mal!! Unterstellen Sie mir das nicht, Mr. Sterling! Ja, ich bewache Zellen und Asservaten — aber in andere gesicherte Abteilungen an Bord komme ich selbst mit meiner Marke überhaupt nicht hinein!',
                            },
                          ],
                        },
                      ],
                    },
                    {
                      speakerId: 'nate',
                      emotion: 'confident',
                      text: 'Prüfen wir das nicht aus dem Bauch heraus, Euer Ehren — sondern fragen wir sämtliche vier Bereichs-Verantwortlichen hier und jetzt der Reihe nach unter Eid ab!',
                    },
                    {
                      speakerId: 'nate',
                      emotion: 'thinking',
                      text: 'Es geht um genau fünf Tat-Bereiche: (1) Krankenzimmer wegen des Betäubungsmittels, (2) Zellenbereich, (3) Technik wegen des MS-400-Handbuchs, (4) Fundbüro wegen des blauen Schals und (5) die Asservatenkammer wegen des Briefs. Wen rufen wir zuerst in den Zeugenstand?',
                      choicePool: true,
                      choices: [
                        {
                          label: 'Technik rufen (Chef-Elektriker Lars Kowalski)',
                          nextLines: [
                            {
                              speakerId: 'electrician',
                              emotion: 'neutral',
                              text: 'N’Abend zusammen. Na schießen Sie los, Herr Anwalt — fragen Sie ruhig, welche Türen mein Technik-Chip aufkriegt und welche nicht.',
                            },
                            {
                              speakerId: 'nate',
                              emotion: 'thinking',
                              text: 'Mr. Kowalski, fangen wir beim Krankenzimmer an: Kommen Sie an den Betäubungsmittel-Schrank von Dr. Vance?',
                            },
                            {
                              speakerId: 'electrician',
                              emotion: 'headshake',
                              text: 'Krankenzimmer? Auf gar keinen Fall! Die Medikamenten-Safes sind medizinisch verplombt — da komm ich höchstens rein, wenn eine Glühbirne flackert und die Ärztin direkt danebensteht.',
                            },
                            {
                              speakerId: 'nate',
                              emotion: 'thinking',
                              text: 'Verstanden. Wie sieht es beim Zellenbereich, Ihrem Technikraum mit den MS-400-Handbüchern, dem Fundbüro und der Asservatenkammer aus?',
                            },
                            {
                              speakerId: 'electrician',
                              emotion: 'neutral',
                              text: 'Also: Zellenbereich? Nur für Wartungsaufträge mit Security-Begleitung – allein hab ich da keinen Dauercode. Technik & Handbücher? Klar, das ist mein eigener Arbeitsplatz. Fundbüro F-418? Keine Chance, das gehört zur Rezeption. Und die Asservatenkammer? Streng abgeriegelt – noch nie von innen gesehen!',
                            },
                            {
                              speakerId: 'maya',
                              emotion: 'thinking',
                              text: '(Notiert für Technik / Kowalski: Technik & Wartungs-Zellenbereich JA · Krankenzimmer, Fundbüro & Asservatenkammer NEIN!)',
                            },
                          ],
                        },
                        {
                          label: 'Ärztin rufen (Dr. Helena Vance)',
                          nextLines: [
                            {
                              speakerId: 'vance',
                              emotion: 'neutral',
                              text: 'Guten Abend, Euer Ehren. Ich beantworte Ihre Zugangsfragen zu meiner Abteilung und dem Schiff selbstverständlich präzise.',
                            },
                            {
                              speakerId: 'nate',
                              emotion: 'thinking',
                              text: 'Frau Dr. Vance: Wie steht es zunächst um Ihren Zugang zum Krankenzimmer und dessen Betäubungsmitteln sowie zum Zellenbereich?',
                            },
                            {
                              speakerId: 'vance',
                              emotion: 'neutral',
                              text: 'Der Betäubungsmittel-Safe im Krankenzimmer unterliegt allein meinem persönlichen Arztschlüssel. In den Zellenbereich hingegen gelange ich ausschließlich bei medizinischem Notruf – ein eigenes Schlossrecht für Zelle 08 besitze ich nicht.',
                            },
                            {
                              speakerId: 'nate',
                              emotion: 'thinking',
                              text: 'Und die übrigen drei Bereiche – Technikraum wegen der Handbücher, das Fundbüro und die Asservatenkammer?',
                            },
                            {
                              speakerId: 'vance',
                              emotion: 'headshake',
                              text: 'Technikraum: niemals betreten, null Zugang. Fundbüro: gehört allein zur Rezeption und Hausdame. Und die Asservatenkammer: ebenfalls keinerlei Zutrittsberechtigung.',
                            },
                            {
                              speakerId: 'maya',
                              emotion: 'thinking',
                              text: '(Notiert für Ärztin / Dr. Vance: Krankenzimmer JA · Zellenbereich, Technik, Fundbüro & Asservatenkammer NEIN!)',
                            },
                          ],
                        },
                        {
                          label: 'Rezeption rufen (Miriam König)',
                          nextLines: [
                            {
                              speakerId: 'miriam',
                              emotion: 'neutral',
                              text: 'Guten Abend, Euer Ehren! Fragen Sie mich sehr gern nach jeder einzelnen Schlüsselkarte in unserer Rezeptions-Schublade.',
                            },
                            {
                              speakerId: 'nate',
                              emotion: 'thinking',
                              text: 'Miss König, gehen wir alle fünf Punkte der Reihe nach durch: Krankenzimmer, Zellenbereich und Technikraum?',
                            },
                            {
                              speakerId: 'miriam',
                              emotion: 'headshake',
                              text: 'Dreimal glatt Nein! An den Medikamenten-Schrank im Krankenzimmer, in den gesicherten Zellenbereich oder in Kowalskis Technik-Werkstatt kommt die Rezeption niemals hinein.',
                            },
                            {
                              speakerId: 'nate',
                              emotion: 'thinking',
                              text: 'Bleiben das Fundbüro – und die Asservatenkammer.',
                            },
                            {
                              speakerId: 'miriam',
                              emotion: 'confident',
                              text: 'Das Fundbüro verwalten wir gemeinsam mit der Hausdame – dort lag Andrews blauer Schal als F-418 verbucht, bis jemand ihn offenbar außer der Reihe mitnahm. In die Asservatenkammer hingegen habe ich keinen einzigen Zutrittscode!',
                            },
                            {
                              speakerId: 'maya',
                              emotion: 'thinking',
                              text: '(Notiert für Rezeption / Miriam: Fundbüro JA · Krankenzimmer, Zellenbereich, Technik & Asservatenkammer NEIN!)',
                            },
                          ],
                        },
                        {
                          label: 'Sicherheit rufen (Officer Lukas Brandt)',
                          nextLines: [
                            {
                              speakerId: 'brandt',
                              emotion: 'neutral',
                              text: 'Melde mich zur Aussage, Euer Ehren. Ich habe nichts zu verbergen – prüfen Sie meine Dienstkarte auf Herz und Nieren!',
                            },
                            {
                              speakerId: 'nate',
                              emotion: 'thinking',
                              text: 'Officer Brandt: Sie haben Zugang zum Zellenbereich und zur Asservatenkammer – korrekt? Was ist aber mit dem Krankenzimmer, der Technik und dem Fundbüro?',
                            },
                            {
                              speakerId: 'brandt',
                              emotion: 'sweating',
                              text: 'Zellenbereich und – unter Doppelprotokoll mit Detective Marston – die Asservatenkammer: ja, dafür trage ich meinen Sicherheits-Schlüssel. Aber Krankenzimmer?! Dr. Vance reißt jedem den Kopf ab, der sich auch nur ihrem Betäubungsmittel-Safe nähert!',
                            },
                            {
                              speakerId: 'vance',
                              emotion: 'neutral',
                              text: 'Das kann ich bestätigen, Euer Ehren! Nicht einmal die Schiffs-Sicherheit besitzt einen Schlüssel zu meinem Betäubungsmittel-Safe.',
                            },
                            {
                              speakerId: 'brandt',
                              emotion: 'neutral',
                              text: 'Und in der Technik-Werkstatt bei den MS-400-Handbüchern oder drüben im verschlossenen Fundbüro-Schrank der Rezeption schlägt mein Sicherheits-Chip überall rot an – kein Zutritt!',
                            },
                            {
                              speakerId: 'maya',
                              emotion: 'thinking',
                              text: '(Notiert für Sicherheit / Brandt: Zellenbereich & Asservatenkammer JA · Krankenzimmer, Technik & Fundbüro NEIN!)',
                            },
                          ],
                        },
                      ],
                    },
                    // Nach allen vier Zeugen:
                    {
                      speakerId: 'maya',
                      emotion: 'shocked',
                      unlocksEvidence: 'notiz_zugangsmatrix',
                      unlocksThought: 'thought_f4_keiner_hat_alle_5',
                      text: 'Moment mal, Nate… schau auf unsere fertige Liste nach allen vier Bereichs-Zeugen!! Weder die Ärztin noch die Technik, weder die Rezeption noch selbst die Schiffs-Sicherheit kommen in alle fünf Räume!!',
                    },
                    {
                      speakerId: 'nate',
                      emotion: 'thinking',
                      text: '(Moment… kein normales Crew-Mitglied kommt gleichzeitig ans Betäubungsmittel im Krankenzimmer, in den Zellenbereich, ans MS-400-Handbuch, ins Fundbüro UND unbemerkt in die Asservatenkammer… Wer auf der gesamten MS Aurora trägt für den Notfall einen General-Schlüssel über ALLE fünf Abteilungen — UND wessen Vorname beginnt mit „A. W.“ — UND wollte in Malta eine Chronometer-Replika…?!!)',
                    },
                    {
                      speakerId: 'nate',
                      emotion: 'confident',
                      shout: 'MOMENT MAL!',
                      shake: true,
                      text: 'MOMENT MAL!! EUER EHREN!! Es gibt hier an Bord genau EINE einzige Person mit General-Zugang zu sämtlichen Bereichen — genau dort oben… der WAHRE Täter ist KAPITÄN—!!',
                    },
                    {
                      speakerId: 'cruisemanager',
                      emotion: 'shocked',
                      animation: 'shock',
                      sfx: 'alarm',
                      shake: true,
                      text: 'HALT!! STOPP!! MEINE DAMEN UND HERREN, WAS FÜR EINE PHANTASTISCHE SHOW!! TOSENDER APPLAUS BITTE!!',
                    },
                    {
                      speakerId: 'cruisemanager',
                      emotion: 'sweating',
                      text: 'WAS WAR DAS DENN BITTE AN UNSEREM LETZTEN ABEND AN BORD!! Welch ein grandioses Krimi-Theater — und vergessen Sie nicht: MORGEN IST ENDE DER REISE IN ATHEN!! Damit verabschieden wir Sie in die letzte Nacht auf See — gute Nacht allerseits!!',
                    },
                    {
                      speakerId: 'pendelton',
                      emotion: 'headshake',
                      text: 'Frau Lindemann?! Was bei allen sieben Weltmeeren fällt Ihnen ein, eine laufende Beweisaufnahme einfach abzupfeifen?!',
                    },
                    {
                      speakerId: 'marston',
                      emotion: 'sweating',
                      text: 'Schnell durch den Seitenausgang hinter die Bühne, Nate und Maya! Sabine hält oben bereits den Kapitän zurück… klären wir den Rest ohne zweitausend Zuschauer!',
                    },
                    // Hinter der Bühne: Kapitän, Managerin, Marston, Nate & Maya
                    {
                      speakerId: 'captain',
                      emotion: 'sweating',
                      unlocksLocation: 'backstage',
                      switchesLocationId: 'backstage',
                      setsPhase: 'investigation',
                      setsFlag: 'flag_f4_backstage_aktiv',
                      text: '*atmet schwer aus und nimmt langsam seine Kapitänsmütze ab* …Danke, Sabine. Danke, dass Sie vor diesen ganzen Passagieren und den Kameras wenigstens mein öffentliches Ansehen – und das unserer Reederei – noch gewahrt haben.',
                    },
                    {
                      speakerId: 'cruisemanager',
                      emotion: 'sweating',
                      text: 'Vierzig Jahre auf den Brücken dieser Flotte wirft man nicht vor zweitausend Touristen mit Handys in den Staub, Albert… Aber hier hinter der Bühne – vor Detective Marston, Mr. Sterling und Miss Maya – ist das Versteckspiel endgültig vorbei.',
                    },
                    {
                      speakerId: 'nate',
                      emotion: 'thinking',
                      text: 'Kapitän Albert Werner Brammer… „A. W.“ auf dem Erpresserbrief. Allein Ihr General-Schlüssel öffnet Krankenzimmer, Zellenbereich, Technikraum, Fundbüro und Asservatenkammer. Warum haben Sie das alles getan, Kapitän?',
                    },
                    {
                      speakerId: 'captain',
                      emotion: 'sweating',
                      text: 'Hören Sie mir bitte einmal bis zum Ende zu… Dieser echte Goldene Schiffs-Chronometer stammt ursprünglich noch vom Schiff meines eigenen Großvaters.',
                    },
                    {
                      speakerId: 'captain',
                      emotion: 'neutral',
                      text: 'Für vierzig Jahre treue Dienste auf den Weltmeeren hatte mir die Geschäftsführung diesen Chronometer hoch und heilig als mein offizielles Abschiedsgeschenk zur Pensionierung versprochen… bis irgendwelche Schätzer der Reederei kurz vor dieser Reise entdeckten, dass das Erbstück über eine Million Euro wert ist!',
                    },
                    {
                      speakerId: 'captain',
                      emotion: 'sweating',
                      text: 'Von einem Tag auf den anderen zog die Reederei ihr Wort zurück und lehnte die Übergabe eiskalt ab! Da bin ich – in meinem blinden Stolz und Zorn – hier in Valletta zu jenem Kunsthandwerker gegangen, um eine täuschend echte Replika anfertigen zu lassen.',
                    },
                    {
                      speakerId: 'maya',
                      emotion: 'shocked',
                      text: 'Und dann haben Sie Oberkellner Arthur Morgan in Fall 1 eingeweiht, damit er einfach die echte Uhr gegen die Fälschung austauscht?!',
                    },
                    {
                      speakerId: 'captain',
                      emotion: 'sweating',
                      text: 'Ja… genau so war es abgemacht! Arthur sollte den Chronometer unauffällig tauschen – ein schneller Schnitt, niemand merkt je einen Unterschied. Aber Arthur muss im VIP-Salon Wind davon bekommen haben, wie unfassbar wertvoll das Original wirklich war…',
                    },
                    {
                      speakerId: 'captain',
                      emotion: 'headshake',
                      text: 'Statt ihn mir zu übergeben, ließ er mir diesen weingetränkten Erpresserbrief zukommen – adressiert an „A. W.“: 45.000 Euro bis zum Einlaufen auf Kreta, und bis dahin behält er den echten Chronometer als Sicherheit!! Meine wertlose Replika hatte er längst geschickt für die Kammer untergeschoben, damit niemand Verdacht schöpft.',
                    },
                    {
                      speakerId: 'nate',
                      emotion: 'thinking',
                      text: 'Und dann habe ich Arthur am nächsten Morgen in Fall 1 für seinen Kabinen-Trick in 312 vor Gericht überführt… und statt auf Kreta abzukassieren, wanderte er wegen mir ins Schiffs-Gefängnis!',
                    },
                    {
                      speakerId: 'captain',
                      emotion: 'sweating',
                      text: 'Genau so war es! Weil unser ganzer Plan geplatzt war und Arthur durch Sie im Gefängnis saß, bekam ich entsetzliche Panik, er würde alles auspacken. In jener Nacht vor Kreta bin ich heimlich hinunter in den Zellentrakt geschlichen, um ihn ein letztes Mal zur Rede zu stellen…',
                    },
                    {
                      speakerId: 'captain',
                      emotion: 'sweating',
                      text: 'Aber dieser Narr hat meine Verzweiflung schamlos ausgenutzt und seine Forderung sofort verzehnfacht — 450.000 Euro verlangte er plötzlich dafür, im Gefängnis den Mund zu halten!! Da hat sich in mir alles verdunkelt…',
                    },
                    {
                      speakerId: 'marston',
                      emotion: 'grumpy',
                      text: 'Und mit Ihrem General-Zugang haben Sie anschließend jede Spur verwischt: Betäubungsmittel, das MS-400-Zeitfenster plus die herausgerissene Handbuchseite, den blauen Schal aus dem Fundbüro – und am Ende sogar in meiner Asservatenkammer das „A. W.“ zu „A. H.“ umgekratzt, damit alles an Andrew Higginson kleben bleibt.',
                    },
                    {
                      speakerId: 'captain',
                      emotion: 'headshake',
                      text: 'Ich weiß, dass keine Entschuldigung der Welt das ungeschehen macht… Es tut mir aus tiefstem Herzen leid – für diese ganze schreckliche Farce, für Miss Brooks und besonders für Andrew Higginson und seine Familie. Den echten Chronometer meines Großvaters fand ich nach jener Nacht in Arthurs Spind und schloss ihn in meinen Brückentresor; ich gebe alles zurück und streite nichts ab.',
                    },
                    {
                      speakerId: 'marston',
                      emotion: 'neutral',
                      text: 'Mein offizieller Bericht geht ohne ein einziges beschönigtes Wort zu Protokoll, Albert – Mr. Higginson kommt augenblicklich frei von jedem Verdacht. Trotzdem…',
                    },
                    {
                      speakerId: 'cruisemanager',
                      emotion: 'neutral',
                      text: 'Wenn wir Sie jetzt mitten in der letzten Nacht vor zweitausend Menschen in Handschellen von der Brücke zerren, bricht an Bord Chaos aus. Ein letzter Wunsch aus Respekt vor vierzig Jahren auf See…',
                    },
                    {
                      speakerId: 'marston',
                      emotion: 'confident',
                      text: 'Ich bleibe bis morgen früh persönlich an Ihrer Seite auf der Kommandobrücke, Kapitän. Sie erhalten noch Ihre letzte reguläre Einfahrt in den Heimathafen Athen — danach treten Sie freiwillig von Bord und stellen sich den Behörden.',
                    },
                    {
                      speakerId: 'captain',
                      emotion: 'neutral',
                      text: 'Danke, Frank… Danke, Mr. Sterling, dass Sie die Wahrheit nie haben begraben lassen. Nur noch einmal das Ruder halten, bis wir sicher im Heimathafen liegen…',
                    },
                    {
                      speakerId: 'nate',
                      emotion: 'confident',
                      setsFlag: 'flag_f4_kapitaen_gestanden',
                      triggersOutro: true,
                      text: 'Gute letzte Wache, Kapitän Brammer. Komm, Maya – sagen wir Andrew und Eleonore die erlösende Nachricht, bevor draußen über der Ägäis der letzte Morgen dämmert!',
                    },
                  ],
                  wrongLines: [
                    {
                      speakerId: 'falk',
                      emotion: 'smug',
                      text: 'Pah! Was soll dieses Dokument denn bitte über den Goldenen Schiffs-Chronometer aus der Asservatenkammer beweisen, Sterling?!',
                    },
                    {
                      speakerId: 'maya',
                      emotion: 'thinking',
                      text: 'Zeig Falk unseren Befund aus dem Vergleich zwischen Flotten-Chronik und dem Chronometer selbst — dass er eine Fälschung ist!',
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
      wrongObjectionLines: [
        {
          speakerId: 'falk',
          emotion: 'smug',
          text: 'Einspruch abgelehnt, Sterling! Dieser Beweis berührt weder den 45.000-€-Brief noch die Initialen „A. H.“!',
        },
        {
          speakerId: 'maya',
          emotion: 'thinking',
          text: 'Hör genau auf Aussage 2 wegen „An: A. H.“ und leg dort den Forensik-Befund über den manipulierten Brief vor, Nate!',
        },
      ],
    },
  },
};
