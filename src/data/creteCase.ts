import type { GameCase } from '../types/game';

export const CRETE_CASE: GameCase = {
  id: 'fall2_kreta',
  title: 'Fall 2: Schatten über Kreta',
  subtitle: 'Hafen von Heraklion · MS Aurora',
  badgeLabel: 'Fall 2 · Schatten über Kreta',
  description:
    'Endlich kommt die sonnige Küste von Kreta in Sicht – doch noch bevor die Passagiere an Land dürfen, schrillen über die MS Aurora erneut die Alarmpfeifen. Ein rätselhafter Vorfall tief unter Deck zwingt Nate und Maya abermals ans Werk, während der ersehnte Urlaub immer weiter in die Ferne rückt.',
  victoryTitle: 'AKT 2.5 ABGESCHLOSSEN!',
  victorySummary:
    'Du hast die wahre Tatzeit in internationalen Gewässern bewiesen, Eleonore vor dem Tribunal entlastet und Sicherheitsoffizier Lukas Brandt im Verhör überführt – doch der wahre Drahtzieher an Bord schlägt noch vor der Hafenöffnung zurück. (Fortsetzung folgt ab Akt 2.6!)',
  supportsOutro: false,
  initialChapterId: 'c2_akt1_morgen',
  chapters: {
    c2_akt1_morgen: {
      id: 'c2_akt1_morgen',
      dayLabel: 'Tag 4 · Morgen',
      timeOfDay: 'tag',
      title: 'Akt 2.1: Ausgangssperre vor Kreta',
      subtitle: 'Hafenblockade & Suche nach dem Kommissar',
    },
    c2_akt2_mittag: {
      id: 'c2_akt2_mittag',
      dayLabel: 'Tag 4 · Mittag',
      timeOfDay: 'tag',
      title: 'Akt 2.2: Die letzte Seemeile',
      subtitle: 'Tatzeit-Twist & Kommissar Dimitri',
    },
    c2_akt3_nachmittag: {
      id: 'c2_akt3_nachmittag',
      dayLabel: 'Tag 4 · Nachmittag',
      timeOfDay: 'tag',
      title: 'Akt 2.3: Conrads Rucksack',
      subtitle: 'Die Verfolgung über die Decks',
    },
    c2_akt4_abend: {
      id: 'c2_akt4_abend',
      dayLabel: 'Tag 4 · Abend',
      timeOfDay: 'abend',
      title: 'Akt 2.4: Einspruch, Ihr Ehren!',
      subtitle: 'Eleonore Higginson im Zeugenstand',
    },
    c2_akt5_nacht: {
      id: 'c2_akt5_nacht',
      dayLabel: 'Tag 4 · Nacht',
      timeOfDay: 'abend',
      title: 'Akt 2.5: Der Flashback & Die Nachtwache',
      subtitle: 'Lüftungsschacht & Konfrontation',
    },
  },
  introSlides: [
    {
      id: 'c2_slide_harbor',
      imageUrl: '/src/assets/images/outro_crete_harbor_1795089043540.jpg',
      kicker: 'Tag 4 · 08:15 Uhr · Hafen von Heraklion',
      caption:
        'Endlich Land in Sicht! Strahlende Mittelmeersonne, weiße Häuser über der Festung von Kreta – an der Reling der MS Aurora freuen sich die Passagiere ausgelassen auf ihren Landgang.',
      sfx: 'foghorn',
      durationMs: 5600,
      panFrom: { scale: 1.0, x: 0, y: 0 },
      panTo: { scale: 1.09, x: 14, y: -4 },
    },
    {
      id: 'c2_slide_shadow',
      imageUrl: '/src/assets/images/case2_cell_shadow_1795164437819.jpg',
      kicker: 'Unter Deck · Arrestzelle 08',
      caption:
        'Doch tief im Inneren des Schiffes liegt kalte Stille über den Stahlschotten. Im flackernden Licht der Lampe zeichnet sich an der Zellenwand nur ein langer, unheilvoller Schatten ab…',
      sfx: 'tension',
      durationMs: 5800,
      panFrom: { scale: 1.06, x: -10, y: 2 },
      panTo: { scale: 1.0, x: 10, y: -4 },
    },
    {
      id: 'c2_slide_alarm',
      imageUrl: '/src/assets/images/case2_brig_cell_day_1795164438127.jpg',
      kicker: '08:30 Uhr · Gangway verriegelt!',
      caption:
        'Schrille Trillerpfeifen zerreißen die Morgenruhe! Alle Ausgänge werden sofort abgeriegelt – niemand verlässt die MS Aurora, bis das Rätsel um den Gefangenen gelöst ist.',
      sfx: 'alarm',
      durationMs: 5200,
      panFrom: { scale: 1.0, x: 8, y: 0 },
      panTo: { scale: 1.1, x: -12, y: -4 },
    },
    {
      id: 'c2_slide_title',
      kicker: 'Fall 2 · Akte MS Aurora',
      caption: 'Schatten über Kreta',
      sfx: 'gavel',
      durationMs: 3400,
      panFrom: { scale: 0.96, x: 0, y: 0 },
      panTo: { scale: 1.0, x: 0, y: 0 },
      isTitleCard: true,
    },
  ],
  initialLocationId: 'promenade',
  initialUnlockedLocations: ['promenade', 'music_salon', 'vip_salon'],
  initialEvidenceIds: ['ausweis_nate', 'higginson_notiz'],
  initialThoughtIds: ['thought_c2_blockade'],
  progressiveLocationUnlocks: [
    {
      id: 'unlock_c2_brig_cell',
      requiredFlags: ['flag_c2_a1_promenade', 'flag_c2_a1_music', 'flag_c2_a1_vip'],
      unlockLocationId: 'brig_cell',
      setsFlag: 'flag_c2_brig_freigeschaltet',
      toast: 'Schauplatz freigeschaltet: Arrestzelle · Unterdeck!',
      lines: [
        {
          speakerId: 'maya',
          emotion: 'confident',
          text: 'Nate! Auf allen oberen Decks heißt es, Kommissar Marston sei hinunter zur Arrestzelle gestürzt! Wir können jetzt endlich dorthin reisen!',
        },
      ],
    },
  ],
  autoChapterTransitions: [
    {
      id: 'c2_a2_to_court',
      chapterId: 'c2_akt2_mittag',
      requiredFlags: ['flag_c2_tatzeit_geloest'],
      toast: 'Die wahre Tatzeit ist geknackt! Auf zur Anhörung im Ballsaal!',
      lines: [
        {
          speakerId: 'maya',
          emotion: 'confident',
          text: 'Das erklärt ALLES, Nate! Die eisige 9-°C-Kühlstörung ab 02:20 Uhr hat Dr. Vances Schätzung komplett verzerrt – der Vorfall geschah schon um 02:15 Uhr!',
        },
        {
          speakerId: 'nate',
          emotion: 'confident',
          text: 'Und wenn ich mir Kapitän Brammers Logbuch anschaue… dann hat das gleich explosive Folgen für die Zuständigkeit! Ab in den Großen Ballsaal zu Kommissar Dimitri!',
          completesChapter: {
            completedChapterTitle: 'Akt 2.2 · Ermittlung abgeschlossen',
            completedTimeLabel: 'Genaue Tatzeit ermittelt',
            summary:
              'Durch das 9-°C-Klimaprotokoll und Leo & Ricks Walkie-Talkie-Streich konntest du die angenommene Tatzeit (07:30 Uhr) um über fünf Stunden vorverlegen. Zeit für die Anhörung vor Kommissar Dimitri!',
            nextChapterId: 'c2_akt2_mittag',
            nextLocationId: 'courtroom',
            nextPhase: 'court',
            nextTimeOfDay: 'tag',
            unlocksLocations: ['courtroom'],
            nextButtonLabel: 'Weiter zur Anhörung (Dr. Vance & Dimitri)',
            nextIntroLines: [
              {
                speakerId: 'dimitri',
                emotion: 'confident',
                text: 'Κύριε Στέρλινγκ! Λοιπόν, ας ακούσουμε επιτέλους την επίσημη ιατροδικαστική εκτίμηση της κυρίας γιατρού, πριν σηκώσω τηλέφωνο στην Εισαγγελία Ηρακλείου!',
              },
              {
                speakerId: 'captain',
                emotion: 'neutral',
                text: 'Ärztin soll reden. Kurz fassen.',
              },
              {
                speakerId: 'falk',
                emotion: 'smug',
                text: 'Mit Vergnügen, Käpt’n! Dr. Helena Vance wird in wenigen Sekunden bestätigen, dass wir uns beim Todeszeitpunkt längst unter griechischer Hafenhoheit befanden!',
                startsTestimonyId: 'testimony_c2_vance',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'c2_a3_to_court',
      chapterId: 'c2_akt3_nachmittag',
      requiredFlags: ['flag_c2_a3_bereit'],
      toast: 'Alle Indizien bereit – Eleonores Zeugen-Anhörung startet!',
      lines: [
        {
          speakerId: 'maya',
          emotion: 'confident',
          text: 'Puh, Conrad ist endlich wieder ruhig – und dieses Keycard-Fragment aus seinem Rucksack beweist, dass nachts um 02:00 Uhr jemand von der Security unten im Zellentrakt war!',
        },
        {
          speakerId: 'nate',
          emotion: 'thinking',
          text: 'Genau damit holen wir Eleonore aus der Schusslinie wegen ihres Seidenschals. Aber irgendetwas sagt mir, dass dieses Verhör trotzdem das chaotischste unseres Lebens wird…',
          completesChapter: {
            completedChapterTitle: 'Akt 2.3 abgeschlossen',
            completedTimeLabel: 'Tag 4 · Nachmittag beendet',
            summary:
              'Du hast Conrads verlorenen Rucksack am Rettungsboot-Deck aufgespürt, den Ausreißer mit Mayas Hilfe beruhigt und ihm das abgebrochene Keycard-Fragment entlockt. Am Abend muss Eleonore wegen ihres Seidenschals in den Zeugenstand!',
            nextChapterId: 'c2_akt4_abend',
            nextLocationId: 'courtroom',
            nextPhase: 'court',
            nextTimeOfDay: 'abend',
            unlocksLocations: ['courtroom'],
            nextButtonLabel: 'Weiter zu Tag 4 · Abend (Eleonores Aussage)',
            nextIntroLines: [
              {
                speakerId: 'pendelton',
                emotion: 'neutral',
                animation: 'slam',
                sfx: 'gavel_double',
                text: 'Ruhe im Ballsaal! Die Abendsitzung des Not-Tribunals wird eröffnet. Staatsanwalt von Falk – wen rufen Sie zu dem gefundenen Seidenschal in den Zeugenstand?',
              },
              {
                speakerId: 'falk',
                emotion: 'smug',
                text: 'Mit zweifelhaftem Vergnügen rufe ich die Eigentümerin des Tat-Hilfsmittels: Mrs. Eleonore Higginson!',
              },
              {
                speakerId: 'eleonore',
                emotion: 'shocked',
                animation: 'shock',
                sfx: 'evidence_chime',
                text: 'OH MEIN GOTT!! EIN ECHTER GERICHTSSAAL!! Andrew, mach schnell ein Foto – ich stehe genau an DEM Zeugenpult!! Hallo, Euer Ehren! Hallo, Herr Verteidiger!!',
              },
              {
                speakerId: 'nate',
                emotion: 'sweating',
                text: '(Sie strahlt mehr als ein Kreuzfahrtschiff zu Weihnachten… das kann ja heiter werden!)',
                startsTestimonyId: 'testimony_c2_eleonore',
              },
            ],
          },
        },
      ],
    },
  ],
  introLines: [
    {
      speakerId: 'maya',
      emotion: 'confident',
      text: 'Tag 4, Morgen! Schau nur aus dem Hafenfenster, Nate – Heraklion liegt direkt vor uns! Endlich raus aus dem Anzug und rein in die Sandalen!',
    },
    {
      speakerId: 'nate',
      emotion: 'confident',
      text: 'Und kein einziges Kreuzverhör mehr bis zum Rückflug. Komm, schnappen wir uns unsere Taschen und gehen…',
    },
    {
      speakerId: 'captain',
      emotion: 'neutral',
      sfx: 'alarm',
      shake: true,
      text: 'BORDDURCHSAGE! Alle Passagiere bleiben augenblicklich an Deck! Die Gangway ist bis auf Weiteres geschlossen! Früher auf der alten MS Poseidon hätte es so ein Tohuwabohu gar nicht gegeben!',
    },
    {
      speakerId: 'andrew',
      emotion: 'neutral',
      text: 'Das darf doch wohl nicht wahr sein!! Schon wieder gesperrt?! Ich hab euch allen gesagt: Wir fahren in die Berge zum Wandern! Kein Seegang, keine verschlossenen Türen, nur frische Bergluft!',
    },
    {
      speakerId: 'eleonore',
      emotion: 'shocked',
      animation: 'shock',
      text: 'Moment… stopp mal!! Andrew! Kinder! Schaut doch mal, wer da steht!! Das ist Nate Sterling – der Star-Verteidiger aus den Bord-Nachrichten gestern!!',
    },
    {
      speakerId: 'conrad',
      emotion: 'smug',
      text: 'Boah, cool!! Hat der echt gestern den Oberkellner überführt?! Darf ich mal an deinem Sakko ziehen, ob da ein echtes Anwaltsabzeichen drunter hängt?!',
    },
    {
      speakerId: 'andrew',
      emotion: 'neutral',
      text: 'Conrad, Finger weg von fremden Leuten! Eleonore, warum hört der Junge schon wieder kein Wort? Du hast ihn komplett so verzogen!',
    },
    {
      speakerId: 'eleonore',
      emotion: 'neutral',
      text: 'ICH?! Wer hat ihm denn vorgestern drei Extra-Waffeln beim Frühstück erlaubt, weil „im Urlaub andere Regeln gelten“?!',
    },
    {
      speakerId: 'leo',
      emotion: 'smug',
      text: 'Haha, hier geht’s ja schon wieder rund. Komm, Rick – wetten, wir kriegen raus, wo die Security hinrennt, noch bevor Papa fertig gemeckert hat?',
    },
    {
      speakerId: 'rick',
      emotion: 'smug',
      text: 'Top, die Wette gilt! Und wenn wir unterwegs einen Abkürzungs-Trick finden, umso besser!',
    },
    {
      speakerId: 'nate',
      emotion: 'sweating',
      text: '(Eine ganze Großfamilie mitten in einer Hafenblockade… Komm, Maya – suchen wir auf allen offenen Decks nach Kommissar Marston, um herauszufinden, was hier überhaupt los ist!)',
    },
  ],
  characters: {
    nate: {
      id: 'nate',
      name: 'Nate Sterling',
      role: 'Strafverteidiger (Urlauber wider Willen)',
      bio: 'Wollte eigentlich nur auf Kreta Urlaub machen, stolpert aber direkt in das nächste große Geheimnis der MS Aurora.',
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
      role: 'Kanzlei-Assistentin',
      bio: 'Immer optimistisch, liebt Geheimnisse – und trägt in ihrer Umhängetasche für wirklich jede Lebenslage das passende Teil mit sich.',
      accentColor: '#f59e0b',
      portraitUrl: '/src/assets/images/sprite_maya_neutral_1795080941915.jpg',
      side: 'left',
    },
    andrew: {
      id: 'andrew',
      name: 'Andrew Higginson',
      role: 'Genervter Familienvater',
      bio: 'Leicht gereizter Familienvater, der Kreuzfahrten längst satt hat und eigentlich viel lieber auf einem Berggipfel stehen würde.',
      accentColor: '#f97316',
      portraitUrl: '/src/assets/images/sprite_andrew_higginson_1795164436947.jpg',
      side: 'right',
    },
    eleonore: {
      id: 'eleonore',
      name: 'Eleonore Higginson',
      role: 'Hobbydetektivin & Ace-Attorney-Fan',
      bio: 'Begeisterte Krimileserin und glühender Fan aller großen Anwaltsprozesse. Kennt jeden „Einspruch!“ auswendig und führt privat ein Notizbuch.',
      accentColor: '#14b8a6',
      portraitUrl: '/src/assets/images/sprite_eleonore_higginson_1795164438099.jpg',
      portraits: {
        shocked: '/src/assets/images/sprite_eleonore_shocked_1795164438020.jpg',
      },
      side: 'right',
    },
    leo: {
      id: 'leo',
      name: 'Leo Higginson',
      role: 'Älterer Sohn (Streich-Planer)',
      bio: 'Grün-weiß gestreiftes Shirt, wacher Blick und ständig auf der Suche nach dem nächsten Schiffsstreich zusammen mit seinem Bruder Rick.',
      accentColor: '#22c55e',
      portraitUrl: '/src/assets/images/sprite_leo_higginson_1795164437738.jpg',
      side: 'right',
    },
    rick: {
      id: 'rick',
      name: 'Rick Higginson',
      role: 'Älterer Sohn (Komplize)',
      bio: 'Trägt stolz sein Piraten-Shirt und macht bei jedem noch so verrückten Streich auf dem Schiff sofort begeistert mit.',
      accentColor: '#a855f7',
      portraitUrl: '/src/assets/images/sprite_rick_higginson_1795164437974.jpg',
      side: 'right',
    },
    conrad: {
      id: 'conrad',
      name: 'Conrad Higginson',
      role: 'Jüngster Sohn (Wirbelwind)',
      bio: 'Trägt voller Stolz seine Marathon-Medaille und einen blauen Rucksack. Flink, frech und extrem neugierig auf alles, was glänzt.',
      accentColor: '#eab308',
      portraitUrl: '/src/assets/images/sprite_conrad_higginson_1795164437468.jpg',
      side: 'right',
    },
    captain: {
      id: 'captain',
      name: 'Kapitän Brammer',
      role: 'Schiffskapitän der MS Aurora',
      bio: 'Alter Seebär, der findet, dass früher auf See alles besser war. Übersetzt Kommissar Dimitris lange griechische Reden auf das absolute Minimum.',
      accentColor: '#0284c7',
      portraitUrl: '/src/assets/images/sprite_captain_brammer_1795164437466.jpg',
      side: 'right',
    },
    dimitri: {
      id: 'dimitri',
      name: 'Kommissar Dimitri',
      role: 'Hafenpolizei Heraklion (Griechisch)',
      bio: 'Tempramentvoller griechischer Kommissar. Spricht kein Wort Deutsch, vertraut aber ausgerechnet Nate Sterling blind – solange Kreta zuständig ist.',
      accentColor: '#38bdf8',
      portraitUrl: '/src/assets/images/sprite_dimitri_cop_1795164437945.jpg',
      side: 'right',
    },
    vance: {
      id: 'vance',
      name: 'Dr. Helena Vance',
      role: 'Schiffsärztin',
      bio: 'Kühle, präzise Schiffsärztin der MS Aurora. Ihr erstes Gutachten legt die Todeszeit auf 07:30 Uhr morgens.',
      accentColor: '#10b981',
      portraitUrl: '/src/assets/images/sprite_dr_vance_1795164436449.jpg',
      side: 'right',
    },
    brandt: {
      id: 'brandt',
      name: 'Officer Lukas Brandt',
      role: 'Nachtwache · Schiffsicherheit',
      bio: 'Stiller Sicherheitsoffizier der Nachtschicht unter Detective Marston. Kenner jedes Wartungsschachts an Bord.',
      accentColor: '#64748b',
      portraitUrl: '/src/assets/images/sprite_brandt_security_1795164437396.jpg',
      side: 'right',
    },
    marston: {
      id: 'marston',
      name: 'Detective Marston',
      role: 'Chef-Ermittler an Bord',
      bio: 'Steht völlig unter Schock, nachdem Arthur Morgan über Nacht in seiner eigenen Arrestzelle gestorben ist.',
      accentColor: '#64748b',
      portraitUrl: '/src/assets/images/sprite_marston_detective_1795080940855.jpg',
      side: 'right',
    },
    falk: {
      id: 'falk',
      name: 'Staatsanwalt von Falk',
      role: 'Sonder-Ankläger an Bord',
      bio: 'Gibt Nate Sterling zunächst offen die Schuld am Chaos und will das Verfahren so schnell wie möglich abschließen.',
      accentColor: '#ef4444',
      portraitUrl: '/src/assets/images/sprite_falk_neutral_1795080942096.jpg',
      portraits: {
        shocked: '/src/assets/images/sprite_falk_shocked_1795080941650.jpg',
        facepalm: '/src/assets/images/sprite_falk_facepalm_1795091158455.jpg',
      },
      side: 'right',
    },
    pendelton: {
      id: 'pendelton',
      name: 'Judge Pendelton',
      role: 'Vorsitzender des Schiffs-Tribunals',
      bio: 'Wollte eigentlich schon längst am Hafen-Café sitzen, hält aber pflichtbewusst das Not-Tribunal zusammen.',
      accentColor: '#a855f7',
      portraitUrl: '/src/assets/images/sprite_pendelton_neutral_1795080941377.jpg',
      portraits: {
        headshake: '/src/assets/images/sprite_pendelton_disappointed_1795091176237.jpg',
      },
      side: 'right',
    },
  },
  evidence: {
    ausweis_nate: {
      id: 'ausweis_nate',
      name: 'Anwaltsausweis',
      category: 'profile',
      iconName: 'user',
      summary: 'Nate Sterlings Anwaltsausweis – auch auf Kreta griffbereit.',
      detail:
        'Eigentlich für den Urlaub verstaut, aber Eleonore Higginson hat ihn schon aus zwanzig Metern Entfernung gefeiert.',
    },
    higginson_notiz: {
      id: 'higginson_notiz',
      name: 'Passagier-Notiz: Familie Higginson',
      category: 'profile',
      iconName: 'user',
      summary: 'Andrew, Eleonore, Leo, Rick und der flinke Conrad.',
      detail:
        'Eine deutsche Urlauberfamilie auf derselben Route: Andrew will in die Berge, Eleonore liebt Gerichtsprozesse, Leo & Rick planen Streiche und Conrad steckt alles ein, was glänzt.',
    },
    obduktion_vorlaeufig: {
      id: 'obduktion_vorlaeufig',
      name: 'Vorläufiger Arzt-Bericht',
      category: 'evidence',
      iconName: 'file',
      summary: 'Dr. Vances Schätzung: Tod um ca. 07:30 Uhr morgens.',
      detail:
        'Laut Dr. Helena Vance sprechen Körpertemperatur und Zustand für einen Todeszeitpunkt um 07:30 Uhr – kurz nach der Hafeneinfahrt. Hinweis am Rand: Standardberechnung bei 21 °C Raumtemperatur.',
    },
    zellen_klima_protokoll: {
      id: 'zellen_klima_protokoll',
      name: 'Zellen-Klimaprotokoll',
      category: 'evidence',
      iconName: 'thermometer',
      summary: 'Kühlung von Zelle 08 sank um 02:20 Uhr auf eisige 9 °C.',
      detail:
        'Technischer Sensor-Ausdruck der Arrestzelle: Um 02:20 Uhr fiel die Regulierung aus und kühlte die Stahlluft auf 9 °C herunter – wodurch ein Leichnam extrem verzögert abkühlt und viel „jünger“ wirkt!',
    },
    lueftung_streich: {
      id: 'lueftung_streich',
      name: 'Leo & Ricks Streich-Protokoll',
      category: 'evidence',
      iconName: 'clock',
      summary: 'Um 02:10 Uhr hörten die Brüder ein Poltern aus Zelle 08.',
      detail:
        'Bei einem Walkie-Talkie-Streich am Schacht des Rettungsboot-Decks hörten Leo und Rick um exakt 02:10 Uhr tief unten einen umstürzenden Metallhocker – und kurz danach ein lautes Lüftungs-Surren.',
    },
    bruecken_log: {
      id: 'bruecken_log',
      name: 'Brücken- & 12-Meilen-Log',
      category: 'evidence',
      iconName: 'receipt',
      summary: 'Griechisches Hoheitsgebiet erst ab 05:45 Uhr erreicht.',
      detail:
        'Offizielles Navigationslog von Kapitän Brammer: Um 02:15 Uhr befand sich die MS Aurora noch 42 Seemeilen vor Kreta – eindeutig in internationalen Gewässern!',
    },
    seidenschal_spur: {
      id: 'seidenschal_spur',
      name: 'Eleonores Kreta-Seidenschal',
      category: 'evidence',
      iconName: 'search',
      summary: 'Blauer Seidenschal mit kretischem Muster – an Zelle 08 gefunden.',
      detail:
        'Seit dem Vorabend von Eleonore vermisst. Wurde am Zellen-Gitter gefunden – riecht bei näherer Betrachtung überraschend stark nach Maschinenöl und frischem Meersalz.',
      inspectRules: [
        {
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Schauen wir uns Eleonores Seidenschal einmal genauer an… Hm! Am Rand klebt gar kein Staub aus der Kabine – das riecht nach dunklem Maschinenöl und frischer Meeresluft!',
            },
          ],
        },
      ],
    },
    conrads_rucksack: {
      id: 'conrads_rucksack',
      name: 'Conrads blauer Rucksack',
      category: 'evidence',
      iconName: 'bag',
      summary: 'Hinter einer Kiste am Rettungsboot-Deck zurückgelassen.',
      detail:
        'Der gestohlene Kinderrucksack, den der fliehende Dieb auf dem Rettungsboot-Deck fallen ließ. Conrad lässt niemanden hineinsehen!',
    },
    keycard_fragment: {
      id: 'keycard_fragment',
      name: 'Abgebrochene Keycard-Ecke',
      category: 'evidence',
      iconName: 'key',
      summary: 'Conrads geheimer Fund aus der Nacht vor Zelle 08.',
      detail:
        'Eine saubere abgebrochene Ecke einer weißen Security-Schlüsselkarte mit rotem Sicherheitsstreifen. Conrad fand sie nachts beim Herumstromern nahe der Arrestzelle.',
      inspectRules: [
        {
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Die Bruchkante ist messerscharf – als wäre diese Security-Karte irgendwo im Vorbeigehen eingeklemmt und abgeknickt. Wenn wir nur das Gegenstück mit der Dienstnummer hätten…',
            },
          ],
        },
      ],
    },
    brandt_keycard_rest: {
      id: 'brandt_keycard_rest',
      name: 'Keycard-Rest „SEC-04“ (Lüftung)',
      category: 'evidence',
      iconName: 'bolt',
      summary: 'Aus dem geölten Lüftungsgitter in Zelle 08 geborgen.',
      detail:
        'Nach Nates Flashback im frisch geölten Lüftungsschacht entdeckt: Die fehlende Hälfte einer Security-Karte auf Namen von Officer Lukas Brandt (SEC-04)!',
    },
  },
  thoughts: {
    thought_c2_blockade: {
      id: 'thought_c2_blockade',
      title: 'Ausgangssperre vor Kreta',
      detail:
        'Niemand darf von Bord. Marston & Falk sind verschwunden – alle Spuren deuten Richtung Unterdeck.',
      kind: 'observation',
    },
    thought_c2_0730_hafen: {
      id: 'thought_c2_0730_hafen',
      title: 'Dr. Vances Angabe: 07:30 Uhr',
      detail:
        'Die Schiffsärztin schätzt den Tod auf 07:30 Uhr – kurz nach Ankunft im griechischen Hafenbecken.',
      kind: 'observation',
    },
    thought_c2_kuehlung_9grad: {
      id: 'thought_c2_kuehlung_9grad',
      title: 'Kühlstörung auf 9 °C ab 02:20 Uhr',
      detail:
        'Zelle 08 war seit 02:20 Uhr eiskalt – dadurch lässt sich die Todeszeit nicht mit normalen 21-°C-Werten berechnen!',
      kind: 'observation',
    },
    thought_c2_0210_poltern: {
      id: 'thought_c2_0210_poltern',
      title: 'Poltern im Schacht um 02:10 Uhr',
      detail:
        'Leo und Rick hörten bei ihrem Streich um 02:10 Uhr tief unten einen umkippenden Stuhl in Zelle 08.',
      kind: 'observation',
    },
    thought_c2_wahre_tatzeit: {
      id: 'thought_c2_wahre_tatzeit',
      title: 'Wahre Tatzeit: ~02:15 Uhr (Int. Gewässer)',
      detail:
        'Durch die Kühlung getarnt geschah die Tat bereits um 02:15 Uhr – mitten auf offener See vor Kreta!',
      kind: 'deduction',
    },
    thought_c2_schal_vermisst: {
      id: 'thought_c2_schal_vermisst',
      title: 'Eleonores vermisster Seidenschal',
      detail:
        'Ihr Schal hing am Zellengitter – doch sie vermisst ihn schon seit dem Vorabend im Salon.',
      kind: 'observation',
    },
    thought_c2_keycard_ecke: {
      id: 'thought_c2_keycard_ecke',
      title: 'Conrads geheime Keycard-Ecke',
      detail:
        'Ein Security-Mitglied verlor nachts direkt beim Zellentrakt ein abgebrochenes Kartenstück – deshalb wurde Conrads Rucksack geklaut!',
      kind: 'observation',
    },
    thought_c2_eleonore_verdacht: {
      id: 'thought_c2_eleonore_verdacht',
      title: 'Eindringling statt Eleonore',
      detail:
        'Der Dieb von Conrads Rucksack und der Nutzer von Eleonores Schal gehören zusammen – damit lässt sich Eleonore im Zeugenstand entlasten.',
      kind: 'deduction',
    },
    thought_c2_flashback_schacht: {
      id: 'thought_c2_flashback_schacht',
      title: 'Flashback: Eleonores Schacht-Spur',
      detail:
        'Maschinenöl und Meersalz am Schal! Der Täter stieg gar nicht durch die verschlossene Zellentür ein, sondern über den Lüftungsschacht!',
      kind: 'deduction',
    },
  },
  logicCombinations: [
    {
      id: 'c2_logic_tatzeit',
      thoughtA: 'thought_c2_kuehlung_9grad',
      thoughtB: 'thought_c2_0210_poltern',
      resultThoughtId: 'thought_c2_wahre_tatzeit',
      setsFlag: 'flag_c2_tatzeit_geloest',
      feedbackLines: [
        {
          speakerId: 'nate',
          emotion: 'confident',
          sfx: 'deduction',
          text: 'GENAU DAS IST ES!! Um 02:10 Uhr hörten Leo und Rick den Stuhl fallen – und um 02:20 Uhr drehte jemand die Kühlung auf 9 °C, um Dr. Vances Schätzung um fünf Stunden nach hinten zu verschieben!',
        },
      ],
    },
    {
      id: 'c2_logic_eleonore',
      thoughtA: 'thought_c2_schal_vermisst',
      thoughtB: 'thought_c2_keycard_ecke',
      resultThoughtId: 'thought_c2_eleonore_verdacht',
      setsFlag: 'flag_c2_a3_bereit',
      feedbackLines: [
        {
          speakerId: 'nate',
          emotion: 'confident',
          sfx: 'deduction',
          text: 'Moment mal… Eleonore hatte gar keine Security-Keycard – aber jemand mit genau so einer Karte war nachts unten, nahm ihren verlorenen Schal und klaute später Conrads Rucksack!',
        },
      ],
    },
  ],
  locations: {
    promenade: {
      id: 'promenade',
      name: 'Promenadendeck',
      subtitle: 'Hafenblick auf Heraklion · Kreta',
      backgroundUrl: '/src/assets/images/outro_crete_harbor_1795089043540.jpg',
      charactersPresent: [
        {
          characterId: 'andrew',
          hideIfFlag: 'flag_c2_a1_rauswurf',
        },
        {
          characterId: 'eleonore',
          hideIfFlag: 'flag_c2_a1_rauswurf',
        },
        {
          characterId: 'conrad',
          hideIfFlag: 'flag_c2_a1_rauswurf',
        },
        {
          characterId: 'captain',
          visibleIfFlag: 'flag_c2_a1_rauswurf',
          hideIfFlag: 'flag_c2_dimitri_weg',
        },
        {
          characterId: 'dimitri',
          visibleIfFlag: 'flag_c2_a1_rauswurf',
          hideIfFlag: 'flag_c2_dimitri_weg',
        },
        {
          characterId: 'captain',
          visibleIfFlag: 'flag_c2_dimitri_weg',
          hideIfFlag: 'flag_c2_a3_start',
        },
        {
          characterId: 'andrew',
          visibleIfFlag: 'flag_c2_dimitri_weg',
          hideIfFlag: 'flag_c2_conrad_flucht',
        },
        {
          characterId: 'eleonore',
          visibleIfFlag: 'flag_c2_dimitri_weg',
          hideIfFlag: 'flag_c2_conrad_flucht',
        },
        {
          characterId: 'conrad',
          visibleIfFlag: 'flag_c2_dimitri_weg',
          hideIfFlag: 'flag_c2_conrad_flucht',
        },
      ],
      hotspots: [
        {
          id: 'c2_a1_gangway',
          label: 'Gesperrte Gangway & Hafenblick',
          x: 24,
          y: 26,
          width: 26,
          height: 30,
          hideIfFlag: 'flag_c2_a1_rauswurf',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              setsFlag: 'flag_c2_a1_promenade',
              text: 'Die Gangway ist tatsächlich mit gelb-schwarzem Flatterband dichtgemacht. Unten am Pier warten schon griechische Streifenwagen… irgendetwas Ernstes ist unter Deck passiert.',
            },
          ],
        },
        {
          id: 'c2_a1_rettungsring',
          label: 'Reling & Rettungsring',
          x: 26,
          y: 72,
          width: 15,
          height: 20,
          hideIfFlag: 'flag_c2_a1_rauswurf',
          lines: [
            {
              speakerId: 'andrew',
              emotion: 'neutral',
              text: 'Schöne Aussicht, sicher… bringt uns aber auch nicht ins Hotel! Schauen Sie bitte auch in den anderen Salons nach, wo Ihr Herr Kommissar steckt!',
            },
          ],
        },
      ],
      talkTopics: [
        {
          id: 'higginson_was_ist_los',
          title: 'Familie Higginson: Was ist hier passiert?',
          speakerId: 'eleonore',
          hideIfFlag: 'flag_c2_a1_rauswurf',
          lines: [
            {
              speakerId: 'eleonore',
              emotion: 'confident',
              setsFlag: 'flag_c2_a1_promenade',
              text: 'Wir standen ganz vorn an der Reling, als plötzlich alle Stewards losrannten! Wenn Sie mich fragen, Mr. Sterling: Das riecht förmlich nach einem neuen Fall – genau wie damals in Fall 2 von…',
            },
            {
              speakerId: 'andrew',
              emotion: 'neutral',
              text: 'Eleonore, bitte! Der Mann hat Urlaub – genau wie wir, bevor hier alles zugesperrt wurde! Conrad, hör auf, am Rettungsring zu schaukeln!',
            },
            {
              speakerId: 'conrad',
              emotion: 'smug',
              text: 'Ich guck doch nur, ob da unten Fische schwimmen!!',
            },
          ],
        },
        {
          id: 'captain_warum_nate',
          title: 'Kapitän Brammer: Warum will Dimitri ausgerechnet uns?',
          speakerId: 'captain',
          requiredFlag: 'flag_c2_a1_rauswurf',
          hideIfFlag: 'flag_c2_dimitri_weg',
          lines: [
            {
              speakerId: 'dimitri',
              emotion: 'confident',
              text: 'Είναι απλό, Καπετάνιε! Ο δικηγόρος αποκάλυψε την αλήθεια στο πλοίο. Θέλω μόνο εκείνον να με βοηθήσει να βρούμε την ώρα θανάτου!',
            },
            {
              speakerId: 'captain',
              emotion: 'neutral',
              text: 'Er hat Ihren Prozess gestern im Bord-Fernsehen gesehen. Vertraut nur Ihnen. Früher hätten die Griechen keinen Rechtsanwalt gefragt, aber naja.',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Komm, Nate – bevor wir ewig an Bord festsitzen, suchen wir eben gemeinsam die genaue Tatzeit! Und danach gehen wir in Heraklion das größte Gyros essen!',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Einverstanden, Maya. Auf zum Kapitän wegen der Schiffsposition, zur Krankenstation und wieder runter zur Arrestzelle!',
              completesChapter: {
                completedChapterTitle: 'Akt 2.1 abgeschlossen',
                completedTimeLabel: 'Tag 4 · Morgen beendet',
                summary:
                  'Nach dem Chaos mit Familie Higginson und dem Rauswurf an der Zelle beauftragt der griechische Kommissar Dimitri dich über den wortkargen Kapitän persönlich: Ermittle die genaue Tatzeit von Arthurs Tod!',
                nextChapterId: 'c2_akt2_mittag',
                nextLocationId: 'infirmary',
                nextPhase: 'investigation',
                nextTimeOfDay: 'tag',
                unlocksLocations: ['infirmary', 'lifeboat_deck', 'brig_cell'],
                nextButtonLabel: 'Weiter zu Tag 4 · Mittag (Tatzeit ermitteln)',
                nextIntroLines: [
                  {
                    speakerId: 'maya',
                    emotion: 'thinking',
                    text: 'Tag 4, Mittag! Die Krankenstation und das Rettungsboot-Deck stehen jetzt offen – lass uns zuerst bei Schiffsärztin Dr. Vance nach dem Todeszeitpunkt fragen!',
                  },
                ],
              },
            },
          ],
        },
        {
          id: 'captain_seemeilen',
          title: 'Kapitän Brammer: Wann erreichte das Schiff Kreta?',
          speakerId: 'captain',
          requiredFlag: 'flag_c2_a1_rauswurf',
          hideIfFlag: 'flag_c2_dimitri_weg',
          lines: [
            {
              speakerId: 'captain',
              emotion: 'neutral',
              unlocksEvidence: 'bruecken_log',
              text: 'Die griechische 12-Meilen-Zone haben wir exakt um 05:45 Uhr morgens passiert. Alles davor war offene internationale See. Hier, mein Brücken-Logbuch!',
            },
            {
              speakerId: 'dimitri',
              emotion: 'confident',
              text: 'Πολύ καλά! Αν ο θάνατος συνέβη μετά τις 05:45, η υπόθεση ανήκει στην ελληνική δικαιοσύνη!',
            },
            {
              speakerId: 'captain',
              emotion: 'neutral',
              text: 'Ab 05:45 Uhr ist er zuständig. Davor nicht.',
            },
          ],
        },
        {
          id: 'higginson_rucksack_gestohlen',
          title: 'Higginsons: Warum seid ihr so aufgeregt?',
          speakerId: 'andrew',
          requiredFlag: 'flag_c2_dimitri_weg',
          hideIfFlag: 'flag_c2_a3_start',
          lines: [
            {
              speakerId: 'andrew',
              emotion: 'neutral',
              setsFlag: 'flag_c2_a3_start',
              text: 'Mr. Sterling! Endlich sind Sie wieder da! Conrads blauer Rucksack wurde vorhin einfach gestohlen!! Irgendein Kerl hat ihn weggerissen und ist weggerannt!',
            },
            {
              speakerId: 'nate',
              emotion: 'sweating',
              text: 'Ähm… tut mir leid, Mr. Higginson, aber ich muss gerade wegen des Mordfalls an die Schiffs-Akten und bin wirklich kein Kreuzfahrt-Fundbüro.',
            },
            {
              speakerId: 'eleonore',
              emotion: 'shocked',
              setsFlag: 'flag_c2_a3_rucksack_gesichtet',
              text: 'Aber mein schöner Kreta-Seidenschal hängt doch auch schon in der Arrestzelle?! Und dabei hatte ich meinen Schal schon gestern Abend verloren! Ach, schauen Sie wenigstens am Rettungsboot-Deck mal die Augen offen!',
            },
            {
              speakerId: 'marston',
              emotion: 'thinking',
              unlocksEvidence: 'seidenschal_spur',
              unlocksThought: 'thought_c2_schal_vermisst',
              text: 'Tut mir leid, Mrs. Higginson – Ihr Schal wurde wirklich als Beweis am Zellengitter gesichert. Falk will Sie heute Abend dazu vor dem Tribunal befragen!',
            },
          ],
        },
        {
          id: 'rucksack_zurueckgeben',
          title: 'Conrads Rucksack zurückgeben',
          speakerId: 'andrew',
          requiredFlag: 'flag_c2_rucksack_gefunden',
          hideIfFlag: 'flag_c2_conrad_flucht',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Schauen Sie mal, Mr. Higginson – den hat der Dieb offenbar auf seiner Flucht hinter den Proviantkisten am Rettungsboot-Deck fallen lassen!',
            },
            {
              speakerId: 'andrew',
              emotion: 'neutral',
              text: 'Na endlich!! Gib mal her, Conrad – jetzt gucken wir erst mal ganz genau rein, was du da vorhin wieder für Zeug auf dem Schiff gesammelt hast!',
            },
            {
              speakerId: 'conrad',
              emotion: 'smug',
              shake: true,
              setsFlag: 'flag_c2_conrad_flucht',
              text: 'NIX DA!! Mein Schatz!! Lass mich los!!',
            },
            {
              speakerId: 'maya',
              emotion: 'shocked',
              text: 'Hey!! Conrad ist blitzschnell über die Treppe nach oben geflitzt! Hinterher – schauen wir mal beim VIP-Salon oder gleich auf dem Rettungsboot-Deck!',
            },
            {
              speakerId: 'andrew',
              emotion: 'neutral',
              text: 'Siehst du, Eleonore?! DAS hast du ihm so beigebracht!!',
            },
            {
              speakerId: 'eleonore',
              emotion: 'neutral',
              text: 'ICH?! Er hat doch genau DEINEN Dickkopf geerbt!!',
            },
          ],
        },
      ],
      presentRules: [
        {
          evidenceId: 'conrads_rucksack',
          targetCharacterId: 'andrew',
          requiredFlag: 'flag_c2_rucksack_gefunden',
          hideIfFlag: 'flag_c2_conrad_flucht',
          lines: [
            {
              speakerId: 'andrew',
              emotion: 'neutral',
              text: 'Das ist er ja!! So, Conrad – jetzt schauen wir sofort hinein, warum ein Dieb hinter diesem Rucksack her war!',
            },
            {
              speakerId: 'conrad',
              emotion: 'smug',
              shake: true,
              setsFlag: 'flag_c2_conrad_flucht',
              text: 'NEIN!! Finger weg, der gehört MIR!!',
            },
            {
              speakerId: 'maya',
              emotion: 'shocked',
              text: 'Weg ist er! Auf zum Rettungsboot-Deck oder in die oberen Salons – wir müssen ihn einholen!',
            },
          ],
        },
      ],
      fallbackPresentLines: [
        {
          speakerId: 'maya',
          emotion: 'neutral',
          text: 'Dazu hat hier auf dem Promenadendeck gerade niemand eine neue Reaktion.',
        },
      ],
    },
    music_salon: {
      id: 'music_salon',
      name: 'Musiksalon',
      subtitle: 'Konzertflügel & Ausgang zu den Decks',
      backgroundUrl: '/src/assets/images/cruise_music_salon_1795089043481.jpg',
      charactersPresent: [
        {
          characterId: 'maya',
        },
      ],
      hotspots: [
        {
          id: 'c2_a1_klavier',
          label: 'Konzertflügel & Gästeliste',
          x: 20,
          y: 42,
          width: 30,
          height: 28,
          lines: [
            {
              speakerId: 'maya',
              emotion: 'thinking',
              setsFlag: 'flag_c2_a1_music',
              text: 'Hier drin ist alles leer, Nate. Ein Kellner an der Tür meinte gerade noch, Detective Marston und Staatsanwalt von Falk seien über die Treppen ganz nach unten gerannt!',
            },
          ],
        },
      ],
      talkTopics: [
        {
          id: 'music_marston_suche',
          title: 'Maya: War Kommissar Marston hier?',
          speakerId: 'maya',
          hideIfFlag: 'flag_c2_a1_rauswurf',
          lines: [
            {
              speakerId: 'maya',
              emotion: 'thinking',
              setsFlag: 'flag_c2_a1_music',
              text: 'Nein, nur ein paar aufgescheuchte Stewards – die meinten, Marston und Falk hätten sich sofort nach dem Alarm ganz nach unten zurückgezogen.',
            },
          ],
        },
      ],
      presentRules: [],
      fallbackPresentLines: [
        {
          speakerId: 'maya',
          emotion: 'neutral',
          text: 'Hier im leeren Musiksalon gibt es gerade niemanden, dem wir das zeigen könnten.',
        },
      ],
    },
    vip_salon: {
      id: 'vip_salon',
      name: 'VIP-Salon',
      subtitle: 'Tageslicht · Oberdeck-Foyer',
      backgroundUrl: '/src/assets/images/cruise_suite_day_clean_1795093696232.jpg',
      charactersPresent: [
        {
          characterId: 'maya',
        },
      ],
      hotspots: [
        {
          id: 'c2_a1_security_pult',
          label: 'Bord-Funk-Konsole',
          x: 62,
          y: 35,
          width: 24,
          height: 24,
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              setsFlag: 'flag_c2_a1_vip',
              text: 'Sieh mal auf das kleine Sicherheits-Terminal am Eingang: Alle Warnleuchten blinken nur an einem einzigen Punkt – „Unterdeck · Arrestzelle 08“!',
            },
          ],
        },
        {
          id: 'c2_a3_fussspur',
          label: 'Kleine nasse Turnschuh-Spuren',
          x: 28,
          y: 72,
          width: 22,
          height: 18,
          visibleIfFlag: 'flag_c2_conrad_flucht',
          hideIfFlag: 'flag_c2_conrad_geloest',
          lines: [
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Aha!! Kleine Turnschuh-Spuren quer über den Teppich – die führen direkt durch die Seitentür hinaus aufs Rettungsboot-Deck!',
            },
          ],
        },
      ],
      talkTopics: [
        {
          id: 'vip_alarm_check',
          title: 'Maya: Gibt es hier eine Spur zu Marston?',
          speakerId: 'maya',
          hideIfFlag: 'flag_c2_a1_rauswurf',
          lines: [
            {
              speakerId: 'maya',
              emotion: 'thinking',
              setsFlag: 'flag_c2_a1_vip',
              text: 'Der VIP-Salon ist menschenleer – aber schau mal rechts auf die Status-Konsole: Der ganze Notruf kam aus Arrestzelle 08 unten im Rumpf!',
            },
          ],
        },
      ],
      presentRules: [],
      fallbackPresentLines: [
        {
          speakerId: 'maya',
          emotion: 'neutral',
          text: 'Hier im VIP-Salon reagiert niemand auf dieses Beweisstück.',
        },
      ],
    },
    brig_cell: {
      id: 'brig_cell',
      name: 'Arrestzelle 08 · Unterdeck',
      subtitle: 'Tatort unter Verschluss',
      backgroundUrl: '/src/assets/images/case2_brig_cell_day_1795164438127.jpg',
      charactersPresent: [
        {
          characterId: 'marston',
          hideIfFlag: 'flag_c2_a1_rauswurf',
        },
        {
          characterId: 'falk',
          hideIfFlag: 'flag_c2_a1_rauswurf',
        },
        {
          characterId: 'maya',
          visibleIfFlag: 'flag_c2_a1_rauswurf',
        },
      ],
      hotspots: [
        {
          id: 'c2_a1_tatort_sperre',
          label: 'Tatort-Markierungen #1 & #2',
          x: 45,
          y: 62,
          width: 34,
          height: 28,
          hideIfFlag: 'flag_c2_a1_rauswurf',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'shocked',
              sfx: 'tension',
              text: 'Um Himmels willen… Arthur Morgans Zelle! Umgekippter Hocker, gelbe Tatort-Markierungen…',
            },
            {
              speakerId: 'falk',
              emotion: 'shocked',
              shake: true,
              text: 'WAS MACHEN SIE HIER UNTEN, STERLING?! Ist Ihnen eigentlich klar, was Ihr kleiner „Triumph“ gestern Abend ausgelöst hat?!',
            },
            {
              speakerId: 'marston',
              emotion: 'sweating',
              text: 'Raus hier, Nate! Sofort! Wegen Ihrer Anklage saß Arthur hier unten – jetzt herrscht Ausnahmezustand, und wir brauchen hier keine Zaungäste!',
            },
            {
              speakerId: 'maya',
              emotion: 'shocked',
              setsFlag: 'flag_c2_a1_rauswurf',
              switchesLocationId: 'promenade',
              text: 'Au backe, da fliegen wir direkt wieder vor die Tür! Oh, schau mal – da wartet schon der Kapitän… und wer ist der Mann in der griechischen Uniform?!',
            },
            {
              speakerId: 'captain',
              emotion: 'neutral',
              text: 'Früher wäre mir so ein Chaos auf keinem meiner Dampfer passiert. Na toll, da kommt auch schon die Hafenpolizei aus Heraklion.',
            },
            {
              speakerId: 'dimitri',
              emotion: 'confident',
              text: 'Καλημέρα σας! Κύριε Στέρλινγκ, άκουσα για την οξυδέρκειά σας στο χθεσινό δικαστήριο. Κανένας εδώ δεν τολμά να μιλήσει καθαρά. Σας χρειάζομαι δίπλα μου στην έρευνα!',
            },
            {
              speakerId: 'captain',
              emotion: 'neutral',
              text: 'Sie sollen mitkommen.',
            },
            {
              speakerId: 'maya',
              emotion: 'sweating',
              text: 'Äh… vierzig Sekunden griechischer Vortrag für „Sie sollen mitkommen“?! Frag den Kapitän lieber nochmal genauer, warum Dimitri ausgerechnet uns will!',
            },
          ],
        },
        {
          id: 'c2_a2_klima_panel',
          label: 'Digitales Zellen-Klimapanel',
          x: 27,
          y: 38,
          width: 10,
          height: 18,
          visibleIfFlag: 'flag_c2_a1_rauswurf',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              unlocksEvidence: 'zellen_klima_protokoll',
              unlocksThought: 'thought_c2_kuehlung_9grad',
              text: 'Moment mal! Warum läuft an dieser Zellenwand die Lüftungs-Kühlung auf eiskalten 9 °C?! Laut Protokoll ist der Regler um exakt 02:20 Uhr nachts abgestürzt!',
            },
          ],
        },
        {
          id: 'c2_a2_hocker',
          label: 'Umgekippter Metallhocker',
          x: 56,
          y: 66,
          width: 18,
          height: 22,
          visibleIfFlag: 'flag_c2_a1_rauswurf',
          lines: [
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Der Stuhl wurde extrem wuchtig umgestoßen… genau so ein Krachen müsste man durch die Lüftungsschächte doch bis nach oben gehört haben!',
            },
          ],
        },
        {
          id: 'c2_a5_lueftung_flashback',
          label: 'Oberes Lüftungsgitter (Zelle 08)',
          x: 61,
          y: 16,
          width: 16,
          height: 14,
          visibleIfFlag: 'flag_c2_a4_fertig',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Alle elektronischen Türscans nach 01:00 Uhr sind komplett leer… wie um alles in der Welt kam der Mörder in diese geschlossene Zelle hinein?!',
            },
            {
              speakerId: 'eleonore',
              emotion: 'shocked',
              sfx: 'thought_pop',
              shake: true,
              text: '(FLASHBACK — Eleonores Stimme im Gerichtssaal: „Warum roch mein Schal nach schmierigem Maschinenöl und frischem Meersalz – genauso wie oben beim Lüftungsschacht?!“)',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              sfx: 'deduction',
              setsFlag: 'flag_c2_brandt_beweis',
              unlocksEvidence: 'brandt_keycard_rest',
              unlocksThought: 'thought_c2_flashback_schacht',
              text: 'ELEONORE WAR EIN GENIE!! Schau dir die Schrauben am Lüftungsgitter an, Maya – frisch geölt und von außen gelöst! Und hier in der Ritze klemmt der Rest einer Keycard: „SEC-04 · Lukas Brandt“!!',
            },
            {
              speakerId: 'maya',
              emotion: 'shocked',
              text: 'Officer Lukas Brandt aus der Nachtwache!! Auf zurück zum Rettungsboot-Deck – stellen wir ihn zur Rede!',
            },
          ],
        },
      ],
      talkTopics: [
        {
          id: 'marston_was_passiert',
          title: 'Marston & Falk ansprechen',
          speakerId: 'falk',
          hideIfFlag: 'flag_c2_a1_rauswurf',
          lines: [
            {
              speakerId: 'falk',
              emotion: 'shocked',
              shake: true,
              text: 'RAUS HIER, STERLING!! Ihr letzter Mandant und seine ganze Verhaftung sind schuld an diesem Desaster! Sie haben in meiner Zelle nichts verloren!',
            },
            {
              speakerId: 'maya',
              emotion: 'shocked',
              setsFlag: 'flag_c2_a1_rauswurf',
              switchesLocationId: 'promenade',
              text: 'Schon verstanden, schon verstanden! Kommen Sie, Nate – draußen wartet der Kapitän mit einem Polizisten aus Kreta!',
            },
            {
              speakerId: 'captain',
              emotion: 'neutral',
              text: 'Früher hätte es so eine Unruhe nicht gegeben. Der Herr hier ist Kommissar Dimitri von der Hafenpolizei.',
            },
            {
              speakerId: 'dimitri',
              emotion: 'confident',
              text: 'Καλημέρα σας! Κύριε Στέρλινγκ, παρακολούθησα τη χθεσινή σας δίκη. Είσαστε ο μόνος που δεν φοβάται την αλήθεια – συνεργαστείτε μαζί μου!',
            },
            {
              speakerId: 'captain',
              emotion: 'neutral',
              text: 'Sie sollen mitkommen.',
            },
          ],
        },
      ],
      presentRules: [],
      fallbackPresentLines: [
        {
          speakerId: 'maya',
          emotion: 'thinking',
          text: 'Hier unten an den kalten Stahlschotten hilft uns das gerade nicht weiter.',
        },
      ],
    },
    infirmary: {
      id: 'infirmary',
      name: 'Krankenstation',
      subtitle: 'Medizinische Abteilung · Dr. Vance',
      backgroundUrl: '/src/assets/images/cruise_infirmary_bay_1795039845935.jpg',
      charactersPresent: [
        {
          characterId: 'vance',
        },
      ],
      hotspots: [
        {
          id: 'c2_a2_arzt_monitor',
          label: 'Obduktions-Notiz am Terminal',
          x: 40,
          y: 46,
          width: 16,
          height: 20,
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Auf Dr. Vances Bildschirm steht eine Fußnote: „Standard-Abkühlkurve bei 21 °C Kabinentemperatur vorausgesetzt.“ Falls die Zelle kälter war, stimmt die Uhrzeit überhaupt nicht!',
            },
          ],
        },
      ],
      talkTopics: [
        {
          id: 'vance_todeszeit',
          title: 'Dr. Vance: Wann genau ist Arthur gestorben?',
          speakerId: 'vance',
          lines: [
            {
              speakerId: 'vance',
              emotion: 'neutral',
              unlocksEvidence: 'obduktion_vorlaeufig',
              unlocksThought: 'thought_c2_0730_hafen',
              text: 'Meine Werte von 08:15 Uhr sind eindeutig, Mr. Sterling: Der Eintritt des Todes lag etwa bei 07:30 Uhr morgens – also bereits innerhalb des Hafengebiets von Kreta.',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Und die genaue Zellentemperatur bei Ihrer Messung haben Sie nicht geprüft?',
            },
            {
              speakerId: 'vance',
              emotion: 'sweating',
              text: 'Ähm… wir gehen auf dem gesamten Schiff routinemäßig von 21 Grad aus! Warum fragen Sie?',
            },
          ],
        },
      ],
      presentRules: [
        {
          evidenceId: 'zellen_klima_protokoll',
          targetCharacterId: 'vance',
          lines: [
            {
              speakerId: 'vance',
              emotion: 'shocked',
              text: 'Neun Grad?! Um 02:20 Uhr?! Nun… das würde die Abkühlkurve natürlich völlig auf den Kopf stellen! Das klären wir am besten gleich vor dem Kommissar!',
            },
          ],
        },
      ],
      fallbackPresentLines: [
        {
          speakerId: 'vance',
          emotion: 'neutral',
          text: 'Dafür bin ich als Schiffsärztin nicht die richtige Ansprechpartnerin, Mr. Sterling.',
        },
      ],
    },
    lifeboat_deck: {
      id: 'lifeboat_deck',
      name: 'Rettungsboot- & Frachtdeck',
      subtitle: 'Oberdeck · Lüftungsanlage & Vorratskisten',
      backgroundUrl: '/src/assets/images/case2_lifeboat_deck_1795164437954.jpg',
      charactersPresent: [
        {
          characterId: 'leo',
          hideIfFlag: 'flag_c2_dimitri_weg',
        },
        {
          characterId: 'rick',
          hideIfFlag: 'flag_c2_dimitri_weg',
        },
        {
          characterId: 'conrad',
          visibleIfFlag: 'flag_c2_conrad_flucht',
          hideIfFlag: 'flag_c2_conrad_geloest',
        },
        {
          characterId: 'brandt',
          visibleIfFlag: 'flag_c2_brandt_beweis',
        },
      ],
      hotspots: [
        {
          id: 'c2_a2_deck_gitter',
          label: 'Großes Metall-Lüftungsgitter',
          x: 78,
          y: 18,
          width: 17,
          height: 28,
          lines: [
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Puh, von hier zieht ein ganz schön kräftiger Schacht direkt in die unteren Decks! Und direkt am Rand riecht es nach Maschinenöl…',
            },
          ],
        },
        {
          id: 'c2_a3_rucksack_fund',
          label: 'Blauer Kinder-Rucksack hinter der Kiste',
          x: 82,
          y: 72,
          width: 15,
          height: 24,
          visibleIfFlag: 'flag_c2_a3_rucksack_gesichtet',
          hideIfFlag: 'flag_c2_rucksack_gefunden',
          lines: [
            {
              speakerId: 'maya',
              emotion: 'shocked',
              unlocksEvidence: 'conrads_rucksack',
              setsFlag: 'flag_c2_rucksack_gefunden',
              text: 'NATE!! Schau mal rechts hinter die graue Supply-Kiste!! Das ist genau Conrads kleiner blauer Rucksack! Der Dieb muss ihn hier auf der Flucht fallen gelassen haben!',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Schnappen wir ihn und bringen ihn zurück zu Familie Higginson aufs Promenadendeck!',
            },
          ],
        },
      ],
      talkTopics: [
        {
          id: 'leo_rick_streich',
          title: 'Leo & Rick: Habt ihr nachts hier etwas gehört?',
          speakerId: 'leo',
          hideIfFlag: 'flag_c2_dimitri_weg',
          lines: [
            {
              speakerId: 'rick',
              emotion: 'smug',
              text: 'Ähm… schwörst du, dass Papa nichts davon erfährt, wenn wir’s dir erzählen?!',
            },
            {
              speakerId: 'leo',
              emotion: 'smug',
              unlocksEvidence: 'lueftung_streich',
              unlocksThought: 'thought_c2_0210_poltern',
              text: 'Wir haben um exakt 02:10 Uhr nachts unsere Walkie-Talkies hier ins Lüftungsgitter gehängt für einen Geister-Prank – doch plötzlich hat’s ganz tief unten richtig laut gepoltert, als wäre ein schwerer Stuhl umgeflogen! Und dann wurde der Schacht eiskalt!',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: '02:10 Uhr?! Ihr zwei Chaoten habt uns gerade den wichtigsten Zeugen-Hinweis auf diesem ganzen Schiff geliefert!',
            },
          ],
        },
        {
          id: 'conrad_beruhigen',
          title: 'Conrad beruhigen & nach seinem Schatz fragen',
          speakerId: 'conrad',
          requiredFlag: 'flag_c2_conrad_flucht',
          hideIfFlag: 'flag_c2_conrad_geloest',
          lines: [
            {
              speakerId: 'conrad',
              emotion: 'neutral',
              text: 'Ich geb Papa das NICHT! Der schimpft immer gleich los, wenn ich irgendwelche Sachen vom Boden aufhebe!',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              sfx: 'bag_rummage',
              text: 'Hey, Conrad… ganz ruhig! Ich kram dir mal was viel Besseres raus: Schau mal, ein echtes Junior-Detektiv-Abzeichen zum Anstecken – und eine ganze Rolle Traubenzucker!',
            },
            {
              speakerId: 'conrad',
              emotion: 'smug',
              text: 'Echt für MICH?! Na gut… ich hab das glänzende Ding heut Nacht ganz unten im Flur vor der Zelle gefunden, als ich nicht schlafen konnte. Und heute Morgen wollte mir ein gruseliger Mann mit grauer Security-Jacke meinen Rucksack dafür wegnehmen!',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              removesEvidence: 'conrads_rucksack',
              unlocksEvidence: 'keycard_fragment',
              unlocksThought: 'thought_c2_keycard_ecke',
              setsFlag: 'flag_c2_conrad_geloest',
              text: 'Danke, du bist der beste Geheim-Ermittler an Bord! Jetzt ab mit dir zu deinen Eltern – wir kümmern uns um die abgebrochene Keycard-Ecke!',
            },
          ],
        },
        {
          id: 'brandt_konfrontation',
          title: 'Officer Lukas Brandt zur Rede stellen!',
          speakerId: 'brandt',
          requiredFlag: 'flag_c2_brandt_beweis',
          lines: [
            {
              speakerId: 'brandt',
              emotion: 'neutral',
              text: 'Halten Sie Abstand vom Wartungsschacht, Mr. Sterling. Hier oben hat ein Verteidiger nichts zu suchen.',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Das wird Ihnen gleich vergehen, Officer Brandt! Genau Ihre abgebrochene Keycard SEC-04 klebte frisch geölt im Lüftungsgitter über Zelle 08!',
            },
            {
              speakerId: 'brandt',
              emotion: 'shocked',
              shake: true,
              text: 'Pah! Eine leere Behauptung! Sie haben nicht den geringsten Beweis, dass ich meine Nachtwache jemals verlassen habe! Sehen wir uns vor Ihrem kleinen Schiffs-Tribunal!',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              switchesLocationId: 'courtroom',
              setsPhase: 'court',
              startsTestimonyId: 'testimony_c2_brandt',
              text: 'Sehr gern, Officer Brandt! Judge Pendelton wartet schon im Großen Ballsaal!',
            },
          ],
        },
      ],
      presentRules: [],
      fallbackPresentLines: [
        {
          speakerId: 'maya',
          emotion: 'neutral',
          text: 'Hier am Rettungsboot-Deck löst dieses Teil gerade nichts aus.',
        },
      ],
    },
    courtroom: {
      id: 'courtroom',
      name: 'Großer Ballsaal · Seegericht',
      subtitle: 'Außerordentliches Tribunal vor Kreta',
      backgroundUrl: '/src/assets/images/cruise_court_ballroom_1795039845955.jpg',
      charactersPresent: [
        {
          characterId: 'pendelton',
        },
        {
          characterId: 'falk',
        },
      ],
      hotspots: [],
      talkTopics: [
        {
          id: 'court_c2_tip',
          title: 'Maya: Wie gehen wir vor?',
          speakerId: 'maya',
          lines: [
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Hör dir jede Aussage genau an, drücke mit „Moment mal!“ nach – und schlage genau beim Widerspruch mit deiner Gerichtsakte zu!',
            },
          ],
        },
      ],
      presentRules: [],
      fallbackPresentLines: [
        {
          speakerId: 'pendelton',
          emotion: 'neutral',
          text: 'Bitte präsentieren Sie Beweise direkt während einer Zeugenaussage, Mr. Sterling.',
        },
      ],
    },
  },
  testimonies: {
    testimony_c2_vance: {
      id: 'testimony_c2_vance',
      title: 'Aussage: Dr. Helena Vance (Todeszeitpunkt)',
      witnessId: 'vance',
      introLines: [
        {
          speakerId: 'vance',
          emotion: 'neutral',
          text: 'Ich fasse mich kurz: Meine medizinische Untersuchung fand um 08:15 Uhr direkt in Arrestzelle 08 statt.',
        },
      ],
      statements: [
        {
          id: 'c2_vance_s1',
          text: 'Bei normaler Raumtemperatur von 21 °C kühlte der Körper bis 08:15 Uhr absolut typisch ab.',
          pressLines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              shout: 'MOMENT MAL!',
              text: 'Sie gehen also fest davon aus, dass in Zelle 08 angenehme 21 Grad herrschten?',
            },
            {
              speakerId: 'vance',
              emotion: 'sweating',
              text: 'Nun… die gesamte Schiffsklimaanlage ist auf 21 Grad geeicht. Etwas anderes lag mir nicht vor!',
            },
          ],
        },
        {
          id: 'c2_vance_s2',
          text: 'Demnach trat der Tod eindeutig erst gegen 07:30 Uhr morgens ein – bereits im Hafen von Kreta!',
          pressLines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              shout: 'MOMENT MAL!',
              text: 'Wenn aber ein technischer Ausfall den Raum abgekühlt hat, verschiebt sich die Todeszeit um Stunden nach vorn!',
            },
            {
              speakerId: 'falk',
              emotion: 'smug',
              text: '„Wenn“ ist kein Beweis, Sterling! Zeigen Sie uns harte Fakten statt Temperatur-Märchen!',
            },
          ],
          contradiction: {
            requiredEvidenceId: 'zellen_klima_protokoll',
            alternativeEvidenceIds: ['lueftung_streich'],
            successLines: [
              {
                speakerId: 'nate',
                emotion: 'confident',
                shout: 'EINSPRUCH!',
                shake: true,
                text: 'Genau diese harten Fakten habe ich hier! Laut dem digitalen Klimaprotokoll stürzte Zelle 08 bereits um 02:20 Uhr auf eisige 9 °C ab – und um 02:10 Uhr hörten zwei Zeugen durch den Schacht den Hocker fallen!',
              },
              {
                speakerId: 'vance',
                emotion: 'shocked',
                text: 'Neun Grad seit 02:20 Uhr?! Oh nein… bei dieser Unterkühlung stimmt meine Schätzung überhaupt nicht! Der tatsächliche Todeszeitpunkt lag dann bei etwa 02:15 Uhr nachts!',
              },
              {
                speakerId: 'falk',
                emotion: 'facepalm',
                animation: 'facepalm',
                sfx: 'facepalm',
                text: 'Gah!! Selbst wenn es 02:15 Uhr war, Sterling – was ändert die frühe Uhrzeit schon für Kommissar Dimitri?!',
                requiresFinalEvidencePrompt: {
                  question:
                    'Zeige Staatsanwalt von Falk und Kommissar Dimitri den Beweis, warum die frühe Tatzeit um 02:15 Uhr ALLES verändert!',
                  correctEvidenceId: 'bruecken_log',
                  successLines: [
                    {
                      speakerId: 'nate',
                      emotion: 'confident',
                      shout: 'VOLLTREFFER!',
                      shake: true,
                      text: 'Das ändert ALLES! Laut Kapitän Brammers Brücken-Log erreichte die MS Aurora die griechischen Gewässer erst um 05:45 Uhr! Um 02:15 Uhr befanden wir uns noch mitten in INTERNATIONALEN GEWÄSSERN!',
                    },
                    {
                      speakerId: 'dimitri',
                      emotion: 'confident',
                      sfx: 'gavel',
                      text: 'Απίστευτο!! Στις 02:15 σε διεθνή ύδατα?! Κύριε Στέρλινγκ, είστε ιδιοφυΐα! Αυτό σημαίνει ότι η Ελληνική Ακτοφυλακή δεν έχει καμία απολύτως αρμοδιότητα! Καλή συνέχεια και… γεια σας!',
                    },
                    {
                      speakerId: 'captain',
                      emotion: 'neutral',
                      text: 'Internationale Gewässer. Nicht sein Problem. Er geht von Bord.',
                    },
                    {
                      speakerId: 'falk',
                      emotion: 'shocked',
                      shake: true,
                      text: 'WAS?! Sie lassen uns jetzt einfach allein auf dem Schiff zurück, Kommissar?! Verdammter Urlaub… dann liegt der gesamte Mordfall eben wieder bei unserem Bord-Tribunal!',
                      completesChapter: {
                        completedChapterTitle: 'Akt 2.2 abgeschlossen',
                        completedTimeLabel: 'Tag 4 · Mittag beendet',
                        summary:
                          'Du hast bewiesen, dass Arthur bereits um 02:15 Uhr in internationalen Gewässern starb. Kommissar Dimitri verabschiedete sich trocken auf Griechisch und ging von Bord. Am Nachmittag wartet schon das nächste Drama auf dem Deck!',
                        nextChapterId: 'c2_akt3_nachmittag',
                        nextLocationId: 'promenade',
                        nextPhase: 'investigation',
                        nextTimeOfDay: 'tag',
                        setsFlag: 'flag_c2_dimitri_weg',
                        nextButtonLabel: 'Weiter zu Tag 4 · Nachmittag',
                        nextIntroLines: [
                          {
                            speakerId: 'maya',
                            emotion: 'sweating',
                            setsFlag: 'flag_c2_dimitri_weg',
                            text: 'Na toll – Dimitri sitzt schon gemütlich im Hafencafé, und wir suchen immer noch den Mörder… Moment, warum winken uns die Higginsons da vorn so hektisch zu?!',
                          },
                        ],
                      },
                    },
                  ],
                  wrongLines: [
                    {
                      speakerId: 'falk',
                      emotion: 'facepalm',
                      animation: 'facepalm',
                      sfx: 'facepalm',
                      text: 'Was soll das über unsere Position um 02:15 Uhr beweisen?! Schauen Sie auf die Schiffsroute, Sterling!',
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
          emotion: 'facepalm',
          animation: 'facepalm',
          sfx: 'facepalm',
          shake: true,
          text: 'Widerlegen Sie gefälligst die 21-°C-Annahme oder die 07:30-Uhr-Tatzeit mit technischen Fakten, Sterling!',
        },
        {
          speakerId: 'pendelton',
          emotion: 'headshake',
          animation: 'headshake',
          sfx: 'headshake',
          text: 'Dieser Einwand überzeugt das Tribunal nicht, Mr. Sterling.',
        },
      ],
    },
    testimony_c2_eleonore: {
      id: 'testimony_c2_eleonore',
      title: 'Aussage: Eleonore Higginson (Die Hobbydetektivin)',
      witnessId: 'eleonore',
      introLines: [
        {
          speakerId: 'eleonore',
          emotion: 'shocked',
          text: 'Oh, ich freu mich so!! Legen Sie ruhig los mit Ihrem Kreuzverhör, Mr. Sterling – ich bin bereit für JEDEN Einspruch!!',
        },
      ],
      statements: [
        {
          id: 'c2_eleo_s1',
          text: 'Ich konnte um ein Uhr nicht schlafen, weil Andrew schnarcht wie ein Nebelhorn, und schlich ein bisschen durch die Gänge.',
          pressLines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              shout: 'MOMENT MAL!',
              text: 'Sie sind nachts allein durch die Kabinengänge geschlichen, Mrs. Higginson?',
            },
            {
              speakerId: 'eleonore',
              emotion: 'shocked',
              text: 'JAAAA!! „MOMENT MAL!“ – Genau die perfekte Betonung wie im Spiel!! Warten Sie, hauen Sie gleich noch auf das Holzpult und zeigen mit dem Finger auf mich?!',
            },
            {
              speakerId: 'nate',
              emotion: 'sweating',
              text: '(Sie feuert mich gerade an, während ich sie ins Kreuzverhör nehme…)',
            },
          ],
        },
        {
          id: 'c2_eleo_s2',
          text: 'Als echte Hobbydetektivin habe ich natürlich alles genau beobachtet – fast wie in meinem Lieblings-Anwaltsspiel!',
          pressLines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              shout: 'MOMENT MAL!',
              text: 'Wie meinen Sie das – „alles genau beobachtet“?',
            },
            {
              speakerId: 'eleonore',
              emotion: 'confident',
              text: 'Na, erst redet der Verteidiger, dann seufzt der rote Staatsanwalt genervt und schlägt sich die Hand vor den Kopf – schauen Sie, genau JETZT macht er’s!!',
            },
            {
              speakerId: 'falk',
              emotion: 'facepalm',
              animation: 'facepalm',
              sfx: 'facepalm',
              text: 'Ich… weigere mich, Teil Ihrer privaten Fangemeinde zu sein, Madame!!',
            },
            {
              speakerId: 'eleonore',
              emotion: 'shocked',
              text: 'ICH WUSSTE, DASS ER DAS MACHT!! Haha, perfekt!!',
            },
          ],
        },
        {
          id: 'c2_eleo_s3',
          text: 'Wahrscheinlich war außer mir unten im Zellengang um diese Uhrzeit niemand sonst unterwegs – meinen Schal fand man ja direkt am Gitter!',
          pressLines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              shout: 'MOMENT MAL!',
              text: 'Moment! Haben Sie denn Belege dafür, dass sonst niemand dort unten war – oder war doch jemand mit Security-Zugang vor Ort?',
            },
            {
              speakerId: 'eleonore',
              emotion: 'confident',
              text: 'Oh!! Ich wusste, dass Sie genau diese Lücke gleich mit einem roten „Einspruch!“ zerlegen! Sie haben doch bestimmt etwas aus dem Flur vor der Zelle dabei, oder?!',
            },
          ],
          contradiction: {
            requiredEvidenceId: 'keycard_fragment',
            successLines: [
              {
                speakerId: 'nate',
                emotion: 'confident',
                shout: 'EINSPRUCH!',
                shake: true,
                text: 'Sie waren dort unten keineswegs allein, Mrs. Higginson! Genau vor Zelle 08 lag dieses abgebrochene Keycard-Fragment – jemand von der Security war mitten in der Nacht vor Ort und hat Ihren vermissten Schal missbraucht!',
              },
              {
                speakerId: 'eleonore',
                emotion: 'shocked',
                text: 'GENAU SO!! „EINSPRUCH!“ Mit perfektem Fingerzeig!! Ich bin völlig unschuldig – und der kleine Conrad hat ja wirklich das echte Beweisstück gefunden!!',
              },
              {
                speakerId: 'pendelton',
                emotion: 'confident',
                animation: 'nod',
                sfx: 'gavel',
                text: 'Nun gut! Mrs. Higginson ist damit als Verdächtige völlig entlastet. Sie dürfen den Zeugenstand wieder verlassen.',
              },
              {
                speakerId: 'eleonore',
                emotion: 'confident',
                text: 'Oh, eine winzige Hobbydetektiv-Beobachtung noch, bevor ich gehe! Wenn die Zellentür elektrisch verriegelt war – warum roch mein Schal dann gar nicht nach Kabinenflur, sondern nach schmierigem Maschinenöl und Meersalz, genau wie beim Lüftungsschacht?!',
              },
              {
                speakerId: 'pendelton',
                emotion: 'headshake',
                animation: 'headshake',
                sfx: 'gavel_double',
                text: 'MRS. HIGGINSON!! Sie sind hier als Zeugin geladen, nicht als Ermittlerin! Mischen Sie sich gefälligst nicht in die laufenden Ermittlungen ein!',
              },
              {
                speakerId: 'falk',
                emotion: 'facepalm',
                animation: 'facepalm',
                sfx: 'facepalm',
                text: 'Raus aus meinem Zeugenstand! Wenn noch ein Passagier meine Arbeit machen will, werfe ich die Perücke über Bord!',
              },
              {
                speakerId: 'marston',
                emotion: 'sweating',
                text: 'Bitte gehen Sie zurück zu Ihrer Familie an Deck, Mrs. Higginson – hier ermitteln immer noch die Profis!',
              },
              {
                speakerId: 'eleonore',
                emotion: 'shocked',
                text: 'Immerhin ein echter Rauswurf wie in Teil 3!! Viel Erfolg, Mr. Sterling!!',
                completesChapter: {
                  completedChapterTitle: 'Akt 2.4 abgeschlossen',
                  completedTimeLabel: 'Tag 4 · Abend beendet',
                  summary:
                    'Eleonore lieferte den unterhaltsamsten Zeugenauftritt der Seefahrt und wurde durch Conrads Keycard-Ecke entlastet. Ihr allerletzter Hinweis über Öl, Meersalz und den Lüftungsschacht wurde zwar wütend abgewürgt – doch lässt er dir einfach keine Ruhe.',
                  nextChapterId: 'c2_akt5_nacht',
                  nextLocationId: 'brig_cell',
                  nextPhase: 'investigation',
                  nextTimeOfDay: 'abend',
                  setsFlag: 'flag_c2_a4_fertig',
                  nextButtonLabel: 'Weiter zu Tag 4 · Nacht (Tatort-Check)',
                  nextIntroLines: [
                    {
                      speakerId: 'maya',
                      emotion: 'thinking',
                      setsFlag: 'flag_c2_a4_fertig',
                      text: 'Puh, die Sitzung wurde bis spät in die Nacht vertagt… Schauen wir uns hier in Arrestzelle 08 noch einmal ganz genau um, Nate! Irgendwo muss doch der Einstieg gewesen sein!',
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
          emotion: 'facepalm',
          animation: 'facepalm',
          sfx: 'facepalm',
          shake: true,
          text: 'Netter Versuch, Sterling – aber was soll DIESES Teil im Flur vor der Zelle beweisen?!',
        },
        {
          speakerId: 'eleonore',
          emotion: 'neutral',
          text: 'Hihi, fast, Mr. Sterling! Probieren Sie doch den kleinen Schatz aus Conrads Rucksack!',
        },
      ],
    },
    testimony_c2_brandt: {
      id: 'testimony_c2_brandt',
      title: 'Aussage: Officer Lukas Brandt (Die Nachtwache)',
      witnessId: 'brandt',
      introLines: [
        {
          speakerId: 'brandt',
          emotion: 'neutral',
          text: 'Machen Sie es kurz, Mr. Sterling. Ich trage eine makellose Dienstakte und lasse mich von einem Urlauber nicht verleumden.',
        },
      ],
      statements: [
        {
          id: 'c2_brandt_s1',
          text: 'Ich hatte um 02:00 Uhr Wache auf dem Oberdeck und habe den Zellentrakt nicht einmal betreten.',
          pressLines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              shout: 'MOMENT MAL!',
              text: 'Aber vom Rettungsboot-Deck oben führt ein großer Luftschacht direkt hinab in Zelle 08 – genau dort waren Sie!',
            },
            {
              speakerId: 'brandt',
              emotion: 'neutral',
              text: 'Unsinn. Warum sollte ein Security-Offizier durch einen engen Wartungsschacht kriechen?',
            },
          ],
        },
        {
          id: 'c2_brandt_s2',
          text: 'Die elektronische Zellentür hat keinen einzigen Scan registriert – also gibt es nicht den Hauch einer Verbindung zwischen mir und Zelle 08!',
          pressLines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              shout: 'MOMENT MAL!',
              text: 'Genau deshalb haben Sie die Tür gemieden und sind über das geschmierte Lüftungsgitter eingestiegen!',
            },
            {
              speakerId: 'brandt',
              emotion: 'sweating',
              text: 'Hören Sie auf zu raten! Legen Sie mir handfeste Beweise direkt aus der Zelle vor!',
            },
          ],
          contradiction: {
            requiredEvidenceId: 'brandt_keycard_rest',
            successLines: [
              {
                speakerId: 'nate',
                emotion: 'confident',
                shout: 'EINSPRUCH!',
                shake: true,
                text: 'Hier ist Ihre Verbindung direkt aus dem frisch geölten Lüftungsgitter in Zelle 08: Die Hälfte einer zerbrochenen Security-Karte auf Ihren Namen – SEC-04, Lukas Brandt!!',
              },
              {
                speakerId: 'brandt',
                emotion: 'shocked',
                shake: true,
                text: 'Gah!! D-das kann von irgendeiner alten Kontrolle stammen! Das beweist noch lange nicht, dass meine Karte draußen im Flur vor dem Schacht zerbrochen ist!',
                requiresFinalEvidencePrompt: {
                  question:
                    'Präsentiere den entscheidenden zweiten Teil der Karte, den Conrad auf dem Gang gefunden hat!',
                  correctEvidenceId: 'keycard_fragment',
                  successLines: [
                    {
                      speakerId: 'nate',
                      emotion: 'confident',
                      shout: 'VOLLTREFFER!',
                      shake: true,
                      sfx: 'gavel_double',
                      text: 'DAS HIER IST DIE ANDERE HÄLFTE!! Die Bruchkante aus Conrads Rucksack passt millimetergenau auf Ihre Karte SEC-04!! Deshalb haben Sie dem kleinen Jungen seinen Rucksack gestohlen – und deshalb verstellten Sie die Kühlung auf 9 °C!',
                    },
                    {
                      speakerId: 'brandt',
                      emotion: 'shocked',
                      shake: true,
                      text: 'Verdammt… JA!! Ich musste Arthur Morgan vor Kreta zum Schweigen bringen, bevor er vor der Polizei anfängt zu singen! Aber glauben Sie bloß nicht, Sie hätten jetzt gewonnen, Sterling…',
                    },
                    {
                      speakerId: 'nate',
                      emotion: 'shocked',
                      text: 'Wer hat Ihnen diesen Befehl gegeben, Brandt?! Reden Sie!!',
                    },
                    {
                      speakerId: 'brandt',
                      emotion: 'neutral',
                      sfx: 'tension',
                      text: 'Ich war nur das Werkzeug. Der wahre Drahtzieher steht ganz oben auf der VIP-Liste – und die Gangway nach Kreta öffnet sich noch lange nicht…',
                    },
                    {
                      speakerId: 'maya',
                      emotion: 'thinking',
                      winGame: true,
                      text: 'Akt 2.5 ist gelöst, Nate – Brandt wird abgeführt! Aber wer ist der große Unbekannte auf der VIP-Liste? Das finden wir in Akt 2.6 heraus!',
                    },
                  ],
                  wrongLines: [
                    {
                      speakerId: 'falk',
                      emotion: 'facepalm',
                      animation: 'facepalm',
                      sfx: 'facepalm',
                      text: 'Sie brauchen das exakte Gegenstück zur abgebrochenen Keycard SEC-04, Sterling!',
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
          emotion: 'facepalm',
          animation: 'facepalm',
          sfx: 'facepalm',
          shake: true,
          text: 'Mit so einem Beweis überführen Sie keinen Sicherheitsoffizier, Sterling! Zeigen Sie uns, was in dem Lüftungsgitter hing!',
        },
        {
          speakerId: 'pendelton',
          emotion: 'headshake',
          animation: 'headshake',
          sfx: 'headshake',
          text: 'Dieser Einwand genügt dem Tribunal noch nicht, Mr. Sterling.',
        },
      ],
    },
  },
};
