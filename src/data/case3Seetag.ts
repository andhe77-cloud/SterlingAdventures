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
      label: 'Die 7-Sekunden-Überlastung am MS-400-Magnetschloss',
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
          text: 'Schreib das gleich als ersten Punkt in deinen Block, Eleonore: Wir müssen zeigen, dass jemand anderes an das MS-400-Wissen gekommen ist oder Andrew es gar nicht allein erfunden hat.',
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
      label: 'Andrews verschwundener blauer Kreta-Seidenschal',
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
          text: 'Und als zweiter Punkt auf unserer Liste: Herausfinden, wer Andrews Schal wirklich aus seiner Jackentasche entwendet hat!',
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
      label: 'Andrew verlässt um 01:58 Uhr allein den Flur & kehrt um 02:23 Uhr zurück',
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
          text: 'Bleibt Punkt drei: Zeigen, wo Andrew zwischen 01:58 und 02:23 Uhr wirklich war — und dass ihn niemand unten am Treppenhaus gesehen hat!',
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
      label: 'Der 45.000-€-Brief an „A. H.“ & Andrews eingeräumte Schulden',
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
          text: 'Das nenne ich die richtige Einstellung, Assistentin Higginson! Teilen wir uns die Fährten systematisch auf — wir können alle Spuren kreuz und quer über das Schiff ganz nach unserem eigenen Tempo verfolgen!',
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
            unlocksLocations: ['switchroom'],
            setsFlag: 'flag_f3_st2_aktiv',
            isComingSoon: false,
            nextButtonLabel: 'Weiter zu Station 3.2: Die 4 Beweise entkräften',
            nextIntroLines: [
              {
                speakerId: 'eleonore',
                emotion: 'confident',
                text: 'Also gut, Nate! Unser Notizbuch ist prall gefüllt: Täterwissen um das MS-400-Schloss, Andrews blauer Schal, die Nachtaufnahmen zwischen 01:58 und 02:23 Uhr und der „A. H.“-Brief.',
              },
              {
                speakerId: 'nate',
                emotion: 'thinking',
                text: 'Wir müssen uns jetzt auf dem ganzen Schiff noch einmal ganz genau umschauen und jeden offenen Punkt gründlich durchleuchten.',
              },
              {
                speakerId: 'eleonore',
                emotion: 'confident',
                text: 'Haken wir einen Punkt von Falks Anklage nach dem anderen ab, Assistentin-Ehrenwort! Wo fangen wir als Erstes an?',
              },
            ],
          },
        },
      ],
    }
  ),
];

// =============================================================================
// STATION 3.2 ABENDVERHANDLUNG INTRO (NACH MAYAS RÜCKKEHR)
// =============================================================================

export const F3_ST2_TRIAL_INTRO_LINES: DialogLine[] = [
  {
    speakerId: 'cruisemanager',
    emotion: 'confident',
    sfx: 'alarm',
    unlocksLocation: 'courtroom',
    switchesLocationId: 'courtroom',
    setsPhase: 'court',
    text: 'MEINE DAMEN UND HERREN – HERZLICH WILLKOMMEN ZUR GROSSEN SEETAG-ABENDVERHANDLUNG IM BALLSAAL DER MS AURORA!! Beide Plätze im Rampenlicht sind gerichtet: Staatsanwalt Victor von Falk tritt heute HÖCHSTPERSÖNLICH in den Zeugenstand!!',
  },
  {
    speakerId: 'pendelton',
    emotion: 'headshake',
    animation: 'headshake',
    sfx: 'gavel_double',
    text: 'Zum wiederholten Male, Frau Lindemann: Drehen Sie das Verfolgerscheinwerfer-Ballett ein wenig herunter! Dies ist eine gerichtliche Überprüfung der Untersuchungshaft gegen Mr. Andrew Higginson und kein Zirkusprogramm!',
  },
  {
    speakerId: 'nate',
    emotion: 'confident',
    text: 'Die Verteidigung ist vollständig bereit, Euer Ehren! Und ich bringe meine Assistentin Maya zurück ans Pult — auch wenn sie heute deutlich härter gekämpft hat als so mancher Seemann.',
  },
  {
    speakerId: 'maya',
    emotion: 'confident',
    text: 'Frisch gewaschen, blitzschnell umgezogen und wieder voll einsatzbereit, Nate! Die drei kleinen Wirbelwinde haben mich nicht kleingekriegt — jetzt machen wir Herrn von Falk fertig!!',
  },
  {
    speakerId: 'falk',
    emotion: 'smug',
    text: 'Welch rührender Anblick, Sterling — Ihre Kanzlei sieht exakt so zerrüttet aus wie Ihre Erfolgsaussichten. Kommen wir zur Sache: Sie behaupten, drei meiner gestrigen Hauptindizien seien zusammengebrochen?',
  },
  {
    speakerId: 'falk',
    emotion: 'confident',
    animation: 'slam',
    text: 'Ich stelle mich freiwillig selbst ans Zeugenpult! Wiederholen wir jeden meiner Anklagepunkte einzeln vor dem gesamten Schiff – und schauen zu, wie Sie sich an meinen Beweisen die Zähne ausbeißen!',
    startsTestimonyId: 'testimony_f3_falk_1',
  },
];

// =============================================================================
// FALL 3 HAUPT-DATENSATZ (STATION 3.1 & 3.2)
// =============================================================================

export const CASE3_SEETAG: GameCase = {
  id: 'fall3_seetag',
  title: 'Fall 3: Unschuldig auf hoher See',
  subtitle: 'MS Aurora · Tag 5 (Seetag)',
  badgeLabel: 'Fall 3 · Auf hoher See',
  description:
    'Nach dem turbulenten Zwischenstopp auf Kreta gleitet die MS Aurora wieder über das offene Mittelmeer. Statt eines ruhigen Seetags wartet an Bord eine verzwickte Suche – und bald stehen Nate und Maya mit unerwarteter Unterstützung vor einem scheinbar aussichtslosen Indiziennetz.',
  victoryTitle: 'Station 3.2 abgeschlossen!',
  victorySummary:
    'Drei von vier Anklagepunkten (Täterwissen, blauer Schal und Nacht-Alibi) wurden vor dem Seegericht zerschlagen. Wegen des noch offenen 45.000-€-Briefs wurde die Verhandlung auf morgen vor Malta vertagt!',
  supportsOutro: true,
  initialChapterId: 'f3_st1_suche_andrew',
  chapters: {
    f3_st1_suche_andrew: {
      id: 'f3_st1_suche_andrew',
      dayLabel: 'Tag 5 · Seetag (Station 3.1)',
      timeOfDay: 'tag',
      title: 'Suche nach Andrew',
      subtitle: 'Familienkabine, Arrestbereich & Kabine 917',
    },
    f3_st2_spurensuche: {
      id: 'f3_st2_spurensuche',
      dayLabel: 'Tag 5 · Seetag (Station 3.2)',
      timeOfDay: 'tag',
      title: 'Die 4 Beweise entkräften',
      subtitle: 'Täterwissen, Schal-Fährte, Nacht-Alibi & Abendverhandlung',
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
    maya_chaos: {
      id: 'maya_chaos',
      name: 'Maya',
      role: 'Kanzlei-Assistentin (Nach 10 Std. Kinderdienst)',
      bio: 'Hat zehn Stunden Kinderdienst mit Piraten-Schlachten, Eismaschinen-Wetten und Saftpäckchen-Explosionen überlebt — sichtbar gezeichnet, aber unbezwingbar.',
      accentColor: '#f59e0b',
      portraitUrl: '/src/assets/images/sprite_maya_juice_chroma_1795422337739.jpg',
      side: 'left',
    },
    pendelton: {
      id: 'pendelton',
      name: 'Judge Pendelton',
      role: 'Vorsitzender Richter · Seegericht',
      bio: 'Hält an Bord trotz Show-Spektakel auf strikte Fairness und lässt sich von bloßen Halbwahrheiten nicht beeindrucken.',
      accentColor: '#1e3a8a',
      portraitUrl: '/src/assets/images/sprite_pendelton_neutral_1795080941377.jpg',
      portraits: {
        headshake: '/src/assets/images/sprite_pendelton_disappointed_1795091176237.jpg',
      },
      side: 'right',
    },
    falk: {
      id: 'falk',
      name: 'Victor von Falk',
      role: 'Staatsanwalt (Heute im Zeugenstand)',
      bio: 'Stellt sich arrogant persönlich ans Zeugenpult, um jedes einzelne Indiz gegen Andrew zu verteidigen — mit fatalen Lücken.',
      accentColor: '#dc2626',
      portraitUrl: '/src/assets/images/sprite_falk_neutral_1795080942096.jpg',
      portraits: {
        shocked: '/src/assets/images/sprite_falk_shocked_1795080941650.jpg',
        facepalm: '/src/assets/images/sprite_falk_facepalm_1795091158455.jpg',
      },
      side: 'right',
    },
    eleonore: {
      id: 'eleonore',
      name: 'Eleonore Higginson',
      role: 'Neue Assistentin (auf Zeit)',
      bio: 'Springt ab Kabine 518 persönlich für Maya als Nates Assistentin ein – entschlossen, einfühlsam und beim Ermitteln immer mit Stift und kleinem Spiralblock bewaffnet.',
      accentColor: '#14b8a6',
      portraitUrl: '/src/assets/images/eleonore_friendly_chroma_1795426716556.jpg',
      portraits: {
        neutral: '/src/assets/images/eleonore_friendly_chroma_1795426716556.jpg',
        sweating: '/src/assets/images/eleonore_worried_chroma_1795426716488.jpg',
        shocked: '/src/assets/images/eleonore_worried_chroma_1795426716488.jpg',
        grumpy: '/src/assets/images/eleonore_worried_chroma_1795426716488.jpg',
        thinking: '/src/assets/images/sprite_eleonore_higginson_1795164438099.jpg',
        confident: '/src/assets/images/sprite_eleonore_higginson_1795164438099.jpg',
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
      portraits: {
        grumpy: '/src/assets/images/marston_grumpy_chroma_1795426716136.jpg',
        headshake: '/src/assets/images/marston_grumpy_chroma_1795426716136.jpg',
        sweating: '/src/assets/images/marston_grumpy_chroma_1795426716136.jpg',
      },
      side: 'right',
    },
    electrician: {
      id: 'electrician',
      name: 'Lars Kowalski',
      role: 'Bord-Elektriker · MS Aurora',
      bio: 'Kennt jeden Schaltkasten des Schiffes aus dem Effeff, verliert im Papierkram seiner hundert Geräte-Handbücher allerdings leicht den Überblick.',
      accentColor: '#eab308',
      portraitUrl: '/src/assets/images/sprite_electrician_chroma_1795294462693.jpg',
      side: 'right',
    },
    vip_guest: {
      id: 'vip_guest',
      name: 'Gerhard von Berg',
      role: 'Verärgerter VIP-Passagier',
      bio: 'Dokumentiert aus Prinzip jede Unordnung im VIP-Speisesaal mit seinem Tablet — rückt aber erst Informationen heraus, wenn ringsum Ordnung herrscht.',
      accentColor: '#b45309',
      portraitUrl: '/src/assets/images/sprite_vip_guest_chroma_1795388139404.jpg',
      side: 'right',
    },
    laundry_worker: {
      id: 'laundry_worker',
      name: 'Elara Novak',
      role: 'Mitarbeiterin der Bord-Wäscherei',
      bio: 'Gewissenhafte Kraft an den großen Wäschetrommeln. Wenn zwischen weißen VIP-Handtüchern etwas Fremdes auftaucht, legt sie es sofort ordentlich ab.',
      accentColor: '#06b6d4',
      portraitUrl: '/src/assets/images/sprite_laundry_worker_chroma_1795388140057.jpg',
      side: 'right',
    },
    sailor_kalle: {
      id: 'sailor_kalle',
      name: 'Kalle Jensen',
      role: 'Deck-Matrose · Nachtschicht',
      bio: 'Übernimmt die ruhige Decksreinigung um zwei Uhr nachts mit seinem alten Kassetten-Walkman – ohne Musik läuft sein Gedächtnis allerdings auf Sparflamme.',
      accentColor: '#38bdf8',
      portraitUrl: '/src/assets/images/sprite_sailor_kalle_chroma_1795388138985.jpg',
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
    beweis_ms400_handbuch_luecke: {
      id: 'beweis_ms400_handbuch_luecke',
      name: 'MS-400-Handbuch (fehlende Seite)',
      category: 'evidence',
      iconName: 'file',
      summary: 'System MS-400: Seite „Bekannte Fehler“ fehlt!',
      detail:
        'Zwischen zehn verlegten Wartungsheften in Kowalskis Werkstatt gefunden: Im Schloss-Handbuch (MS-400) wurde genau die Seite „Bekannte Fehler“ sauber herausgerissen!',
    },
    beweis_vip_waeschefoto: {
      id: 'beweis_vip_waeschefoto',
      name: 'VIP-Foto: Blauer Schal im Wäschewagen',
      category: 'evidence',
      iconName: 'search',
      summary: 'Gerhard von Bergs Schnappschuss vom Vorabend im VIP-Speisesaal.',
      detail:
        'Ein Beschwerdefoto über unordentliche Wäschewagen im VIP-Speisesaal — rechts zwischen den weißen Handtüchern ragt unverkennbar Andrews königsblauer Kreta-Seidenschal hervor!',
    },
    beweis_fundbuero_protokoll: {
      id: 'beweis_fundbuero_protokoll',
      name: 'Fundbüro-Register F-418 (Nicht abgeholt)',
      category: 'evidence',
      iconName: 'receipt',
      summary: 'Blauer Seidenschal eingeliefert — Ausgabe an Crew-internen Abholer?',
      detail:
        'Eintrag F-418: „Königsblauer Seidenschal mit goldener Borte, aus VIP-Wäsche“. Status: NICHT vom Eigentümer abgeholt. Da er kurz darauf als Tatwerkzeug in Zelle 08 hing, führt die Spur direkt zu jemandem mit Crew-Zugang!',
    },
    notiz_nachtdienstplan: {
      id: 'notiz_nachtdienstplan',
      name: 'Nacht-Dienstplan (00:00–04:00 Uhr)',
      category: 'evidence',
      iconName: 'file',
      summary: 'Deck 10 Pool- & Spieldeck wurde um 02:10 Uhr von Kalle Jensen gereinigt.',
      detail:
        'Aus Kapitän Brammers Brücken-Ordner kombiniert: Matrose Kalle Jensen hatte in der Mordnacht genau zwischen 01:55 und 02:35 Uhr Schicht auf dem oberen Pool- & Spieldeck.',
    },
    walkman_batterien: {
      id: 'walkman_batterien',
      name: 'Zwei 1,5V-Mignon-Batterien',
      category: 'evidence',
      iconName: 'bolt',
      summary: 'Beschlagnahmte Batterien aus Detective Marstons TV-Fernbedienung.',
      detail:
        'Andrew durfte sie in Kabine 917 auf keinen Fall behalten („Ich bin IT-ler und kein MacGyver!“). Matrose Kalle Jensen sucht genau solche Mignon-Zellen für seinen Walkman.',
    },
    beweis_kalle_aussage: {
      id: 'beweis_kalle_aussage',
      name: 'Zeugenaussage Kalle Jensen (02:12 · Deck 10)',
      category: 'evidence',
      iconName: 'user',
      summary: 'Kalle sah Andrew um 02:12 Uhr oben auf Deck 10 seine Kinder suchen.',
      detail:
        'Mit frischem Walkman-Sound erinnerte sich Matrose Kalle glasklar: Um Punkt 02:12 Uhr fragte ihn ein verzweifelter Vater im grauen Polohemd mit orangem Kragen auf dem Pooldeck nach zwei Jungs!',
    },
    beweis_alibi_laufweg: {
      id: 'beweis_alibi_laufweg',
      name: 'Laufweg-Beweis: 01:58–02:23 Uhr oben an Deck',
      category: 'evidence',
      iconName: 'clock',
      summary: 'Kamera Deck 5 (01:58) -> Zeuge Deck 10 (02:12) -> Kamera Deck 5 (02:23).',
      detail:
        'Die eingetragene Laufweg-Karte widerlegt Falks Deck-2-Mordtheorie vollständig: In dem Zeitfenster konnte Andrew unmöglich ins weit entfernte Unterdeck-Zellenabteil absteigen!',
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
    thought_f3_erledigt_1_wissen: {
      id: 'thought_f3_erledigt_1_wissen',
      title: 'Aufgabe 1 gelöst: Seite „Bekannte Fehler“ fehlt!',
      detail:
        'Im MS-400-Handbuch in Kowalskis Werkstatt wurde genau die Seite „Bekannte Fehler“ absichtlich herausgerissen — jemand hat das angebliche Täterwissen direkt dort entfernt!',
      kind: 'deduction',
    },
    thought_f3_schal_crew_verdacht: {
      id: 'thought_f3_schal_crew_verdacht',
      title: 'Verdacht gegen Crew: Schal lag im Fundbüro!',
      detail:
        'Andrew hat den Schal nicht in die Tasche zurückgesteckt, sondern beim Aufräumen im VIP-Speisesaal mit den Handtüchern verloren. Er landete als Fundstück F-418 im Fundbüro und wurde nicht abgeholt — jemand von der Crew hatte direkten Zugriff!',
      kind: 'deduction',
    },
    thought_f3_erledigt_2_schal: {
      id: 'thought_f3_erledigt_2_schal',
      title: 'Aufgabe 2 gelöst: Schal über Fundbüro verschwunden',
      detail:
        'VIP-Foto -> Wäscherei -> Fundbüro-Register F-418 (nicht abgeholt): Falks Theorie vom selbst mitgebrachten Tatwerkzeug ist widerlegt!',
      kind: 'deduction',
    },
    thought_f3_walkman_batterien: {
      id: 'thought_f3_walkman_batterien',
      title: 'Matrose Kalle braucht zwei 1,5V-Batterien',
      detail:
        'Kalle auf Deck 10 erinnert sich ohne Musik in seinem Walkman an gar nichts. Wo auf dem Schiff gab es doch noch gleich Ärger wegen einkassierter 1,5V-Mignon-Batterien?',
      kind: 'observation',
    },
    thought_f3_erledigt_3_alibi: {
      id: 'thought_f3_erledigt_3_alibi',
      title: 'Aufgabe 3 gelöst: Andrews Alibi auf Deck 10 bewiesen',
      detail:
        'Überwachungskamera Deck 5 (01:58) -> Kalle Jensen auf Deck 10 (02:12) -> Kamera Deck 5 (02:23). Andrew war in der gesamten Mordzeit nachweislich weit entfernt oben an Deck!',
      kind: 'deduction',
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
              text: 'Hm… auf dieser Deck-Tafel stehen zwar alle Bars, Pools, Show-Lounges und das Eis-Bistro, aber natürlich keine privaten Passagierlisten mit Namen.',
            },
            {
              speakerId: 'nate',
              emotion: 'sweating',
              text: 'Hätte mich auch gewundert, wenn hier draußen direkt „Familie Higginson, Deck X“ angeschlagen wäre. Aber wenn Sabine Lindemann gestern die halbe Show moderiert hat und alle Programmpunkte plant, muss sie irgendwo ihren Standort gemeldet haben.',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Ganz genau — und oben auf der Kommandobrücke laufen alle Fäden zusammen! Fragen wir Kapitän Brammer einfach direkt, wohin sich Frau Lindemann verkrochen hat.',
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
              text: 'Also ehrlich… gestern Abend ist Sabine Lindemann gefühlt alle zehn Minuten mit Klemmbrett und Megafon über das Promenadendeck marschiert, als würde ihr das Schiff gehören!',
            },
            {
              speakerId: 'nate',
              emotion: 'sweating',
              text: 'Und ausgerechnet heute Morgen nach dem großen Verhaftungs-Eklat herrscht hier draußen gespenstische Ruhe — nicht einmal ein einziger Event-Flyer flattert herum.',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Sie ist weder an der Reling noch im Musiksalon oder VIP-Salon zu sehen. Komisch… vielleicht brütet sie schon wieder im Geheimen an ihrem nächsten Theaterstück!',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Wenn jemand auf diesem Schiff weiß, in welches Versteck sich Frau Lindemann vor ihren eigenen Folgen zurückgezogen hat, dann Kapitän Brammer oben auf der Kommandobrücke!',
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
              text: 'Ich bin eben jede einzelne Liegestuhlreihe bis hinüber zum Pool-Kiosk abgelaufen und habe sogar hinter den großen Sonnenblenden nachgeschaut — kein Detective Marston weit und breit!',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Und die Kellner mit den Kaffeewagen zucken auch alle nur ratlos mit den Schultern. Offenbar hält sich Frank wirklich ganz bewusst unter Deck versteckt, damit kein Neugieriger Andrew sieht.',
            },
            {
              speakerId: 'eleonore',
              emotion: 'thinking',
              text: 'Aber wie sollen wir ihn bloß finden, wenn Officer Brandt mauert und hier an der frischen Luft niemand etwas weiß?',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Langsam sind wir fast jeden öffentlichen Bereich abgegangen. Wenn wir überall sonst auch nichts erfahren, fragen wir am besten nochmal Sabine Lindemann hinter der Bühne, wer hier an Bord Zugang zu sämtlichen Gästekabinen hat!',
            },
          ],
        },
      ],
      presentRules: [],
      fallbackPresentLines: [
        {
          speakerId: 'eleonore',
          emotion: 'neutral',
          text: 'Dafür gibt es hier an Deck gerade keinen Anhaltspunkt, Nate — heben wir die Akte für jemanden mit Antworten auf!',
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
              text: 'Der Konzertflügel steht geschlossen und friedlich im Morgenlicht. Kaum zu glauben, dass vor kaum drei Tagen hier unsere allererste große Ermittlung an Bord begonnen hat.',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Damals dachten wir nach Anyas Klavierabend tatsächlich noch, ab Kreta beginne endlich unser ruhiger Mittelmeer-Urlaub… Tja, Satz mit X!',
            },
            {
              speakerId: 'nate',
              emotion: 'sweating',
              text: 'Immerhin erinnert mich Anya Brooks daran, wie hartnäckig man manchmal hinsehen muss. Von der Kreuzfahrtmanagerin oder den Higginsons fehlt hier allerdings jede Spur.',
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
              text: 'Ich habe eben kurz hinter die Samtvorhänge an der kleinen Bühne gespäht und sogar beim Barkeeper nachgefragt — hier drin probt heute Morgen niemand.',
            },
            {
              speakerId: 'nate',
              emotion: 'sweating',
              text: 'Für Frau Lindemann ist der kleine Musiksalon nach ihrer gestrigen Ballsaal-Show wahrscheinlich auch schon längst zu unspektakulär geworden…',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Stimmt, die braucht gleich Scheinwerfer und hundert Plätze! Gehen wir hoch auf die Brücke zu Kapitän Brammer — der kriegt garantiert als Erster mit, wo sie ihr nächstes Projekt aufbaut!',
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
              text: 'Hier im Musiksalon steckt er auch nicht… Weder in den roten Polsternischen hinten noch drüben bei den Notenständern.',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Ein abgekämpfter Detective, der nachts um vier einen unschuldigen Gefangenen bei sich unterbringt, wird wohl kaum früh um neun gemütlich Klaviermusik hören.',
            },
            {
              speakerId: 'eleonore',
              emotion: 'sweating',
              text: 'Stimmt wohl… Die beiden hocken garantiert in seiner eigenen Kabine! Aber wie finden wir diese Kabine nur unter all den hunderten Zimmern heraus?',
            },
          ],
        },
      ],
      presentRules: [],
      fallbackPresentLines: [
        {
          speakerId: 'nate',
          emotion: 'neutral',
          text: 'Hier gibt es im Augenblick niemanden, dem wir etwas zeigen könnten.',
        },
      ],
    },

    vip_salon: {
      id: 'vip_salon',
      name: 'VIP-Salon',
      subtitle: 'Ruhige Lounge an Deck',
      backgroundUrl: '/src/assets/images/case2_vip_salon_day_1795181599051.jpg',
      charactersPresent: [],
      hotspots: [
        {
          id: 'hs_f3_vip_vitrine',
          label: 'Neu verglaste Chronometer-Vitrine',
          x: 42,
          y: 34,
          width: 22,
          height: 36,
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Die Schau-Vitrine aus Fall 1 wurde inzwischen fein säuberlich neu verglast — auch wenn der Goldene Schiffs-Chronometer längst als Beweismittel bei den Akten liegt.',
            },
            {
              speakerId: 'maya',
              emotion: 'sweating',
              text: 'Weißt du noch, Nate? Hier drin lag damals nur diese winzige Schutzglocke und Arthur Morgans weingetränkter Erpresserbrief… Ach ja, waren das noch harmlose Zeiten.',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Und genau dorthin reichen heute noch die Ausläufer unseres neuen Falls zurück! Behalten wir jedes alte Detail aus Fall 1 gut im Hinterkopf.',
            },
          ],
        },
      ],
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
              text: 'Im VIP-Salon blättern nur zwei ältere Ehepaare in feinen Bademänteln und schlürfen Darjeeling-Tee. Kein Mucks, kein Show-Getöse.',
            },
            {
              speakerId: 'maya',
              emotion: 'sweating',
              text: 'So ruhig wie hier drin hält Sabine Lindemann es keine drei Minuten am Stück aus! Und von Familie Higginson ist hier mit drei wilden Jungs natürlich auch niemand.',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Recht hast du — fragen wir endlich Kapitän Brammer oben auf der Brücke nach unserer verschwundenen Event-Chefin!',
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
              text: 'Der VIP-Salon ist fast leer… Ein brummiger Kriminalbeamter auf Selbstzahler-Urlaubsbudget lässt sich bestimmt nicht hier oben teuren Champagner servieren.',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Definitiv nicht — Frank regt sich ja schon auf, wenn das Filterkaffee-Wasser im Pappbecher zu lauwarm ist. Und Andrew versteckt er schon gar nicht in der Luxus-Lounge.',
            },
            {
              speakerId: 'eleonore',
              emotion: 'thinking',
              text: 'Dann müssen wir weiter alle Ecken prüfen — oder jemandem vom Schiffspersonal endlich entlocken, wo reguläre Passagier-Listen geführt werden!',
            },
          ],
        },
      ],
      presentRules: [],
      fallbackPresentLines: [
        {
          speakerId: 'nate',
          emotion: 'neutral',
          text: 'Hier sitzt heute Morgen leider niemand, der uns bei der Zeugenbefragung hilft.',
        },
      ],
    },

    bridge: {
      id: 'bridge',
      name: 'Kommandobrücke',
      subtitle: 'Kapitän Brammers Steuerstand',
      backgroundUrl: '/src/assets/images/bridge_deck_1795257794601.jpg',
      charactersPresent: [{ characterId: 'captain' }],
      hotspots: [
        {
          id: 'hs_f3_bridge_dienstplan',
          label: 'Crew-Nachtdienst-Ordner neben dem Logbuch',
          x: 69,
          y: 55,
          width: 22,
          height: 24,
          visibleIfFlag: 'flag_f3_st2_aktiv',
          hideIfFlag: 'flag_f3_pooldeck_offen',
          lines: [
            {
              speakerId: 'eleonore',
              emotion: 'confident',
              text: 'Schau mal genau dorthin neben Kapitän Brammers Logbuch, Nate — da liegt ein dicker blauer Ordner mit der Aufschrift „Nachtwache & Decks-Reinigung 00:00–04:00“!',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Wenn tatsächlich jemand aus der Crew genau um zwei Uhr nachts oben auf dem Pooldeck geputzt hat, dann müsste derjenige Andrew dort begegnet sein! Knacken wir schnell die lose beigelegten Schichtnotizen!',
              startsMiniGameId: 'duty_roster_puzzle',
            },
          ],
        },
      ],
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
              text: 'WAS?! Jetzt parkt dieser Polizist seine Verdächtigen schon eigenmächtig in Privatkabinen?! Woher soll ICH auswendig wissen, auf welchem Deck ein einzelner Urlaubspassagier seine Koffer abgestellt hat?!',
            },
            {
              speakerId: 'captain',
              emotion: 'neutral',
              text: 'Für tausend Kabinenbuchungen hab ich doch wohl Personal im Hotelbetrieb – hier oben auf der Brücke lenke ich dreitausend Tonnen Stahl übers Mittelmeer, verdammt!',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Verstanden, Herr Kapitän — technische und nautische Logbücher laufen über Sie, nicht die Passagier-Zuteilung. Gehen wir systematisch vor: Prüfen wir die Krankenstation oder fragen direkt Frau Lindemann hinter der Bühne, wer die Kabinenpläne führt!',
            },
          ],
        },
        {
          id: 'talk_f3_st2_brammer_dienstplan',
          title: 'Wer hatte in der Mordnacht an den oberen Decks Dienst?',
          speakerId: 'captain',
          requiredFlag: 'flag_f3_st2_aktiv',
          hideIfFlag: 'flag_f3_pooldeck_offen',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Kapitän Brammer, noch eine ganz entscheidende Frage zur Mordnacht: Andrew war zwischen 01:58 und 02:23 Uhr oben an der frischen Luft auf der Suche nach seinen Söhnen. Hatte zu dieser Uhrzeit irgendjemand aus der Decks-Crew Dienst oben auf Deck 10?',
            },
            {
              speakerId: 'captain',
              emotion: 'grumpy',
              text: 'Himmel, schon wieder Nachtschicht-Abfragen?! Erst die Seekarte bis vor Kreta, jetzt jeder Matrose mit Wischmopp! Glauben Sie ernsthaft, ich führe persönlich Buch darüber, wer wann um zwei Uhr früh das Pooldeck schrubbt?!',
            },
            {
              speakerId: 'eleonore',
              emotion: 'confident',
              text: 'Moment mal — dort drüben unter Ihrer blauen Kaffeetasse liegt doch der Nachtdienst-Ordner vom Bootsmann! Dürfen wir kurz in die Notizzettel schauen?',
            },
            {
              speakerId: 'captain',
              emotion: 'neutral',
              text: 'Da drüben auf der Seitenkonsole liegt der unvollständige Putz- und Nachtdienst-Ordner mit den drei losen Schichtnotizen von heute Nacht. Wenn Sie Ihren Kopf benutzen und selbst zusammenpuzzeln wollen, welcher Seemann wo stand — bitteschön!',
              startsMiniGameId: 'duty_roster_puzzle',
            },
          ],
        },
      ],
      presentRules: [],
      fallbackPresentLines: [
        {
          speakerId: 'captain',
          emotion: 'grumpy',
          text: 'Lassen Sie mich auf meiner Brücke mit diesem Papierkram in Ruhe, Sterling — ich muss Kurs auf Malta halten!',
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
              text: '„Gavel Crates“, goldene Pappschilder und ein überdimensionierter Holz-Richterhammer… Die nutzt unsere gestrige Katastrophe tatsächlich als kulissenreifes Entertainment-Programm!',
            },
            {
              speakerId: 'nate',
              emotion: 'sweating',
              text: 'Solange sie mir nicht vor dem nächsten Auftritt heimlich Glitzerkonfetti ins Sakko steckt, will ich nichts gesagt haben… Wobei — zutrauen würde ich es ihr sofort.',
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
              text: 'An der Pinnwand daneben hängen Entwürfe für den „Großen Seetag-Showdown“ — mit fett eingekreistem Uhrzeit-Slot um 19:30 Uhr und drei Ausrufezeichen.',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Oh oh… wenn wir bis heute Abend keine echten Beweise für Andrews Unschuld liefern, verwandelt sie das hier in ein Live-Drama auf unsere Kosten!',
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
              text: 'Überall auf dem Teppich liegen aufgeschlagene Piraten-Malbücher, abgebrochene Wachsmalstifte und ein halbes Pfund zerbröselter Salzcracker!',
            },
            {
              speakerId: 'nate',
              emotion: 'sweating',
              text: 'Ich glaube, genau hier entsteht gerade Leos detaillierter Schlachtplan zur Kaperung des Kinderclubs. Respekt vor jeder Mutter auf diesem Schiff!',
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
              text: 'Da leuchtet Conrads kleiner blauer Rucksack am Stuhlbein – nach der großen Rettungsboot-Jagd gestern Mittag zum Glück wieder sicher bei seinem stolzen Besitzer.',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Und wenn ich es recht spüre, stecken darin mindestens drei Ersatz-Spielzeugautos, eine angefangene Saftflasche und bestimmt zwanzig Steine von Kreta!',
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
              text: 'T-Shirts, bunte Socken, Badeshorts und Schlafanzüge quellen aus jedem Winkel des offenen Koffers… Es grenzt an ein Wunder, dass all das in einer Kabine Platz hat.',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Bei drei quirligen Jungs auf einer Seereise darf man offenbar kein einziges Mal die Augen schließen — sonst verschwinden nicht nur die Socken, sondern auch gleich die Besitzer dazu!',
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
              emotion: 'sweating',
              text: 'Hören Sie auf, sich die Schuld zu geben, Sie zwei! Ich hab heute Nacht zwar auch nur geweint, aber eines steht fest: Ohne Ihren Kampf gestern Abend hätten sie Arthur Morgans Tod doch längst als Selbstmord abgehakt — und mein Mann ist KEIN Mörder!',
            },
            {
              speakerId: 'eleonore',
              emotion: 'neutral',
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
              text: 'Alles voll im Griff, Nate! Na ja… fast! Leo hat eben das halbe Sofa zur „Black Pearl“ erklärt, Rick kontrolliert mit seiner silbernen Stoppuhr auf die Sekunde genau, ob du bald wiederkommst, und Conrad füttert seinen grünen Dino mit Orangenstücken!',
            },
            {
              speakerId: 'nate',
              emotion: 'sweating',
              text: 'Klingt… lebhaft! Bist du sicher, dass du bis zur Abendverhandlung durchhältst? Ich kann sonst versuchen, uns schnell zwischendurch einen großen Eimer Kaffee hochzuschicken.',
            },
            {
              speakerId: 'maya',
              emotion: 'sweating',
              text: 'Kaffee wäre super — oder gleich eine schusssichere Schürze gegen fliegende Saftpäckchen! Jetzt geh schon, Partner — hol Andrew frei!',
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
              text: 'Ganz tief durchatmen, Eleonore!! Sehen Sie genau hin: Die Decke auf der Pritsche ist glatt gestrichen, der Becher unbenutzt und das MS-400-Schloss war von außen verriegelt. Hier hat weder ein Kampf noch ein Verbrechen stattgefunden!',
            },
            {
              speakerId: 'eleonore',
              emotion: 'sweating',
              backgroundOverrideUrl: '/src/assets/images/cell_08_inside_1795211919808.jpg',
              text: 'Meinen Sie wirklich…? Aber warum sitzt er dann nicht hier, wenn Officer Brandt direkt vorn an der Tür steht?!',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Genau das finden wir jetzt sofort heraus — knöpfen wir uns Officer Brandt vor!',
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
              text: '(Der bewegt keinen Millimeter, wenn Sie mit ihm streiten, Nate… Lassen Sie mich es einmal ganz menschlich als Ehefrau versuchen!)',
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
              text: 'Wir wollten den Kerl hier unten doch auf keinen Fall in die Zelle mit dem MS-400-Schloss sperren, nachdem er gestern vor zweihundert Zeugen geprahlt hat, wie leicht man genau diese Tür in 7 Sekunden knackt!! Fragen Sie Detective Marston — er hat den Gefangenen selbst übernommen. Mehr sag ich nicht!',
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
      hotspots: [
        {
          id: 'hs_f3_infirmary_labor',
          label: 'Toxikologie-Schrank & Patienten-Terminal',
          x: 64,
          y: 42,
          width: 24,
          height: 36,
          lines: [
            {
              speakerId: 'eleonore',
              emotion: 'thinking',
              text: 'Das ist also das Labor-Terminal, an dem Dr. Vance gestern endlich die Betäubungsmittel in Arthur Morgans Blut nachgewiesen hat!',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Ohne dieses späte Labor-Panel hätte das Gericht den Selbstmord niemals als Mord anerkannt. Immerhin arbeitet die Ärztin sauber — auch wenn sie jetzt leider nicht weiß, wo Marston seinen Gast untergebracht hat.',
            },
          ],
        },
      ],
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
              text: 'Entschuldigen Sie die Störung am frühen Morgen, Frau Doktor! Haben Sie Detective Marston oder meinen Mann Andrew heute irgendwann hier unten gesehen?',
            },
            {
              speakerId: 'vance',
              emotion: 'neutral',
              setsFlag: 'flag_f3_check_infirmary',
              text: 'Nein, leider überhaupt nicht, Mrs. Higginson. Nach dem gestrigen Tribunal hat sich weder der Detective noch irgendjemand sonst aus der Ermittlungsgruppe hier gemeldet.',
            },
            {
              speakerId: 'vance',
              emotion: 'thinking',
              text: 'Ganz ehrlich — so plötzlich, wie Staatsanwalt von Falk gestern nach dem ersten Beweis eine Pause erzwang und Ihren Mann verhaften ließ, war das sogar mir als Ärztin ziemlich unheimlich. Aber private Passagierkabinen stehen nicht in meinen Behandlungsakten.',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Danke für Ihre Offenheit, Dr. Vance. Keiner an Deck, niemand im VIP- oder Musiksalon, weder Kapitän Brammer noch Dr. Vance… Gehen wir am besten zurück zu Sabine Lindemann hinter der Bühne — sie weiß sicher, wer die normalen Kabinenpläne verwaltet!',
            },
          ],
        },
      ],
      presentRules: [],
      fallbackPresentLines: [
        {
          speakerId: 'vance',
          emotion: 'neutral',
          text: 'Medizinisch sehe ich hierbei leider keinerlei Zusammenhang — damit muss Ihnen jemand anderes helfen.',
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
        {
          id: 'talk_f3_st2_miriam_ungewoehnlich',
          title: 'Gab es gestern Abend noch irgendetwas Ungewöhnliches an Bord?',
          speakerId: 'miriam',
          requiredFlag: 'flag_f3_st2_aktiv',
          hideIfFlag: 'flag_f3_vip_speisesaal_offen',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Hallo Miriam! Sagen Sie mal, abseits von Kabinenlisten: Gab es gestern Abend kurz vor oder nach der Show irgendwelche Beschwerden oder ungewöhnliche Vorfälle bei Ihnen am Schalter?',
            },
            {
              speakerId: 'miriam',
              emotion: 'sweating',
              text: 'Oh, fragen Sie bloß nicht… Ein einziger Gast hat mir gestern kurz vor Schließung fast die Marmorplatte zerkratzt! Herr Gerhard von Berg — sitzt drüben im VIP-Speisesaal!',
            },
            {
              speakerId: 'eleonore',
              emotion: 'thinking',
              text: 'Gerhard von Berg? Worüber hat er sich denn so schrecklich aufgeregt?',
            },
            {
              speakerId: 'miriam',
              emotion: 'neutral',
              unlocksLocation: 'vip_dining',
              setsFlag: 'flag_f3_vip_speisesaal_offen',
              text: 'Oh, über so ziemlich alles! Dieser Mann fotografiert schon seit dem allerersten Tag unserer Kreuzfahrt jede kleinste Unordnung für seine große Sammelbeschwerde an die Reederei ab — natürlich auch gestern Abend beim späten Abräumen im VIP-Speisesaal! Wenn Sie dort rübergehen wollen, machen Sie sich auf knurrigste Laune gefasst…',
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
              text: 'Das Batteriefach ist komplett leer geräumt und der kleine Plastikdeckel liegt akkurat daneben auf dem Nachttisch… Detective Marston geht offenbar absolut kein Risiko ein.',
            },
            {
              speakerId: 'andrew',
              emotion: 'grumpy',
              text: 'Schauen Sie mich nicht so an, Nate! Ich wollte bloß ganz friedlich die Nachmittagswiederholung vom Wetterbericht anmachen — nicht die MS Aurora hacken!',
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
              text: 'Da oben auf der grauen Mappe steht sogar noch sein großer Kaffee-Becher der „Police Academy“! Daneben liegen Kopien der alten Bordakten von Fall 1.',
            },
            {
              speakerId: 'marston',
              emotion: 'grumpy',
              text: 'Hände weg von meinem Schreibkram, meine Herrschaften — ich gehe hier in Ruhe die alten Unterlagen noch einmal durch, falls dieser rote Brief doch mehr Fäden spinnt als gedacht.',
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
              emotion: 'sweating',
              shake: true,
              text: 'ANDREW!! GOTT SEI DANK, DIR GEHT ES GUT!! Ich hab halb Heraklion und das ganze Unterdeck nach dir umgekrempelt, als Zelle 08 komplett leer stand!!',
            },
            {
              speakerId: 'andrew',
              emotion: 'neutral',
              text: 'Eleonore?! Meine Güte, wie schön es ist, dich hier zu sehen!!',
            },
            {
              speakerId: 'andrew',
              emotion: 'grumpy',
              shake: true,
              text: 'Und SIE, Mr. Sterling!! Da hilft man Ihnen einmal gutmütig aus der Patsche, erklärt der halben Welt dieses verflixte Schloss — und was hat man davon?! Zack, eingesperrt unter Bewachung!!',
            },
            {
              speakerId: 'nate',
              emotion: 'sweating',
              text: 'Es tut mir wirklich unendlich leid, Andrew… Maya und ich haben kein Auge zugemacht und holen Sie da heute noch raus, versprochen!',
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
              emotion: 'grumpy',
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
        {
          id: 'talk_f3_st2_marston_batterien',
          title: 'Frank, könnten wir kurz Ihre TV-Batterien ausleihen?!',
          speakerId: 'marston',
          requiredFlag: 'flag_f3_kalle_braucht_batterien',
          hideIfFlag: 'flag_f3_batterien_geholt',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Frank, perfektes Timing! Wissen Sie noch die zwei 1,5-Volt-Mignon-Batterien, die Sie Andrew aus der Fernseh-Fernbedienung beschlagnahmt haben?',
            },
            {
              speakerId: 'andrew',
              emotion: 'grumpy',
              shake: true,
              text: 'MOMENT MAL!! Wofür zum Teufel braucht IHR zwei jetzt plötzlich meine Batterien?! Vor zehn Minuten war ich noch angeblich MacGyver — und jetzt wollt Ihr selbst damit herumfummeln?!',
            },
            {
              speakerId: 'eleonore',
              emotion: 'confident',
              text: 'Ganz ruhig, Schatz! Oben auf dem Pooldeck steht ein todmüder Nachtschicht-Matrose namens Kalle, dessen Walkman genau diese zwei Mignon-Zellen braucht, damit er sich an dein 02:12-Uhr-Alibi erinnert!',
            },
            {
              speakerId: 'marston',
              emotion: 'grumpy',
              unlocksEvidence: 'walkman_batterien',
              setsFlag: 'flag_f3_batterien_geholt',
              text: 'Grummel… na schön. Wenn Mr. Higginson hier drinnen fest versprochen seine Finger von meinen Geräten lässt und die Dinger sofort aufs Oberdeck wandern, rück ich sie raus. Hier — zwei frische 1,5V-Zellen für Kalles Walkman!',
            },
          ],
        },
        {
          id: 'talk_f3_st2_marston_aufgabe4',
          title: 'Frank: Gibt es schon etwas Neues zu Arthur Morgans „A. H.“-Brief?',
          speakerId: 'marston',
          requiredFlag: 'flag_f3_st2_aktiv',
          lines: [
            {
              speakerId: 'marston',
              emotion: 'grumpy',
              text: 'Ich hänge hier seit Stunden am grauenhaften Bordnetz, Nate — aus Heraklion liegt bislang noch keine Rückmeldung zu Arthur Morgans Überweisungen vor. Bei den Hafenbanken auf Kreta dauert das leider bis morgen.',
            },
            {
              speakerId: 'nate',
              emotion: 'sweating',
              text: 'Mist! Genau auf diesem weingetränkten 45.000-€-Brief aus Anyas Fall — „Letzte Frist: 45.000 Euro bis zum Einlaufen auf Kreta…“ — baut Staatsanwalt von Falk heute Abend seine gesamte Motiv-Anklage gegen Andrew auf!',
            },
            {
              speakerId: 'marston',
              emotion: 'confident',
              text: 'Wenn mich mein alter Spürsinn nicht völlig trügt, stimmt an der „A. H.“-Deutung irgendetwas ganz gewaltig nicht! Falls Falk heute Abend wirklich wieder mit diesem Zettel wedelt, müsst Ihr Verteidiger Euch als Nächstes noch einmal ganz genau die Original-Beweise aus Fall 1 vornehmen — jedes Papier, jede Zahlungsnotiz, jede Spur vom Chronometer-Diebstahl!',
            },
            {
              speakerId: 'eleonore',
              emotion: 'thinking',
              text: 'Die Original-Beweise aus Fall 1 noch einmal von vorn prüfen… Verstanden, Detective! Für heute Abend bleibt Aufgabe 4 also leider noch offen — umso wichtiger, dass wir die anderen drei Beweise restlos zerschlagen!',
            },
          ],
        },
      ],
      presentRules: [],
      fallbackPresentLines: [
        {
          speakerId: 'marston',
          emotion: 'grumpy',
          text: 'Hebt das erstmal sicher bei euch in der Akte auf — ich hab hier drin schon genug Papierkram am Hals!',
        },
      ],
    },

    switchroom: {
      id: 'switchroom',
      name: 'Schaltzentrale & Bordtechnik',
      subtitle: 'Technik-Werkstatt bei Elektriker Lars Kowalski',
      backgroundUrl: '/src/assets/images/scene_ship_switchroom_1795276701791.jpg',
      charactersPresent: [{ characterId: 'electrician' }],
      hotspots: [
        {
          id: 'hs_f3_kowalski_werkbank',
          label: 'Kowalskis unordentliche Werkbank voller Handbücher',
          x: 20,
          y: 52,
          width: 34,
          height: 36,
          visibleIfFlag: 'flag_f3_kowalski_erlaubnis',
          hideIfFlag: 'flag_f3_aufgabe1_erledigt',
          lines: [
            {
              speakerId: 'eleonore',
              emotion: 'confident',
              text: 'Da drüben unter Kabelrollen, Lüftergittern und Werkzeugkästen stecken tatsächlich überall dicke technische Broschüren!',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Suchen wir alle zehn verstreuten Wartungshandbücher zusammen und prüfen dann ganz in Ruhe die korrekte Schloss-Dokumentation!',
              startsMiniGameId: 'kowalski_books_hidden',
            },
          ],
        },
      ],
      talkTopics: [
        {
          id: 'talk_f3_st2_kowalski_handbuch',
          title: 'War der 7-Sekunden-Trick am MS-400 wirklich so geheim?',
          speakerId: 'electrician',
          hideIfFlag: 'flag_f3_kowalski_erlaubnis',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Hallo Herr Kowalski! Kurze Frage zu gestern Abend: Staatsanwalt von Falk behauptet ja, außer Andrew hätte niemand an Bord jemals von diesem 7-Sekunden-Reset-Trick des MS-400-Schlosses gewusst. Stimmt das wirklich — nicht einmal in Ihren technischen Unterlagen?',
            },
            {
              speakerId: 'electrician',
              emotion: 'sweating',
              text: 'Na hören Sie mal, Herr Anwalt! Wissen Sie überhaupt, wie viele Maschinen, Pumpen, Klimageräte und Schloss-Module auf so einem verdammten Kreuzfahrtschiff laufen?! Ich kann doch unmöglich alle hundert Geräte-Handbücher auswendig im Kopf haben!',
            },
            {
              speakerId: 'eleonore',
              emotion: 'confident',
              text: 'Moment mal — Sie meinen, theoretisch könnten solche bekannten Systemfehler durchaus ganz normal in einem Ihrer Wartungshandbücher stehen?!',
            },
            {
              speakerId: 'electrician',
              emotion: 'neutral',
              setsFlag: 'flag_f3_kowalski_erlaubnis',
              text: 'Klar doch, wenn der Hersteller Fehler-Nachträge mitschickt! Schauen Sie meinetwegen einfach selber nach — irgendwo da drüben in meinen Regalen, Kisten und auf der Werkbank fliegen noch zehn einzelne Geräte-Handbücher herum!',
              choices: [
                {
                  label: 'Sofort die 10 Handbücher in der Werkstatt zusammensuchen!',
                  nextLines: [
                    {
                      speakerId: 'nate',
                      emotion: 'confident',
                      text: 'Packen wir’s an, Eleonore! Suchen wir jedes einzelne der zehn Handbücher zusammen und prüfen die Schloss-Akte!',
                      startsMiniGameId: 'kowalski_books_hidden',
                    },
                  ],
                },
                {
                  label: 'Erstmal noch andere Stellen auf dem Schiff ansehen',
                  nextLines: [
                    {
                      speakerId: 'nate',
                      emotion: 'neutral',
                      text: 'Danke, Herr Kowalski — die Werkbank läuft uns ja nicht weg!',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 'talk_f3_st2_kowalski_werkbank_direkt',
          title: 'Die 10 Handbücher auf der Werkbank durchsuchen',
          speakerId: 'eleonore',
          requiredFlag: 'flag_f3_kowalski_erlaubnis',
          hideIfFlag: 'flag_f3_aufgabe1_erledigt',
          lines: [
            {
              speakerId: 'eleonore',
              emotion: 'confident',
              text: 'Gehen wir zurück an Kowalskis Werkbank und sammeln alle zehn verstreuten Wartungshefte ein — irgendwo darunter steckt die Antwort!',
              startsMiniGameId: 'kowalski_books_hidden',
            },
          ],
        },
        {
          id: 'talk_f3_st2_kowalski_fehlende_seite',
          title: 'Kowalski auf die herausgerissene Fehler-Seite ansprechen',
          speakerId: 'electrician',
          requiredFlag: 'flag_f3_aufgabe1_erledigt',
          lines: [
            {
              speakerId: 'electrician',
              emotion: 'shocked',
              text: 'Himmel… ich fass es nicht! Da fehlt ja wirklich sauber herausgetrennt die komplette Seite „Bekannte Fehler“! Schauen Sie sich nur diese saubere Risskante an den Heftklammern an!',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Herr Kowalski, wann haben Sie das MS-400-Heft das letzte Mal selbst benutzt? Und wer hat außer Ihnen überhaupt Zutritt zu dieser Schaltzentrale?',
            },
            {
              speakerId: 'electrician',
              emotion: 'sweating',
              text: 'Na… tagsüber schaut hier hin und wieder mal ein Sicherheitsmann oder Offizier rein, wenn wir Sicherungs-Checks machen… Und abends vor zwei Tagen war mein Werkstattschrank unverschlossen! Dass sich jemand genau DIESE eine Seite geklaut hat, läuft mir echt eiskalt den Rücken runter!',
            },
            {
              speakerId: 'eleonore',
              emotion: 'confident',
              text: 'Damit ist eines vor Gericht glasklar: Das „geheime“ Täterwissen stand schwarz auf weiß in der Schiffstechnik — bis der echte Mörder die Seite entfernt hat!',
            },
          ],
        },
      ],
      presentRules: [],
      fallbackPresentLines: [
        {
          speakerId: 'electrician',
          emotion: 'neutral',
          text: 'Mit so Papierkram kenn ich mich nicht aus — suchen Sie lieber selbst bei den Handbüchern auf der Werkbank!',
        },
      ],
    },

    vip_dining: {
      id: 'vip_dining',
      name: 'VIP-Speisesaal',
      subtitle: 'Exklusiver Speisesaal · Bereich von Gerhard von Berg',
      backgroundUrl: '/src/assets/images/bg_f3_vip_dining_1795388140537.jpg',
      charactersPresent: [{ characterId: 'vip_guest' }],
      hotspots: [
        {
          id: 'hs_f3_vip_servierwagen',
          label: 'Drei chaotisch blockierte Servierwagen im Gang',
          x: 52,
          y: 52,
          width: 28,
          height: 36,
          hideIfFlag: 'flag_f3_vip_aufgeraeumt',
          lines: [
            {
              speakerId: 'eleonore',
              emotion: 'confident',
              text: 'Kein Wunder, dass Herr von Berg kurz vor einem Wutanfall steht — drei volle Servierwagen stehen komplett quer zwischen den Tischen!',
            },
            {
              speakerId: 'nate',
              emotion: 'sweating',
              text: 'Und ohne Ordnung im Gang verrät er uns kein Sterbenswort. Zeigen wir ihm, wie schnell wir die drei Wagen sauber in die Nischen rechts bugsieren!',
              startsMiniGameId: 'vip_sokoban',
            },
          ],
        },
        {
          id: 'hs_f3_vip_tablet',
          label: 'Gerhard von Bergs Beschwerde-Tablet',
          x: 20,
          y: 58,
          width: 22,
          height: 24,
          visibleIfFlag: 'flag_f3_vip_aufgeraeumt',
          hideIfFlag: 'flag_f3_vip_foto_gefunden',
          lines: [
            {
              speakerId: 'eleonore',
              emotion: 'thinking',
              text: 'Da drüben neben dem Silberteller liegt sein großes Tablet mit den Beschwerde-Fotos von gestern Abend.',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Blättern wir einfach ganz unbefangen auf gut Glück durch alle Aufnahmen — vielleicht steckt zwischen den Tischen und Wagen ja doch irgendein verräterisches Detail!',
              startsMiniGameId: 'vip_photo_search',
            },
          ],
        },
      ],
      talkTopics: [
        {
          id: 'talk_f3_st2_vip_erstkontakt',
          title: 'Mit Herrn von Berg über gestern Abend sprechen',
          speakerId: 'vip_guest',
          hideIfFlag: 'flag_f3_vip_aufgeraeumt',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'neutral',
              text: 'Guten Tag, Herr von Berg! An der Rezeption hieß es, Sie hätten die ganze Reise über jede kleine Panne an Bord fotografisch dokumentiert…',
            },
            {
              speakerId: 'vip_guest',
              emotion: 'grumpy',
              shake: true,
              text: 'WAS?! Noch mehr Neugierige, während man hier über verlassene Servierwagen stolpert?! Sehen Sie sich dieses Elend doch an!! Seit einer Stunde stehen hier im gesamten Speisesaal die Wagen kreuz und quer herum!',
            },
            {
              speakerId: 'vip_guest',
              emotion: 'grumpy',
              text: 'Schaffen Sie hier im Saal erstmal ordentlich Ordnung und bringen diese blockierten Servierwagen an ihren Platz! Vorher bekommen Sie von mir weder eine Auskunft noch einen einzigen Blick auf meine Fotos!!',
            },
            {
              speakerId: 'eleonore',
              emotion: 'confident',
              text: 'Pah! Ein paar Servierwagen einparken ist nach drei Jungs zu Hause doch reines Aufwärmen! Lassen Sie mich mal kurz ran, Nate!',
              choices: [
                {
                  label: 'Eleonore räumt im VIP-Speisesaal auf!',
                  nextLines: [
                    {
                      speakerId: 'eleonore',
                      emotion: 'confident',
                      text: 'Packen wir es an — stellen wir die blockierten Servierwagen sauber an die Wand!',
                      startsMiniGameId: 'vip_sokoban',
                    },
                  ],
                },
                {
                  label: 'Erstmal noch warten',
                  nextLines: [
                    {
                      speakerId: 'nate',
                      emotion: 'sweating',
                      text: 'Gleich erledigen wir das für Sie, Herr von Berg!',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 'talk_f3_st2_vip_fotos',
          title: 'Auf gut Glück seine Beschwerde-Fotos von der Reise ansehen',
          speakerId: 'vip_guest',
          requiredFlag: 'flag_f3_vip_aufgeraeumt',
          hideIfFlag: 'flag_f3_vip_foto_gefunden',
          lines: [
            {
              speakerId: 'vip_guest',
              emotion: 'neutral',
              text: 'Nun gut — da wenigstens wieder Ordnung im Saal herrscht, werfen Sie meinetwegen auf gut Glück einen kurzen Blick auf meine zehn Beschwerdefotos von der gesamten Reise. Aber zerkratzen Sie bloß nicht mein Display!',
              startsMiniGameId: 'vip_photo_search',
            },
          ],
        },
        {
          id: 'talk_f3_st2_vip_nach_foto',
          title: 'Wohin wurde der Handtuch-Wagen auf dem Wäschefoto gerollt?',
          speakerId: 'vip_guest',
          requiredFlag: 'flag_f3_vip_foto_gefunden',
          lines: [
            {
              speakerId: 'vip_guest',
              emotion: 'neutral',
              text: 'Diese junge Dame aus der Bord-Wäscherei — eine gewisse Elara Novak — hat die ganzen nassen weißen VIP-Handtücher noch vor Mitternacht eingesammelt.',
            },
            {
              speakerId: 'vip_guest',
              emotion: 'grumpy',
              text: 'Unmöglich lautes Räderquietschen machte das Teil übrigens auch! Sie schob diesen klappernden Rollwagen direkt zum Lastenaufzug und hinunter in die große Bord-Wäscherei!',
            },
            {
              speakerId: 'eleonore',
              emotion: 'confident',
              text: 'Eine gewisse Elara Novak in der Bord-Wäscherei — genau sie müssen wir fragen, was sie beim Ausladen zwischen all den weißen Handtüchern gefunden hat!',
            },
          ],
        },
      ],
      presentRules: [],
      fallbackPresentLines: [
        {
          speakerId: 'vip_guest',
          emotion: 'grumpy',
          text: 'Belästigen Sie mich nicht mit Ihren Zetteln, ich prüfe hier meine Tafelmusik!',
        },
      ],
    },

    laundry: {
      id: 'laundry',
      name: 'Bord-Wäscherei',
      subtitle: 'Großwäscherei unter Deck · bei Elara Novak',
      backgroundUrl: '/src/assets/images/bg_f3_laundry_1795388140064.jpg',
      charactersPresent: [{ characterId: 'laundry_worker' }],
      hotspots: [
        {
          id: 'hs_f3_waesche_trommeln',
          label: 'Dampfende Industrie-Waschtrommeln',
          x: 18,
          y: 38,
          width: 32,
          height: 38,
          lines: [
            {
              speakerId: 'nate',
              emotion: 'sweating',
              text: 'Was für gewaltige Stahl-Trommeln… Hier drin kocht jeden Abend die gesamte Tischwäsche eines halben Luxusdampfers auf neunzig Grad.',
            },
            {
              speakerId: 'eleonore',
              emotion: 'shocked',
              text: 'Gar nicht auszudenken, was mit meinem Kreta-Seidenschal passiert wäre, wenn Elara ihn nicht rechtzeitig vor dem Einschalten aus dem weißen Berg herausgefischt hätte!',
            },
          ],
        },
        {
          id: 'hs_f3_waesche_sortiertisch',
          label: 'Sortiertisch für Fundstücke & feine Tücher',
          x: 62,
          y: 62,
          width: 26,
          height: 24,
          lines: [
            {
              speakerId: 'eleonore',
              emotion: 'confident',
              text: 'Hier liegen Brillen, Manschettenknöpfe und Broschen ordentlich auf blauen Samttüchern vorsortiert — hier wird wirklich jede Kleinigkeit vor der Wäsche aussortiert.',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Kein Zufall also, dass Elara Novak auch den königsblauen Schal genau gesehen hat. Reden wir mit ihr über seinen weiteren Weg!',
            },
          ],
        },
      ],
      talkTopics: [
        {
          id: 'talk_f3_st2_elara_waesche',
          title: 'Haben Sie gestern im VIP-Wäschewagen ein blaues Tuch gefunden?',
          speakerId: 'laundry_worker',
          hideIfFlag: 'flag_f3_fundbuero_offen',
          lines: [
            {
              speakerId: 'eleonore',
              emotion: 'confident',
              text: 'Hallo Elara! Wir haben da eine ganz bestimmte Frage zu Ihrer späten Fuhre aus dem VIP-Speisesaal gestern Abend — dieses Foto zeigt einen blauen Seidenschal mitten in den feuchten Handtüchern!',
            },
            {
              speakerId: 'laundry_worker',
              emotion: 'confident',
              text: 'Ach!! NATÜRLICH erinnere ich mich an genau dieses edle blaue Tuch mit den kleinen goldenen Fäden! Ich wollte schon die Kochwäsche starten, da zog ich den Schal im allerletzten Moment aus dem großen Handtuch-Berg!',
            },
            {
              speakerId: 'nate',
              emotion: 'shocked',
              text: 'Gott sei Dank haben Sie ihn rechtzeitig bemerkt! Und was haben Sie danach mit dem blauen Schal gemacht — ihn etwa oben abgegeben?',
            },
            {
              speakerId: 'laundry_worker',
              emotion: 'neutral',
              unlocksLocation: 'lost_found',
              setsFlag: 'flag_f3_fundbuero_offen',
              text: 'Genau wie es Vorschrift ist: Ich habe ihn fein säuberlich aufgehängt, kurz trocknen lassen und persönlich noch am selben Abend ins schiffsinterne Fundbüro gebracht! Dort wird jede Abgabe sauber mit Nummer eingetragen — schauen Sie direkt mal ins Protokoll!',
            },
          ],
        },
        {
          id: 'talk_f3_st2_elara_bestaetigt',
          title: 'Elara: Wie sicher ist die Ablieferung im Fundbüro?',
          speakerId: 'laundry_worker',
          requiredFlag: 'flag_f3_fundbuero_offen',
          lines: [
            {
              speakerId: 'laundry_worker',
              emotion: 'confident',
              text: 'Hundertprozentig sicher! Ich habe den feinen blauen Schal dort im Fundbüro selbst über den Holztresen gereicht und noch zugesehen, wie die Nummer mit Füller ins große Register eingetragen wurde!',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Wissen Sie zufällig noch die ungefähre Uhrzeit oder ob sonst jemand im Flur vor der Fundkammer unterwegs war?',
            },
            {
              speakerId: 'laundry_worker',
              emotion: 'neutral',
              text: 'Das war kurz vor Mitternacht — im Gang war alles totenstill, nur ganz am Ende der Schicht lief noch jemand vom Bordpersonal Richtung Personaltreppe. Im Buch selbst steht die genaue Registrierungs-Nummer auf alle Fälle drin!',
            },
          ],
        },
      ],
      presentRules: [
        {
          evidenceId: 'beweis_vip_waeschefoto',
          hideIfFlag: 'flag_f3_fundbuero_offen',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Schauen Sie mal auf dieses Foto von gestern Abend im VIP-Speisesaal — erkennen Sie dieses blaue Seidentuch zwischen Ihren weißen Handtüchern?',
            },
            {
              speakerId: 'laundry_worker',
              emotion: 'confident',
              unlocksLocation: 'lost_found',
              setsFlag: 'flag_f3_fundbuero_offen',
              text: 'Ja klar, das ist ja derselbe königsblaue Seidenschal! Ich hab ihn damals sofort rausgezogen, bevor die Trommeln angingen, und noch am selben Abend brav unten im Fundbüro abgegeben! Prüfen Sie dort einfach das Ausgabe-Protokoll!',
            },
          ],
        },
      ],
      fallbackPresentLines: [
        {
          speakerId: 'laundry_worker',
          emotion: 'neutral',
          text: 'Tut mir leid, das gehört nicht zu meinen Wäschekörben — schauen Sie lieber beim VIP-Foto oder im Fundbüro weiter!',
        },
      ],
    },

    lost_found: {
      id: 'lost_found',
      name: 'Schiffs-Fundbüro',
      subtitle: 'Lagerkammer & Fund-Protokollbuch',
      backgroundUrl: '/src/assets/images/bg_f3_lost_found_1795388139951.jpg',
      charactersPresent: [],
      hotspots: [
        {
          id: 'hs_f3_fundbuero_buch',
          label: 'Offenes Fundbüro-Protokollbuch auf dem Tresen',
          x: 48,
          y: 66,
          width: 28,
          height: 22,
          hideIfFlag: 'flag_f3_aufgabe2_erledigt',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Da liegt das dicke ledergebundene Fundbüro-Register offen auf dem Tresen! Alle Abgaben und Ausgaben sind hier sauber nummeriert.',
            },
            {
              speakerId: 'eleonore',
              emotion: 'thinking',
              text: 'Gehen wir die letzten Seiten Eintrag für Eintrag durch — finden wir Andrews blauen Kreta-Seidenschal und prüfen seinen Status!',
              startsMiniGameId: 'fundbuero_log',
            },
          ],
        },
        {
          id: 'hs_f3_fundbuero_regal',
          label: 'Nummerierte Fundregale an der Rückwand',
          x: 18,
          y: 26,
          width: 24,
          height: 44,
          lines: [
            {
              speakerId: 'eleonore',
              emotion: 'thinking',
              text: 'Strohüte, Designer-Sonnenbrillen, goldene Armbanduhren und Kinderspielzeug in sauberen Fächern… Und dazwischen prangt ein leeres Fach mit dem kleinen Papierzettel F-418!',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Genau aus diesem Regal ist der Schal also verschwunden — nachdem er zuvor von der Wäscherei ordnungsgemäß eingebucht wurde! Und nach Dienstschluss kommt hier nur Personal mit Masterschlüssel hinein.',
            },
          ],
        },
      ],
      talkTopics: [
        {
          id: 'talk_f3_st2_fundbuero_pruefen',
          title: 'Das Fundbüro-Register Eintrag für Eintrag durchgehen',
          speakerId: 'nate',
          hideIfFlag: 'flag_f3_aufgabe2_erledigt',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Schauen wir uns das große Fundbüro-Protokollbuch genau an: Wurde der Schal eingetragen — und hat ihn jemals ein Passagier abgeholt?',
              startsMiniGameId: 'fundbuero_log',
            },
          ],
        },
        {
          id: 'talk_f3_st2_fundbuero_nachlese',
          title: 'Schlussfolgerung aus Eintrag F-418 rekapitulieren',
          speakerId: 'eleonore',
          requiredFlag: 'flag_f3_aufgabe2_erledigt',
          lines: [
            {
              speakerId: 'eleonore',
              emotion: 'confident',
              text: 'Eintrag F-418 steht schwarz auf weiß als NICHT ABGEHOLT im Buch! Und im Regal selbst ist das Fach komplett leer!',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Das bedeutet doppelt Schlechtes für Staatsanwalt von Falk: Erstens hat Andrew niemals ein „Tatwerkzeug“ mit in die Zelle geschleppt — er hatte den Schal harmlos im VIP-Speisesaal mit den Handtüchern verloren.',
            },
            {
              speakerId: 'eleonore',
              emotion: 'thinking',
              text: 'Und zweitens: Da der Schal ohne Abhol-Quittung aus dieser verschlossenen Kammer verschwand und kurz darauf in Zelle 08 hing, muss sich jemand mit Crew-Zugang hier bedient haben!',
            },
          ],
        },
      ],
      presentRules: [],
      fallbackPresentLines: [
        {
          speakerId: 'eleonore',
          emotion: 'neutral',
          text: 'Hier im stillen Fundbüro ist gerade niemand außer uns zweien, Nate.',
        },
      ],
    },

    pool_deck: {
      id: 'pool_deck',
      name: 'Pool- & Oberdeck · Deck 10',
      subtitle: 'Frische Seeluft · Nachtschicht-Matrose Kalle Jensen',
      backgroundUrl: '/src/assets/images/bg_f3_pool_deck_1795388140094.jpg',
      charactersPresent: [{ characterId: 'sailor_kalle' }],
      hotspots: [
        {
          id: 'hs_f3_pooldeck_karte',
          label: 'Decks-Übersichtsplan am Pool-Eingang',
          x: 78,
          y: 36,
          width: 18,
          height: 36,
          visibleIfFlag: 'flag_f3_kalle_aussage_erhalten',
          hideIfFlag: 'flag_f3_aufgabe3_erledigt',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Da hängt die große beleuchtete Decks-Querschnittskarte vom gesamten Schiff: von Deck 2 tief unten beim Arrest bis hoch zu Deck 10 hier oben am Pool!',
            },
            {
              speakerId: 'eleonore',
              emotion: 'confident',
              text: 'Tragen wir jetzt alle Positionen um 01:58 Uhr, 02:12 Uhr und 02:23 Uhr sauber ein und ziehen die echte Laufweg-Linie!',
              startsMiniGameId: 'alibi_route_map',
            },
          ],
        },
      ],
      talkTopics: [
        {
          id: 'talk_f3_st2_kalle_walkman',
          title: 'Kalle Jensen zur Mordnacht um 02:10 Uhr befragen',
          speakerId: 'sailor_kalle',
          hideIfFlag: 'flag_f3_kalle_braucht_batterien',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Ahoi, Kalle Jensen! Laut Dienstplan haben Sie in der besagten Nacht von 01:55 bis 02:35 Uhr hier oben das Pool- & Spieldeck geschrubbt. Haben Sie dabei zufällig einen verzweifelten Vater im grauen Poloshirt gesehen, der nach zwei Jungs suchte?',
            },
            {
              speakerId: 'sailor_kalle',
              emotion: 'sweating',
              unlocksThought: 'thought_f3_walkman_batterien',
              setsFlag: 'flag_f3_kalle_braucht_batterien',
              text: 'Boah ey… frag mich bloß nichts so früh am Morgen, Kumpel! Mein Kopf ist komplett matschig — vor einer Stunde sind genau hier die verdammten Batterien in meinem alten Kassetten-Walkman abgenippelt!',
            },
            {
              speakerId: 'sailor_kalle',
              emotion: 'grumpy',
              text: 'Ohne ordentlichen Synthie-Beat auf den Ohren rattert in meinem Gehirn rein gar nichts! Wenn Sie irgendwo zwei frische 1,5V-Mignon-Batterien auftreiben können, fällt mir jede einzelne Minute von heute Nacht sofort wieder ein…',
            },
            {
              speakerId: 'eleonore',
              emotion: 'thinking',
              text: 'Zwei 1,5-Volt-Mignon-Batterien… Na großartig! Wo auf dem ganzen Schiff sollen wir jetzt bloß zwei solche Batterien auftreiben, Nate?',
            },
          ],
        },
        {
          id: 'talk_f3_st2_kalle_wartet',
          title: 'Kalle braucht immer noch zwei 1,5V-Mignon-Batterien',
          speakerId: 'sailor_kalle',
          requiredFlag: 'flag_f3_kalle_braucht_batterien',
          hideIfFlag: 'flag_f3_batterien_geholt',
          lines: [
            {
              speakerId: 'sailor_kalle',
              emotion: 'sweating',
              text: 'Mmmh… düdel-düm… Nee, funktioniert nicht! Ich summ mir schon seit zehn Minuten selbst die Bassline vor, aber ohne Strom im Walkman ist mein Langzeitgedächtnis wie leergefegt!',
            },
            {
              speakerId: 'eleonore',
              emotion: 'sweating',
              text: 'Oh je — sein Gesang wird von Minute zu Minute schiefer! Wir müssen irgendwo an Bord zwei frische 1,5V-Mignon-Batterien für seinen Walkman finden, bevor er gleich noch ein Solo startet!',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Überlegen wir mal scharf, wo uns heute bereits genau solche Batterien begegnet sind…',
            },
          ],
        },
        {
          id: 'talk_f3_st2_kalle_batterien_geben',
          title: 'Kalle die zwei beschlagnahmten 1,5V-Batterien geben',
          speakerId: 'sailor_kalle',
          requiredFlag: 'flag_f3_batterien_geholt',
          hideIfFlag: 'flag_f3_kalle_aussage_erhalten',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              removesEvidence: 'walkman_batterien',
              text: 'Bitteschön, Kalle — zwei brandneue 1,5-Volt-Mignon-Batterien direkt aus Kabine 917! Jetzt lassen Sie die Kassette rollen!',
            },
            {
              speakerId: 'sailor_kalle',
              emotion: 'confident',
              sfx: 'evidence_chime',
              unlocksEvidence: 'beweis_kalle_aussage',
              setsFlag: 'flag_f3_kalle_aussage_erhalten',
              text: 'JAAAA MANN!! Das drückt wieder!! Moment… jetzt schnurrt auch mein Gedächtnis wieder wie geschmiert!!',
            },
            {
              speakerId: 'sailor_kalle',
              emotion: 'confident',
              text: 'Punkt 02:12 Uhr!! Genau als mein Lieblingssong anfing, kam ein völlig verschwitzter Typ im grauen Poloshirt mit orangem Kragen hier über Deck 10 gehetzt und rief: „Haben Sie zwei Jungs gesehen — schwarzes Piratenshirt und weißes T-Shirt?!“ Ich hab ihn noch zur Kinder-Rutschen-Ecke hochgeschickt!',
            },
            {
              speakerId: 'eleonore',
              emotion: 'shocked',
              text: '02:12 UHR OBEN AUF DECK 10!! Das ist exakt mitten im behaupteten Mordfenster unten auf Deck 2!! Nate — holen wir die Schiffskarte raus und zeichnen alle Positionen sauber ein!!',
              choices: [
                {
                  label: 'Laufweg- & Alibi-Karte direkt ausfüllen!',
                  nextLines: [
                    {
                      speakerId: 'nate',
                      emotion: 'confident',
                      text: 'Machen wir Falks Zeittheorie endgültig den Garaus — ab auf die Querschnittskarte!',
                      startsMiniGameId: 'alibi_route_map',
                    },
                  ],
                },
                {
                  label: 'Erstmal Kalles Aussage in Ruhe einstecken',
                  nextLines: [
                    {
                      speakerId: 'nate',
                      emotion: 'confident',
                      text: 'Danke, Kalle! Die Querschnittskarte können wir gleich hier an Deck ausfüllen!',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 'talk_f3_st2_alibi_karte',
          title: 'Laufweg- & Alibi-Karte jetzt ausfüllen',
          speakerId: 'eleonore',
          requiredFlag: 'flag_f3_kalle_aussage_erhalten',
          hideIfFlag: 'flag_f3_aufgabe3_erledigt',
          lines: [
            {
              speakerId: 'eleonore',
              emotion: 'confident',
              text: 'Öffnen wir die Schiffs-Querschnittskarte und verbinden Andrews reale Stationen um 01:58, 02:12 und 02:23 Uhr!',
              startsMiniGameId: 'alibi_route_map',
            },
          ],
        },
        {
          id: 'talk_f3_st2_kalle_nachlese',
          title: 'Kalle: Danke für Ihre Aussage zu 02:12 Uhr!',
          speakerId: 'sailor_kalle',
          requiredFlag: 'flag_f3_aufgabe3_erledigt',
          lines: [
            {
              speakerId: 'sailor_kalle',
              emotion: 'confident',
              text: 'Kein Problem, Kumpel — und danke für die fetten Batterien! Wenn dieser hochnäsige Staatsanwalt heute Abend noch mehr dummes Zeug redet, holt mich einfach rein, ich schwör die Uhrzeit auf meinen ersten Walkman!',
            },
            {
              speakerId: 'eleonore',
              emotion: 'confident',
              text: 'Mit Ihrer genauen Zeitangabe und unserer eingetragenen Laufweg-Karte hat Andrew heute Abend endlich ein wasserdichtes Alibi, Kalle!',
            },
          ],
        },
      ],
      presentRules: [
        {
          evidenceId: 'walkman_batterien',
          hideIfFlag: 'flag_f3_kalle_aussage_erhalten',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              removesEvidence: 'walkman_batterien',
              text: 'Hier sind Ihre zwei 1,5V-Mignon-Batterien, Kalle — direkt für Ihren Walkman!',
            },
            {
              speakerId: 'sailor_kalle',
              emotion: 'confident',
              sfx: 'evidence_chime',
              unlocksEvidence: 'beweis_kalle_aussage',
              setsFlag: 'flag_f3_kalle_aussage_erhalten',
              text: 'BÄMM!! Endlich wieder richtiger Beat auf den Ohren!! Punkt 02:12 Uhr war das — ich erinnere mich glasklar: Ihr Mann im grauen Polohemd mit orangem Kragen stürmte hier über Deck 10 und fragte nach Leo und Rick!',
            },
            {
              speakerId: 'eleonore',
              emotion: 'confident',
              text: 'Jetzt fehlt nur noch die exakte Weg-Rekonstruktion auf der Schiffskarte, Nate!',
              startsMiniGameId: 'alibi_route_map',
            },
          ],
        },
      ],
      fallbackPresentLines: [
        {
          speakerId: 'sailor_kalle',
          emotion: 'neutral',
          text: 'Ohne Power für meinen Walkman bringt mir das Papierzeug gerade gar nichts, Kumpel!',
        },
      ],
    },

    courtroom: {
      id: 'courtroom',
      name: 'Großer Ballsaal · Seegericht',
      subtitle: 'Abendverhandlung · Staatsanwalt von Falk im Zeugenstand',
      backgroundUrl: '/src/assets/images/cruise_court_ballroom_1795039845955.jpg',
      charactersPresent: [
        { characterId: 'pendelton' },
        { characterId: 'falk' },
      ],
      hotspots: [],
      talkTopics: [
        {
          id: 'court_f3_tip',
          title: 'Maya: Wie zerlegen wir Falks Aussagen?',
          speakerId: 'maya',
          lines: [
            {
              speakerId: 'maya',
              emotion: 'sweating',
              text: 'Falk macht heute auf extra glitschig! Wenn er wieder drumherum redet, drücke unbedingt mit „Moment mal!“ genau die richtige Nachfrage durch — dann verrät er sich selbst und du haust ihm den passenden Beweis aus der Akte um die Ohren!',
            },
          ],
        },
      ],
      presentRules: [],
      fallbackPresentLines: [
        {
          speakerId: 'pendelton',
          emotion: 'neutral',
          text: 'Bitte legen Sie Beweise direkt während eines Kreuzverhörs gegen eine Aussage vor, Mr. Sterling.',
        },
      ],
    },
  },

  // ===========================================================================
  // ABENDVERHANDLUNG (STATION 3.2 FINALE: FALK IM ZEUGENSTAND)
  // ===========================================================================
  testimonies: {
    testimony_f3_falk_1: {
      id: 'testimony_f3_falk_1',
      title: 'Abendverhandlung · Aussage 1: Exklusives Wissen',
      witnessId: 'falk',
      introLines: [
        {
          speakerId: 'falk',
          emotion: 'smug',
          text: 'Hören Sie genau zu, Euer Ehren — und vor allem Sie, Sterling: Ich beginne mit meiner ersten eisernen Säule! Kein zufälliger Passagier verfügt über jenes geheime Fachwissen, mit dem der Angeklagte selbst hier im Ballsaal geprahlt hat!',
        },
      ],
      statements: [
        {
          id: 'f3_t1_s1',
          text: 'Am späten Abend vor Kreta stieg Mr. Andrew Higginson hier auf das Pult und erklärte vor über zweihundert Passagieren, wie sich das hochmoderne Magnetschloss MS-400 von Zelle 08 durch eine gezielte Bus-Überlastung lautlos öffnen lässt.',
          pressLines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              shout: 'MOMENT MAL!',
              text: 'Sie stellen das so dar, als hätte Andrew diese Vorführung aus freien Stücken zur Schau gestellt, Herr Staatsanwalt — dabei haben wir ihn ausdrücklich als Sachverständigen gebeten, um den Mord an Arthur Morgan aufzuklären!',
            },
            {
              speakerId: 'falk',
              emotion: 'smug',
              text: 'Oh, selbstverständlich „aus purer Nächstenliebe“, Sterling! Bloß seltsam, wie punktgenau ausgerechnet ein angeblich völlig unbeteiligter Urlauber exakt jene Schwachstelle heraufbeschwört, mit der sein eigenes Opfer kurz zuvor lautlos überrascht wurde!',
            },
            {
              speakerId: 'maya',
              emotion: 'sweating',
              text: '(Der dreht einem wirklich jedes Wort im Mund um… Hör dir seine nächste Behauptung über das Bordpersonal ganz genau an!)',
            },
          ],
        },
        {
          id: 'f3_t1_s2',
          text: 'Weder Sicherheitsoffizier Lukas Brandt noch Ihr vielgepriesener Bord-Elektriker Lars Kowalski hatten von dieser spezifischen Schwachstelle jemals gehört — ein deutliches Zeichen dafür, wie geheim dieses Wissen war.',
          pressLines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              shout: 'MOMENT MAL!',
              text: 'Halt! Ein Bord-Elektriker betreut auf so einem Kreuzfahrtschiff Hunderte verschiedene Anlagen und Schaltkreise! Nur weil er ein Detail nicht sofort aus dem Gedächtnis aufsagt, heißt das doch noch lange nicht, dass es geheim war!',
            },
            {
              speakerId: 'falk',
              emotion: 'confident',
              text: 'Ach nein? Wenn der leitende Elektriker der MS Aurora ein sicherheitsrelevantes Verhalten seiner eigenen Zellenschlösser nicht kennt, beweist das erst recht, dass niemand an Bord je darüber stolpern konnte!',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: '(Er schließt von Kowalskis Gedächtnis direkt auf das gesamte Schiff… Ob wir ihn festnageln können, wie zuverlässig eigentlich die Bordunterlagen sind?)',
            },
          ],
        },
        {
          id: 'f3_t1_s3',
          text: 'Daraus folgt zwingend: Auf der gesamten MS Aurora existierte zu keinem Zeitpunkt irgendeine Spur oder Informationsquelle für diese Sicherheitslücke — allein ein externer Spezialist wie Mr. Higginson konnte sie kennen!',
          pressLines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              shout: 'MOMENT MAL!',
              text: 'Das geht mir entschieden zu glatt, Herr von Falk! Prüfen wir doch einmal, worauf Sie diese Behauptung überhaupt stützen!',
              choices: [
                {
                  label: '„Haben Sie überhaupt selbst einmal ein Magnetschloss zerlegt?!“',
                  nextLines: [
                    {
                      speakerId: 'falk',
                      emotion: 'smug',
                      text: 'Tst! Für Schraubendreher zahlt die Reederei Techniker, mein Bester! Als Staatsanwalt prüfe ich Beweise, keine Kabelschuhe. Versuchen Sie’s mit einer ernsthaften Frage!',
                    },
                  ],
                },
                {
                  label: '„Wie genau haben Sie die schriftlichen Bord-Unterlagen der Technik geprüft?!“',
                  nextLines: [
                    {
                      speakerId: 'nate',
                      emotion: 'confident',
                      text: 'Sie behaupten, an Bord habe niemals irgendeine Quelle über diese Schloss-Macke existiert. Haben Sie denn überhaupt einmal die offiziellen technischen Unterlagen in der Schaltzentrale vollständig auf ihren Zustand geprüft?!',
                    },
                    {
                      speakerId: 'falk',
                      emotion: 'confident',
                      setsFlag: 'flag_f3_trial_1_enttarnt',
                      sfx: 'thought_pop',
                      text: 'Welch lächerliches Ablenkungsmanöver! Jede Anlage an Bord besitzt seit Indienststellung eine ordentlich hinterlegte Dokumentation bei der Bordtechnik — und selbstverständlich liegt dort alles lückenlos und im Originalzustand vor, ohne dass ein Täter etwas hätte vertuschen müssen!',
                    },
                  ],
                },
                {
                  label: '„Vielleicht hat Officer Brandt Andrew den Trick heimlich zugeflüstert!“',
                  nextLines: [
                    {
                      speakerId: 'pendelton',
                      emotion: 'headshake',
                      text: 'Bitte bleiben Sie bei den Fakten und vermeiden Sie bloße Unterstellungen gegen das Sicherheitspersonal, Mr. Sterling.',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 'f3_t1_s4',
          visibleIfFlag: 'flag_f3_trial_1_enttarnt',
          text: 'Sämtliche schriftlichen Unterlagen bei der Bordtechnik liegen vollständig und unverändert vor — niemand an Bord hätte dort jemals etwas über das Zellenschloss nachlesen oder gar beseitigen können!',
          pressLines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              shout: 'MOMENT MAL!',
              text: 'Vollständig und unverändert, sagen Sie? Da lehnen Sie sich aber ziemlich weit über die Reling, Herr Staatsanwalt — wir haben uns genau diese Unterlagen nämlich angesehen!',
            },
          ],
          contradiction: {
            requiredEvidenceId: 'beweis_ms400_handbuch_luecke',
            successLines: [
              {
                speakerId: 'nate',
                emotion: 'confident',
                shout: 'EINSPRUCH!',
                shake: true,
                text: 'VOLLSTÄNDIG UND UNVERÄNDERT, HERR STAATSANWALT?! Werfen Sie einen genauen Blick auf genau dieses MS-400-Wartungshandbuch aus Elektriker Kowalskis Werkstatt!!',
              },
              {
                speakerId: 'nate',
                emotion: 'confident',
                text: 'Genau bei der Rubrik „Bekannte Fehler“ klafft an den Heftklammern eine messerscharfe Risskante!! Jemand hat diese komplette Seite absichtlich herausgerissen!!',
              },
              {
                speakerId: 'falk',
                emotion: 'shocked',
                shake: true,
                text: 'W-WAS?! Eine… herausgerissene Seite im offiziellen Wartungshandbuch?! Wer zum Kuckuck sollte ausgerechnet dort ein einziges Kapitel entfernen?!',
              },
              {
                speakerId: 'maya',
                emotion: 'confident',
                text: 'Na DER ECHTE MÖRDER natürlich! Damit alle Welt genau wie Kowalski ahnungslos dasteht und denkt, nur ein externer IT-ler hätte von der Lücke gewusst!!',
              },
              {
                speakerId: 'pendelton',
                emotion: 'neutral',
                sfx: 'gavel',
                text: 'Das Gericht nimmt dieses manipulierte Handbuch zu den Akten. Punkt 1 — angebliches exklusives Täterwissen — ist damit als Beweis gegen Mr. Higginson unhaltbar!',
              },
              {
                speakerId: 'falk',
                emotion: 'facepalm',
                animation: 'facepalm',
                sfx: 'facepalm',
                text: 'Tch… EIN kleiner Schönheitsfehler an einem Papierheft ändert am Kern überhaupt nichts, Sterling!! Dann gehen wir eben direkt zu meiner ZWEITEN, völlig unerschütterlichen Beweis-Säule!!',
                startsTestimonyId: 'testimony_f3_falk_2',
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
          text: 'Netter Versuch, Sterling — aber mit diesem Beweis erschüttern Sie meine Aussage nicht. Haken Sie erst sauber nach, wo meine Behauptung angreifbar ist!',
        },
      ],
    },

    testimony_f3_falk_2: {
      id: 'testimony_f3_falk_2',
      title: 'Abendverhandlung · Aussage 2A: Der blaue Schal',
      witnessId: 'falk',
      introLines: [
        {
          speakerId: 'falk',
          emotion: 'confident',
          text: 'Hier liegt der königsblaue Kreta-Seidenschal, an dem Arthur Morgan in Zelle 08 erhängt wurde! Und hören Sie auf, sich hinter Papierfetzen zu verstecken, Sterling!',
        },
      ],
      statements: [
        {
          id: 'f3_t2a_s1',
          text: 'Dieser königsblaue Seidenschal mit goldener Borte ist das unstrittige Eigentum Ihres Mandanten Andrew Higginson — das hat er gestern selbst eingeräumt, während seine Frau das identische Zwillingsstück besitzt.',
          pressLines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              shout: 'MOMENT MAL!',
              text: 'Dass der Schal ursprünglich Andrew gehört hat, bestreitet heute niemand mehr! Entscheidend ist aber doch, WIE dieses Tuch überhaupt von Andrew weg und hinunter in Arrestzelle 08 gelangt ist!',
            },
            {
              speakerId: 'falk',
              emotion: 'smug',
              text: 'Eine höchst simple Frage mit einer ebenso simplen Antwort, Sterling: Er hat ihn schlichtweg selbst in der Tasche behalten und heruntergetragen!',
            },
          ],
        },
        {
          id: 'f3_t2a_s2',
          text: 'Mr. Higginsons Behauptung, ihm sei dieser Schal am Vorabend rein zufällig „gestohlen“ worden oder abhandengekommen, ist eine billige Schutzbehauptung — niemand nimmt einem Touristen im Vorbeigehen nur einen Seidenschal aus der Jackentasche!',
          pressLines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              shout: 'MOMENT MAL!',
              text: 'Da stimme ich Ihnen sogar halb zu — ein Taschendieb war das wirklich nicht! Aber haben Sie sich jemals gefragt, ob Andrew seinen Schal am Vorabend vielleicht versehentlich an einem anderen Ort auf dem Schiff liegen ließ?!',
            },
            {
              speakerId: 'falk',
              emotion: 'smug',
              text: 'Wo denn bitteschön — soll sich der blaue Seidenschal etwa in Luft aufgelöst haben?! Hätte er ihn irgendwo im Gästebereich liegen lassen, wäre das doch aufgefallen!',
            },
          ],
        },
        {
          id: 'f3_t2a_s3',
          text: 'Nach dem Abendessen vor Kreta hat niemand außerhalb der Familie diesen blauen Schal je irgendwo an Bord gesehen — es gibt nicht das geringste Zeichen dafür, dass das Tuch anderswo abgelegt wurde.',
          pressLines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              shout: 'MOMENT MAL!',
              text: 'Gewagte Behauptung bei Hunderten von Gästen an Bord! Fragen wir doch mal gezielt nach dem Weg Ihres Mandanten am Vorabend!',
              choices: [
                {
                  label: '„Haben Sie überhaupt alle Kleiderschränke in Kabine 518 durchsucht?!“',
                  nextLines: [
                    {
                      speakerId: 'falk',
                      emotion: 'smug',
                      text: 'In Kabine 518 lagen Spielzeug-Dinos und Cracker, kein Tat-Seil! Bleiben Sie bei etwas Verwertbarem, Sterling!',
                    },
                  ],
                },
                {
                  label: '„Haben Sie geprüft, ob Gäste in den Restaurants an dem Abend etwas bemerkt haben?!“',
                  nextLines: [
                    {
                      speakerId: 'nate',
                      emotion: 'confident',
                      text: 'Andrew hat sich am Abend vor dem Einlaufen doch nicht in Luft aufgelöst! Haben Sie überprüft, wo er sich zuletzt aufgehalten hat — und ob verärgerte Passagiere das dortige Chaos vielleicht sogar dokumentiert haben?!',
                    },
                    {
                      speakerId: 'falk',
                      emotion: 'confident',
                      setsFlag: 'flag_f3_trial_2a_enttarnt',
                      sfx: 'thought_pop',
                      text: 'Unfug!! Ich stütze eine Mordanklage doch nicht auf Restaurant-Nörgeleien! Weder ist dort jemals ein blauer Schal aufgetaucht, noch existiert irgendein Beleg dafür, dass das Tuch außerhalb von Mr. Higginsons eigenem Besitz gelandet wäre!',
                    },
                  ],
                },
                {
                  label: '„Vielleicht hat Arthur Morgan sich einfach ein genau gleiches Tuch in Kreta gekauft!“',
                  nextLines: [
                    {
                      speakerId: 'falk',
                      emotion: 'smug',
                      text: 'In Kreta gab es genau zwei Exemplare — ein Geschenk an die Higginsons! Erinnern Sie sich gefälligst an Ihre eigene Beweisführung von gestern, Sterling!',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 'f3_t2a_s4',
          visibleIfFlag: 'flag_f3_trial_2a_enttarnt',
          text: 'Es existiert nicht ein einziges Dokument und keine einzige Aufnahme im gesamten Gästebereich, die diesen blauen Schal nach dem Abendessen irgendwo außerhalb von Mr. Higginsons Besitz zeigen würde!',
          pressLines: [
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: '(Er behauptet ernsthaft, es gebe nicht ein einziges Bild aus dem Gästebereich… Nate, wir wissen es doch besser!)',
            },
          ],
          contradiction: {
            requiredEvidenceId: 'beweis_vip_waeschefoto',
            successLines: [
              {
                speakerId: 'nate',
                emotion: 'confident',
                shout: 'EINSPRUCH!',
                shake: true,
                text: 'DOCH, HERR STAATSANWALT!! Schauen Sie auf dieses Beschwerdefoto von VIP-Gast Gerhard von Berg aus dem VIP-Speisesaal!!',
              },
              {
                speakerId: 'nate',
                emotion: 'confident',
                text: 'Genau rechts aus diesem überfüllten Rollwagen voll feuchter weißer Handtücher lugt unverkennbar Andrews königsblauer Kreta-Seidenschal mit der goldenen Borte hervor! Andrew hat ihn dort beim Aufräumen verloren — zusammen mit der Schmutzwäsche abgeräumt!',
              },
              {
                speakerId: 'falk',
                emotion: 'shocked',
                shake: true,
                text: 'WAS ZUM…?! Warum um Himmels willen fotografiert ein VIP-Passagier schmutzige Handtuchwagen?! Grr… na schön! Selbst WENN das gute Stück versehentlich in die Schmutzwäsche gerutscht sein sollte…',
              },
              {
                speakerId: 'falk',
                emotion: 'confident',
                text: 'Das erklärt überhaupt noch nicht, wie er angeblich später in eine verschlossene Zelle gelangt sein soll! Machen Sie sich auf meine direkte Erwiderung gefasst!',
                startsTestimonyId: 'testimony_f3_falk_2b',
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
          text: 'Halten Sie mir keine beliebigen Notizen unter die Nase, Sterling! Prüfen Sie zuerst genau, wie mein Mandant-Bild am Vorabend ins Wanken gerät!',
        },
      ],
    },

    testimony_f3_falk_2b: {
      id: 'testimony_f3_falk_2b',
      title: 'Abendverhandlung · Aussage 2B: Verbleib des Schals',
      witnessId: 'falk',
      introLines: [
        {
          speakerId: 'falk',
          emotion: 'sweating',
          text: 'Na schön, geben wir Ihrer Fantasie kurz Futter, Sterling! Nehmen wir an, dieser blaue Schal landete tatsächlich gestern Abend in einem schmutzigen Wäschewagen…',
        },
      ],
      statements: [
        {
          id: 'f3_t2b_s1',
          text: 'Wenn zwischen Hunderten Handtüchern ein wertvolles Seidentuch gefunden wird, verschwindet es in den geregelten Betriebsabläufen des Schiffes — niemals wandert es auf wundersame Weise in die Hände eines geheimen Mörders!',
          pressLines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              shout: 'MOMENT MAL!',
              text: 'Und genau diese Abläufe haben wir heute bis ins letzte Detail verfolgt, Herr von Falk! Die Mitarbeiterin der Bord-Wäscherei — Elara Novak — hat das Tuch tatsächlich gefunden und ordnungsgemäß weitergeleitet!',
            },
            {
              speakerId: 'falk',
              emotion: 'smug',
              text: 'Selbstverständlich weiß ich, wie geordnete Reederei-Verwaltung funktioniert: Wenn ein Fundstück korrekt erfasst wird, gelangt es auch nicht einfach in falsche Hände!',
            },
          ],
        },
        {
          id: 'f3_t2b_s2',
          text: 'Zu keinem Zeitpunkt existierte an Bord irgendein unkontrolliertes Loch zwischen Personalbereich und Zellentrakt, über das sich eine unbefugte Person einfach an diesem Schal hätte bedienen können!',
          pressLines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              shout: 'MOMENT MAL!',
              text: 'Kein Loch im Ablauf, ja? Dann testen wir mal, wie gründlich Sie den weiteren Weg hinter der Bord-Wäscherei verfolgt haben!',
              choices: [
                {
                  label: '„Vielleicht hat jemand die Waschmaschine während des Schleuderns geknackt!“',
                  nextLines: [
                    {
                      speakerId: 'falk',
                      emotion: 'facepalm',
                      text: 'Herrgott, Sterling — hören Sie sich eigentlich selbst noch reden?! Versuchen Sie es mit den echten Abläufen an Bord!',
                    },
                  ],
                },
                {
                  label: '„Haben Sie überhaupt überprüft, was nach der Abgabe durch das Personal passiert ist?!“',
                  nextLines: [
                    {
                      speakerId: 'nate',
                      emotion: 'confident',
                      text: 'Elara Novak hat den Schal nicht behalten, sondern ordentlich weitergereicht! Haben Sie jemals geprüft, was mit diesem Fundstück danach laut Dienstwegen geschehen ist — oder ob es bis heute vermisst wird?!',
                    },
                    {
                      speakerId: 'falk',
                      emotion: 'confident',
                      setsFlag: 'flag_f3_trial_2b_enttarnt',
                      sfx: 'thought_pop',
                      text: 'Pure Spekulation!! Auf einem Schiff dieser Klasse wird jedes sichergestellte Gäste-Eigentum lückenlos verbucht und ordentlich wieder ausgegeben — es bleibt dort nirgends herrenlos als offene Beute für irgendwelche zwielichtigen Gestalten liegen!',
                    },
                  ],
                },
                {
                  label: '„Vielleicht lag er die ganze Zeit unter einem Waschmittel-Sack!“',
                  nextLines: [
                    {
                      speakerId: 'falk',
                      emotion: 'smug',
                      text: 'Dann wäre er kaum um drei Uhr morgens trocken und glatt in Zelle 08 aufgetaucht, meinen Sie nicht?!',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 'f3_t2b_s3',
          visibleIfFlag: 'flag_f3_trial_2b_enttarnt',
          text: 'Jeder einmal beim Personal abgegebene Gegenstand wird sauber dokumentiert und rechtmäßig zurückgegeben — eine offene Lücke ohne Eigentümer-Übergabe existiert in unseren Bordbüchern nicht!',
          pressLines: [
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Aha!! Sauber dokumentiert und rechtmäßig zurückgegeben, sagt er… Nate, ich glaube genau da drüben liegt unser Gegenschlag!',
            },
          ],
          contradiction: {
            requiredEvidenceId: 'beweis_fundbuero_protokoll',
            successLines: [
              {
                speakerId: 'nate',
                emotion: 'confident',
                shout: 'EINSPRUCH!',
                shake: true,
                text: 'SCHWARZ AUF WEISS IM FUND-REGISTER, HERR VON FALK!! Eintrag F-418: „Königsblauer Seidenschal mit goldener Borte, eingeliefert durch Elara Novak (VIP-Wäscherei)“ — Status: NICHT ABGEHOLT!!',
              },
              {
                speakerId: 'nate',
                emotion: 'confident',
                text: 'Andrew hat den Schal niemals wieder angerührt! Er lag im verschlossenen Fundbüro, bis sich jemand mit Bordzugang — JEMAND AUS DER CREW — heimlich daran bediente, um ihn kurz darauf in Arrestzelle 08 zu platzieren!!',
              },
              {
                speakerId: 'falk',
                emotion: 'shocked',
                shake: true,
                text: 'N-NICHT ABGEHOLT?! Aus dem… geschlossenen Personal-Bereich?!',
              },
              {
                speakerId: 'pendelton',
                emotion: 'neutral',
                sfx: 'gavel',
                text: 'Beeindruckende Beweiskette der Verteidigung: VIP-Foto, Wäscherei und Eintrag F-418! Damit fällt auch Punkt 2 — das Schal-Indiz — vollständig gegen Mr. Higginson in sich zusammen!',
              },
              {
                speakerId: 'falk',
                emotion: 'facepalm',
                animation: 'facepalm',
                sfx: 'facepalm',
                text: 'Grrr… selbst ohne Handbuch und selbst ohne Schal bleibt meine DRITTE SÄULE wie aus Granit gemeißelt: DIE ÜBERWACHUNGSKAMERAS IN DER MORDNACHT!!',
                startsTestimonyId: 'testimony_f3_falk_3',
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
          text: 'Erst sauber nachhaken, bis meine These steht — und dann brauchen Sie schon einen handfesten Beleg aus den Bordbüchern, Sterling!',
        },
      ],
    },

    testimony_f3_falk_3: {
      id: 'testimony_f3_falk_3',
      title: 'Abendverhandlung · Aussage 3: Nachtaufnahmen & Alibi',
      witnessId: 'falk',
      introLines: [
        {
          speakerId: 'falk',
          emotion: 'confident',
          text: 'Eine Kamera lügt nicht, Sterling! Sehen wir doch einmal, wie Ihr Mandant aus diesen gnadenlosen Zeitstempeln herausspazieren will!',
        },
      ],
      statements: [
        {
          id: 'f3_t3_s1',
          text: 'Die Flurkamera auf Deck 5 zeigt ohne jeden Zweifel: Um Punkt 01:58 Uhr verlässt Andrew Higginson allein seine Kabine — und exakt fünfundzwanzig Minuten später, um 02:23 Uhr, schleicht er eilig wieder zurück!',
          pressLines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              shout: 'MOMENT MAL!',
              text: 'Dass er zwischen 01:58 und 02:23 Uhr unterwegs war, gibt Andrew inzwischen offen zu — er hat verzweifelt seine beiden ausgebüxten Söhne Leo und Rick gesucht!',
            },
            {
              speakerId: 'falk',
              emotion: 'smug',
              text: 'Aha — erst schlafen, dann plötzlich Kinder suchen! Eine herrlich bequeme Ausrede für genau jene fünfundzwanzig Minuten, in denen auf Deck 2 ein Mann ermordet wurde!',
            },
          ],
        },
        {
          id: 'f3_t3_s2',
          text: 'Zwischen 01:58 und 02:23 Uhr klafft exakt rund um das 02:04-bis-02:19-Uhr-Tatfenster mehr als genug Spielraum, um drei Decks hinab in den Arrestbereich auf Deck 2 zu eilen, die Tat zu vollbringen und wieder heraufzusteigen.',
          pressLines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              shout: 'MOMENT MAL!',
              text: 'Moment mal! Rechnen Sie doch erst einmal mit, Herr Staatsanwalt: Wenn Andrew genau während dieses kurzen Zeitfensters in einem ganz anderen Teil des Schiffs gesehen wurde, reicht diese knappe Zeitspanne niemals gleichzeitig für einen Ausflug bis ganz hinunter in den Zellenblock!',
            },
            {
              speakerId: 'falk',
              emotion: 'confident',
              text: 'Nettes Rechenexempel, Sterling — nur fehlt Ihnen dafür bedauerlicherweise jede glaubwürdige Bestätigung!',
            },
          ],
        },
        {
          id: 'f3_t3_s3',
          text: 'Niemand auf diesem gesamten Schiff kann bezeugen, Andrew Higginson zwischen 02:04 und 02:19 Uhr auch nur in die Nähe eines anderen Schiffsdecks laufen gesehen zu haben — sein nächtlicher Suchspaziergang ist ein reines Märchen!',
          pressLines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              shout: 'MOMENT MAL!',
              text: 'Da haben Sie sich aber gewaltig verrechnet, Herr von Falk! Schauen wir doch mal, wen Ihre Ermittlungen mitten in der Nacht glatt vergessen haben!',
              choices: [
                {
                  label: '„Vielleicht hat ihn ja eine Möwe oben auf dem Schornstein gesehen!“',
                  nextLines: [
                    {
                      speakerId: 'falk',
                      emotion: 'facepalm',
                      text: 'Sehr geistreich, Sterling… Wenn Ihre gesamte Verteidigung neuerdings auf Vögeln basiert, räumen wir lieber sofort die Bühne!',
                    },
                  ],
                },
                {
                  label: '„Haben Sie je geprüft, wer aus der Nacht-Crew zu dieser Stunde wach war?!“',
                  nextLines: [
                    {
                      speakerId: 'nate',
                      emotion: 'confident',
                      text: 'Auf einem Kreuzfahrtschiff schläft nicht jeder! Haben Sie denn überhaupt einmal im Schichtplan nachgeschaut, welche Crew-Mitglieder zwischen 01:55 und 02:35 Uhr regulär auf den anderen Decks Dienst geschoben haben?!',
                    },
                    {
                      speakerId: 'falk',
                      emotion: 'sweating',
                      setsFlag: 'flag_f3_trial_3_enttarnt',
                      sfx: 'thought_pop',
                      text: 'N-Nachtschicht?! Ach was — wer um zwei Uhr morgens den Mopp schwingt, döst halb über seinem Eimer ein und merkt nichts! Kein einziger Mensch an Bord kann Ihrem Mandanten für die Tatzeit ein Alibi geben — und ebenso wenig lässt sich damit eine unmögliche Route zu Deck 2 beweisen!!',
                    },
                  ],
                },
                {
                  label: '„Leo und Rick waren ja auch wach — Kinder sind unbestechliche Zeugen!“',
                  nextLines: [
                    {
                      speakerId: 'pendelton',
                      emotion: 'neutral',
                      text: 'Selbstverständlich stützen wir ein Strafverfahren ungern allein auf die Aussagen von Sechs- bis Zehnjährigen ohne unabhängigen Zeugen, Mr. Sterling.',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 'f3_t3_s4',
          visibleIfFlag: 'flag_f3_trial_3_enttarnt',
          text: 'Kein Crew-Mitglied aus der Nachtschicht hat Mr. Higginson während des Tatfensters an einem anderen Ort gesehen — es gibt keinerlei Entlastung, die gegen seinen Gang hinunter zu Deck 2 sprechen würde!',
          pressLines: [
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Ha!! Genau diese Behauptung wollten wir hören, Nate — jetzt zerlegen wir seine Zeitrechnung endgültig!!',
            },
          ],
          contradiction: {
            requiredEvidenceId: 'beweis_alibi_laufweg',
            alternativeEvidenceIds: ['beweis_kalle_aussage'],
            successLines: [
              {
                speakerId: 'nate',
                emotion: 'confident',
                shout: 'EINSPRUCH!',
                shake: true,
                text: 'DOCH, HERR STAATSANWALT — GENAU DIESE ENTLASTUNG EXISTIERT!! Sehen Sie sich unsere belegte Zeit- und Laufweg-Rekonstruktion an!!',
              },
              {
                speakerId: 'nate',
                emotion: 'confident',
                shout: 'VOLLTREFFER!',
                shake: true,
                sfx: 'victory',
                text: '01:58 Uhr Auszug auf der Flurkamera Deck 5 — Punkt 02:12 Uhr persönlich begegnet und angesprochen von Nachtschicht-Matrose KALLE JENSEN hoch oben auf dem Pooldeck (Deck 10) auf der Suche nach „zwei Jungs im Piraten- und weißen Shirt“ — und 02:23 Uhr Rückkehr auf Deck 5!!',
              },
              {
                speakerId: 'nate',
                emotion: 'confident',
                text: 'Bei den Entfernungen und Sicherheits-Treppenhäusern an Bord war es physisch VOLLKOMMEN UNMÖGLICH, zwischendurch acht Decks tiefer in Zelle 08 einzubrechen, Arthur Morgan zu betäuben und aufzuhängen!! Andrew Higginson hat ein lückenloses Alibi!!',
              },
              {
                speakerId: 'falk',
                emotion: 'shocked',
                shake: true,
                sfx: 'tension',
                text: 'W-WAS?! Ein… ein wacher Zeuge um 02:12 Uhr oben auf Deck 10?! Verflucht — wie zum Teufel haben Sie diesem verschlafenen Matrosen bitte auf die Sprünge geholfen?!',
              },
              {
                speakerId: 'maya',
                emotion: 'sweating',
                text: 'Mit zwei beschlagnahmten TV-Batterien aus Kabine 917 und gutem altem 80er-Synthie-Pop!! Klingt irre, hält aber vor Gericht!!',
              },
              {
                speakerId: 'falk',
                emotion: 'facepalm',
                animation: 'facepalm',
                sfx: 'facepalm',
                text: 'S-SO EINE SCHANDE!! Aber bilden Sie sich bloß nicht ein, das Verfahren wäre zu Ende, Sterling!! EINE SÄULE STEHT NOCH — UND ZWAR SO HART WIE STAHL!!',
              },
              {
                speakerId: 'falk',
                emotion: 'confident',
                animation: 'slam',
                sfx: 'gavel_double',
                text: 'DER VIERTE ANKLAGEPUNKT!! Der weingetränkte Erpresserbrief aus Fall 1 — „Letzte Frist: 45.000 Euro bis zum Einlaufen auf Kreta. Bis dahin bleibt der Chronometer als Sicherheit – sonst erfahren alle von Ihren Geschäften“ — adressiert an „A. H.“!! Kombiniert mit Mr. Higginsons eigenen gestandenen Geldsorgen!!',
              },
              {
                speakerId: 'falk',
                emotion: 'smug',
                text: 'Diesen 45.000-€-Brief haben Sie mit keinem einzigen Beweisstück heute angerührt, Sterling!! Also bleibt mein Mordmotiv bestehen!!',
              },
              {
                speakerId: 'nate',
                emotion: 'thinking',
                text: 'Tch… da hat er allerdings leider recht, Maya… Für Aufgabe 4 — was wirklich hinter diesem rotweinverschmierten „A. H.“-Brief und Arthur Morgans Geschäften steckt — reicht die Seetag-Akte nicht aus.',
              },
              {
                speakerId: 'maya',
                emotion: 'sweating',
                text: 'Stimmt… Detective Marston hatte völlig recht: Dafür müssen wir uns als Nächstes noch einmal ganz genau die Original-Beweise aus Fall 1 — rund um den Brief und den Chronometer — auf den Tisch holen!',
              },
              {
                speakerId: 'nate',
                emotion: 'confident',
                text: 'Euer Ehren!! Wir bestreiten nicht, dass dieser letzte Punkt noch einer genauen Prüfung der Fall-1-Unterlagen bedarf. ABER drei von vier Pfeilern dieser Verhaftung — Täterwissen, Schal und Nacht-Alibi — liegen soeben zertrümmert am Boden!! Einen unschuldigen Familienvater auf Verdacht eines verschmierten Monogramms weiter einzusperren, wäre pure Willkür!',
              },
              {
                speakerId: 'pendelton',
                emotion: 'neutral',
                animation: 'slam',
                sfx: 'gavel_double',
                text: 'RUHE IM BALLSAAL!! Ich habe genug gehört! Drei der vier Belastungsindizien sind eindrucksvoll entkräftet worden — zugleich bleibt der rätselhafte 45.000-€-Brief aus dem ersten Prozess noch unaufgeklärt.',
              },
              {
                speakerId: 'pendelton',
                emotion: 'neutral',
                text: 'Aus diesem Grund wird die Verhandlung hiermit bis morgen VERTAGT! Allerdings sehe ich keinen vertretbaren Grund mehr, Mr. Higginson länger in Gewahrsam zu halten — ER KOMMT VORERST AUF FREIEN FUSS! Vorausgesetzt, eine Amtsperson bürgt persönlich für sein Erscheinen morgen!',
              },
              {
                speakerId: 'marston',
                emotion: 'confident',
                shout: 'MOMENT MAL!',
                shake: true,
                text: 'Ich übernehme diese Bürgschaft, Euer Ehren!! Als leitender Ermittler garantiere ich hiermit persönlich mit meinem Namen und meiner Dienstmarke dafür, dass Mr. Andrew Higginson morgen pünktlich zur Fortsetzung vor diesem Gericht erscheint!',
              },
              {
                speakerId: 'andrew',
                emotion: 'shocked',
                sfx: 'victory',
                text: 'F-Frank?! Nate?! Eleonore?! I-ich bin frei?! Ich darf wieder zurück zu meiner Familie?!',
              },
              {
                speakerId: 'eleonore',
                emotion: 'neutral',
                text: 'ANDREW!! Du hast es geschafft, Nate — du hast ihn tatsächlich rausgeholt!!',
              },
              {
                speakerId: 'cruisemanager',
                emotion: 'confident',
                triggersOutro: true,
                text: 'APPLAUS!! WELCH EIN CLIFFHANGER, MEINE DAMEN UND HERREN!! Und verpassen Sie auf keinen Fall, wie es morgen weitergeht!!',
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
          text: 'Mit bloßen Ausflüchten entkommen Sie diesem Zeitfenster nicht, Sterling! Erst nachhaken, dann echte Fakten gegen meine Nacht-Rekonstruktion liefern!',
        },
      ],
    },
  },
};
