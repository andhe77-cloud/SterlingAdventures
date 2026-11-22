import type { DialogLine, GameCase } from '../types/game';

/**
 * Helper for multiple-choice memory rounds that loop remaining wrong options
 * until the correct memory point is selected.
 */
function buildMemoryQuizStep(
  prompt: Omit<DialogLine, 'choices'>,
  wrongOptions: Array<{ label: string; feedbackLines: DialogLine[] }>,
  correctOption: { label: string; successLines: DialogLine[] }
): DialogLine {
  const allOptions = [
    ...wrongOptions.map((w, idx) => ({
      key: `w_${idx}`,
      isCorrect: false as const,
      label: w.label,
      lines: w.feedbackLines,
    })),
    {
      key: 'correct',
      isCorrect: true as const,
      label: correctOption.label,
      lines: correctOption.successLines,
    },
  ];

  // Rotate option order deterministically based on prompt length so the right answer sits in varied slots
  const offset = prompt.text.length % allOptions.length;
  const ordered = [
    ...allOptions.slice(offset),
    ...allOptions.slice(0, offset),
  ];

  const wrongCount = wrongOptions.length;
  const memo = new Map<number, DialogLine>();

  const buildNode = (wrongMask: number): DialogLine => {
    const cached = memo.get(wrongMask);
    if (cached) return cached;

    const choices: NonNullable<DialogLine['choices']> = [];
    for (let i = 0; i < ordered.length; i++) {
      const opt = ordered[i];
      if (opt.isCorrect) {
        choices.push({
          label: opt.label,
          nextLines: opt.lines,
        });
      } else {
        const bit = 1 << i;
        if ((wrongMask & bit) === 0) {
          choices.push({
            label: opt.label,
            nextLines: [...opt.lines, buildNode(wrongMask | bit)],
          });
        }
      }
    }

    const node: DialogLine = {
      ...prompt,
      choices,
    };
    memo.set(wrongMask, node);
    return node;
  };

  void wrongCount;
  return buildNode(0);
}

// =============================================================================
// DECK-ABSCHLUSS-RÄTSEL (4 BEWEISE VON FALK REKAPITULIEREN -> ENDE 3.1)
// =============================================================================

export const F3_DECK_4BEWEISE_QUIZ_LINES: DialogLine[] = [
  {
    speakerId: 'nate',
    emotion: 'thinking',
    text: 'Puh… wieder oben an der frischen Seeluft. Immerhin wissen wir jetzt, dass es Andrew bei Frank eigentlich ganz gut geht — sogar ohne TV-Batterien!',
  },
  {
    speakerId: 'eleonore',
    emotion: 'confident',
    text: 'Haha, typisch mein Mann! Erst meckern, dann trotzdem still vor sich hin grübeln und in Wahrheit heilfroh sein, wenn er Ruhe hat! Aber jetzt gilt es, Nate!',
  },
  {
    speakerId: 'eleonore',
    emotion: 'thinking',
    text: 'Wir haben noch nicht einmal unsere großen Fallakten vom Ballsaal auf dem Tisch — also rekapitulieren wir erst einmal genau, welche VIER Hauptbeweise Staatsanwalt von Falk gestern Abend gegen Andrew vorgebracht hat!',
  },
  {
    speakerId: 'nate',
    emotion: 'confident',
    text: 'Genau richtig, Assistentin Eleonore! Gehen wir Punkt für Punkt durch unser Gedächtnis und legen direkt vier einzelne Ermittlungs-Aufgaben im Notizbuch an!',
  },

  // --- FRAGE 1: TÄTERWISSEN ---
  buildMemoryQuizStep(
    {
      speakerId: 'eleonore',
      emotion: 'thinking',
      text: 'Also, Punkt 1 von Staatsanwalt von Falk! Womit hat er behauptet, dass ausgerechnet Andrew als Einziger das Zellenschloss in der Mordnacht lautlos öffnen konnte?',
    },
    [
      {
        label: 'Andrew habe eine geheime Master-Keycard aus der Brücke geklaut',
        feedbackLines: [
          {
            speakerId: 'eleonore',
            emotion: 'headshake',
            text: 'Nein, das mit dem abgebrochenen Keycard-Stück war doch schon in der Mittagsanhörung bei Officer Brandt! Überleg mal: Was hat Andrew selbst im Zeugenstand vorgemacht?',
          },
        ],
      },
      {
        label: 'Andrew sei über den Lüftungsschacht mit einem Drahtseil hinabgeklettert',
        feedbackLines: [
          {
            speakerId: 'nate',
            emotion: 'sweating',
            text: 'Haha, Andrew in einem engen Lüftungsschacht?! Da würden nicht einmal seine Knie reinpassen! Erinner dich an seinen stolzen Technik-Vortrag!',
          },
        ],
      },
      {
        label: 'Andrew habe Dr. Vances Krankenstations-Code geknackt',
        feedbackLines: [
          {
            speakerId: 'eleonore',
            emotion: 'thinking',
            text: 'Von Dr. Vances Schrank-Code hat Falk gar nichts gesagt — der Angriff zielte genau auf Andrews Vorführung direkt vor dem Richterpult!',
          },
        ],
      },
    ],
    {
      label: 'Täterwissen: Die 7-Sekunden-Überlastung am MS-400-Magnetschloss',
      successLines: [
        {
          speakerId: 'eleonore',
          emotion: 'confident',
          sfx: 'thought_pop',
          unlocksThought: 'thought_f3_aufgabe_1_wissen',
          setsFlag: 'flag_f3_aufgabe_1',
          text: 'Exakt!! Falks erster Punkt war „Täterwissen“! Weil Andrew ausgerechnet den geheimen 7-Sekunden-Überlast-Trick auf Schleife B live im Zeugenstand erklärt hat — obwohl weder Brandt noch Kowalski ihn kannten!',
        },
        {
          speakerId: 'nate',
          emotion: 'thinking',
          text: 'Aufgabe 1 notiert: Wir müssen beweisen, dass jemand anderes an das MS-400-Wissen gekommen ist oder Andrew es gar nicht allein erfunden hat!',
        },
      ],
    }
  ),

  // --- FRAGE 2: DER BLAUE SCHAL ---
  buildMemoryQuizStep(
    {
      speakerId: 'nate',
      emotion: 'thinking',
      text: 'Weiter zu Punkt 2! Welches konkrete Tatwerkzeug aus Zelle 08 hat Staatsanwalt von Falk direkt mit unserer Familie in Verbindung gebracht?',
    },
    [
      {
        label: 'Einen Weinkorken aus dem VIP-Salon-Mülleimer',
        feedbackLines: [
          {
            speakerId: 'eleonore',
            emotion: 'sweating',
            text: 'Das war Fall 1 mit dem Chronometer, Nate! Hier in Zelle 08 hing etwas Persönliches direkt über dem Stuhl!',
          },
        ],
      },
      {
        label: 'Conrads kleinen blauen Kinderrucksack vom Rettungsboot-Deck',
        feedbackLines: [
          {
            speakerId: 'eleonore',
            emotion: 'thinking',
            text: 'Den hat Maya schon bei unseren Sachen in der Kabine! Nein, es geht um ein Geschenk von unseren Freunden für diese Mittelmeer-Reise!',
          },
        ],
      },
      {
        label: 'Einen alten Werkzeug-Schraubenschlüssel aus dem Maschinenraum',
        feedbackLines: [
          {
            speakerId: 'nate',
            emotion: 'headshake',
            text: 'Nein, den hätte Elektriker Kowalski sofort erkannt! Denk an den Schock am Strand von Kreta zurück!',
          },
        ],
      },
    ],
    {
      label: 'Tatmittel Schal: Andrews verschwundener blauer Kreta-Seidenschal',
      successLines: [
        {
          speakerId: 'eleonore',
          emotion: 'shocked',
          sfx: 'thought_pop',
          unlocksThought: 'thought_f3_aufgabe_2_schal',
          setsFlag: 'flag_f3_aufgabe_2',
          text: 'Ja… sein eigener königsblauer Kreta-Seidenschal! Falk behauptet, Andrew habe die „Diebstahl“-Geschichte nur erfunden, um seinen eigenen Schal als Tat-Seil in Zelle 08 zu vertuschen!',
        },
        {
          speakerId: 'nate',
          emotion: 'confident',
          text: 'Aufgabe 2 notiert: Herausfinden, wer Andrews Schal wirklich aus seiner Jackentasche entwendet hat!',
        },
      ],
    }
  ),

  // --- FRAGE 3: AUFNAHMEN IN DER MORDNACHT ---
  buildMemoryQuizStep(
    {
      speakerId: 'eleonore',
      emotion: 'thinking',
      text: 'Jetzt Punkt 3 — das war der Moment, in dem mir gestern Abend fast das Herz stehen geblieben ist! Was genau zeigte das Überwachungsvideo aus der Mordnacht?',
    },
    [
      {
        label: 'Andrew beim Herumschleichen vor der Krankenstation um 07:30 Uhr',
        feedbackLines: [
          {
            speakerId: 'nate',
            emotion: 'thinking',
            text: 'Um 07:30 Uhr war Arthur schon längst tot! Die Aufnahme stammt genau aus dem kritischen 15-Minuten-Zeitfenster mitten in der Nacht!',
          },
        ],
      },
      {
        label: 'Wie Andrew zusammen mit Conrad durch den Ballsaal läuft',
        feedbackLines: [
          {
            speakerId: 'eleonore',
            emotion: 'headshake',
            text: 'Conrad lag doch friedlich im Bett und hat durchgeschlafen! Auf dem Video war Andrew völlig allein!',
          },
        ],
      },
      {
        label: 'Wie Andrew Arthur Morgans Arzneiflasche ins Meer wirft',
        feedbackLines: [
          {
            speakerId: 'nate',
            emotion: 'sweating',
            text: 'Zum Glück gibt es so eine Aufnahme nicht! Schau dir in Gedanken den Korridor auf Deck 5 genau vor dem Personal-Treppenhaus an!',
          },
        ],
      },
    ],
    {
      label: 'Nacht-Aufnahmen: Andrew verlässt um 01:58 Uhr allein den Flur & kehrt um 02:23 Uhr zurück',
      successLines: [
        {
          speakerId: 'eleonore',
          emotion: 'sweating',
          sfx: 'thought_pop',
          unlocksThought: 'thought_f3_aufgabe_3_kamera',
          setsFlag: 'flag_f3_aufgabe_3',
          text: 'Genau das!! Von 01:58 bis 02:23 Uhr — exakt rund um das 02:04-bis-02:19-Mordfenster! Und weil er erst behauptet hat geschlafen zu haben, bevor er zugab Leo und Rick gesucht zu haben, wirkte das doppelt verdächtig!',
        },
        {
          speakerId: 'nate',
          emotion: 'confident',
          text: 'Aufgabe 3 notiert: Zeigen, wo Andrew zwischen 01:58 und 02:23 Uhr wirklich war — und dass ihn niemand unten am Treppenhaus gesehen hat!',
        },
      ],
    }
  ),

  // --- FRAGE 4: DAS MOTIV ---
  buildMemoryQuizStep(
    {
      speakerId: 'nate',
      emotion: 'thinking',
      text: 'Und jetzt der vierte und letzte Schlag von Staatsanwalt von Falk! Womit hat er am Ende direkt auf ein Mordmotiv gegen Arthur Morgan gezielt?',
    },
    [
      {
        label: 'Andrew habe sich mit Arthur beim Abendbuffet um den letzten Hummer gestritten',
        feedbackLines: [
          {
            speakerId: 'eleonore',
            emotion: 'sweating',
            text: 'Hahaha — bei Andrews Laune manchmal vorstellbar, aber bestimmt kein Mordmotiv vor einem Schiffsgericht! Denk an das Beweismittel aus Fall 1 mit dem Rotweinfleck!',
          },
        ],
      },
      {
        label: 'Arthur Morgan habe Andrews Kinder auf dem Promenadendeck angeschrien',
        feedbackLines: [
          {
            speakerId: 'nate',
            emotion: 'thinking',
            text: 'Darüber hat zwar kaum jemand gesprochen, aber Falk zog ganz konkret ein Papier mit zwei bestimmten Initialen aus der Tasche!',
          },
        ],
      },
      {
        label: 'Andrew wollte unbedingt selbst den Goldenen Chronometer stehlen',
        feedbackLines: [
          {
            speakerId: 'eleonore',
            emotion: 'headshake',
            text: 'Den hatte Anya doch längst zurückgegeben! Nein — es ging um eine konkrete Geldsumme über 45.000 Euro bis zur Ankunft auf Kreta!',
          },
        ],
      },
    ],
    {
      label: 'Finanzielles Motiv: Der 45.000-€-Brief an „A. H.“ & Andrews eingeräumte Schulden',
      successLines: [
        {
          speakerId: 'eleonore',
          emotion: 'shocked',
          sfx: 'thought_pop',
          unlocksThought: 'thought_f3_aufgabe_4_motiv',
          setsFlag: 'flag_f3_aufgabe_4',
          text: 'GANZ GENAU!! Der verschmierte Rotwein-Brief aus Fall 1 — angeblich stand dort nicht „A. M.“, sondern „A. H.“ für Andrew Higginson! Und als Andrew vor Schreck über Haus und Urlaubsschulden gestammelt hat, hatte Falk sein angebliches Mordmotiv!',
        },
        {
          speakerId: 'nate',
          emotion: 'confident',
          text: 'Damit haben wir ALLE VIER einzelnen Aufgaben sauber in unserem Notizbuch gesichert: 1. Täterwissen, 2. Blauer Schal, 3. Nacht-Kamera & Alibi und 4. Das „A. H.“-Geldmotiv!',
        },
        {
          speakerId: 'eleonore',
          emotion: 'confident',
          shout: 'MOMENT MAL!',
          shake: true,
          sfx: 'victory',
          text: 'Vier Aufgaben, zwei starke Spürnasen und ein ganzer Seetag vor uns! Machen wir Staatsanwalt von Falks Indiziennetz Stück für Stück den Garaus, Nate!!',
        },
        {
          speakerId: 'nate',
          emotion: 'confident',
          text: 'Das nenne ich die richtige Einstellung, Assistentin Higginson! Packen wir Station 3.2 an — erst einmal holen wir tief Luft und bereiten unseren ersten Gegenschlag vor!',
          setsFlag: 'flag_f3_st1_komplett',
          completesChapter: {
            completedChapterTitle: 'Station 3.1 abgeschlossen',
            completedTimeLabel: 'Auf hoher See · Suche nach Andrew beendet',
            summary:
              'Du hast Sabine Lindemann hinter der Bühne aufgespürt, im chaotischen Familienzimmer mit Maya die drei Jungs angezogen und Eleonore als neue Assistentin gewonnen. Über Officer Brandt, die Rezeptionistin Miriam König und das 8-Punkte-Schiffsplan-Rätsel hast du Andrew wohlbehalten in Detective Marstons Kabine 917 gefunden und alle vier Anklage-Aufgaben gesichert.',
            nextChapterId: 'f3_st2_spurensuche',
            nextLocationId: 'promenade',
            nextPhase: 'investigation',
            nextTimeOfDay: 'tag',
            isComingSoon: true,
            nextButtonLabel: 'Demnächst: Station 3.2 (Die 4 Beweise entkräften)',
            comingSoonNote:
              'Station 3.1 („Suche nach Andrew“) ist abgeschlossen! Im nächsten Bauabschnitt widmen sich Nate und Eleonore den vier Ermittlungs-Aufgaben rund um Täterwissen, Schal, Nachtaufnahmen und das „A. H.“-Motiv.',
            nextIntroLines: [],
          },
        },
      ],
    }
  ),
];

// =============================================================================
// FALL 3 HAUPT-DATENSATZ (STATION 3.1)
// =============================================================================

export const CASE3_SEETAG: GameCase = {
  id: 'fall3_seetag',
  title: 'Fall 3: Unschuldig auf hoher See',
  subtitle: 'MS Aurora · Tag 5 (Seetag)',
  badgeLabel: 'Fall 3 · Station 1: Suche nach Andrew',
  description:
    'Die MS Aurora hat von Kreta abgelegt, und Andrew Higginson sitzt wegen Falks vier Indizien in Haft. Nate und Maya quält das schlechte Gewissen – wo steckt Familie Higginson, und wo ist Andrew überhaupt untergebracht?',
  victoryTitle: 'Station 3.1 abgeschlossen!',
  victorySummary:
    'Andrew wohlbehalten in Kabine 917 gefunden, Eleonore als Assistentin gewonnen und alle vier Anklagepunkte von Falk sauber als Ermittlungsaufgaben gesichert.',
  supportsOutro: false,
  initialChapterId: 'f3_st1_suche_andrew',
  chapters: {
    f3_st1_suche_andrew: {
      id: 'f3_st1_suche_andrew',
      dayLabel: 'Tag 5 · Seetag (Station 3.1)',
      timeOfDay: 'tag',
      title: 'Suche nach Andrew',
      subtitle: 'Familienkabine, Arrestbereich & Kabine 917',
    },
  },
  initialLocationId: 'promenade',
  initialUnlockedLocations: ['promenade', 'music_salon', 'vip_salon', 'bridge'],
  initialEvidenceIds: ['ausweis_f3_nate'],
  initialThoughtIds: ['thought_f3_schlechtes_gewissen'],
  introSlides: [
    {
      id: 'f3_slide_sea',
      imageUrl: '/src/assets/images/intro_ship_sunset_1795043375929.jpg',
      kicker: 'Tag 5 · 07:00 Uhr · Auf hoher See',
      caption:
        'Die Lichter von Kreta sind längst hinter dem Horizont versunken. Auf dem Sonnendeck geht der Seetag ruhig seinen Gang – doch tief im Schiff beginnt für Nate und Maya der schwerste Morgen der Reise…',
      sfx: 'foghorn',
      durationMs: 5600,
      panFrom: { scale: 1.0, x: 0, y: 0 },
      panTo: { scale: 1.09, x: 14, y: -4 },
    },
    {
      id: 'f3_slide_arrest',
      imageUrl: '/src/assets/images/outro_andrew_arrest_fixed_1795337972595.jpg',
      kicker: 'Nach dem Abend-Tribunal · Schlaflose Nacht',
      caption:
        'Erst holten sie Andrew als Technik-Zeugen ans Pult – dann drehte Staatsanwalt von Falk den Spieß mit vier schweren Indizien gnadenlos um. Jetzt muss Nate sein Versprechen an eine verzweifelte Familie einlösen.',
      sfx: 'tension',
      durationMs: 5600,
      panFrom: { scale: 1.08, x: -12, y: 4 },
      panTo: { scale: 1.0, x: 8, y: -4 },
    },
    {
      id: 'f3_slide_title',
      kicker: 'Fall 3 · Akte MS Aurora',
      caption: 'Station 3.1: Suche nach Andrew',
      sfx: 'gavel',
      durationMs: 3600,
      panFrom: { scale: 0.96, x: 0, y: 0 },
      panTo: { scale: 1.0, x: 0, y: 0 },
      isTitleCard: true,
    },
  ],
  introLines: [
    {
      speakerId: 'nate',
      emotion: 'sweating',
      text: '… gääähn. Maya, wie spät ist es? Hast du letzte Nacht auch nur zehn Minuten lang ein Auge zugemacht?',
    },
    {
      speakerId: 'maya',
      emotion: 'sweating',
      text: 'Kein bisschen, Nate… Seit gestern Abend auf dem Ballsaalpodium habe ich mich nur hin und her gewälzt. Mein ganzer Magen krampft vor schlechtem Gewissen…',
    },
    {
      speakerId: 'nate',
      emotion: 'thinking',
      text: 'Wir tragen daran auch wirklich Mitschuld, Maya. Hätten wir der Kreuzfahrtmanagerin nicht diese blöde Abend-Show versprochen und Andrew als Technik-Zeugen nach vorn geschickt, säße der arme Mann jetzt nicht in Untersuchungshaft.',
    },
    {
      speakerId: 'maya',
      emotion: 'confident',
      text: 'Dann müssen wir heute sofort etwas unternehmen! Als Allererstes gehen wir zu Eleonore und den drei Jungs, entschuldigen uns aufrichtig und sehen nach, wie es ihnen geht!',
    },
    {
      speakerId: 'nate',
      emotion: 'sweating',
      text: 'Klingt vernünftig — hat nur einen klitzekleinen Haken: Weißt du überhaupt, in welcher Kabine Familie Higginson wohnt?! Auf diesem Schiff gibt es über zweihundert Zimmertüren!',
    },
    {
      speakerId: 'maya',
      emotion: 'thinking',
      text: 'Stimmt… wir kennen ihre Zimmernummer gar nicht! Moment — arbeitet Kreuzfahrtmanagerin Sabine Lindemann nicht auch für den Kinderclub und die Familienprogramme? Vielleicht weiß sie wenigstens, wo die Higginsons untergebracht sind!',
    },
  ],
  characters: {
    nate: {
      id: 'nate',
      name: 'Nate Sterling',
      role: 'Strafverteidiger (Übermüdet, aber entschlossen)',
      bio: 'Hat nach Andrews nächtlicher Festnahme kein Auge zugetan und setzt alles daran, seinen Fehler wieder gutzumachen.',
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
      bio: 'Kümmert sich heute schweren Herzens – aber voller Tatendrang – um die drei wilden Higginson-Kinder, damit Eleonore und Nate ermitteln können.',
      accentColor: '#f59e0b',
      portraitUrl: '/src/assets/images/sprite_maya_neutral_1795080941915.jpg',
      side: 'left',
    },
    eleonore: {
      id: 'eleonore',
      name: 'Eleonore Higginson',
      role: 'Neue Assistentin (auf Zeit)',
      bio: 'Springt ab Kabine 518 persönlich für Maya als Nates Assistentin ein – immer mit Stift, kleinem Spiralblock und viel Krimibegeisterung bewaffnet.',
      accentColor: '#14b8a6',
      portraitUrl: '/src/assets/images/sprite_eleonore_higginson_1795164438099.jpg',
      portraits: {
        shocked: '/src/assets/images/sprite_eleonore_shocked_1795164438020.jpg',
        blushing: '/src/assets/images/sprite_eleonore_blushing_1795345217627.jpg',
      },
      side: 'left',
    },
    andrew: {
      id: 'andrew',
      name: 'Andrew Higginson',
      role: 'Unschuldig Verhafteter (IT-Experte)',
      bio: 'Sitzt ausgerechnet mit Detective Marston in Kabine 917 – ärgert sich über beschlagnahmte Fernbedienungs-Batterien, hat aber endlich ruhig geschlafen.',
      accentColor: '#f97316',
      portraitUrl: '/src/assets/images/sprite_andrew_friendly_1795181599060.jpg',
      portraits: {
        grumpy: '/src/assets/images/sprite_andrew_higginson_1795164436947.jpg',
        shocked: '/src/assets/images/sprite_andrew_shocked_1795299265347.jpg',
      },
      side: 'right',
    },
    captain: {
      id: 'captain',
      name: 'Kapitän Brammer',
      role: 'Schiffskapitän der MS Aurora',
      bio: 'Hat langsam endgültig genug von schlaflosen Kreuzfahrtmanagern, Show-Prozessen und verschwundenen Detectives.',
      accentColor: '#0284c7',
      portraitUrl: '/src/assets/images/sprite_captain_brammer_1795164437466.jpg',
      side: 'right',
    },
    cruisemanager: {
      id: 'cruisemanager',
      name: 'Sabine Lindemann',
      role: 'Kreuzfahrtmanagerin · Entertainment & Events',
      bio: 'Plant hinter der Bühne voller Begeisterung bereits die nächste große Gerichts-LARP-Show auf hoher See.',
      accentColor: '#ec4899',
      portraitUrl: '/src/assets/images/sprite_cruise_manager_chroma_1795294462722.jpg',
      side: 'right',
    },
    brandt: {
      id: 'brandt',
      name: 'Officer Lukas Brandt',
      role: 'Wache am Arrestbereich',
      bio: 'Blockt Nate zunächst strikt ab, lässt sich von Eleonores echter Sorge als Ehefrau aber erweichen.',
      accentColor: '#64748b',
      portraitUrl: '/src/assets/images/sprite_brandt_security_1795164437396.jpg',
      side: 'right',
    },
    vance: {
      id: 'vance',
      name: 'Dr. Helena Vance',
      role: 'Schiffsärztin',
      bio: 'Hält in der Krankenstation Stellung, hat von Detective Marstons Verbleib aber keine Ahnung.',
      accentColor: '#10b981',
      portraitUrl: '/src/assets/images/sprite_dr_vance_1795164436449.jpg',
      side: 'right',
    },
    miriam: {
      id: 'miriam',
      name: 'Miriam König',
      role: 'Chef-Rezeptionistin · MS Aurora',
      bio: 'Pflichtbewusste Rezeptionistin mit messerscharfem Systemblick. Darf keine Kabinennummer direkt verraten – liebt aber logische Ausschlussrätsel.',
      accentColor: '#a855f7',
      portraitUrl: '/src/assets/images/sprite_receptionist_chroma_1795345216266.jpg',
      side: 'right',
    },
    marston: {
      id: 'marston',
      name: 'Detective Marston',
      role: 'Urlaubender Chef-Ermittler',
      bio: 'Hat Andrew mangels sicherer Arrestzelle kurzerhand bei sich in Kabine 917 einquartiert und ihm vorsichtshalber alle Batterien abgenommen.',
      accentColor: '#64748b',
      portraitUrl: '/src/assets/images/sprite_marston_detective_1795080940855.jpg',
      side: 'right',
    },
  },
  evidence: {
    ausweis_f3_nate: {
      id: 'ausweis_f3_nate',
      name: 'Nates Anwaltsabzeichen',
      category: 'profile',
      iconName: 'user',
      summary: 'Das goldene Verteidiger-Abzeichen für das Schiffs-Tribunal.',
      detail:
        'An deinem Urlaubs-Sakko befestigt. Nach Andrews Verhaftung fühlte es sich heute Morgen schwerer an als je zuvor.',
    },
    notiz_kabine_518: {
      id: 'notiz_kabine_518',
      name: 'Kabinen-Zettel: Familie Higginson',
      category: 'evidence',
      iconName: 'key',
      summary: 'Sabine Lindemanns Erinnerung an Familien-Suite 518.',
      detail:
        'Deck 5, Familien-Suite 518. Sabine kannte die Nummer nur persönlich, weil sie den kleinen Conrad dort nach einem Ausreißer-Abenteuer aus dem Kinderclub wieder abliefern musste.',
    },
    notiz_rezeption_regeln: {
      id: 'notiz_rezeption_regeln',
      name: 'Rezeptions-Datenschutzhinweis',
      category: 'evidence',
      iconName: 'file',
      summary: 'Miriam darf keine Kabinennummer nennen – nur Ausschluss-Fakten.',
      detail:
        'Acht allgemeine Angaben über Lage, Deck-Typ, Lärm, Restaurant-Nähe und Wartungssperren grenzen Detective Marstons Kabine bis auf einen einzigen Raum ein.',
    },
    notiz_kabine_917: {
      id: 'notiz_kabine_917',
      name: 'Schiffsplan-Treffer: Kabine 917',
      category: 'evidence',
      iconName: 'door',
      summary: 'Deck 9 · Innenkabine · Mittschiffs · Backbord.',
      detail:
        'Über alle acht Ausschluss-Kriterien von Miriam König exakt bestimmt: Detective Marstons ruhige Einzel-Innenkabine auf Deck 9.',
    },
  },
  thoughts: {
    thought_f3_schlechtes_gewissen: {
      id: 'thought_f3_schlechtes_gewissen',
      title: 'Bei Familie Higginson entschuldigen',
      detail:
        'Andrew wurde verhaftet, weil wir ihn ins Kreuzverhör geholt haben. Als Erstes müssen wir nach Eleonore und den Kindern sehen — nur wo ist ihre Kabine?',
      kind: 'question',
    },
    thought_f3_eleonore_besuchen: {
      id: 'thought_f3_eleonore_besuchen',
      title: 'Familienkabine 518 aufsuchen',
      detail:
        'Sabine Lindemann hat uns Kabine 518 genannt. Schauen wir sofort nach Eleonore und den drei Kindern!',
      kind: 'observation',
    },
    thought_f3_assistentin_eleonore: {
      id: 'thought_f3_assistentin_eleonore',
      title: 'Neue Assistentin: Eleonore',
      detail:
        'Maya passt heute auf Leo, Rick und Conrad auf. Bis zum nächsten Prozess ermittelt Eleonore persönlich an meiner Seite — zunächst geht es hinunter zu Andrew!',
      kind: 'deduction',
    },
    thought_f3_andrew_weg: {
      id: 'thought_f3_andrew_weg',
      title: 'Arrestzelle 08 ist leer!',
      detail:
        'Andrew sitzt nicht in Zelle 08! Brandt hat bestätigt, dass Detective Marston ihn woanders untergebracht hat.',
      kind: 'question',
    },
    thought_f3_marston_gesucht: {
      id: 'thought_f3_marston_gesucht',
      title: 'Wo steckt Detective Marston?',
      detail:
        'Weder die Brücke noch die Krankenstation noch die Salons wissen, in welcher Kabine Marston Urlaub macht. Wer kennt alle Gästezimmer?',
      kind: 'question',
    },
    thought_f3_kabine_917: {
      id: 'thought_f3_kabine_917',
      title: 'Marston & Andrew in Kabine 917',
      detail:
        'Alle 8 Ausschluss-Angaben der Rezeption zeigen auf Deck 9, Innenkabine, Mittschiffs, Backbord, Kabine 917.',
      kind: 'deduction',
    },
    thought_f3_aufgabe_1_wissen: {
      id: 'thought_f3_aufgabe_1_wissen',
      title: 'Aufgabe 1: Täterwissen widerlegen',
      detail:
        'Falks Punkt 1: Nur Andrew wusste angeblich vom 7-Sekunden-Überlasttrick des MS-400-Schlosses. Wer an Bord kannte diese Sicherheitslücke noch?',
      kind: 'question',
    },
    thought_f3_aufgabe_2_schal: {
      id: 'thought_f3_aufgabe_2_schal',
      title: 'Aufgabe 2: Schal-Diebstahl klären',
      detail:
        'Falks Punkt 2: Andrews blauer Kreta-Seidenschal diente als Tat-Seil in Zelle 08. Wer hat ihn am Vorabend wirklich aus Andrews Jackentasche gestohlen?',
      kind: 'question',
    },
    thought_f3_aufgabe_3_kamera: {
      id: 'thought_f3_aufgabe_3_kamera',
      title: 'Aufgabe 3: Nachtaufnahmen 01:58–02:23 Uhr',
      detail:
        'Falks Punkt 3: Die Flurkamera zeigt Andrew während des Mordfensters auf Deck 5. Wie beweisen wir, dass er Leo und Rick gesucht hat und nie unten im Zellentrakt war?',
      kind: 'question',
    },
    thought_f3_aufgabe_4_motiv: {
      id: 'thought_f3_aufgabe_4_motiv',
      title: 'Aufgabe 4: „A. H.“-Brief & Motiv entkräften',
      detail:
        'Falks Punkt 4: Der weinbefleckte 45.000-€-Brief aus Fall 1 soll auf „A. H.“ lauten und mit Andrews Schulden sein Motiv belegen. Wer steckt wirklich hinter den Initialen?',
      kind: 'question',
    },
  },
  logicCombinations: [],
  locations: {
    promenade: {
      id: 'promenade',
      name: 'Promenadendeck',
      subtitle: 'Tag 5 · Ruhige See · Außendeck',
      backgroundUrl: '/src/assets/images/cruise_deck_promenade_1795039844574.jpg',
      charactersPresent: [
        {
          characterId: 'eleonore',
          visibleIfFlag: 'flag_f3_maya_bei_kindern',
        },
      ],
      hotspots: [
        {
          id: 'hs_f3_promenade_reling',
          label: 'Rezeption & Deck-Plan-Info-Säule',
          x: 68,
          y: 36,
          width: 24,
          height: 36,
          hideIfFlag: 'flag_f3_backstage_offen',
          lines: [
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Hier draußen auf den Decks sind alle Passagier-Listen natürlich nicht angeschlagen… wenn wir Sabine Lindemann nirgends auf dem Promenadendeck finden, sollten wir auf die Brücke gehen und Kapitän Brammer fragen!',
            },
          ],
        },
      ],
      talkTopics: [
        {
          id: 'talk_f3_promenade_suche_lindemann',
          title: 'Nach Sabine Lindemann & Familie Higginson umsehen',
          speakerId: 'maya',
          hideIfFlag: 'flag_f3_backstage_offen',
          lines: [
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Hm… die Kreuzfahrtmanagerin ist weder an Deck noch im Musiksalon oder VIP-Salon zu sehen. Komisch, nach gestern Abend müsste sie doch irgendwo herumstolzieren!',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Wenn jemand auf diesem Schiff weiß, in welches Versteck sich Frau Lindemann verkrochen hat, dann Kapitän Brammer oben auf der Kommandobrücke!',
            },
          ],
        },
        {
          id: 'talk_f3_promenade_suche_marston',
          title: 'Hier an Deck nach Detective Marston fragen',
          speakerId: 'eleonore',
          requiredFlag: 'flag_f3_marston_suchen',
          hideIfFlag: 'flag_f3_rezeption_offen',
          lines: [
            {
              speakerId: 'eleonore',
              emotion: 'sweating',
              setsFlag: 'flag_f3_check_promenade',
              text: 'Hier oben an der Reling habe ich jeden Liegestuhl abgesucht — kein Detective Marston weit und breit! Kellner und Passagiere zucken auch alle nur ratlos mit den Schultern.',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Merkwürdig… langsam sind wir wirklich fast jeden öffentlichen Raum abgegangen. Ob Sabine Lindemann hinter der Bühne weiß, wo oder wie wir eine Passagier-Kabine von einem Gast herausfinden?',
            },
          ],
        },
      ],
      presentRules: [],
      fallbackPresentLines: [
        {
          speakerId: 'eleonore',
          emotion: 'neutral',
          text: 'Dafür gibt es hier an Deck gerade keinen Anhaltspunkt, Nate.',
        },
      ],
    },

    music_salon: {
      id: 'music_salon',
      name: 'Musiksalon',
      subtitle: 'Stiller Konzertsaal am Vormittag',
      backgroundUrl: '/src/assets/images/case2_music_salon_day_1795186993338.jpg',
      charactersPresent: [],
      hotspots: [
        {
          id: 'hs_f3_musik_fluegel',
          label: 'Anyas Konzertflügel',
          x: 24,
          y: 42,
          width: 34,
          height: 36,
          lines: [
            {
              speakerId: 'nate',
              emotion: 'neutral',
              text: 'Der Konzertflügel steht geschlossen und friedlich im Morgenlicht. Von unserer Kreuzfahrtmanagerin oder der Familie Higginson fehlt hier jede Spur.',
            },
          ],
        },
      ],
      talkTopics: [
        {
          id: 'talk_f3_music_suche_lindemann',
          title: 'Saal nach Sabine Lindemann absuchen',
          speakerId: 'maya',
          hideIfFlag: 'flag_f3_backstage_offen',
          lines: [
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Hier drin probt noch nicht einmal jemand. Frau Lindemann ist definitiv nicht im Musiksalon — gehen wir vielleicht hoch auf die Brücke zu Kapitän Brammer!',
            },
          ],
        },
        {
          id: 'talk_f3_music_suche_marston',
          title: 'Im Musiksalon nach Detective Marston suchen',
          speakerId: 'eleonore',
          requiredFlag: 'flag_f3_marston_suchen',
          hideIfFlag: 'flag_f3_rezeption_offen',
          lines: [
            {
              speakerId: 'eleonore',
              emotion: 'thinking',
              setsFlag: 'flag_f3_check_music',
              text: 'Hier im Musiksalon steckt er auch nicht… Nicht hinter den Samtvorhängen und nicht an der Bar.',
            },
          ],
        },
      ],
      presentRules: [],
      fallbackPresentLines: [
        {
          speakerId: 'nate',
          emotion: 'neutral',
          text: 'Hier gibt es niemanden, dem wir etwas zeigen könnten.',
        },
      ],
    },

    vip_salon: {
      id: 'vip_salon',
      name: 'VIP-Salon',
      subtitle: 'Ruhige Lounge an Deck',
      backgroundUrl: '/src/assets/images/case2_vip_salon_day_1795181599051.jpg',
      charactersPresent: [],
      hotspots: [],
      talkTopics: [
        {
          id: 'talk_f3_vip_suche_lindemann',
          title: 'VIP-Lounge überprüfen',
          speakerId: 'nate',
          hideIfFlag: 'flag_f3_backstage_offen',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Im VIP-Salon trinken nur zwei ältere Ehepaare ihren Tee. Weder Sabine Lindemann noch Familie Higginson ist hier — fragen wir Kapitän Brammer auf der Brücke!',
            },
          ],
        },
        {
          id: 'talk_f3_vip_suche_marston',
          title: 'VIP-Salon nach Detective Marston absuchen',
          speakerId: 'eleonore',
          requiredFlag: 'flag_f3_marston_suchen',
          hideIfFlag: 'flag_f3_rezeption_offen',
          lines: [
            {
              speakerId: 'eleonore',
              emotion: 'thinking',
              setsFlag: 'flag_f3_check_vip',
              text: 'Der VIP-Salon ist fast leer… Ein zahlender Detective auf Urlaubsbudget hockt wohl eher woanders, oder?',
            },
          ],
        },
      ],
      presentRules: [],
      fallbackPresentLines: [
        {
          speakerId: 'nate',
          emotion: 'neutral',
          text: 'Hier ist gerade niemand zu befragen.',
        },
      ],
    },

    bridge: {
      id: 'bridge',
      name: 'Kommandobrücke',
      subtitle: 'Kapitän Brammers Steuerstand',
      backgroundUrl: '/src/assets/images/bridge_deck_1795257794601.jpg',
      charactersPresent: [{ characterId: 'captain' }],
      hotspots: [],
      talkTopics: [
        {
          id: 'talk_f3_captain_lindemann',
          title: 'Wo ist Kreuzfahrtmanagerin Sabine Lindemann?',
          speakerId: 'captain',
          hideIfFlag: 'flag_f3_backstage_offen',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'neutral',
              text: 'Guten Morgen, Kapitän Brammer! Entschuldigen Sie die frühe Störung — wissen Sie zufällig, wo Frau Lindemann steckt? Wir suchen Familie Higginsons Kabinennummer.',
            },
            {
              speakerId: 'captain',
              emotion: 'grumpy',
              text: 'Grrr… diese Theater-Trulla raubt mir noch den letzten Nerv!! Seit sechs Uhr morgens trägt sie Mikrofone, hölzerne Richtergeländer und Aktenkartonagen direkt durch den Ballsaal!',
            },
            {
              speakerId: 'captain',
              emotion: 'grumpy',
              text: 'Und als wäre das noch nicht genug Trubel an Bord, musste gestern auch noch der älteste von diesen drei Higginson-Rabauken oben am Ausguck auftauchen und mich ernsthaft fragen, ob er durch mein altes Messing-Fernrohr Möwen auf drei Meilen Entfernung zählen darf!! Kinder an Bord…',
            },
            {
              speakerId: 'maya',
              emotion: 'shocked',
              text: 'Um sechs Uhr morgens?! Macht Frau Lindemann etwa jetzt schon Deko für einen weiteren Show-Prozess?!',
            },
            {
              speakerId: 'captain',
              emotion: 'neutral',
              unlocksLocation: 'backstage',
              setsFlag: 'flag_f3_backstage_offen',
              text: 'Sie hat sich samt Kostümständer komplett hinter der Bühne des Ballsaals verschanzt! Gehen Sie durch die Seitentür rechts neben der Show-Empore — und holen Sie mich da bloß raus!',
            },
          ],
        },
        {
          id: 'talk_f3_captain_marston',
          title: 'Wissen Sie, wo Detective Marston schläft?',
          speakerId: 'captain',
          requiredFlag: 'flag_f3_marston_suchen',
          hideIfFlag: 'flag_f3_rezeption_offen',
          lines: [
            {
              speakerId: 'eleonore',
              emotion: 'shocked',
              text: 'Herr Kapitän, bitte!! Mein Mann Andrew liegt gar nicht in Zelle 08! Officer Brandt sagt, Detective Marston habe ihn zu sich geholt — wissen Sie, in welcher Kabine Marston liegt?!',
            },
            {
              speakerId: 'captain',
              emotion: 'grumpy',
              setsFlag: 'flag_f3_check_bridge',
              text: 'Woher soll ICH auswendig wissen, auf welchem Deck ein einzelner Urlaubspassagier seine Koffer abgestellt hat?! Für Kabinenlisten hab ich doch wohl Personal im Hotelbetrieb – hier oben lenke ich ein Schiff, verdammt!',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Okay, auf der Brücke erfahren wir nichts über private Gästekabinen. Prüfen wir die Krankenstation oder fragen gleich Frau Lindemann hinter der Bühne, wer hier die Zimmerpläne verwaltet!',
            },
          ],
        },
      ],
      presentRules: [],
      fallbackPresentLines: [
        {
          speakerId: 'captain',
          emotion: 'grumpy',
          text: 'Lassen Sie mich auf meiner Brücke mit diesem Papierkram in Ruhe, Sterling!',
        },
      ],
    },

    backstage: {
      id: 'backstage',
      name: 'Hinter der Bühne',
      subtitle: 'Garderobe & Requisitenraum des Ballsaals',
      backgroundUrl: '/src/assets/images/bg_f3_backstage_1795345218370.jpg',
      charactersPresent: [{ characterId: 'cruisemanager' }],
      hotspots: [
        {
          id: 'hs_f3_backstage_kisten',
          label: 'Requisiten-Kisten & Richterhammer',
          x: 68,
          y: 66,
          width: 24,
          height: 26,
          lines: [
            {
              speakerId: 'maya',
              emotion: 'sweating',
              text: '„Gavel Crates“ und ein hölzernes Zeugenpult… Die nutzt unsere gestrige Katastrophe ernsthaft als kulissenreifes Entertainment-Programm!',
            },
          ],
        },
        {
          id: 'hs_f3_backstage_spiegel',
          label: 'Schminkspiegel & Ablaufplan',
          x: 34,
          y: 42,
          width: 18,
          height: 28,
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'An der Pinnwand daneben hängen Entwürfe für den „Großen Seetag-Showdown“. Da schaudert es mir jetzt schon.',
            },
          ],
        },
      ],
      talkTopics: [
        {
          id: 'talk_f3_lindemann_zimmer',
          title: 'Nach Familie Higginsons Kabine fragen',
          speakerId: 'cruisemanager',
          hideIfFlag: 'flag_f3_kabine_518_offen',
          lines: [
            {
              speakerId: 'cruisemanager',
              emotion: 'confident',
              sfx: 'victory',
              text: 'Ah!! Mein Star-Verteidiger!! Die Zuschauer-Bewertungen von gestern Abend brechen alle Rekorde der Reederei! Ich habe sogar die große Seetag-Showbühne schon fast komplett umdekorieren lassen — meine Beförderung liegt quasi auf dem Silbertablett!!',
            },
            {
              speakerId: 'nate',
              emotion: 'sweating',
              text: 'Ähm, Frau Lindemann… Ihnen ist aber schon klar, dass gestern Abend ein völlig unschuldiger Familienvater verhaftet wurde?! Maya und ich haben die ganze Nacht nicht geschlafen!',
            },
            {
              speakerId: 'cruisemanager',
              emotion: 'thinking',
              text: 'Oh… na ja, natürlich, rechtlich alles höchst dramatisch und traurig — aber stellen Sie sich erst die Einschaltquote beim großen Freispruch heute Abend vor!! Wollen Sie etwa wieder ermitteln?',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Zuerst einmal wollen wir zu seiner Frau Eleonore und den drei Kindern und uns anständig entschuldigen! Können Sie auf Ihrem Tablet vielleicht nachsehen, in welcher Kabine Familie Higginson wohnt?',
            },
            {
              speakerId: 'cruisemanager',
              emotion: 'thinking',
              text: 'Oh, auf meinem Event-Tablet habe ich leider gar keine regulären Gästekabinen — dort sehe ich immer nur, wenn jemand Sonderpakete, Ausflüge, Shows oder den Kinderclub extra bucht!',
            },
            {
              speakerId: 'cruisemanager',
              emotion: 'confident',
              unlocksLocation: 'higginson_cabin',
              unlocksEvidence: 'notiz_kabine_518',
              unlocksThought: 'thought_f3_eleonore_besuchen',
              setsFlag: 'flag_f3_kabine_518_offen',
              text: 'Aber bei den Higginsons habe ich ausgerechnet die Nummer selbst im Kopf! Vorgestern musste ich nämlich den kleinen Conrad persönlich aus unserem Kinderclub nach Hause bringen — der Knirps hatte sich unter dem Basteltisch mit einer Tüte Cracker versteckt, weil sein kleiner grüner Spielzeug-Dino angeblich Mittagsschlaf brauchte! Es ist die große Familien-Suite 518 auf Deck 5!',
            },
            {
              speakerId: 'cruisemanager',
              emotion: 'neutral',
              text: 'Als wir ankamen, hockte der mittlere Bruder sogar schon im Türrahmen und hat mit seiner kleinen silbernen Stoppuhr gestoppt, wie lange wir für den Rückweg gebraucht haben! Eine herrlich lebendige Familie — ich schicke der Etagen-Stewardess schnell Bescheid, damit sie Sie direkt zu Mrs. Higginson vorlässt!',
            },
          ],
        },
        {
          id: 'talk_f3_lindemann_marston',
          title: 'Wo steckt Detective Marston? Alle sind ratlos!',
          speakerId: 'cruisemanager',
          requiredFlag: 'flag_f3_marston_suchen',
          hideIfFlag: 'flag_f3_rezeption_offen',
          lines: [
            {
              speakerId: 'eleonore',
              emotion: 'shocked',
              text: 'Frau Lindemann, Sie müssen uns helfen! Andrew sitzt nicht in Arrestzelle 08 — laut Officer Brandt hat Detective Marston ihn irgendwo mit hingenommen! Aber an Deck, auf der Brücke und überall sonst weiß kein Mensch, wo Marston steckt!',
            },
            {
              speakerId: 'cruisemanager',
              emotion: 'thinking',
              text: 'Detective Marston? Wie vorhin erwähnt: Ich kann in meinem Event-System ja immer nur nachschauen, ob jemand etwas extra bucht — also Show-Dinner, Wellness-Pakete oder Gruppenkurse. Und von diesem Detective gibt es schlicht keine einzige Extra-Reservierung!',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Wenn jemand ganz regulär ohne Sonderbuchungen reist, taucht er bei Ihnen gar nicht auf… Wer hat hier an Bord denn Zugriff auf alle normalen Passagier-Kabinen?',
            },
            {
              speakerId: 'cruisemanager',
              emotion: 'confident',
              unlocksLocation: 'reception',
              setsFlag: 'flag_f3_rezeption_offen',
              text: 'Dafür gibt es nur eine einzige Adresse auf dem ganzen Schiff: die Schiffs-Rezeption vorn im Haupt-Atrium! Unsere Chef-Rezeptionistin Miriam König kennt jedes einzelne Kabinenfeld im System – na ja, ob sie Ihnen aus Datenschutzgründen sofort eine Nummer nennt, steht allerdings auf einem anderen Blatt…',
            },
          ],
        },
      ],
      presentRules: [],
      fallbackPresentLines: [
        {
          speakerId: 'cruisemanager',
          emotion: 'confident',
          text: 'Spannend! Aber heben Sie sich diesen Effekt am besten für das große Abendprogramm auf der Bühne auf!',
        },
      ],
    },

    higginson_cabin: {
      id: 'higginson_cabin',
      name: 'Kabine 518 · Familie Higginson',
      subtitle: 'Chaotische Familien-Suite auf Deck 5',
      backgroundUrl: '/src/assets/images/bg_f3_family_cabin_1795345218994.jpg',
      charactersPresent: [
        {
          characterId: 'eleonore',
          hideIfFlag: 'flag_f3_maya_bei_kindern',
        },
        {
          characterId: 'maya',
          visibleIfFlag: 'flag_f3_maya_bei_kindern',
        },
      ],
      hotspots: [
        {
          id: 'hs_f3_kabine_malbuch',
          label: 'Piraten-Malbuch & Cracker',
          x: 24,
          y: 72,
          width: 24,
          height: 22,
          lines: [
            {
              speakerId: 'maya',
              emotion: 'neutral',
              text: 'Überall auf dem Boden liegen Piraten-Malbücher, bunte Stifte und zerbröselte Salzcracker herum! Diese Kabine sieht nach einer sehr unruhigen Nacht aus.',
            },
          ],
        },
        {
          id: 'hs_f3_kabine_rucksack',
          label: 'Conrads kleiner blauer Rucksack',
          x: 13,
          y: 52,
          width: 14,
          height: 25,
          lines: [
            {
              speakerId: 'nate',
              emotion: 'neutral',
              text: 'Da leuchtet Conrads kleiner blauer Rucksack am Stuhlbein – nach der großen Rettungsboot-Jagd gestern Mittag zum Glück wieder sicher bei seinem Besitzer.',
            },
          ],
        },
        {
          id: 'hs_f3_kabine_koffer',
          label: 'Offener Familienkoffer mit Klamotten',
          x: 56,
          y: 50,
          width: 26,
          height: 28,
          lines: [
            {
              speakerId: 'nate',
              emotion: 'sweating',
              text: 'T-Shirts, bunte Socken und Schlafanzüge quellen aus jedem Winkel des Koffers… Hier hilft morgens nur System.',
            },
          ],
        },
      ],
      talkTopics: [
        {
          id: 'talk_f3_eleonore_morgen',
          title: 'Sich bei Eleonore entschuldigen & den Tag planen',
          speakerId: 'eleonore',
          hideIfFlag: 'flag_f3_maya_bei_kindern',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'sweating',
              text: 'Guten Morgen, Eleonore… Bitte glauben Sie mir: Maya und ich haben kein Auge zugemacht. Es tut uns unendlich leid, dass wir Andrew gestern Abend aufs Pult geholt haben und er jetzt verhaftet ist.',
            },
            {
              speakerId: 'maya',
              emotion: 'sweating',
              text: 'Wir fühlen uns beide so furchtbar… Wir hätten nie ahnen können, dass Falk so eine hinterhältige Pause vorbereitet hat!',
            },
            {
              speakerId: 'eleonore',
              emotion: 'neutral',
              text: 'Hören Sie auf, sich die Schuld zu geben, Sie zwei! Ich hab heute Nacht zwar auch nur geheult, aber eines steht fest: Ohne Ihre Hilfe hätte Andrew diesen Schwindel niemals geglaubt – und mein Mann ist KEIN Mörder!',
            },
            {
              speakerId: 'eleonore',
              emotion: 'confident',
              text: 'Genug herumgehangen! Ich muss jetzt sofort zu Andrew hinunter in den Arrestbereich und sehen, wie es ihm geht — und Sie begleiten mich, Nate!',
            },
            {
              speakerId: 'nate',
              emotion: 'sweating',
              text: 'Sehr gern, Eleonore! Aber… wer passt den ganzen langen Seetag über auf Leo, Rick und Conrad auf, während wir ermitteln?',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'ICH natürlich!! Die drei haben gestern auf dem Promenadendeck schon super auf mich gehört — na ja, fast! Aber erst muss ich dieses Kinderzimmer-Chaos bändigen und alle drei richtig anziehen!',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Hilf mir bitte kurz beim Klamotten- und Sachen-Sortieren, Nate! Welches T-Shirt trug nochmal welcher Junge auf den Decks, und wem gehört all das verstreute Zeug hier?!',
              startsMiniGameId: 'kids_dressup',
            },
          ],
        },
        {
          id: 'talk_f3_maya_babysitting',
          title: 'Maya: Wie läuft es mit den drei Jungs?',
          speakerId: 'maya',
          requiredFlag: 'flag_f3_maya_bei_kindern',
          lines: [
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Alles im Griff, Nate! Leo malt eine riesige Piratenkarte, Rick testet mein Schokoeis-Versprechen und Conrad füttert seinen Spielzeug-Dino mit Salzcrackern! Kümmer du dich mit Eleonore in Ruhe um Andrew!',
            },
          ],
        },
      ],
      presentRules: [],
      fallbackPresentLines: [
        {
          speakerId: 'eleonore',
          emotion: 'neutral',
          text: 'Dafür haben wir jetzt leider kaum Platz in meinem kleinen Notizblock, Nate.',
        },
      ],
    },

    brig_cell: {
      id: 'brig_cell',
      name: 'Zellentrakt & Arrestbereich',
      subtitle: 'Unterdeck · Sicherheitszone vor Zelle 08',
      backgroundUrl: '/src/assets/images/case2_brig_cell_day_1795164438127.jpg',
      charactersPresent: [{ characterId: 'brandt' }],
      hotspots: [
        {
          id: 'hs_f3_zelle08_schauen',
          label: 'Durch die Gittertür in Zelle 08 blicken',
          x: 62,
          y: 26,
          width: 24,
          height: 54,
          hideIfFlag: 'flag_f3_zelle_leer_entdeckt',
          lines: [
            {
              speakerId: 'eleonore',
              emotion: 'shocked',
              shake: true,
              sfx: 'tension',
              backgroundOverrideUrl: '/src/assets/images/cell_08_inside_1795211919808.jpg',
              setsFlag: 'flag_f3_zelle_leer_entdeckt',
              unlocksThought: 'thought_f3_andrew_weg',
              text: 'MOMENT MAL… NATE!! DIE ZELLE IST VOLLKOMMEN LEER!! Wo ist mein Mann?! Um Gottes willen — nach dem, was hier gestern Nacht mit Arthur Morgan geschehen ist… WAS HABEN DIE MIT ANDREW GEMACHT?!',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              backgroundOverrideUrl: '/src/assets/images/cell_08_inside_1795211919808.jpg',
              text: 'Ganz tief durchatmen, Eleonore!! Schauen Sie sich um: Kein Kampf, das Bett ist unberührt — niemand hat ihm hier drin etwas angetan. Schauen wir uns in Ruhe um und knöpfen uns gleich Officer Brandt hier vorn vor!',
            },
          ],
        },
      ],
      talkTopics: [
        {
          id: 'talk_f3_brandt_nate',
          title: 'Nate: Wo haben Sie Andrew Higginson hingebracht?!',
          speakerId: 'brandt',
          requiredFlag: 'flag_f3_zelle_leer_entdeckt',
          hideIfFlag: 'flag_f3_brandt_abgewiegelt',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Officer Brandt! Was soll das heißen, Zelle 08 ist leer?! Wo befindet sich mein Mandant Andrew Higginson?',
            },
            {
              speakerId: 'brandt',
              emotion: 'grumpy',
              setsFlag: 'flag_f3_brandt_abgewiegelt',
              text: 'Ich gebe Ihnen genau gar keine Auskunft, Sterling!! Dieser Bereich ist gesperrt, und mit einem Verteidiger, der unsere Sicherheitssysteme in der Abendsendung vorführt, rede ich überhaupt kein Wort!! Verschwinden Sie!',
            },
            {
              speakerId: 'eleonore',
              emotion: 'sweating',
              text: '(Der bewegt keinen Millimeter, wenn Sie mit ihm streiten, Nate… Lassen Sie mich es einmal ganz menschlich versuchen!)',
            },
          ],
        },
        {
          id: 'talk_f3_brandt_eleonore',
          title: 'Eleonore: Officer, bitte sagen Sie mir als Ehefrau, wo er ist!',
          speakerId: 'brandt',
          requiredFlag: 'flag_f3_brandt_abgewiegelt',
          hideIfFlag: 'flag_f3_marston_suchen',
          lines: [
            {
              speakerId: 'eleonore',
              emotion: 'shocked',
              text: 'Officer Brandt… bitte!! Es geht mir gerade nicht um irgendeinen Prozess. Hier unten wurde vorgestern ein Mann getötet, die Zelle ist leer und mein Mann hat drei kleine Kinder oben in Kabine 518. Bitte sagen Sie mir wenigstens, ob Andrew in Sicherheit ist!!',
            },
            {
              speakerId: 'brandt',
              emotion: 'neutral',
              text: '… Na schön, Mrs. Higginson. Ihnen als Ehefrau sage ich zumindest so viel, damit Sie sich nicht unnötig zerfleischen: Ihrem Mann geht es körperlich völlig gut.',
            },
            {
              speakerId: 'brandt',
              emotion: 'grumpy',
              unlocksLocation: 'infirmary',
              unlocksThought: 'thought_f3_marston_gesucht',
              setsFlag: 'flag_f3_marston_suchen',
              text: 'Wir wollten den Kerl hier unten doch auf keinen Fall ins MS-400-Schloss sperren, nachdem er gestern vor zweihundert Zeugen geprahlt hat, wie leicht man genau diese Tür in 7 Sekunden knackt!! Fragen Sie Detective Marston — er hat den Gefangenen selbst übernommen. Mehr sag ich nicht!',
            },
            {
              speakerId: 'eleonore',
              emotion: 'sweating',
              text: 'Puh… ein Glück, er lebt und ist bei Detective Marston! Aber wo auf diesem Riesenschiff steckt Detective Marston überhaupt?! Suchen wir erst einmal an allen Schauplätzen nach ihm!',
            },
          ],
        },
      ],
      presentRules: [],
      fallbackPresentLines: [
        {
          speakerId: 'brandt',
          emotion: 'grumpy',
          text: 'Sparen Sie sich Ihre Papierwedlerei für den Ballsaal, Sterling!',
        },
      ],
    },

    infirmary: {
      id: 'infirmary',
      name: 'Krankenstation',
      subtitle: 'Schiffsklinik bei Dr. Helena Vance',
      backgroundUrl: '/src/assets/images/cruise_infirmary_bay_1795039845935.jpg',
      charactersPresent: [{ characterId: 'vance' }],
      hotspots: [],
      talkTopics: [
        {
          id: 'talk_f3_vance_marston',
          title: 'Dr. Vance: Ist Detective Marston heute hier gewesen?',
          speakerId: 'vance',
          requiredFlag: 'flag_f3_marston_suchen',
          hideIfFlag: 'flag_f3_rezeption_offen',
          lines: [
            {
              speakerId: 'eleonore',
              emotion: 'thinking',
              text: 'Guten Morgen, Frau Doktor! Haben Sie Detective Marston oder meinen Mann Andrew heute Morgen irgendwann hier unten gesehen?',
            },
            {
              speakerId: 'vance',
              emotion: 'neutral',
              setsFlag: 'flag_f3_check_infirmary',
              text: 'Nein, leider überhaupt nicht, Mrs. Higginson. Nach dem gestrigen Tribunal hat sich weder der Detective noch irgendjemand sonst aus der Ermittlungsgruppe hier gemeldet — und private Passagierkabinen stehen nicht in meinen Behandlungsakten.',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Keiner an Deck, niemand im VIP- oder Musiksalon, weder Kapitän Brammer noch Dr. Vance… Gehen wir am besten zur Kreuzfahrtmanagerin hinter der Bühne — wenn jemand weiß, wie man einen Gast findet, dann sie!',
            },
          ],
        },
      ],
      presentRules: [],
      fallbackPresentLines: [
        {
          speakerId: 'vance',
          emotion: 'neutral',
          text: 'Medizinisch sehe ich hierbei leider keinerlei Zusammenhang.',
        },
      ],
    },

    reception: {
      id: 'reception',
      name: 'Schiffs-Rezeption',
      subtitle: 'Haupt-Atrium & Concierge-Schalter',
      backgroundUrl: '/src/assets/images/bg_f3_reception_1795345218605.jpg',
      charactersPresent: [{ characterId: 'miriam' }],
      hotspots: [
        {
          id: 'hs_f3_schiffsplan',
          label: 'Beleuchtete Schiffsplan-Tafel hinter dem Schalter',
          x: 20,
          y: 18,
          width: 24,
          height: 36,
          visibleIfFlag: 'flag_f3_miriam_raetsel_aktiv',
          hideIfFlag: 'flag_f3_marston_kabine_offen',
          lines: [
            {
              speakerId: 'eleonore',
              emotion: 'confident',
              text: 'Schau mal, Nate — da leuchtet direkt die interaktive Schiffsplan-Tafel! Probieren wir doch gleich alle Ausschluss-Hinweise von Miriam aus!',
              startsMiniGameId: 'ship_plan',
            },
          ],
        },
      ],
      talkTopics: [
        {
          id: 'talk_f3_miriam_intro',
          title: 'Miriam König nach Detective Marstons Kabine fragen',
          speakerId: 'miriam',
          hideIfFlag: 'flag_f3_miriam_raetsel_aktiv',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Guten Morgen! Frau Lindemann schickt uns herunter — wir suchen dringend nach Detective Frank Marston. Können Sie bitte nachsehen, welche Kabine er gebucht hat?',
            },
            {
              speakerId: 'miriam',
              emotion: 'neutral',
              text: 'Guten Morgen, mein Herr! Ich bin Miriam König, Chef-Rezeptionistin der MS Aurora. Es tut mir ausgesprochen leid, aber unsere Datenschutz-Richtlinie § 9 verbietet mir strengstens, Ihnen die genaue Kabinennummer eines Gastes direkt zu nennen!',
            },
            {
              speakerId: 'eleonore',
              emotion: 'shocked',
              text: 'A-aber er hat meinen Ehemann bei sich!! Sie können uns doch nicht einfach abweisen?!',
            },
            {
              speakerId: 'miriam',
              emotion: 'smug',
              unlocksEvidence: 'notiz_rezeption_regeln',
              setsFlag: 'flag_f3_miriam_raetsel_aktiv',
              text: 'Nun… die konkrete Zimmernummer darf ich Ihnen auf keinen Fall aussprechen. ABER gegen ganz allgemeine Auskünfte darüber, welche Decks und Kabinenbereiche er NICHT gebucht hat und wo er garantiert nicht schläft, sagt unsere Vorschrift kein einziges Wort… Fragen Sie ruhig, solange Ihr Gedächtnis mitmacht!',
            },
          ],
        },
        {
          id: 'talk_f3_miriam_fragen',
          title: 'Miriam alle 8 Ausschluss-Fragen stellen (Wiederholbar)',
          speakerId: 'miriam',
          requiredFlag: 'flag_f3_miriam_raetsel_aktiv',
          hideIfFlag: 'flag_f3_marston_kabine_offen',
          lines: [
            {
              speakerId: 'miriam',
              emotion: 'neutral',
              text: 'Worüber aus den allgemeinen Buchungsdaten möchten Sie genaueres erfahren? Merken Sie sich meine Angaben gut — ich wiederhole sie Ihnen gern, falls Sie unterwegs etwas vergessen!',
              choicePool: true,
              choices: [
                {
                  label: '1. Ist Detective Marston als VIP-Gast eingecheckt?',
                  nextLines: [
                    {
                      speakerId: 'miriam',
                      emotion: 'smug',
                      text: 'Haha, nein — sämtliche VIP- und Panoramasuiten befinden sich hoch oben auf den Decks 12 bis 14. In unserer gesamten VIP-Liste taucht kein einziger Kriminalbeamter auf.',
                    },
                  ],
                },
                {
                  label: '2. Hat seine Kabine Blick aufs Meer oder einen Balkon?',
                  nextLines: [
                    {
                      speakerId: 'miriam',
                      emotion: 'neutral',
                      text: 'Keineswegs. Herr Marston hat ausdrücklich unseren kleinsten Spar-Tarif ohne Fenster verlangt: weder Balkonkabine noch Außenkabine — er schläft garantiert in einer reinen Innenkabine.',
                    },
                  ],
                },
                {
                  label: '3. Liegt seine Kabine auf einem eher lauten Deck?',
                  nextLines: [
                    {
                      speakerId: 'miriam',
                      emotion: 'neutral',
                      text: 'Ohne Zweifel NEIN! Er verlangte absolute Urlaubsruhe. Alles auf den unteren Maschinendecks 4 und 5 dröhnt nachts, und auf den Party-, Pool- und Showdecks 10 und 11 wummern bis tief in die Nacht die Bässe.',
                    },
                  ],
                },
                {
                  label: '4. Ist er nahe am großen Bord-Restaurant einquartiert?',
                  nextLines: [
                    {
                      speakerId: 'miriam',
                      emotion: 'neutral',
                      text: 'Auf gar keinen Fall! Auf Deck 7 ziehen die Steakhaus-Dämpfe bis in die Flure, und Deck 8 beherbergt unser großes Hauptbuffet samt Kombüse. Beides hat Herr Marston strikt ausgeschlossen.',
                    },
                  ],
                },
                {
                  label: '5. Liegt sein Zimmer in einem Familienbereich?',
                  nextLines: [
                    {
                      speakerId: 'miriam',
                      emotion: 'smug',
                      text: 'Gott bewahre, nein! Deck 6 besteht fast ausschließlich aus großen Mehrbett-Familienkabinen mit lebhaften Kindergruppen — so schön wie bei Ihnen, Mrs. Higginson, aber nichts für einen alleinreisenden Polizisten.',
                    },
                  ],
                },
                {
                  label: '6. Wohnt er vorne am Bug oder hinten am Heck?',
                  nextLines: [
                    {
                      speakerId: 'miriam',
                      emotion: 'neutral',
                      text: 'Weder noch! Vorne am Bug spürt man bei schwerem Seegang jede Welle und morgens die Ankerketten, und ganz achtern am Heck vibriert der Wellness-Abluftschacht. Er wollte ausschließlich die ruhige Mitte — strikt Mittschiffs.',
                    },
                  ],
                },
                {
                  label: '7. Liegt die Kabine auf Steuerbord oder Backbord?',
                  nextLines: [
                    {
                      speakerId: 'miriam',
                      emotion: 'neutral',
                      text: 'Kleiner Insider-Tipp zur Innenaufteilung dieses Decktyps: Auf der Steuerbord-Seite (rechts in Fahrtrichtung) liegen dort nur Crew-Wäschelager und Servicekammern! Passagier-Innenkabinen gibt es in diesem Bereich nur auf Backbord.',
                    },
                  ],
                },
                {
                  label: '8. Gibt es gesperrte Nummern oder Doppelkabinen im Innenkorridor?',
                  nextLines: [
                    {
                      speakerId: 'miriam',
                      emotion: 'smug',
                      text: 'Jawohl! Alle geraden Kabinennummern (912, 914, 916, 918) dort sind seit gestern wegen Klimawartung gesperrt. Und von den ungeraden sind 911, 913 und 915 reine Doppel- bzw. Technikräume — genau eine ungerade Einzel-Innenkabine darüber bleibt frei.',
                    },
                  ],
                },
                {
                  label: 'Zum Schiffsplan wechseln & Kabine jetzt eingrenzen!',
                  exitsChoicePool: true,
                  nextLines: [
                    {
                      speakerId: 'nate',
                      emotion: 'confident',
                      text: 'Alles klar — schauen wir rüber auf die beleuchtete Schiffsplan-Tafel und streichen nach deinen Erinnerungen alles Unmögliche weg!',
                      startsMiniGameId: 'ship_plan',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 'talk_f3_schiffsplan_direkt',
          title: 'Schiffsplan an der Tafel öffnen (Kabine einkreisen)',
          speakerId: 'eleonore',
          requiredFlag: 'flag_f3_miriam_raetsel_aktiv',
          hideIfFlag: 'flag_f3_marston_kabine_offen',
          lines: [
            {
              speakerId: 'eleonore',
              emotion: 'confident',
              text: 'Öffnen wir wieder die Schiffsplan-Tafel — wir können genau bei unserer bisherigen Auswahl weitermachen!',
              startsMiniGameId: 'ship_plan',
            },
          ],
        },
      ],
      presentRules: [],
      fallbackPresentLines: [
        {
          speakerId: 'miriam',
          emotion: 'neutral',
          text: 'Sehr interessant, mein Herr — aber laut Datenschutz hilft mir auch dieses Papier leider nicht weiter!',
        },
      ],
    },

    marston_cabin: {
      id: 'marston_cabin',
      name: 'Kabine 917 · Detective Marston',
      subtitle: 'Deck 9 · Innenkabine · Mittschiffs · Backbord',
      backgroundUrl: '/src/assets/images/bg_f3_marston_cabin_1795345218230.jpg',
      charactersPresent: [
        { characterId: 'marston' },
        { characterId: 'andrew' },
      ],
      hotspots: [
        {
          id: 'hs_f3_fernbedienung',
          label: 'Geöffnete TV-Fernbedienung ohne Batterien',
          x: 56,
          y: 66,
          width: 18,
          height: 15,
          lines: [
            {
              speakerId: 'nate',
              emotion: 'sweating',
              text: 'Das Batteriefach ist komplett leer geräumt und der Deckel liegt daneben… Detective Marston geht offenbar absolut kein Risiko ein.',
            },
          ],
        },
        {
          id: 'hs_f3_akte_tisch',
          label: 'Marstons verdeckte Ermittlungsmappe',
          x: 72,
          y: 72,
          width: 22,
          height: 20,
          lines: [
            {
              speakerId: 'eleonore',
              emotion: 'thinking',
              text: 'Da oben auf der Mappe liegt sogar ein Kaffee-Becher der „Police Academy“! Frank arbeitet offenbar heimlich doch an unserem Fall weiter…',
            },
          ],
        },
      ],
      talkTopics: [
        {
          id: 'talk_f3_kabine_917_dialog',
          title: 'Mit Andrew & Detective Marston sprechen',
          speakerId: 'andrew',
          hideIfFlag: 'flag_f3_auf_deck_4fragen',
          lines: [
            {
              speakerId: 'eleonore',
              emotion: 'shocked',
              shake: true,
              text: 'ANDREW!! GOTT SEI DANK, DIR GEHT ES GUT!! Ich hab halb Heraklion und das ganze Unterdeck nach dir umgekrempelt, als Zelle 08 komplett leer stand!!',
            },
            {
              speakerId: 'andrew',
              emotion: 'shocked',
              text: 'Eleonore?! Nate?! Woher zum Kuckuck habt Ihr zwei diese winzige Innenkabine ohne jedes Fenster gefunden?! Habt Ihr eine halbe Suchmannschaft angeheuert?!',
            },
            {
              speakerId: 'andrew',
              emotion: 'grumpy',
              text: 'Aber wo Sie schon mal hier sind, Nate — schauen Sie sich bitte diesen Schwachsinn da auf dem Tisch an!! Wissen Sie, was Ihr geschätzter Herr Detective gestern Nacht gemacht hat, kaum dass die Tür ins Schloss fiel?!',
            },
            {
              speakerId: 'andrew',
              emotion: 'grumpy',
              shake: true,
              text: 'DER HAT MIR ALLEN ERNSTES DIE ZWEI BATTERIEN AUS DER FERNSEH-FERNBEDIENUNG GEKLAUT!! Sagen Sie ihm das doch mal: ICH BIN IT-LER UND NICHT MACGYVER!! Was zum Teufel soll ich bitte mit zwei Batterien anstellen?!',
            },
            {
              speakerId: 'andrew',
              emotion: 'thinking',
              text: '… Na gut, wenn man genau drüber nachdenkt: Mit den zwei 1,5-Volt-Mignon-Batterien, der Infrarot-Leuchtdiode aus der Platine, einem kleinen Drahtstück aus dem Hosenknopf und der IR-Wartungsschnittstelle da oben über der Kabinentür könnte man natürlich schon einen getakteten Reset-Impuls senden und…',
            },
            {
              speakerId: 'marston',
              emotion: 'shocked',
              shake: true,
              sfx: 'facepalm',
              text: 'GENAU DESWEGEN HAB ICH DIE VERDAMMTEN BATTERIEN HERAUSGENOMMEN!!',
            },
            {
              speakerId: 'nate',
              emotion: 'sweating',
              text: 'Haha… ja gut, Frank, in diesem Punkt gebe ich Ihnen ausnahmsweise mal voll recht. Wie kommt ihr zwei hier denn überhaupt miteinander klar?',
            },
            {
              speakerId: 'andrew',
              emotion: 'neutral',
              text: 'Ach, wissen Sie… als der alte Brummbär erstmal aufgehört hat mich wie einen Schwerverbrecher anzustarren, haben wir uns richtig gut vertragen. Und ganz ehrlich… ich habe heute Nacht auf diesem schmalen Bett tatsächlich zum allerersten Mal auf dieser gesamten Kreuzfahrt tief und fest durchgeschlafen!!',
            },
            {
              speakerId: 'eleonore',
              emotion: 'grumpy',
              shake: true,
              text: 'WIE BITTE?! Hör ich da gerade richtig, Andrew Higginson?! Du schläfst in einer fensterlosen Arrest-Kabine mit einem fremden Detective BESSER als in unserer schönen Familien-Suite mit deiner eigenen Ehefrau?!',
            },
            {
              speakerId: 'andrew',
              emotion: 'neutral',
              text: 'Na hör mal, Schatz — kein Kinder-Gezänk morgens um sechs, keine Klimaanlagen-Diskussion… Und außerdem sieh dich doch mal im Spiegel an mit deinem Bleistift und deinem kleinen Spiralblock! Gib’s doch endlich zu: Du hast hier draußen gerade selbst den allergrößten Spaß beim Ermitteln!!',
            },
            {
              speakerId: 'eleonore',
              emotion: 'blushing',
              sfx: 'thought_pop',
              text: 'W-WAS?! I-ich hab doch überhaupt keinen Spaß… mein armer Ehemann sitzt schließlich unschuldig in Haft, da… da kann man doch gar keinen Spaß haben! Das hier ist… ist reine, todernste Kanzleipflicht als Nates Assistentin, jawohl!!',
            },
            {
              speakerId: 'marston',
              emotion: 'neutral',
              text: 'Schon gut, Mrs. Higginson — Sie machen das tatsächlich gar nicht übel. Hört mal zu, Leute: Je länger ich gestern Nacht über Falks plötzliche Pause und diese perfekt zugeschnittene Indizienkette nachgedacht habe, desto stinkiger kommt mir diese ganze Sache vor.',
            },
            {
              speakerId: 'marston',
              emotion: 'confident',
              setsFlag: 'flag_f3_marston_hilft',
              text: 'Ich werde Ihnen helfen, Nate. Offiziell muss ich hier mit Andrew die Füße stillhalten, sonst schlägt mir Falk wegen Gefangenenbegünstigung sofort den Kopf ab — wir beide bleiben also bis auf Weiteres exakt hier in Kabine 917. Aber intern checke ich alle Crew-Akten und Funkprotokolle für Sie!',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Danke, Frank — genau diese Rückendeckung brauchen wir! Auf geht’s zurück aufs Promenadendeck, Eleonore: Sortieren wir erst einmal alles, womit Staatsanwalt von Falk Andrew angeklagt hat!',
            },
            {
              speakerId: 'andrew',
              emotion: 'confident',
              setsFlag: 'flag_f3_auf_deck_4fragen',
              switchesLocationId: 'promenade',
              text: 'Macht es gut, Ihr zwei! Und vergesst bloß keinen einzigen von Falks vier Punkten, sonst holt er euch heute Abend auf der Bühne direkt ein!!',
            },
            ...F3_DECK_4BEWEISE_QUIZ_LINES,
          ],
        },
      ],
      presentRules: [],
      fallbackPresentLines: [
        {
          speakerId: 'marston',
          emotion: 'neutral',
          text: 'Hebt das erstmal sicher bei euch in der Akte auf — hier drinnen muss alles unter Verschluss bleiben.',
        },
      ],
    },
  },
  testimonies: {},
};
