import type { DialogLine, GameCase } from '../types/game';

function buildMultiTryDefense(
  basePrompt: Omit<DialogLine, 'choices'>,
  options: Array<{ label: string; lines: DialogLine[] }>,
  continueLabel = 'Nichts weiter entgegenzusetzen (Weiter)'
): DialogLine {
  const n = options.length;
  const fullMask = (1 << n) - 1;
  const memo = new Map<number, DialogLine>();

  const getNode = (usedMask: number): DialogLine => {
    const cached = memo.get(usedMask);
    if (cached) return cached;

    const remainingChoices: NonNullable<DialogLine['choices']> = [];
    for (let i = 0; i < n; i++) {
      if ((usedMask & (1 << i)) === 0) {
        const nextMask = usedMask | (1 << i);
        remainingChoices.push({
          label: options[i].label,
          nextLines:
            nextMask === fullMask
              ? [...options[i].lines]
              : [...options[i].lines, getNode(nextMask)],
        });
      }
    }

    if (usedMask !== 0) {
      remainingChoices.push({
        label: continueLabel,
        nextLines: [],
      });
    }

    const node: DialogLine = {
      ...basePrompt,
      choices: remainingChoices,
    };
    memo.set(usedMask, node);
    return node;
  };

  return getNode(0);
}

export const CRETE_ACT23_INTRO_LINES: DialogLine[] = [
  {
    speakerId: 'nate',
    emotion: 'shocked',
    shout: 'MOMENT MAL!',
    shake: true,
    backgroundOverrideUrl: '/src/assets/images/crete_beach_day_1795257795327.jpg',
    text: 'Entschuldigen Sie bitte die plötzliche Störung mitten im Sonnenbad, Mrs. Higginson – aber darf ich Sie ganz vorsichtig etwas zu diesem blauen Seidenschal um Ihre Schultern fragen?',
  },
  {
    speakerId: 'maya',
    emotion: 'sweating',
    backgroundOverrideUrl: '/src/assets/images/crete_beach_day_1795257795327.jpg',
    text: 'Nate… ist das nicht ein bisschen sehr stürmisch für den Strand? Hallo erstmal, Familie Higginson!',
  },
  {
    speakerId: 'eleonore',
    emotion: 'confident',
    backgroundOverrideUrl: '/src/assets/images/crete_beach_day_1795257795327.jpg',
    text: 'Aber gar kein Problem, Mr. Sterling! Oh, Sie meinen meinen hübschen Kreta-Schal? Ich trage ihn heute extra dick gewickelt, weil ich mir durch diese eiskalte Bord-Klimaanlage im Salon leider eine kleine Erkältung eingefangen habe.',
  },
  {
    speakerId: 'eleonore',
    emotion: 'neutral',
    backgroundOverrideUrl: '/src/assets/images/crete_beach_day_1795257795327.jpg',
    text: 'Das ist nämlich ein ganz besonderes Stück für uns: Unsere besten Freunde zu Hause haben uns zur großen Mittelmeer-Kreuzfahrt ein doppeltes Partnergeschenk gemacht – Andrew besitzt haargenau denselben Schal noch einmal!',
  },
  {
    speakerId: 'eleonore',
    emotion: 'neutral',
    backgroundOverrideUrl: '/src/assets/images/crete_beach_day_1795257795327.jpg',
    text: 'Bloß hat unser kleiner Schussel seinen gestern Abend mal wieder irgendwo an Bord liegen lassen… Ach Andrew, du lässt ja wirklich immer alles irgendwo liegen!',
  },
  {
    speakerId: 'andrew',
    emotion: 'grumpy',
    shake: true,
    backgroundOverrideUrl: '/src/assets/images/crete_beach_day_1795257795327.jpg',
    text: 'Hab ich NICHT!! Hör endlich auf, mir das ständig vor fremden Leuten vorzuwerfen, Eleonore! Ich hatte ihn sauber zusammengefaltet in meiner Jackentasche auf der Bank liegen – ich bin hundertprozentig sicher, der wurde mir gestern gestohlen!!',
  },
  {
    speakerId: 'eleonore',
    emotion: 'neutral',
    backgroundOverrideUrl: '/src/assets/images/crete_beach_day_1795257795327.jpg',
    text: 'Jaja, Schatz… klar doch. Wer um alles in der Welt würde denn bitte auf einem Luxusschiff ausgerechnet so einen blauen Seidenschal stehlen?',
  },
  {
    speakerId: 'nate',
    emotion: 'thinking',
    backgroundOverrideUrl: '/src/assets/images/crete_beach_day_1795257795327.jpg',
    unlocksEvidence: 'andrews_verlorener_schal',
    unlocksThought: 'thought_c2_a3_schal_zwilling',
    text: '(Andrews verlorener Schal notiert… Wenn er Recht hat und sein identisches Stück gestern Abend verschwunden ist, dann erklärt das schlagartig dieses feine blaue „Seidentuch“ oben am Gitter von Zelle 08!)',
  },
  {
    speakerId: 'eleonore',
    emotion: 'thinking',
    backgroundOverrideUrl: '/src/assets/images/crete_beach_day_1795257795327.jpg',
    text: 'Sagen Sie mal, Mr. Sterling… Sie gucken ja gerade so nachdenklich wie im dritten Akt eines Agatha-Christie-Romans! Warum fragen Sie denn am Strand überhaupt nach genau diesem Schal?',
  },
  {
    speakerId: 'nate',
    emotion: 'sweating',
    backgroundOverrideUrl: '/src/assets/images/crete_beach_day_1795257795327.jpg',
    text: 'Nun… unter uns gesagt, Mrs. Higginson: Heute Morgen hing genau so ein blaues Seidentuch an den Stäben in Arthur Morgans Arrestzelle – ich hielt es zuerst einfach für eines seiner typischen Erste-Klasse-Kellnertücher.',
  },
  {
    speakerId: 'eleonore',
    emotion: 'shocked',
    backgroundOverrideUrl: '/src/assets/images/crete_beach_day_1795257795327.jpg',
    text: 'WAS?! In der Zelle von diesem toten Kellner?!',
  },
  {
    speakerId: 'nate',
    emotion: 'thinking',
    backgroundOverrideUrl: '/src/assets/images/crete_beach_day_1795257795327.jpg',
    text: 'Wenn das aber gar nicht Arthurs Tuch war, sondern Andrews verschwundener Schal, dann bekomme ich ein riesiges Problem mit diesem offiziellen „Selbstmord“! Nur… erklären kann ich es mir trotzdem nicht: Die elektronische Zellentür wurde die ganze Nacht nicht geöffnet, und von außen gibt es keinerlei Gewaltspuren.',
  },
  {
    speakerId: 'eleonore',
    emotion: 'confident',
    backgroundOverrideUrl: '/src/assets/images/crete_beach_day_1795257795327.jpg',
    text: 'Ach, an so einem modernen Elektronikschloss scheitert es?! Na dann sollte sich Andrew das doch einfach mal kurz anschauen – der kennt sich schließlich hervorragend mit Technik aus!',
  },
  {
    speakerId: 'andrew',
    emotion: 'grumpy',
    shake: true,
    backgroundOverrideUrl: '/src/assets/images/crete_beach_day_1795257795327.jpg',
    text: 'ELEONORE!! Ich kriege gleich einen Anfall!! Nur weil ich in der IT arbeite, heißt das doch NICHT, dass ich mich grundsätzlich mit jeder Technik auf diesem Planeten auskenne!!',
  },
  {
    speakerId: 'andrew',
    emotion: 'grumpy',
    backgroundOverrideUrl: '/src/assets/images/crete_beach_day_1795257795327.jpg',
    text: 'Was denkt ihr denn alle immer?! Zuhause der verstopfte Tintenstrahldrucker? „Frag Andrew, der macht IT!“ Der klemmende Toaster? „Andrew kennt sich mit Technik aus!“ Letztes Jahr sollte ich bei meiner Schwiegermutter sogar das Garagentor neu verlöten!!',
  },
  {
    speakerId: 'andrew',
    emotion: 'grumpy',
    backgroundOverrideUrl: '/src/assets/images/crete_beach_day_1795257795327.jpg',
    text: 'Und jetzt ein elektronisches Sicherheits-Zellenschloss auf einem Mittelmeer-Kreuzfahrtschiff?! Ich plane beruflich Datenbank-Architekturen – ich bin kein Einbrecher mit Lötkolben!!',
  },
  {
    speakerId: 'maya',
    emotion: 'sweating',
    backgroundOverrideUrl: '/src/assets/images/crete_beach_day_1795257795327.jpg',
    text: 'Ähm… ich glaube, da wurde gerade ein jahrelang angestauter Lebensschmerz angetippt…',
  },
  {
    speakerId: 'eleonore',
    emotion: 'confident',
    backgroundOverrideUrl: '/src/assets/images/crete_beach_day_1795257795327.jpg',
    text: 'Jaja, Schatz, genau deswegen bist du ja unser kluger Kopf! Außerdem… denk doch einmal eine Sekunde praktisch: Wenn du Mr. Sterling unten hilfst, hättest du endlich einmal eine halbe Stunde himmlische Ruhe vor den drei Jungs – und Miss Maya passt bestimmt solange ganz lieb auf sie auf!',
  },
  {
    speakerId: 'maya',
    emotion: 'shocked',
    backgroundOverrideUrl: '/src/assets/images/crete_beach_day_1795257795327.jpg',
    text: 'W-was?! Ich soll auf Leo, Rick und Conrad aufpassen?! Auf alle drei gleichzeitig?!',
  },
  {
    speakerId: 'andrew',
    emotion: 'neutral',
    backgroundOverrideUrl: '/src/assets/images/crete_beach_day_1795257795327.jpg',
    text: '… Eine ganze halbe Stunde ohne Geschrei, ohne verlorene Flip-Flops und ohne Diskussion, wer zuerst eine dritte Eiskugel kriegt? Na schön… Sagen Sie einfach Bescheid, Mr. Sterling, sobald man überhaupt wieder an die Zelle rankommt!',
  },
  {
    speakerId: 'maya',
    emotion: 'confident',
    setsFlag: 'flag_c2_a3_start',
    text: 'Zurück an Bord auf dem Promenadendeck! Unsere Strand-Auszeit war zwar kürzer als ein Espresso, aber jetzt lässt uns dieses Rätsel einfach keine Ruhe mehr.',
  },
  {
    speakerId: 'nate',
    emotion: 'thinking',
    text: 'Mir geht es genauso, Maya. Eigentlich ist die Akte offiziell geschlossen und Kommissar Dimitri kümmert sich längst um die Hafen-Formalitäten – aber solange dieser blaue Schal in Zelle 08 hängt, stimmt irgendetwas gewaltig nicht.',
  },
  {
    speakerId: 'maya',
    emotion: 'confident',
    text: 'Dann hilft alles Grübeln oben an der Reling nichts! Gehen wir einfach direkt hinunter ins Unterdeck zu Arrestzelle 08 und sehen uns den Tatort noch einmal ganz genau an!',
  },
];

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
      title: 'Akt 2.3: Der blaue Schal & das Magnetschloss',
      subtitle: 'Kreuzfahrtmanagerin, Schaltzentrale & Abend-Show',
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
          emotion: 'thinking',
          text: 'Warte mal, Nate… ist dir eigentlich aufgefallen, wie unheimlich leer die oberen Salons auf einmal sind?',
        },
        {
          speakerId: 'nate',
          emotion: 'thinking',
          text: 'Ja… egal, wen wir auf den oberen Decks gefragt haben – überall heißt es nur noch, die gesamte Sicherheitsmannschaft sei Hals über Kopf nach ganz unten gelaufen.',
        },
        {
          speakerId: 'maya',
          emotion: 'thinking',
          text: 'Und auf dem Terminal im VIP-Salon blinkt genau ein einziges rotes Warnsignal ganz tief unten im Rumpf auf.',
        },
        {
          speakerId: 'nate',
          emotion: 'thinking',
          text: 'Irgendwo dort unten bei Arrestzelle 08 liegt also der wahre Grund, warum plötzlich die Gangway verriegelt wurde und Marston wie vom Erdboden verschluckt ist.',
        },
        {
          speakerId: 'maya',
          emotion: 'confident',
          text: 'Wenn uns oben ohnehin niemand mehr durchlässt, bleibt eigentlich nur ein Weg: Wir gehen direkt hinunter ins Unterdeck zur Arrestzelle und sehen selbst nach, was dort los ist!',
        },
      ],
    },
  ],
  autoChapterTransitions: [
    {
      id: 'c2_a3_to_evening_court',
      chapterId: 'c2_akt3_nachmittag',
      requiredFlags: ['flag_c2_a3_showtime'],
      toast: 'Abend-Gerichtsshow! Alle Beweise für den Mord liegen bereit!',
      lines: [
        {
          speakerId: 'cruisemanager',
          emotion: 'confident',
          sfx: 'alarm',
          text: 'BORDDURCHSAGE AN ALLE PASSAGIERE! Hier spricht Ihre Kreuzfahrtmanagerin Sabine Lindemann! Sichern Sie sich schnell einen guten Platz im Großen Ballsaal – unsere große Abend-Gerichtsshow mit Strafverteidiger Nate Sterling startet in genau fünf Minuten!!',
        },
        {
          speakerId: 'maya',
          emotion: 'confident',
          text: 'Das war unser Stichwort, Nate! Wir wissen endlich, dass der blaue Schal Andrews verschwundenes Exemplar ist, wir haben die geheime 15-Minuten-Stromlücke im MS-400 UND Dr. Vances Toxikologie-Gutachten!',
        },
        {
          speakerId: 'nate',
          emotion: 'confident',
          unlocksLocation: 'courtroom',
          switchesLocationId: 'courtroom',
          setsPhase: 'court',
          text: 'Na schön – lösen wir unser Versprechen gegenüber Frau Lindemann ein und beenden dieses Selbstmord-Märchen ein für alle Mal vor dem ganzen Schiff!',
          startsTestimonyId: 'testimony_c2_a3_vance',
        },
      ],
    },
    {
      id: 'c2_a3_legacy_retired',
      chapterId: 'c2_akt3_nachmittag',
      requiredFlags: ['flag_c2_a3_legacy_unused'],
      lines: [],
    },
  ],
  introLines: [
    {
      speakerId: 'maya',
      emotion: 'confident',
      text: 'Tag 4, Morgen! Nate, schau doch mal raus durch die großen Fenster – Heraklion! Weiße Häuser, strahlend blauer Himmel, kein einziger Gerichtssaal weit und breit!',
    },
    {
      speakerId: 'nate',
      emotion: 'confident',
      text: 'Ich kann’s kaum glauben. Gestern Abend noch Kreuzverhör im Ballsaal, und heute Morgen riecht die Luft endlich nach Hafen, Salz und starkem griechischem Kaffee.',
    },
    {
      speakerId: 'maya',
      emotion: 'confident',
      sfx: 'bag_rummage',
      text: 'Und ich bin vorbereitet! Ich hab schon meinen Sonnenhut, drei Strandhandtücher, einen historischen Reiseführer für Knossos und eine XXL-Flasche Sonnencreme dabei!',
    },
    {
      speakerId: 'nate',
      emotion: 'sweating',
      text: 'Das passt alles ernsthaft in diese eine Umhängetasche?! Na gut… dann schnappen wir unsere Koffer und gehen endlich über die Gangway an Land…',
    },
    {
      speakerId: 'captain',
      emotion: 'neutral',
      sfx: 'alarm',
      shake: true,
      text: 'BORDDURCHSAGE! Hier spricht Kapitän Brammer! Alle Passagiere treten augenblicklich von der Gangway zurück und bleiben bis auf Weiteres an Bord!',
    },
    {
      speakerId: 'captain',
      emotion: 'neutral',
      text: 'Die Hafenausgänge werden mit sofortiger Wirkung verriegelt. Halten Sie die Treppenhäuser zum Unterdeck frei und warten Sie weitere Anweisungen auf den Promenaden ab.',
    },
    {
      speakerId: 'maya',
      emotion: 'shocked',
      text: 'Äh… wie bitte?! Verriegelt?! Nate, wir stehen zehn Meter vor dem Festland!',
    },
    {
      speakerId: 'andrew',
      emotion: 'grumpy',
      text: 'Das darf doch wohl nicht wahr sein!! Schon wieder gesperrt?! Ich hab’s euch zu Hause hundertmal gesagt: Wir fahren in die Berge zum Wandern! Kein Hafenamt, keine verschlossenen Türen, nur Kuhglocken und klare Bergluft!',
    },
    {
      speakerId: 'eleonore',
      emotion: 'neutral',
      text: 'Jetzt reg dich doch nicht gleich so auf, Andrew, es gibt bestimmt nur irgendeine kleine Zollkontrolle oder…',
    },
    {
      speakerId: 'eleonore',
      emotion: 'shocked',
      animation: 'shock',
      sfx: 'evidence_chime',
      text: 'Moment… stopp mal!! Andrew! Kinder!! Schaut doch mal, wer da direkt neben uns an der Reling steht!! DEN kenn ich doch aus dem Bord-Fernsehen!!',
    },
    {
      speakerId: 'nate',
      emotion: 'sweating',
      text: 'Äh… guten Morgen? Haben wir uns schon einmal gesehen?',
    },
    {
      speakerId: 'eleonore',
      emotion: 'confident',
      text: 'Sie sind Mr. Nate Sterling! Der Strafverteidiger von gestern Abend auf Bord-Kanal 4! Wie Sie diesen Kellner mit dem Weinglas in die Enge getrieben haben… sagen Sie bloß, Sie ermitteln hier schon wieder?!',
      choices: [
        {
          label: '„Ich bin heute eigentlich nur ganz normal im Urlaub…“',
          nextLines: [
            {
              speakerId: 'nate',
              emotion: 'sweating',
              text: 'Ehrlich gesagt wollte ich heute einfach nur in Sandalen über Kreta schlendern und keinen einzigen Tatort mehr sehen.',
            },
            {
              speakerId: 'eleonore',
              emotion: 'confident',
              text: 'Hihi, genau so reden bescheidene Hauptcharaktere immer kurz vor dem nächsten Kapitel!',
            },
          ],
        },
        {
          label: '„Ein guter Verteidiger bleibt eben immer wachsam!“',
          nextLines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Sagen wir so: Wenn plötzlich alle Türen dichtgemacht werden, juckt es berufsbedingt schon ein bisschen in den Fingern.',
            },
            {
              speakerId: 'eleonore',
              emotion: 'shocked',
              text: 'Oh!! Andrew, hast du diese Entschlossenheit gehört?! Wie in Teil 1!!',
            },
          ],
        },
        {
          label: '„Pssst! Sagen Sie’s nicht dem Staatsanwalt, ich will nur ein Eis.“',
          nextLines: [
            {
              speakerId: 'nate',
              emotion: 'sweating',
              text: 'Bitte verraten Sie niemanden von der Crew, dass ich überhaupt noch ein Anwaltsabzeichen in der Tasche habe…',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Keine Sorge, mit doppeltem Schokoeis in der Hand tarnt dich niemand als Ermittler!',
            },
          ],
        },
      ],
    },
    {
      speakerId: 'conrad',
      emotion: 'smug',
      text: 'Boah, cool!! Bist du echt ein richtiger Anwalt?! Darf ich mal an deinem Sakko ziehen, ob da drunter ein geheimes Detektiv-Abzeichen klebt?!',
    },
    {
      speakerId: 'andrew',
      emotion: 'grumpy',
      text: 'Conrad! Finger weg von fremden Anzügen, sonst gibt’s drei Tage kein Eis! Eleonore, warum hört der Junge wieder auf kein einziges Wort? Du hast ihn komplett so verzogen!',
    },
    {
      speakerId: 'eleonore',
      emotion: 'neutral',
      text: 'ICH?! Wer hat ihm denn vorgestern beim Abendbuffet zugenickt, als er seine Gummibärchen in den Schokobrunnen getunkt hat, weil „im Urlaub andere Gesetze gelten“?!',
    },
    {
      speakerId: 'leo',
      emotion: 'smug',
      text: 'Haha, läuft ja wieder super bei uns. Komm, Rick – wetten, wir kriegen schneller raus, warum die Security hier rumrennt, als Papa bis zehn zählen kann?',
    },
    {
      speakerId: 'rick',
      emotion: 'smug',
      text: 'Die Wette gilt! Und wer zuerst einen echten Polizisten sieht, sucht sich heute Nachmittag den Nachtisch für beide aus!',
    },
    {
      speakerId: 'conrad',
      emotion: 'smug',
      text: 'Ich komm mit!! Ich will auch einen echten Polizeiwagen sehen!',
    },
    {
      speakerId: 'andrew',
      emotion: 'neutral',
      text: 'Bleib sofort hier, Conrad!! … Entschuldigen Sie dieses Familienchaos, Mr. Sterling. Aber wenn Sie schon dieser berühmte TV-Anwalt sind – finden Sie doch bitte heraus, wer hier den Ausgang blockiert!',
    },
    {
      speakerId: 'maya',
      emotion: 'thinking',
      text: 'Also ich mag die ja irgendwie… Aber im Ernst, Nate: Hier scheint wirklich etwas Großes im Gange zu sein. Und von Detective Marston oder Staatsanwalt von Falk fehlt jede Spur.',
    },
    {
      speakerId: 'nate',
      emotion: 'thinking',
      text: 'Stimmt. Irgendjemand muss wissen, warum plötzlich alle Ausgänge dicht sind. Schauen wir uns erst einmal auf den offenen Decks und in den Salons um, Maya – vielleicht erfahren wir dort, wo Marston abgeblieben ist.',
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
      bio: 'Trägt stolz sein Piraten-Shirt und ist ständig auf der Suche nach dem nächsten Schiffsstreich zusammen mit seinem Bruder Rick.',
      accentColor: '#22c55e',
      portraitUrl: '/src/assets/images/sprite_rick_higginson_1795164437974.jpg',
      side: 'right',
    },
    rick: {
      id: 'rick',
      name: 'Rick Higginson',
      role: 'Älterer Sohn (Komplize)',
      bio: 'Weißes T-Shirt, wacher Blick und macht bei jedem noch so verrückten Streich auf dem Schiff sofort begeistert mit.',
      accentColor: '#a855f7',
      portraitUrl: '/src/assets/images/sprite_rick_white_shirt_1795294462808.jpg',
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
    cruisemanager: {
      id: 'cruisemanager',
      name: 'Sabine Lindemann',
      role: 'Kreuzfahrtmanagerin · Entertainment & Events',
      bio: 'Ambitionierte Kreuzfahrtmanagerin der MS Aurora. Liebt spektakuläre Unterhaltung, nennt das Tribunal ein „Gerichts-LARP“ und wittert darin ihre große Beförderung.',
      accentColor: '#ec4899',
      portraitUrl: '/src/assets/images/sprite_cruise_manager_chroma_1795294462722.jpg',
      side: 'right',
    },
    electrician: {
      id: 'electrician',
      name: 'Lars Kowalski',
      role: 'Chef-Bordelektriker',
      bio: 'Trockener, übermüdeter Schiffs-Elektriker aus dem Unterdeck. Kennt jede Sicherung auf der MS Aurora und liebt es, vermeintliche „IT-Experten“ zu foppen.',
      accentColor: '#eab308',
      portraitUrl: '/src/assets/images/sprite_electrician_chroma_1795294462693.jpg',
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
      summary: 'Dr. Vances Schnellbericht: Tod ca. 07:30 Uhr – Eilübergabe an Heraklion.',
      detail:
        'Laut Dr. Helena Vance sprechen Messung (08:15 Uhr) und Standardtabelle (Normwert 21 °C) für einen offiziellen Todeszeitpunkt um 07:30 Uhr – kurz nach der Hafeneinfahrt. Vermerk: Zügige Übergabe an die Hafenbehörde empfohlen.',
    },
    brandt_wachbuch: {
      id: 'brandt_wachbuch',
      name: 'Wachprotokoll Officer Brandt',
      category: 'evidence',
      iconName: 'clock',
      summary: 'Nachtwache bis 06:00 Uhr – Gefangenen bei Schichtende entdeckt.',
      detail:
        'Unterschriebenes Wachprotokoll von Officer Lukas Brandt: Regulärer Dienst bis 06:00 Uhr morgens. Vermerk: „Keine besonderen Vorkommnisse während der Nachtschicht; leblosen Gefangenen beim Kontrollgang zu Schichtende in Zelle 08 entdeckt und gemeldet.“',
    },
    zellen_klima_protokoll: {
      id: 'zellen_klima_protokoll',
      name: 'Zellen-Klimaprotokoll',
      category: 'evidence',
      iconName: 'thermometer',
      summary: 'Zellentemperatur wurde um 03:00 Uhr manuell stark heruntergedreht.',
      detail:
        'Technischer Sensor-Ausdruck der Arrestzelle: Um exakt 03:00 Uhr nachts hat jemand manuell über das Regel-Ventil eingegriffen und die Temperatur in Zelle 08 stark abgesenkt.',
    },
    beweis_brandt_luegt: {
      id: 'beweis_brandt_luegt',
      name: 'Widerspruch: Brandt lügt',
      category: 'evidence',
      iconName: 'clock',
      summary: '02:10 Uhr Krachen vs. Brandts ruhige Schicht bis 06:00 Uhr.',
      detail:
        'Festgehaltener Widerspruch aus deinen Ermittlungen: Während Officer Brandt eine ruhige Wache bis 06:00 Uhr (Fund) und Dr. Vance 07:30 Uhr melden, hörten Zeugen bereits um 02:10 Uhr ein lautes Krachen aus Zelle 08.',
    },
    notiz_todeszeit_0210: {
      id: 'notiz_todeszeit_0210',
      name: 'Notiz: Todeszeitpunkt 02:10 Uhr',
      category: 'evidence',
      iconName: 'file',
      summary: 'Todeszeitpunkt lag in Wahrheit schon bei ca. 02:10 Uhr.',
      detail:
        'Nachdem Eleonore die Kühl-Manipulation angesprochen hat, räumt Kapitän Brammer auf der Kommandobrücke wütend ein, dass der Todeszeitpunkt schon früher um 02:10 Uhr lag – behauptet aber, das ändere nichts.',
    },
    lueftung_streich: {
      id: 'lueftung_streich',
      name: 'Leo & Ricks Streich-Protokoll',
      category: 'evidence',
      iconName: 'clock',
      summary: 'Um 02:10 Uhr hörten die Brüder ein lautes Poltern aus Zelle 08.',
      detail:
        'Bei einem Walkie-Talkie-Streich am Schacht des Rettungsboot-Decks hörten Leo und Rick um exakt 02:10 Uhr tief unten einen umstürzenden Metallhocker – erschrocken riss ihr Gürtel-Clip ab und beide rannten sofort zurück in ihre Kabine.',
    },
    bruecken_log: {
      id: 'bruecken_log',
      name: 'Brücken- & 12-Meilen-Log',
      category: 'evidence',
      iconName: 'receipt',
      summary: 'Griechisches Hoheitsgebiet erst ab 05:45 Uhr erreicht.',
      detail:
        'Offizielles Navigationslog der MS Aurora: Um 02:10 Uhr befand sich das Schiff noch 42 Seemeilen vor Kreta – eindeutig in internationalen Gewässern!',
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
    andrews_verlorener_schal: {
      id: 'andrews_verlorener_schal',
      name: 'Notiz: Andrews verlorener Schal',
      category: 'evidence',
      iconName: 'search',
      summary: 'Identisches Schal-Paar: Andrew sagt gestohlen, Eleonore sagt verlegt.',
      detail:
        'Eleonore trägt ihren blauen Schal wegen ihrer Klimaanlagen-Erkältung selbst – genau das identische Partnergeschenk von Andrew fehlt seit gestern Abend. Andrew schwört, der Schal sei ihm gestohlen worden.',
    },
    schloss_logbuch: {
      id: 'schloss_logbuch',
      name: 'System-Log Magnetschloss MS-400',
      category: 'evidence',
      iconName: 'key',
      summary: 'Keine Türöffnung von 00:00 bis 08:15 Uhr protokolliert.',
      detail:
        'Laut Andrew ist in Zelle 08 ein Magnetschloss der Serie MS-400 verbaut: Bei Stromausfall öffnet es spurlos, schreibt das regulär aber ins Log – und im Speicher steht kein einziger Eintrag.',
    },
    magnet_crash_protokoll: {
      id: 'magnet_crash_protokoll',
      name: 'Schloss-Crash-Befund (15 Min)',
      category: 'evidence',
      iconName: 'bolt',
      summary: 'Überlastung legt MS-400 für 15 Min lahm – ohne Log-Eintrag!',
      detail:
        'Andrews Praxistest an der Konsole beweist: Ein gezielter Controller-Absturz kappt die Magnetspannung für volle 15 Minuten und entriegelt die Tür komplett lautlos, ohne ein einziges Bit ins Zugriffslog zu schreiben.',
    },
    spannungseinbruch_log: {
      id: 'spannungseinbruch_log',
      name: 'Spannungsprotokoll 02:04–02:19',
      category: 'evidence',
      iconName: 'receipt',
      summary: 'Deck -2 zeigte nachts exakt 15 Minuten Spannungseinbruch.',
      detail:
        'Aus der Schaltzentrale von Chef-Elektriker Lars Kowalski: Zwischen exakt 02:04 Uhr und 02:19 Uhr fiel auf Zellentrakt-Schleife B die Versorgung ab – und der Brücken-Alarm wurde manuell stummgeschaltet.',
    },
    obduktion_betaeubung: {
      id: 'obduktion_betaeubung',
      name: 'Toxikologie-Befund: Betäubt!',
      category: 'evidence',
      iconName: 'file',
      summary: 'Arthur Morgan wurde vor seinem Tod stark betäubt!',
      detail:
        'Dr. Vances verspätete Labor-Auswertung beweist eine massive Dosis eines schnell wirkenden Beruhigungsmittels in Arthur Morgans Blut. Er war wehrlos – ein Selbstmord ist damit widerlegt!',
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
      title: 'Offizieller Bericht: 07:30 Uhr',
      detail:
        'Dr. Vance gibt als offiziellen Todeszeitpunkt ca. 07:30 Uhr an (Normwert 21 °C).',
      kind: 'observation',
    },
    thought_c2_brandt_dienst: {
      id: 'thought_c2_brandt_dienst',
      title: 'Brandts Fund bei Schichtende (06:00)',
      detail:
        'Laut Wachprotokoll war nachts alles ruhig – erst am Ende seiner Schicht um 06:00 Uhr fand Brandt Arthur tot in Zelle 08.',
      kind: 'observation',
    },
    thought_c2_0210_poltern: {
      id: 'thought_c2_0210_poltern',
      title: 'Krachen im Schacht um 02:10 Uhr',
      detail:
        'Leo und Rick hörten bei ihrem Streich um 02:10 Uhr tief unten einen lauten Schlag in Zelle 08 und rannten erschrocken weg.',
      kind: 'observation',
    },
    thought_c2_zeit_unmoeglich: {
      id: 'thought_c2_zeit_unmoeglich',
      title: '06:00 Uhr gefunden vs. 07:30 Uhr tot?!',
      detail:
        'Brandt fand Arthur um 06:00 Uhr tot – doch der Arztbericht nennt 07:30 Uhr als Todeszeitpunkt! Hier wird etwas massiv verschleiert!',
      kind: 'deduction',
    },
    thought_c2_brandt_luegt: {
      id: 'thought_c2_brandt_luegt',
      title: 'Brandt lügt (02:10 vs. 06:00/07:30)!',
      detail:
        'Schon um 02:10 Uhr krachte es in der Zelle, obwohl Brandt eine ruhige Schicht bis 06:00 Uhr protokolliert hat! Zeig es Dimitri in Zelle 08!',
      kind: 'deduction',
    },
    thought_c2_kuehlung_9grad: {
      id: 'thought_c2_kuehlung_9grad',
      title: 'Temperatur in Zelle 08 um 03:00 Uhr geändert',
      detail:
        'Jemand hat die Zellentemperatur um 03:00 Uhr manuell stark heruntergeregelt.',
      kind: 'observation',
    },
    thought_c2_wahre_tatzeit: {
      id: 'thought_c2_wahre_tatzeit',
      title: 'Todeszeitpunkt 02:10 Uhr!',
      detail:
        'Auf der Kommandobrücke hat der Kapitän zähneknirschend eingeräumt, dass der Todeszeitpunkt schon um 02:10 Uhr lag – behauptet aber, das ändere nichts. Was wohl Kommissar Dimitri dazu sagt?',
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
    thought_c2_a3_schal_zwilling: {
      id: 'thought_c2_a3_schal_zwilling',
      title: 'Zwei identische Kreta-Schals',
      detail:
        'Eleonore trägt ihren gegen den Zug der Klimaanlage – doch Andrews exakt gleiches Geschenk-Exemplar verschwand gestern! Trotzdem bleibt das Rätsel um das unberührte Schloss.',
      kind: 'observation',
    },
    thought_c2_a3_gerichts_larp: {
      id: 'thought_c2_a3_gerichts_larp',
      title: 'Deal: Abend-Gerichtsshow',
      detail:
        'Kreuzfahrtmanagerin Sabine Lindemann überstimmt den Kapitän für ihr „Gerichts-LARP“. Wir dürfen weiterermitteln, wenn wir heute Abend wieder verhandeln.',
      kind: 'observation',
    },
    thought_c2_a3_magnetschloss: {
      id: 'thought_c2_a3_magnetschloss',
      title: 'Magnetschloss MS-400 (Sauberes Log?)',
      detail:
        'Andrew meint, das Magnetschloss öffnet bei Stromausfall ohne Gewalt – aber jeder Vorfall stünde im Logbuch. Solange das Log sauber scheint, blockt er ab.',
      kind: 'question',
    },
    thought_c2_a3_log_luecke: {
      id: 'thought_c2_a3_log_luecke',
      title: 'Elektronik-Logs sind nicht sicher!',
      detail:
        'Auch die Kühlung wurde um 03:00 Uhr verändert, ohne dass die Zellendaten einen Einlass zeigten! Zeig Andrew in Zelle 08 das Zellen-Klimaprotokoll!',
      kind: 'deduction',
    },
    thought_c2_a3_15min_luecke: {
      id: 'thought_c2_a3_15min_luecke',
      title: '15 Min Schloss-Ausfall ohne Log!',
      detail:
        'Bei einem Controller-Crash öffnet sich Zelle 08 für 15 Minuten spurlos und ohne Logbucheintrag. Gab es genau so einen Ausfall heute Nacht auf Deck -2?',
      kind: 'observation',
    },
    thought_c2_a3_arthur_betaeubt: {
      id: 'thought_c2_a3_arthur_betaeubt',
      title: 'Arthur war schwer betäubt!',
      detail:
        'Dr. Vances Toxikologie beweist eine hohe Dosis Schlaf-/Beruhigungsmittel in Arthurs Blut. Kein Kampf, kein Selbstmord!',
      kind: 'observation',
    },
    thought_c2_a3_mord_bewiesen: {
      id: 'thought_c2_a3_mord_bewiesen',
      title: 'ES WAR MORD! (Betäubt + 15 Min offen)',
      detail:
        'Unbemerkter 15-Minuten-Einstieg von 02:04 bis 02:19 Uhr plus betäubtes Opfer: Arthur Morgan wurde ermordet! Ab in die Abend-Gerichtsshow!',
      kind: 'deduction',
    },
  },
  logicCombinations: [
    {
      id: 'c2_logic_brandt_zeit',
      thoughtA: 'thought_c2_brandt_dienst',
      thoughtB: 'thought_c2_0730_hafen',
      resultThoughtId: 'thought_c2_zeit_unmoeglich',
      feedbackLines: [
        {
          speakerId: 'nate',
          emotion: 'shocked',
          shout: 'MOMENT MAL!',
          shake: true,
          text: 'Halt mal kurz alles an, Maya! Schau dir diese beiden Uhrzeiten nebeneinander an!',
        },
        {
          speakerId: 'nate',
          emotion: 'thinking',
          text: 'Laut Brandts unterschriebenem Wachprotokoll hat er Arthur Morgan bereits am Ende seiner Schicht um 06:00 Uhr morgens tot in Zelle 08 aufgefunden…',
        },
        {
          speakerId: 'maya',
          emotion: 'shocked',
          text: '… aber in Dr. Vances offiziellem Arzt-Bericht steht als Todeszeitpunkt erst 07:30 Uhr?! Das wären ja anderthalb Stunden, NACHDEM er schon tot gefunden wurde!!',
        },
        {
          speakerId: 'nate',
          emotion: 'thinking',
          text: 'Ganz genau. Niemand stirbt um 07:30 Uhr, wenn man ihn schon um 06:00 Uhr leblos entdeckt hat. Hier wird doch massiv etwas an den Uhrzeiten verschleiert!',
        },
      ],
    },
    {
      id: 'c2_logic_brandt_luege',
      thoughtA: 'thought_c2_zeit_unmoeglich',
      thoughtB: 'thought_c2_0210_poltern',
      resultThoughtId: 'thought_c2_brandt_luegt',
      setsFlag: 'flag_c2_a2_brandt_widerspruch_geloest',
      unlocksEvidence: 'beweis_brandt_luegt',
      feedbackLines: [
        {
          speakerId: 'nate',
          emotion: 'confident',
          shout: 'VOLLTREFFER!',
          shake: true,
          text: 'HAB ICH IHN!! Jetzt greift jedes Zahnrad ineinander, Maya!!',
        },
        {
          speakerId: 'maya',
          emotion: 'shocked',
          text: 'Um exakt 02:10 Uhr nachts krachte es tief unten in Zelle 08 so laut, dass Leo und Rick es oben im Schacht hörten!',
        },
        {
          speakerId: 'nate',
          emotion: 'confident',
          text: 'Und das geschah mitten in Officer Brandts Nachtschicht! Trotzdem behauptet er felsenfest, die Nacht sei ruhig gewesen, und notiert einen Fund um 06:00 Uhr gegenüber Dr. Vances 07:30 Uhr! Brandt LÜGT!! Zurück in die Arrestzelle zu Kommissar Dimitri – machen wir ihm diesen Widerspruch mit Händen und Füßen klar!',
        },
      ],
    },
    {
      id: 'c2_logic_a3_log_zweifel',
      thoughtA: 'thought_c2_kuehlung_9grad',
      thoughtB: 'thought_c2_a3_magnetschloss',
      resultThoughtId: 'thought_c2_a3_log_luecke',
      feedbackLines: [
        {
          speakerId: 'nate',
          emotion: 'confident',
          shout: 'MOMENT MAL!',
          shake: true,
          text: 'Genau das braucht Andrew! Um 03:00 Uhr wurde die Temperatur in dieser angeblich völlig abgesperrten Zelle verstellt, ohne dass ein Türscan auftauchte!',
        },
        {
          speakerId: 'nate',
          emotion: 'thinking',
          text: 'Das könnte reichen, um Andrews Zweifel an den elektronischen Aufzeichnungen der Zelle ins Wanken zu bringen.',
        },
      ],
    },
    {
      id: 'c2_logic_a3_mord_beweis',
      thoughtA: 'thought_c2_a3_15min_luecke',
      thoughtB: 'thought_c2_a3_arthur_betaeubt',
      resultThoughtId: 'thought_c2_a3_mord_bewiesen',
      setsFlag: 'flag_c2_a3_showtime',
      feedbackLines: [
        {
          speakerId: 'nate',
          emotion: 'confident',
          shout: 'VOLLTREFFER!',
          shake: true,
          text: 'Jetzt gibt es keinen Zweifel mehr, Maya! Zwischen 02:04 und 02:19 Uhr war das Magnetschloss für volle 15 Minuten ohne Log-Eintrag offen – und Arthur Morgan lag schwer betäubt in der Zelle!!',
        },
        {
          speakerId: 'maya',
          emotion: 'shocked',
          text: 'Das war ein kaltblütiger Mord in einer scheinbar verschlossenen Zelle!! Auf in den Großen Ballsaal zur Abend-Gerichtsshow!',
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
          characterId: 'andrew',
          visibleIfFlag: 'flag_c2_a1_angenommen',
          hideIfFlag: 'flag_c2_dimitri_weg',
        },
        {
          characterId: 'eleonore',
          visibleIfFlag: 'flag_c2_a1_angenommen',
          hideIfFlag: 'flag_c2_dimitri_weg',
        },
        {
          characterId: 'captain',
          visibleIfFlag: 'flag_c2_a1_rauswurf',
          hideIfFlag: 'flag_c2_a2_bruecke_freigeschaltet',
        },
        {
          characterId: 'dimitri',
          visibleIfFlag: 'flag_c2_a1_rauswurf',
          hideIfFlag: 'flag_c2_a1_angenommen',
        },
        {
          characterId: 'andrew',
          visibleIfFlag: 'flag_c2_dimitri_weg',
          hideIfFlag: 'flag_c2_a3_andrew_in_zelle',
        },
        {
          characterId: 'eleonore',
          visibleIfFlag: 'flag_c2_dimitri_weg',
          hideIfFlag: 'flag_c2_a3_showtime',
        },
        {
          characterId: 'conrad',
          visibleIfFlag: 'flag_c2_dimitri_weg',
          hideIfFlag: 'flag_c2_a3_andrew_in_zelle',
        },
        {
          characterId: 'cruisemanager',
          visibleIfFlag: 'flag_c2_a3_pass_erlaubnis',
          hideIfFlag: 'flag_c2_a3_showtime',
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
              text: 'Die ganze Gangway wurde tatsächlich mit gelb-schwarzem Absperrband dichtgemacht. Zwei stämmige Matrosen stehen davor und lassen nicht einmal die Kofferträger durch.',
            },
            {
              speakerId: 'maya',
              emotion: 'shocked',
              text: 'Schade um unseren schönen Morgen-Plan… und schau mal ganz nach unten auf den Kai, Nate! Da blinkt doch blaues Licht – mindestens zwei Streifenwagen der griechischen Hafenpolizei sind schon vorgefahren!',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Zwei Streifenwagen direkt am Pier und ein komplettes Ausgehverbot für tausend Kreuzfahrtgäste? Eine harmlose Zollkontrolle sieht jedenfalls anders aus.',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Vor allem frage ich mich, wo Detective Marston und Staatsanwalt von Falk stecken… Gestern Abend wollte Falk uns beim Frühstück noch großspurig im Ballsaal auslachen!',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              setsFlag: 'flag_c2_a1_promenade',
              text: 'Stimmt, und jetzt fehlt von beiden jede Spur. Der Steward da vorn hat auf meine Frage nur nervös geschluckt und Richtung Innendecks genickt – schauen wir im Musiksalon und im VIP-Salon nach, was hinter den Kulissen passiert ist!',
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
              speakerId: 'conrad',
              emotion: 'smug',
              text: 'Boah, guckt mal, da unten am Steg schwimmt ein riesiger Fisch!! Oder ist das ’n kleiner Hai?!',
            },
            {
              speakerId: 'andrew',
              emotion: 'grumpy',
              text: 'Conrad! Runter von der untersten Relingstange, sofort!! Wie oft hab ich dir gesagt, du sollst dich hier nicht halb drüberhängen?!',
            },
            {
              speakerId: 'nate',
              emotion: 'sweating',
              text: 'Hoppla – hab ihn am Rucksackträger. Alles gut, kleiner Mann, von hier oben sieht man die Fische doch genauso gut.',
            },
            {
              speakerId: 'eleonore',
              emotion: 'confident',
              text: 'Oh, danke, Mr. Sterling! Schnelle Reflexe wie bei einem guten Verteidiger! Andrew, siehst du, man muss nur freundlich mit ihm reden!',
            },
            {
              speakerId: 'andrew',
              emotion: 'neutral',
              text: 'Klar, in drei Minuten hängt er wieder dran… Ach, Mr. Sterling, schauen Sie lieber in den Salons nach, was hier los ist – sonst drehe ich hier an Deck noch durch!',
            },
          ],
        },
      ],
      talkTopics: [
        {
          id: 'higginson_was_ist_los',
          title: 'Familie Higginson: Was habt ihr beobachtet?',
          speakerId: 'eleonore',
          hideIfFlag: 'flag_c2_a1_rauswurf',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'neutral',
              text: 'Sagen Sie mal, Sie standen ja schon recht früh an der Reling – haben Sie gesehen, wann und warum die Crew die Gangway plötzlich abgeriegelt hat?',
            },
            {
              speakerId: 'eleonore',
              emotion: 'confident',
              setsFlag: 'flag_c2_a1_promenade',
              text: 'Oh ja! Wir wollten uns die besten Plätze für die Hafeneinfahrt sichern – und ich hab zu Andrew noch gesagt: „Den da kenn ich doch aus dem Bord-Fernsehen!“, als Sie vorhin um die Ecke kamen!',
            },
            {
              speakerId: 'eleonore',
              emotion: 'shocked',
              text: 'Kurz nach acht rannten plötzlich drei Sicherheitsoffiziere kreidebleich an uns vorbei zur Treppe nach unten! Ich hab sofort zu Andrew gesagt: „Schatz, das riecht nach Fall 2!“',
            },
            {
              speakerId: 'andrew',
              emotion: 'grumpy',
              text: 'Und ich hab zum zehnten Mal geantwortet, dass ein Urlaub KEINE Kriminalserie ist! Wir hätten ins Allgäu fahren sollen – auf einer Alm sperrt niemand morgens um acht die Wandertür ab!',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: '(Der arme Mann seufzt ja fast so laut wie das Nebelhorn… Was sage ich ihm am besten?)',
              choices: [
                {
                  label: '„Da haben Sie recht – auf einer Alm gibt’s keinen Hafenalarm.“',
                  nextLines: [
                    {
                      speakerId: 'andrew',
                      emotion: 'neutral',
                      text: 'Danke!! Endlich mal jemand mit klarem Menschenverstand hier an Bord!',
                    },
                  ],
                },
                {
                  label: '„Immerhin wartet hier unten statt Steigungen das Frühstücksbuffet!“',
                  nextLines: [
                    {
                      speakerId: 'andrew',
                      emotion: 'neutral',
                      text: 'Hm… na schön, das Rührei mit Speck heute früh war tatsächlich gar nicht so verkehrt.',
                    },
                  ],
                },
              ],
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Ach, nehmen Sie es sportlich, Mr. Higginson – ein Schiff voller Geheimnisse ist doch fast noch spannender als Kühe auf einer Wiese!',
            },
            {
              speakerId: 'conrad',
              emotion: 'smug',
              text: 'Hast du denn in deiner riesigen Tasche auch Handschellen oder eine echte Detektiv-Lupe dabei, Fräulein Maya?!',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              sfx: 'bag_rummage',
              text: 'Hahaha, die Lupe hab ich gestern wieder eingepackt, ja – aber die bleibt schön geheim, bis wir wirklich einen Hinweis finden!',
            },
            {
              speakerId: 'andrew',
              emotion: 'grumpy',
              text: 'Conrad, jetzt hör auf, fremde Damen nach ihrem Tascheninhalt auszufragen! Wo bleiben eigentlich Leo und Rick schon wieder? Eleonore, die zwei hecken doch garantiert wieder irgendeinen Unfug aus!',
            },
            {
              speakerId: 'eleonore',
              emotion: 'neutral',
              text: 'Lass sie doch ein bisschen herumstromern, Andrew – sie haben schließlich Ferien! Und solange sie nichts kaputtmachen…',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: '(Sicherheitsoffiziere, die kreidebleich nach unten rennen, und Hafenpolizei am Kai… Klingt leider nach deutlich mehr als nur verlorenem Gepäck. Gehen wir die anderen Salons abklappern, Maya!)',
            },
          ],
        },
        {
          id: 'dimitri_ansprechen',
          title: 'Kommissar Dimitri: Direkt ansprechen',
          speakerId: 'dimitri',
          requiredFlag: 'flag_c2_a1_rauswurf',
          hideIfFlag: 'flag_c2_a1_angenommen',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'neutral',
              text: 'Entschuldigen Sie, Kommissar Dimitri – sprechen Sie vielleicht ein wenig Englisch oder ein paar Brocken Deutsch? Ich würde gern verstehen, was Sie von mir erwarten.',
            },
            {
              speakerId: 'dimitri',
              emotion: 'confident',
              text: 'Α, κύριε Στέρλινγκ! Ναι, βεβαίως, ακούστε με προσεκτικά: η υπόθεση στο καράβι έχει πολλές σκιές και κανένας αξιωματικός δεν μου λέει όλη την αλήθεια για το βράδυ!',
            },
            {
              speakerId: 'dimitri',
              emotion: 'confident',
              text: 'Χρειαζόμαστε καθαρό μυαλό, καλό ελληνικό καφέ και απόλυτη διαφάνεια πριν υπογράψω οποιοδήποτε χαρτί για το λιμεναρχείο του Ηρακλείου!',
            },
            {
              speakerId: 'dimitri',
              emotion: 'confident',
              text: 'Ελάτε μαζί μου, θα ελέγξουμε τα πάντα βήμα-βήμα και μετά θα κεράσω τζατζίκι στην παραλία!',
            },
            {
              speakerId: 'maya',
              emotion: 'sweating',
              text: 'Ähm… hast du diesmal irgendwas verstanden? Ich glaub, am Schluss klang ein Wort fast wie „Zaziki“ – oder vielleicht auch „Zelle“?',
            },
            {
              speakerId: 'nate',
              emotion: 'sweating',
              text: 'Kein einziges Wort. Höchstens „Kaffee“ – falls ich mir das bei seinem Redetempo nicht bloß eingebildet habe.',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Aber er lächelt uns irgendwie freundlich zu und deutet gleichzeitig auf seine Polizei-Dienstmarke… Ob er einfach wissen will, ob wir ihm helfen?',
            },
            {
              speakerId: 'nate',
              emotion: 'sweating',
              text: 'Gut möglich. Bevor ich auf Griechisch irgendetwas Falsches abnicke, fragen wir doch lieber nochmal Kapitän Brammer, was genau der Kommissar von uns will.',
            },
          ],
        },
        {
          id: 'captain_warum_nate',
          title: 'Kapitän Brammer: Warum will Dimitri ausgerechnet uns?',
          speakerId: 'captain',
          requiredFlag: 'flag_c2_a1_rauswurf',
          hideIfFlag: 'flag_c2_a1_angenommen',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Entschuldigen Sie, Kapitän Brammer – können Sie mir mal kurz übersetzen, was Kommissar Dimitri da eben genau von mir wollte? Er ist doch gerade erst vom Hafen an Bord gekommen!',
            },
            {
              speakerId: 'captain',
              emotion: 'neutral',
              text: 'Er will Sie bei der Sache dabei haben. Ganz einfach.',
            },
            {
              speakerId: 'nate',
              emotion: 'sweating',
              text: 'Aber woher weiß er überhaupt, wer ich bin? Er konnte unsere Verhandlung gestern ja kaum im Bord-Fernsehen verfolgt haben.',
            },
            {
              speakerId: 'dimitri',
              emotion: 'confident',
              text: 'Κύριε Στέρλινγκ, δεν σας είδα στην τηλεόραση – δεν έχω καν πρόσβαση στο κλειστό κύκλωμα του πλοίου! Όμως το πρωί ο καπετάνιος μού έστειλε το επίσημο ημερολόγιο και τη σύνοψη της χθεσινής δίκης!',
            },
            {
              speakerId: 'captain',
              emotion: 'neutral',
              text: 'Ich musste der Hafenbehörde vor dem Anlegen das offizielle Bord-Protokoll von gestern rüberfunken. Ihr Name stand fett drin – weil Sie als Einziger den wahren Täter statt dem nächstbesten Sündenbock überführt haben.',
            },
            {
              speakerId: 'dimitri',
              emotion: 'confident',
              text: 'Ο εισαγγελέας και ο επιθεωρητής φωνάζουν όλη την ώρα και βιάζονται να κλείσουν το κελί. Όταν διάβασα πώς σώσατε έναν αθώο χθες, κατάλαβα ότι είστε ο μόνος ψύχραιμος εδώ μέσα!',
            },
            {
              speakerId: 'captain',
              emotion: 'neutral',
              text: 'Er sagt, Ihre eigenen Schiffsleute reden da unten viel zu nervös um den heißen Brei. Ihnen traut er. Denen nicht.',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Oh! Hörst du das, Nate? Kommissar Dimitri möchte dich offiziell als unabhängigen Blick an seiner Seite haben!',
            },
            {
              speakerId: 'nate',
              emotion: 'sweating',
              text: 'Moment mal, ganz langsam, Maya… Ich bin Strafverteidiger im Urlaub und kein Hilfsermittler für die griechische Hafenpolizei! Außerdem hast du ja gesehen, wie geladen Staatsanwalt von Falk schon jetzt auf mich ist.',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Und genau DAS macht mir Sorgen, Nate! Hast du gehört, was Falk dir eben unten im Gang an den Kopf geworfen hat? Er schiebt die ganze Schuld an Arthurs Tod auf dein Urteil von gestern!',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Hm… stimmt schon. Ich hab Arthur Morgan gestern überführt – und keine zwölf Stunden später stirbt er genau in dieser Arrestzelle, während Marston und Falk am liebsten sofort die Tür zuschweißen würden.',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Und abgesehen davon: Von Bord lässt uns heute Vormittag sowieso niemand! Also warum sollen wir uns nicht wenigstens gemeinsam mit Dimitri anschauen, was eigentlich passiert ist? Wenn alles ein tragischer Unfall war, gehen wir danach beruhigt an den Strand!',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: '(Eigentlich wollte ich heute Urlaub machen – aber einfach umdrehen und abtauchen?)',
              choices: [
                {
                  label: '„Stimmt ja – von Bord kommen wir jetzt ohnehin nicht.“',
                  nextLines: [
                    {
                      speakerId: 'nate',
                      emotion: 'sweating',
                      text: 'Recht hast du… solange die Gangway zu bleibt, können wir unsere Zeit genauso gut sinnvoll nutzen.',
                    },
                  ],
                },
                {
                  label: '„Falk schiebt mir die Schuld zu – das lasse ich nicht stehen!“',
                  nextLines: [
                    {
                      speakerId: 'nate',
                      emotion: 'confident',
                      text: 'Ich lasse mir sicher nicht nachsagen, ich hätte gestern jemanden leichtfertig in den Tod geschickt!',
                    },
                  ],
                },
              ],
            },
            {
              speakerId: 'dimitri',
              emotion: 'confident',
              text: 'Παρακαλώ, κύριε Στέρλινγκ! Μόνο λίγη βοήθεια μέχρι να δούμε καθαρά τα γεγονότα!',
            },
            {
              speakerId: 'captain',
              emotion: 'neutral',
              text: 'Er bittet höflich. Bis Mittag hält er Ihnen den Staatsanwalt vom Hals.',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Na gut… versprochen ist erst einmal nichts, aber wegschauen kann ich bei der Sache auch nicht. Fangen wir ganz ruhig an und hören uns erst einmal an, was die Leute hier an Bord überhaupt über die Nacht wissen.',
              completesChapter: {
                completedChapterTitle: 'Akt 2.1 abgeschlossen',
                completedTimeLabel: 'Tag 4 · Morgen beendet',
                summary:
                  'Nach dem Trubel mit Familie Higginson und dem Rauswurf vor Zelle 08 schaltet sich Kommissar Dimitri von der Hafenpolizei Heraklion ein. Dank Kapitän Brammers Funk-Protokoll vertraut er nur deinem Urteil – und Nate beschließt, erst einmal behutsam herauszufinden, was in der Nacht überhaupt geschehen ist.',
                nextChapterId: 'c2_akt2_mittag',
                nextLocationId: 'infirmary',
                nextPhase: 'investigation',
                nextTimeOfDay: 'tag',
                unlocksLocations: ['infirmary', 'brig_cell'],
                locksLocations: ['lifeboat_deck'],
                setsFlag: 'flag_c2_a1_angenommen',
                nextButtonLabel: 'Weiter zu Tag 4 · Mittag (Akt 2.2)',
                nextIntroLines: [
                  {
                    speakerId: 'maya',
                    emotion: 'thinking',
                    setsFlag: 'flag_c2_a1_angenommen',
                    text: 'Tag 4, Mittag! Kommissar Dimitri hat vorhin oben beim Kapitän tatsächlich ordentlich Druck gemacht.',
                  },
                  {
                    speakerId: 'nate',
                    emotion: 'thinking',
                    text: 'Immerhin dürfen wir uns jetzt endlich offiziell umschauen, statt direkt von Falk vor die Tür gesetzt zu werden.',
                  },
                  {
                    speakerId: 'maya',
                    emotion: 'thinking',
                    text: 'Genau! Neben dem Gang vor Arrestzelle 08 steht uns ab sofort auch die Krankenstation offen – und bis zur Mittagsanhörung bleibt nicht mehr allzu viel Zeit.',
                  },
                  {
                    speakerId: 'nate',
                    emotion: 'thinking',
                    text: 'Gehen wir strukturiert vor: Schauen wir zuerst bei Dr. Vance in der Krankenstation vorbei und hören uns unvoreingenommen an, was die medizinischen Unterlagen zur Nacht sagen.',
                  },
                ],
              },
            },
          ],
        },
        {
          id: 'higginson_mittag_pause',
          title: 'Familie Higginson: Wie läuft’s an Deck?',
          speakerId: 'andrew',
          requiredFlag: 'flag_c2_a1_angenommen',
          hideIfFlag: 'flag_c2_a2_rettungsdeck_offen',
          lines: [
            {
              speakerId: 'andrew',
              emotion: 'grumpy',
              text: 'Mittag ist längst durch, und wir stehen immer noch in der prallen Sonne vor Heraklion! Wenigstens habe ich Conrad gerade mit einer riesigen Tüte Salzcracker unter dem Sonnensegel festgenagelt.',
            },
            {
              speakerId: 'eleonore',
              emotion: 'confident',
              text: 'Ach, Andrew, nörgel doch nicht dauernd herum! Siehst du nicht, dass Mr. Sterling hochkonzentriert ermittelt? Kommen Sie denn überhaupt voran, Herr Verteidiger?',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Schwierig… unten vor Zelle 08 steht ein Sicherheitsoffizier namens Brandt wie eine Mauer vor dem Gitter und lässt uns keinen Schritt in die Zelle hinein.',
              choices: [
                {
                  label: '„Wenn wenigstens jemand nachts etwas gehört hätte…“',
                  nextLines: [
                    {
                      speakerId: 'eleonore',
                      emotion: 'confident',
                      text: 'Oh! In jedem guten Krimi gibt es genau dann einen geheimen Ohrenzeugen, der wach war, als eigentlich niemand wach sein sollte!',
                    },
                  ],
                },
                {
                  label: '„Sie wollen einfach alles blitzschnell als Selbstmord abhaken.“',
                  nextLines: [
                    {
                      speakerId: 'eleonore',
                      emotion: 'shocked',
                      text: 'Typisch!! Genau so fängt Fall 2 in den Klassikern immer an – überhastete Abschlussberichte sind IMMER verdächtig!',
                    },
                  ],
                },
              ],
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Wir wissen jedenfalls nicht einmal, ob heute Nacht dort unten überhaupt alles so ruhig war, wie das Wachbuch behauptet…',
            },
            {
              speakerId: 'andrew',
              emotion: 'neutral',
              text: 'Also gehört hab ich nachts gar nichts – ich hab nach dem Abendessen durchgeschlafen wie ein Stein. Nur unsere beiden Großen, Leo und Rick, benehmen sich seit heute früh reichlich merkwürdig.',
            },
            {
              speakerId: 'andrew',
              emotion: 'grumpy',
              text: 'Ständig schleichen sie heimlich nach oben aufs Rettungsboot-Deck und tuscheln über ihr grünes Walkie-Talkie… keine Ahnung, was die zwei da oben schon wieder ausgefressen haben.',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              unlocksLocation: 'lifeboat_deck',
              setsFlag: 'flag_c2_a2_rettungsdeck_offen',
              text: 'Auf dem Rettungsboot-Deck?! Danke, Mr. Higginson – schauen wir doch gleich oben auf dem Rettungsboot-Deck vorbei und fühlen Leo und Rick mal ein bisschen auf den Zahn!',
            },
          ],
        },
        {
          id: 'captain_seemeilen_warten',
          title: 'Kapitän Brammer: Wie geht es hier weiter?',
          speakerId: 'captain',
          requiredFlag: 'flag_c2_a1_angenommen',
          hideIfFlag: 'flag_c2_a2_bruecke_freigeschaltet',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Kapitän Brammer – wie lange sollen die Passagiere hier auf dem Deck eigentlich noch festgehalten werden? Langsam werden die Gäste ziemlich unruhig.',
            },
            {
              speakerId: 'captain',
              emotion: 'neutral',
              text: 'Mir passt dieser Stau vor meiner eigenen Gangway genauso wenig wie Ihren Urlaubern, Herr Sterling. Auf so einem Kreuzfahrtschiff hängt jeder Zeitplan an der Minute.',
            },
            {
              speakerId: 'captain',
              emotion: 'neutral',
              text: 'Die Schiffsärztin hat ihren Bericht vorgelegt, und um Punkt Mittag gibt es die offizielle Abschlussuntersuchung vor dem Seegericht im Großen Ballsaal.',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Und danach rechnen Sie damit, dass alles abgeschlossen ist?',
            },
            {
              speakerId: 'captain',
              emotion: 'neutral',
              text: 'Bis dahin trägt Kommissar Dimitri die Papiere zusammen – danach übernimmt das Hafenamt den Vorfall und ich bekomme meine Passagiere endlich geordnet an Land.',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: '(Irgendwie klingt der Kapitän, als könnte es ihm mit dieser Übergabe gar nicht schnell genug gehen…)',
            },
          ],
        },
        {
          id: 'c2_a3_promenade_maya_plan',
          title: 'Maya: Wie gehen wir in Sachen Zelle 08 weiter vor?',
          speakerId: 'maya',
          requiredFlag: 'flag_c2_a3_start',
          hideIfFlag: 'flag_c2_a3_pass_erlaubnis',
          lines: [
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Tja, da stehen wir also wieder auf dem Promenadendeck, Nate. Unten liegt der Hafen von Heraklion in voller Nachmittagssonne, und eigentlich könnten wir gerade Oliven und Feta bestellen.',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Stattdessen kreist mir ständig dieser doppelte blaue Kreta-Schal durch den Kopf. Eleonore trägt ihren wegen der kühlen Klimaanlage, während Andrews identischer Schal seit gestern Abend angeblich verschwunden ist.',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Und als wir heute früh in Zelle 08 standen, hielten wir das blaue Seidentuch oben an der Stange für irgendein Kellner-Halstuch von Arthur! Wenn das aber Andrews Schal war, wie kam er dann bitte in eine abgeschlossene Zelle ohne Tür-Eintrag?!',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Genau das ist die Wand, vor der ich stehe. Aus dem Gedächtnis allein kommen wir da nicht weiter – ich muss mir die Tür und das Zellenschloss unten noch einmal mit eigenen Augen ansehen.',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Dann auf nach unten zu Arrestzelle 08! Sobald wir irgendwie an dem Gitter vorbeikommen, holen wir unseren genervten IT-Berater dazu!',
            },
          ],
        },
        {
          id: 'c2_a3_promenade_eleonore_schal',
          title: 'Eleonore & Andrew: Wegen dem gestohlenen Schal…',
          speakerId: 'eleonore',
          requiredFlag: 'flag_c2_a3_start',
          hideIfFlag: 'flag_c2_a3_andrew_in_zelle',
          lines: [
            {
              speakerId: 'eleonore',
              emotion: 'confident',
              text: 'Hach, ich fühle mich wie mitten in der spannendsten Doppelfolge, Mr. Sterling! Sagen Sie Bescheid, sobald Andrew zu Ihnen hinunterkommen soll – ich packe ihm auch schon eine kleine Tasche mit Gummibärchen und Taschentüchern!',
            },
            {
              speakerId: 'andrew',
              emotion: 'grumpy',
              shake: true,
              text: 'Eleonore, ich gehe eine Tür angucken, nicht auf eine dreitägige Polarexpedition!! Und zu Ihnen, Nate: Sorgen Sie unten erst mal für Zutritt – vorher bewege ich mich keinen Millimeter aus diesem Schattenplatz weg!',
            },
            {
              speakerId: 'nate',
              emotion: 'sweating',
              text: 'Verstanden, Andrew. Und wenn wir drinnen sind, versuche ich auch nicht, Ihren Drucker zu reparieren.',
            },
            {
              speakerId: 'andrew',
              emotion: 'grumpy',
              text: 'Sehr witzig. Vergessen Sie nicht: Datenbanken! Keine Elektronikschlösser!',
            },
          ],
        },
        {
          id: 'c2_a3_promenade_managerin',
          title: 'Sabine Lindemann: Wie läuft unser „Gerichts-LARP“?',
          speakerId: 'cruisemanager',
          requiredFlag: 'flag_c2_a3_pass_erlaubnis',
          hideIfFlag: 'flag_c2_a3_showtime',
          lines: [
            {
              speakerId: 'cruisemanager',
              emotion: 'confident',
              text: 'Na, Herr Verteidiger! Die Vorfreude auf den Abend brodelt schon im ganzen Speisesaal – die Küche hat extra „Einspruch!“-Servietten falten lassen und an der Bar wetten die Gäste bereits drei zu eins darauf, was Sie heute im Großen Ballsaal aus dem Hut zaubern!',
            },
            {
              speakerId: 'nate',
              emotion: 'sweating',
              text: '„Einspruch“-Servietten?! Frau Lindemann, hier geht es um den ungeklärten Tod eines Menschen, nicht um eine Zirkusvorstellung!',
            },
            {
              speakerId: 'cruisemanager',
              emotion: 'confident',
              text: 'Ach was – nennen wir es niveauvolles Qualitäts-Entertainment mit Aufklärungs-Mehrwert! Unser großes Kreuzfahrt-Gerichts-LARP! Schaffen Sie unten harte Fakten, dann liefert unsere Show heute Abend Traumquoten… und mein Schreibtisch in der Reederei-Zentrale rückt wieder ein Stück näher!',
            },
            {
              speakerId: 'maya',
              emotion: 'sweating',
              text: '(Irgendwie ist sie mir unheimlicher als Staatsanwalt von Falk…)',
            },
          ],
        },
      ],
      presentRules: [],
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
      backgroundUrl: '/src/assets/images/case2_music_salon_day_1795186993338.jpg',
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
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Wie merkwürdig still es hier im Musiksalon ist… Gestern Abend hat hier noch Anyas Konzertflügel den halben Saal gefüllt.',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Und jetzt stehen auf den kleinen Marmortischen noch halbvolle Kaffeetassen und angebissene Croissants – fast so, als wären die Gäste mitten im Frühstück aufgescheucht worden.',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Schau mal rüber zum Konzertflügel, Nate! Auf der Klavierbank liegt ein zerknitterter Dienstplan der Stewards.',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Tatsächlich… Jemand hat mit dickem rotem Stift die gesamte Morgenbesatzung vom Frühstücksbuffet abgezogen. Abgezogen? Wohin denn – etwa zu den Kabinen?',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              setsFlag: 'flag_c2_a1_music',
              text: 'Nein, eher in den Service-Trakt! Ein Kellner an der Tür meinte gerade noch flüsternd, Detective Marston und Staatsanwalt von Falk seien vor zehn Minuten kreidebleich die hintere Treppe ganz nach unten gestürzt!',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Ganz nach unten in die Service-Decks? Wenn Marston und Falk es beide so eilig hatten, steckt dort etwas Ernsteres dahinter als ein verlegter Koffer.',
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
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Hätte gedacht, Marston hält hier vielleicht ein kleines Briefing für die verunsicherten Passagiere ab – aber hier drinnen lässt sich kein einziger Offizier blicken.',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Kein Wunder. Ich hab vorhin den Barkeeper gefragt, der meinte nur: „Stellen Sie keine Fragen, Miss, heute Morgen stimmt unter Deck gar nichts.“ Danach hat er sofort alle Gläser weggeräumt.',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Klingt gar nicht gut… Vor allem, wenn auch Staatsanwalt von Falk so früh am Morgen mit ihm unterwegs ist. Der Mann würde normalerweise niemals vor neun Uhr ohne frisch gebügelten Kragen irgendwo hinrennen.',
            },
            {
              speakerId: 'maya',
              emotion: 'sweating',
              sfx: 'bag_rummage',
              setsFlag: 'flag_c2_a1_music',
              text: 'Und ich hatte meinen großen Strandhut schon ganz oben griffbereit in die Tasche gestopft… Na komm, schauen wir mal weiter, ob im VIP-Salon jemand Genaueres weiß!',
              choices: [
                {
                  label: '„Kopf hoch – heute Nachmittag liegen wir bestimmt am Strand!“',
                  nextLines: [
                    {
                      speakerId: 'maya',
                      emotion: 'confident',
                      text: 'Dein Wort in Kretas Ohren, Nate! Dann bleibt mein Sonnenhut eben noch ein Stündchen auf Standby!',
                    },
                  ],
                },
                {
                  label: '„Wetten, in deiner Tasche steckt sogar ein Schlauchboot?“',
                  nextLines: [
                    {
                      speakerId: 'maya',
                      emotion: 'confident',
                      text: 'Hey!! Nur Schwimmflügel und ein kleiner Sonnenschirm – ich bin schließlich für jede Hafenlage vorbereitet!',
                    },
                  ],
                },
              ],
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
      backgroundUrl: '/src/assets/images/case2_vip_salon_day_1795181599051.jpg',
      charactersPresent: [
        {
          characterId: 'dimitri',
          visibleIfFlag: 'flag_c2_tatzeit_geloest',
          hideIfFlag: 'flag_c2_dimitri_weg',
        },
        {
          characterId: 'maya',
        },
      ],
      hotspots: [
        {
          id: 'c2_a1_security_pult',
          label: 'Bord-Funk-Konsole',
          x: 55,
          y: 31,
          width: 14,
          height: 22,
          lines: [
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Hier im VIP-Salon hat man das Gefühl, die Zeit sei stehen geblieben… Schau mal, da drüben blinkt noch die kleine Sicherheits-Konsole neben der Tür.',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Prüfen wir die Sektorenliste kurz: Oberdeck Grün, Promenadendeck Grün, Musiksalon Grün… alle oberen Bereiche sind komplett ruhig.',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Moment – da ganz unten in der Liste blinkt doch noch ein einziger Eintrag tiefrot auf Deck -2!',
            },
            {
              speakerId: 'maya',
              emotion: 'shocked',
              text: 'Lies mal die Zeile daneben, Nate! „PRIORITÄT ROT · UNTERDECK · ARRESTZELLE 08“!!',
            },
            {
              speakerId: 'nate',
              emotion: 'shocked',
              setsFlag: 'flag_c2_a1_vip',
              text: 'Arrestzelle 08… Dort unten wurde doch gestern Abend nach der Verhandlung Arthur Morgan eingesperrt! Was um alles in der Welt ist heute Nacht in dieser Zelle passiert?!',
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
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Seltsam. Hier im VIP-Bereich hält sich sonst immer mindestens ein Sicherheitsoffizier auf, falls wichtige Gäste an Bord sind.',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Stimmt – gestern stand hier bei jedem Rundgang ein Posten mit Ohrstöpsel und ernster Miene neben der Tür. Heute ist kein einziger Mann in Uniform weit und breit.',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Selbst die kleinen Funkgeräte auf dem Tresen wurden einfach liegen gelassen, als alle hals über Kopf weggerufen wurden.',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Und auf der Status-Anzeige drüben an der Wand leuchtet ausschließlich der Zellentrakt ganz unten im Rumpf auf.',
            },
            {
              speakerId: 'maya',
              emotion: 'sweating',
              setsFlag: 'flag_c2_a1_vip',
              text: 'Wenn wir wissen wollen, warum niemand an Land darf und was mit Arthur Morgan los ist, führt wohl leider kein Weg an diesem Zellentrakt vorbei…',
            },
          ],
        },
        {
          id: 'dimitri_vip_0210',
          title: 'Kommissar Dimitri: Der Todeszeitpunkt war schon um 02:10 Uhr!',
          speakerId: 'dimitri',
          requiredFlag: 'flag_c2_tatzeit_geloest',
          hideIfFlag: 'flag_c2_a2_bruecke_geloest',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Kommissar Dimitri! Gut, dass wir Sie hier oben erwischen! Schauen Sie sich unsere frische Notiz von der Brücke an: Der wahre Todeszeitpunkt lag nicht bei 07:30 Uhr, sondern schon um 02:10 Uhr!',
            },
            {
              speakerId: 'dimitri',
              emotion: 'thinking',
              text: 'Χμ;; «02:10 Uhr»… Δεν καταλαβαίνω τίποτα από αυτά τα γερμανικά, κύριε Στέρλινγκ! Αλλά περιμένετε… κοιτάξτε έξω από το μεγάλο παράθυρο!! Θάλασσα!! Πού ήμασταν στις 02:10;;',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Äh… Nate? Er versteht das deutsche „Todeszeitpunkt“ schon wieder kein bisschen – aber schau mal, wie energisch er plötzlich durch das große Panoramafenster hinaus aufs weite Meer zeigt!',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Moment… erst zeigt er auf meine Notiz mit der Uhrzeit 02:10 Uhr, und dann gleich zweimal hinaus aufs Wasser vor Kreta…',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              shout: 'MOMENT MAL!',
              shake: true,
              startsMiniGameId: 'sea_chart',
              text: 'Was will er uns damit sagen?! Warte mal… 02:10 Uhr nachts – und das Meer! WO war unser Schiff um 07:30, um 06:00 und um 02:10 Uhr überhaupt?! Gehen wir die Schiffspositionen direkt Punkt für Punkt mit Kommissar Dimitri durch!',
            },
          ],
        },
      ],
      presentRules: [
        {
          evidenceId: 'notiz_todeszeit_0210',
          targetCharacterId: 'dimitri',
          requiredFlag: 'flag_c2_tatzeit_geloest',
          hideIfFlag: 'flag_c2_a2_bruecke_geloest',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Schauen Sie hier, Kommissar Dimitri – unsere neue Notiz: „Todeszeitpunkt 02:10 Uhr“!',
            },
            {
              speakerId: 'dimitri',
              emotion: 'thinking',
              text: 'Χμ;; Δεν διαβάζω γερμανικά, κύριε Στέρλινγκ… Μα 02:10… κοιτάξτε εκεί έξω! Η θάλασσα!! Πού βρισκόταν το πλοίο στις 02:10;;',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Er kann den deutschen Zettel natürlich wieder nicht lesen… aber sieh mal, wie aufgeregt er bei den Zahlen „02:10“ durchs Fenster hinaus aufs offene Meer zeigt!',
            },
            {
              speakerId: 'nate',
              emotion: 'shocked',
              shout: 'MOMENT MAL!',
              shake: true,
              startsMiniGameId: 'sea_chart',
              text: 'Hm… was will er uns damit klarmachen?! „02:10 Uhr“ und hinaus aufs Wasser… Richtig!! Vergleichen wir für ihn die genauen Schiffspositionen von 07:30, 06:00 und 02:10 Uhr!',
            },
          ],
        },
        {
          evidenceId: 'zellen_klima_protokoll',
          targetCharacterId: 'dimitri',
          requiredFlag: 'flag_c2_tatzeit_geloest',
          hideIfFlag: 'flag_c2_a2_bruecke_geloest',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Kommissar Dimitri! Mit diesem Protokoll und dem Eingeständnis von der Brücke wissen wir jetzt: Der Tod trat schon um 02:10 Uhr ein!',
            },
            {
              speakerId: 'dimitri',
              emotion: 'thinking',
              text: 'Θερμοκρασία… 02:10;; Κοιτάξτε έξω από το παράθυρο, κύριε Στέρλινγκ! Πού ήμασταν στη θάλασσα στις 02:10;;',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Schau mal, Nate – er klopft auf die Zahl und deutet immer wieder durchs Fenster auf die Wasserlinie draußen!',
            },
            {
              speakerId: 'nate',
              emotion: 'shocked',
              shout: 'MOMENT MAL!',
              shake: true,
              startsMiniGameId: 'sea_chart',
              text: 'Hm… was will er uns damit sagen, wenn er so beharrlich aufs Meer hinauszeigt?! Stimmt – checken wir gemeinsam die Schiffsposition um 02:10 Uhr!',
            },
          ],
        },
      ],
      fallbackPresentLines: [
        {
          speakerId: 'maya',
          emotion: 'neutral',
          text: 'Hier im VIP-Salon reagiert darauf gerade niemand.',
        },
      ],
    },
    brig_cell: {
      id: 'brig_cell',
      name: 'Arrestzelle 08 · Unterdeck',
      subtitle: 'Tatort & Innenansicht der Zelle',
      backgroundUrl: '/src/assets/images/case2_brig_cell_day_1795164438127.jpg',
      alternateBackground: {
        flag: 'flag_c2_a2_zelle_offen',
        backgroundUrl: '/src/assets/images/cell_08_inside_1795211919808.jpg',
        outsideWhenFlag: 'flag_c2_dimitri_weg',
        reopenWhenFlag: 'flag_c2_a3_pass_erlaubnis',
      },
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
          characterId: 'brandt',
          visibleIfFlag: 'flag_c2_a1_angenommen',
          hideIfFlag: 'flag_c2_a2_zelle_offen',
        },
        {
          characterId: 'brandt',
          visibleIfFlag: 'flag_c2_dimitri_weg',
          hideIfFlag: 'flag_c2_a3_pass_erlaubnis',
        },
        {
          characterId: 'dimitri',
          visibleIfFlag: 'flag_c2_a1_angenommen',
          hideIfFlag: 'flag_c2_tatzeit_geloest',
        },
        {
          characterId: 'andrew',
          visibleIfFlag: 'flag_c2_a3_andrew_in_zelle',
          hideIfFlag: 'flag_c2_a3_lock_geknackt',
        },
        {
          characterId: 'maya',
          visibleIfFlag: 'flag_c2_a1_rauswurf',
          hideIfFlag: 'flag_c2_a3_andrew_in_zelle',
        },
        {
          characterId: 'maya',
          visibleIfFlag: 'flag_c2_a3_andrew_verabschiedet',
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
              speakerId: 'maya',
              emotion: 'sweating',
              text: 'Brrr… spürst du das, Nate? Hier unten im Stahlgang ist es plötzlich bitterkalt im Vergleich zum Sonnendeck oben…',
            },
            {
              speakerId: 'nate',
              emotion: 'shocked',
              sfx: 'tension',
              text: 'Um Himmels willen… Arthur Morgans Arrestzelle! Gelbe Tatort-Markierungen #1 und #2 auf dem Boden, ein umgekippter Metallhocker – und die Zelle ist abgesperrt!',
            },
            {
              speakerId: 'maya',
              emotion: 'shocked',
              text: 'Nate… heißt das etwa… Arthur ist in der Nacht hier unten…?!',
            },
            {
              speakerId: 'falk',
              emotion: 'shocked',
              shake: true,
              text: 'WAS MACHEN SIE HIER UNTEN, STERLING?! Haben Sie hier nicht schon genug Schaden angerichtet?! Ist Ihnen überhaupt klar, was Ihr kleiner „Triumph“ gestern Abend ausgelöst hat?!',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Staatsanwalt von Falk?! Moment – was ist hier heute Nacht mit meinem früheren Mandanten passiert?! Ich war gestern Abend selbst im Gerichtssaal, ich habe ein Recht zu erfahren…',
            },
            {
              speakerId: 'marston',
              emotion: 'sweating',
              text: 'Gar nichts haben Sie hier unten, Nate! Bitte gehen Sie jetzt sofort wieder nach oben an Deck! Wegen Ihrer Anklage von gestern saß Arthur hier – jetzt liegt er tot in unserer eigenen Obhut und die griechische Hafenpolizei steht vor der Gangway!',
            },
            {
              speakerId: 'falk',
              emotion: 'shocked',
              text: 'Schaffen Sie diesen Zivilisten aus meinem Blickfeld, Detective! Und halten Sie gefälligst alle unbefugten Urlauber vom Zellentrakt fern!',
            },
            {
              speakerId: 'maya',
              emotion: 'shocked',
              setsFlag: 'flag_c2_a1_rauswurf',
              switchesLocationId: 'promenade',
              text: 'Au backe, die zwei setzen uns ja hochkant wieder vor die Tür! Komm, Nate – ehe hier noch jemand Handschellen klickt… Oh! Da draußen an der Reling wartet schon der Kapitän – und wer ist der Mann in der blauen Uniform neben ihm?!',
            },
            {
              speakerId: 'captain',
              emotion: 'neutral',
              text: 'Na wunderbar. Früher hätte mir so ein Trauerspiel niemand auf eines meiner Schiffe gebracht. Herr Sterling – das hier ist Kommissar Dimitri von der Hafenpolizei Heraklion.',
            },
            {
              speakerId: 'dimitri',
              emotion: 'confident',
              text: 'Καλημέρα σας, κύριε Στέρλινγκ! Επιτέλους σας βρίσκω! Μόλις ανέβηκα στο πλοίο από το λιμεναρχείο και ήδη επικρατεί απόλυτο χάος στους διαδρόμους!',
            },
            {
              speakerId: 'dimitri',
              emotion: 'confident',
              text: 'Διάβασα το πρωί την έκτακτη αναφορά του καπετάνιου για τα χθεσινά γεγονότα. Οι αξιωματικοί εδώ κάτω μου κρύβουν την αλήθεια, τρέχουν πανικόβλητοι και δεν απαντούν σε καμία ερώτηση!',
            },
            {
              speakerId: 'dimitri',
              emotion: 'confident',
              text: 'Η ελληνική αστυνομία χρειάζεται διαφάνεια και έναν ψύχραιμο μάρτυρα! Θέλω να έρθετε αμέσως μαζί μου για να ρίξουμε φως σε αυτή την περίεργη υπόθεση πριν χαθεί πολύτιμος χρόνος!',
            },
            {
              speakerId: 'maya',
              emotion: 'sweating',
              text: 'Äh… Nate? Hast du davon auch nur ein einziges Wort verstanden? Ich glaube, ich hab bloß „Kalimera“ und deinen Nachnamen rausgehört…',
            },
            {
              speakerId: 'nate',
              emotion: 'sweating',
              text: 'Keinen Schimmer. Klang entweder nach einer Standpauke oder nach einer riesigen Einladung. Warten wir ab, was der Kapitän uns übersetzt.',
            },
            {
              speakerId: 'captain',
              emotion: 'neutral',
              text: 'Sie sollen mitkommen.',
            },
            {
              speakerId: 'nate',
              emotion: 'sweating',
              text: '… Das war jetzt ernsthaft die komplette Übersetzung?!',
            },
            {
              speakerId: 'captain',
              emotion: 'neutral',
              text: 'Das Wesentliche. Fragen Sie ruhig noch nach, wenn Sie’s genauer wissen wollen.',
            },
          ],
        },
        {
          id: 'c2_a2_zelle_gesperrt',
          label: 'Versiegelte Arrestzelle 08 (Kein Zutritt)',
          x: 42,
          y: 36,
          width: 34,
          height: 46,
          visibleIfFlag: 'flag_c2_a1_rauswurf',
          hideIfFlag: 'flag_c2_a2_zelle_offen',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Versuchen wir es mal… Wenn wir zumindest durch die oberen Gitterstäbe einen Blick in den Raum werfen könnten…',
            },
            {
              speakerId: 'brandt',
              emotion: 'neutral',
              text: 'Stopp, Mr. Sterling! Einen Schritt zurück, bitte. Zelle 08 steht unter strengem Sicherheitsverschluss. Solange mein Wachbericht gilt, darf hier kein Unbefugter hinein.',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Solange Officer Brandt sich wie eine Betonwand vor das Gitter stellt, kommen wir nicht ins Innere…',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Nur Kommissar Dimitri könnte ihm befehlen aufzuschließen – aber dafür braucht Dimitri erst einen klaren Widerspruch gegen das, was uns hier erzählt wird.',
            },
          ],
        },
        {
          id: 'c2_a2_seil_schal',
          label: 'Blaues Stoffband an der oberen Stange',
          x: 42,
          y: 10,
          width: 8,
          height: 44,
          visibleIfFlag: 'flag_c2_a2_zelle_offen',
          hideIfFlag: 'flag_c2_dimitri_weg',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'shocked',
              shout: 'MOMENT MAL!',
              shake: true,
              text: 'Schau dir das da oben an der oberen Querstange einmal ganz aus der Nähe an, Maya!',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Im ersten Funkspruch an die Hafenpolizei hieß es doch noch „Gefangener mit einem Seil erhängt“ – aber das sieht aus der Nähe irgendwie ganz anders aus…',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              setsFlag: 'flag_c2_a2_seil_gesehen',
              text: 'Nanu?! Das ist ja gar kein grobes Schiffstau aus dem Arrest… fass das Material mal an, Nate! Es fühlt sich an wie ein ganz feines, glattes Seidentuch!',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Ein edles blaues Seidentuch? Eigentlich gar nicht so ungewöhnlich bei einem geschniegelten Oberkellner aus der Ersten Klasse – Arthur trug solche Tücher ja häufiger unterm Kragen.',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Merkwürdig ist höchstens, dass man ihm ausgerechnet so ein feines Tuch mit in die Arrestzelle gelassen hat… behalten wir es sicherheitshalber im Hinterkopf.',
            },
          ],
        },
        {
          id: 'c2_a2_zellenschloss',
          label: 'Elektronisches Zellenschloss',
          x: 2,
          y: 46,
          width: 10,
          height: 22,
          visibleIfFlag: 'flag_c2_a2_zelle_offen',
          hideIfFlag: 'flag_c2_dimitri_weg',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Schauen wir uns das elektronische Sicherheits-Schloss direkt am Türrahmen ganz genau an, Maya.',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              setsFlag: 'flag_c2_a2_schloss_gesehen',
              text: 'Kein einziger Kratzer, keine Aufbruchspur am Metall – und schau dir das Display-Log hier an: Zwischen 00:00 und 08:15 Uhr gab es keinen einzigen Keycard-Scan!',
            },
            {
              speakerId: 'maya',
              emotion: 'shocked',
              text: 'Keinen einzigen Scan?! Das bedeutet doch, die Tür wurde die ganze Nacht über von außen kein einziges Mal geöffnet…',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Falls das hier also wirklich kein Selbstmord gewesen sein sollte, wäre diese Zelle ein perfekter verschlossener Raum. Behalten wir dieses Schloss-Protokoll unbedingt im Hinterkopf!',
            },
          ],
        },
        {
          id: 'c2_a2_klima_panel',
          label: 'Vereistes Klima- & Kühlpanel an der Wand',
          x: 23,
          y: 27,
          width: 14,
          height: 34,
          visibleIfFlag: 'flag_c2_a2_zelle_offen',
          hideIfFlag: 'flag_c2_a2_klima_geloest',
          lines: [
            {
              speakerId: 'maya',
              emotion: 'shocked',
              text: 'Brrr!! Jetzt, wo wir direkt in Zelle 08 stehen, spürt man erst richtig, wie eisig kalt es hier drinnen ist!! Ich seh fast schon meinen eigenen Atem!',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Schau mal rüber an die linke Stahlwand, Nate – diese Metallklappe dort ist ja regelrecht mit weißem Reif überzogen!',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Das ist ein Wartungsmodul für die Zellentemperatur! Die Diagnose-Leitungen dahinter stehen völlig verstellt und blockiert.',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Richten wir die Kühlrohre sauber vom Regel-Ventil bis zum Sensor aus – dann spuckt uns das Terminal vielleicht aus, wann und ob hier jemand gedreht hat!',
              startsMiniGameId: 'cooling_pipes',
            },
          ],
        },
        {
          id: 'c2_a2_klima_fertig',
          label: 'Ausgelesenes Zellen-Klimaprotokoll',
          x: 23,
          y: 27,
          width: 14,
          height: 34,
          visibleIfFlag: 'flag_c2_a2_klima_geloest',
          hideIfFlag: 'flag_c2_dimitri_weg',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Die Diagnose-Leitung läuft wieder sauber, und der Ausdruck des Kühlpanels steckt in unserer Akte.',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Punkt 03:00 Uhr nachts wurde hier also manuell eingegriffen und die Temperatur in Zelle 08 extrem nach unten gedreht…',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Halten wir diese Uhrzeit im Hinterkopf – Dr. Vance sollte vielleicht erfahren, unter welchen Bedingungen sie heute Morgen gemessen hat.',
            },
          ],
        },
        {
          id: 'c2_a2_hocker',
          label: 'Umgekippter Metallhocker',
          x: 53,
          y: 66,
          width: 20,
          height: 26,
          visibleIfFlag: 'flag_c2_a2_zelle_offen',
          hideIfFlag: 'flag_c2_dimitri_weg',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Da liegt der schwere Metallhocker quer auf dem Zellenboden. Wenn so ein Ding umfällt, dröhnt das über die Stahlwände durchs halbe Schiff!',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Genau das muss das laute Krachen gewesen sein, das Leo und Rick um 02:10 Uhr oben bis aufs Rettungsboot-Deck gehört haben!',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Interessant ist auch diese Kratzspur hier auf dem Metallboden… sie verläuft fast schnurgerade genau unter das obere Lüftungsgitter.',
            },
          ],
        },
        {
          id: 'c2_a3_zelle_abgesperrt',
          label: 'Gesperrtes Zellengitter (Officer Brandt)',
          x: 40,
          y: 34,
          width: 36,
          height: 48,
          visibleIfFlag: 'flag_c2_dimitri_weg',
          hideIfFlag: 'flag_c2_a3_pass_erlaubnis',
          lines: [
            {
              speakerId: 'brandt',
              emotion: 'neutral',
              shake: true,
              setsFlag: 'flag_c2_a3_abgewiesen',
              unlocksLocation: 'bridge',
              text: 'HALT, STERLING!! Keinen einzigen Schritt näher an Arrestzelle 08! Kommissar Dimitri hat das Verfahren vorläufig zu den Akten gelegt, die Hafenbehörde ist informiert – Sie haben hier unten im Sicherheitstrakt absolut nichts mehr zu suchen!',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Aber Officer Brandt, wir haben einen neuen Hinweis aus den Passagier-Aussagen! Es geht um ein entscheidendes Detail am elektronischen Türschloss und um dieses blaue Tuch dort oben – lassen Sie uns bitte nur fünf Minuten hinein!',
            },
            {
              speakerId: 'brandt',
              emotion: 'neutral',
              text: 'Ausgeschlossen!! Meine Wache untersteht wieder allein dem Bordkommando, und mein Befehl lautet: Zutritt für Zivilisten strikt verweigert! Niemand betritt diese Zelle ohne ausdrückliche Anordnung der Schiffsführung.',
            },
            {
              speakerId: 'nate',
              emotion: 'sweating',
              text: 'Also müssten wir direkt oben bei Kapitän Brammer um eine Ausnahmegenehmigung bitten?',
            },
            {
              speakerId: 'brandt',
              emotion: 'neutral',
              text: 'Versuchen Sie Ihr Glück auf der Kommandobrücke, wenn Sie zu viel Freizeit haben! Aber der Kapitän wird Ihnen hochkant denselben Marsch blasen – verschwinden Sie!',
            },
            {
              speakerId: 'maya',
              emotion: 'grumpy',
              text: 'Pah, der Mann hat ja die Herzlichkeit eines vereisten Bullauges! Komm, Nate – fragen wir einfach selbst oben auf der Kommandobrücke nach!',
            },
          ],
        },
        {
          id: 'c2_a3_schloss_konsole',
          label: 'Magnetschloss MS-400 & Kabelbox',
          x: 2,
          y: 46,
          width: 12,
          height: 24,
          visibleIfFlag: 'flag_c2_a3_pass_erlaubnis',
          hideIfFlag: 'flag_c2_a3_lock_geknackt',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Da sitzt diese unscheinbare Elektronik-Konsole des MS-400-Schlosses direkt im schweren Türrahmen. Blankes Metall, keine Hebelspuren, kein verkratztes Schlüsselloch – nur ein schmales Status-Display und versiegelte Klemmen.',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Wenn hier wirklich jemand ohne offiziellen Schlüsselkarteneintrag durchgegangen ist, muss die Antwort irgendwo hinter dieser Verkleidung stecken… Mal sehen, was Andrew herausfindet, wenn er einmal davorsteht.',
            },
          ],
        },
        {
          id: 'c2_a3_schal_stange',
          label: 'Blauer Kreta-Schal am Gitter',
          x: 42,
          y: 10,
          width: 10,
          height: 44,
          visibleIfFlag: 'flag_c2_a3_pass_erlaubnis',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Jetzt, wo ich Eleonores Exemplar draußen am Strand vor Augen hatte, bleibt wirklich nicht der Hauch eines Zweifels: Diese goldene Borte, dieses tiefe Blau – das hier oben ist Andrews angeblich gestohlener Kreta-Seidenschal.',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Aber wie kommt ein Seidenschal vom Promenadendeck in eine Zelle, deren Tür sich die ganze Nacht über laut Protokoll kein einziges Mal geöffnet hat?',
            },
          ],
        },
        {
          id: 'c2_a5_lueftung_flashback',
          label: 'Oberes Lüftungsgitter (Zelle 08)',
          x: 52,
          y: 3,
          width: 21,
          height: 22,
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
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Detective Marston! Staatsanwalt von Falk! Was ist hier unten passiert – warum wird das ganze Schiff abgeriegelt?',
            },
            {
              speakerId: 'falk',
              emotion: 'shocked',
              shake: true,
              text: 'RAUS HIER, STERLING!! Ihr letzter Mandant und seine ganze Verhaftung sind schuld an diesem Desaster! Sie haben vor dieser Arrestzelle nicht das Geringste verloren!',
            },
            {
              speakerId: 'marston',
              emotion: 'sweating',
              text: 'Bitte gehen Sie einfach zurück nach oben, Nate. Arthur hat die Nacht nicht überlebt – und genau jetzt steht schon die griechische Hafenpolizei vor der Tür. Es wird ohnehin nur unangenehme Fragen geben!',
            },
            {
              speakerId: 'maya',
              emotion: 'shocked',
              setsFlag: 'flag_c2_a1_rauswurf',
              switchesLocationId: 'promenade',
              text: 'Schon verstanden, schon verstanden! Kommen Sie, Nate, bevor er uns noch in die Nachbarzelle steckt… Oh! Schauen Sie mal draußen an der Treppe – da wartet der Kapitän mit einem Polizisten aus Kreta!',
            },
            {
              speakerId: 'captain',
              emotion: 'neutral',
              text: 'Na wunderbar. Früher hätte es so eine Unruhe auf keinem meiner Schiffe gegeben. Herr Sterling – das hier ist Kommissar Dimitri von der Hafenpolizei Heraklion.',
            },
            {
              speakerId: 'dimitri',
              emotion: 'confident',
              text: 'Καλημέρα σας, κύριε Στέρλινγκ! Επιτέλους σας βρίσκω! Μόλις ανέβηκα στο πλοίο από το λιμεναρχείο και ήδη επικρατεί απόλυτο χάος στους διαδρόμους!',
            },
            {
              speakerId: 'dimitri',
              emotion: 'confident',
              text: 'Μου έδωσαν το πρωί τη χθεσινή αναφορά του καπετάνιου. Όλοι εδώ κάτω πανικοβάλλονται, φωνάζουν χωρίς λόγο και δεν απαντούν καθαρά στις ερωτήσεις μου!',
            },
            {
              speakerId: 'dimitri',
              emotion: 'confident',
              text: 'Χρειάζομαι έναν ανεξάρτητο και ψύχραιμο άνθρωπο δίπλα μου, αλλιώς δεν θα βγάλουμε άκρη μέχρι το βράδυ! Ελάτε μαζί μου τώρα!',
            },
            {
              speakerId: 'maya',
              emotion: 'sweating',
              text: 'Ähm… Nate? Hast du davon auch nur ein einziges Wort verstanden? Ich glaube, es ging um das Schiff… oder um uns?',
            },
            {
              speakerId: 'nate',
              emotion: 'sweating',
              text: 'Nicht den blassesten Schimmer. Er redet auf jeden Fall ziemlich dringend auf uns ein… Hören wir mal, was der Kapitän dazu sagt.',
            },
            {
              speakerId: 'captain',
              emotion: 'neutral',
              text: 'Sie sollen mitkommen.',
            },
            {
              speakerId: 'maya',
              emotion: 'sweating',
              text: '… Moment. Wirklich nur „Sie sollen mitkommen“?! Reden wir doch nochmal in Ruhe mit ihm – oder fragen wir den Kapitän, was genau hier gerade vor sich geht!',
            },
          ],
        },
        {
          id: 'brandt_nachtwache',
          title: 'Officer Brandt: Wer hat den Gefangenen heute Nacht bewacht?',
          speakerId: 'brandt',
          requiredFlag: 'flag_c2_a1_angenommen',
          hideIfFlag: 'flag_c2_a2_zelle_offen',
          lines: [
            {
              speakerId: 'brandt',
              emotion: 'neutral',
              text: 'Guten Mittag, Mr. Sterling. Officer Lukas Brandt, Sicherheitsoffizier der Nachtschicht. Kommissar Dimitri hat mir aufgetragen, Zelle 08 bis zur Übernahme abgesperrt zu halten.',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Sie hatten also heute Nacht hier unten Dienst, Officer Brandt? Wie genau ist der Morgen hier abgelaufen?',
            },
            {
              speakerId: 'brandt',
              emotion: 'neutral',
              setsFlag: 'flag_c2_a2_brandt_protokoll',
              unlocksEvidence: 'brandt_wachbuch',
              unlocksThought: 'thought_c2_brandt_dienst',
              text: 'Ganz nach Vorschrift. Bis zu meinem regulären Schichtende um 06:00 Uhr morgens war in diesem Trakt alles ruhig. Erst bei meinem letzten Kontrollgang zum Schichtwechsel habe ich Arthur Morgan leblos in Zelle 08 entdeckt und sofort Meldung erstattet – hier haben Sie eine Kopie meines Wachprotokolls für Ihre Unterlagen.',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: '(Hmm… er wirkt fast schon zu routiniert. Was frage ich ihn noch?)',
              choices: [
                {
                  label: '„Dürfen wir wenigstens einen kurzen Blick in die Zelle werfen?“',
                  nextLines: [
                    {
                      speakerId: 'brandt',
                      emotion: 'neutral',
                      text: 'Ausgeschlossen, Mr. Sterling. Solange nichts gegen meinen offiziellen Bericht spricht, bleibt die Zelle verriegelt.',
                    },
                  ],
                },
                {
                  label: '„Haben Sie in der Nacht irgendetwas Ungewöhnliches gehört?“',
                  nextLines: [
                    {
                      speakerId: 'brandt',
                      emotion: 'neutral',
                      text: 'Auf einem fahrenden Stahlschiff knarrt und ächzt es nachts ständig durch die Schotten. Besondere Vorkommnisse gab es auf meiner Wache keine.',
                    },
                  ],
                },
              ],
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Immerhin haben wir sein unterschriebenes Wachprotokoll jetzt ordentlich in unserer Gerichtsakte, Nate.',
            },
          ],
        },
        {
          id: 'dimitri_zelle_check',
          title: 'Kommissar Dimitri: Können Sie die Zelle für uns öffnen?',
          speakerId: 'dimitri',
          requiredFlag: 'flag_c2_a1_angenommen',
          hideIfFlag: 'flag_c2_a2_brandt_widerspruch_geloest',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Kommissar Dimitri – Officer Brandt lässt uns keinen Fuß in die Zelle setzen. Können Sie die Tür nicht einfach kraft Ihres Amtes öffnen lassen?',
            },
            {
              speakerId: 'dimitri',
              emotion: 'confident',
              text: 'Κύριε Στέρλινγκ, δεν μπορώ να ανοίξω έτσι απλά ένα σφραγισμένο κελί! Ο αξιωματικός ασφαλείας έχει την ευθύνη – φέρτε μου πρώτα μια ξεκάθαρη απόδειξη ότι κάτι δεν πάει καλά στα έγγραφα!',
            },
            {
              speakerId: 'maya',
              emotion: 'sweating',
              text: 'Er schüttelt energisch den Kopf und deutet abwechselnd auf das schwere Zellenschloss und auf Officer Brandt…',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Ohne einen handfesten Widerspruch gegen den bisherigen Bericht darf oder will er den Sicherheits-Offizier also nicht einfach überstimmen.',
            },
          ],
        },
        {
          id: 'dimitri_widerspruch_zeigen',
          title: 'Kommissar Dimitri: Den Zeit-Widerspruch ohne Worte erklären!',
          speakerId: 'dimitri',
          requiredFlag: 'flag_c2_a2_brandt_widerspruch_geloest',
          hideIfFlag: 'flag_c2_a2_zelle_offen',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Jetzt haben wir die Zeitzahlen schwarz auf weiß, Maya! 02:10 Uhr Krachen gegen 06:00 Uhr Fund und 07:30 Uhr Arztbericht!',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Genau! Das Einzige Problem ist nur: Kapitän Brammer ist nicht hier unten zum Übersetzen… Wenn wir ihm einfach nur deutsche Akten unter die Nase halten, versteht er kein Wort!',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              shout: 'MOMENT MAL!',
              shake: true,
              startsMiniGameId: 'dimitri_pantomime',
              text: 'Dann müssen eben Uhrzeiten, Handzeichen und eine Portion Pantomime reichen, Kommissar Dimitri! Schauen Sie genau her – gleich wird klar, warum Zelle 08 sofort auf muss!',
            },
          ],
        },
        {
          id: 'dimitri_nach_oeffnung',
          title: 'Kommissar Dimitri: Was steht jetzt an?',
          speakerId: 'dimitri',
          requiredFlag: 'flag_c2_a2_zelle_offen',
          hideIfFlag: 'flag_c2_dimitri_weg',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Danke, Kommissar! Bleiben Sie vor der Tür stehen, während wir im Inneren alles untersuchen?',
            },
            {
              speakerId: 'dimitri',
              emotion: 'confident',
              text: 'Εξετάστε όλο το κελί με ησυχία, κύριε Στέρλινγκ! Εγώ κρατώ το πόστο εδώ μέχρι να βρείτε κάθε λεπτομέρεια!',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Er nickt uns zu und verschränkt entschlossen die Arme vor der Brust! Kommissar Dimitri hält uns hier den Rücken frei – schauen wir uns in aller Ruhe im Inneren von Zelle 08 um, Nate!',
            },
          ],
        },
        {
          id: 'c2_a3_brandt_abblocken',
          title: 'Officer Brandt: Zutritt zu Zelle 08 verlangen!',
          speakerId: 'brandt',
          requiredFlag: 'flag_c2_dimitri_weg',
          hideIfFlag: 'flag_c2_a3_pass_erlaubnis',
          lines: [
            {
              speakerId: 'brandt',
              emotion: 'neutral',
              shake: true,
              setsFlag: 'flag_c2_a3_abgewiesen',
              unlocksLocation: 'bridge',
              text: 'Wie oft soll ich mich noch wiederholen, Mr. Sterling?! Kein Zutritt! Die Untersuchung ist beendet, und ich stehe nicht mehr unter den Befehlen irgendeines Hafen-Kommissars!',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Aber Officer Brandt, wir wollen doch nur fünf Minuten an das Zellenschloss! Wenn dort ein technischer Fehler vorliegt, müsste das auch in Ihrem Interesse sein!',
            },
            {
              speakerId: 'brandt',
              emotion: 'neutral',
              text: 'Mein einziges Interesse ist Ruhe in diesem Trakt! Gehen Sie hoch zur Kommandobrücke und bitten Sie Kapitän Brammer höchstpersönlich – obwohl ich Ihnen jetzt schon verspreche, dass Sie da oben nur die Tür gezeigt kriegen!',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Na gut – dann schauen wir eben oben auf der Kommandobrücke vorbei, Nate. Vielleicht findet sich ja doch ein Weg!',
            },
          ],
        },
        {
          id: 'c2_a3_maya_holt_andrew',
          title: 'Maya: Andrew von oben holen & die Kids einsammeln',
          speakerId: 'maya',
          requiredFlag: 'flag_c2_a3_pass_erlaubnis',
          hideIfFlag: 'flag_c2_a3_andrew_in_zelle',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Kaum zu glauben, dass die Visitenkarte einer Kreuzfahrtmanagerin hier unten mehr Gewicht hat als der Befehl des Sicherheitsoffiziers – Brandt musste tatsächlich abziehen!',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Solange wir heute Abend ein gutes Programm liefern, hätten wir wahrscheinlich sogar die Kapitänskajüte buchen dürfen! Also, Abmachung ist Abmachung: Ich gehe hoch aufs Promenadendeck, übernehme solange Leo, Rick und Conrad und schicke dir Andrew herunter!',
            },
            {
              speakerId: 'nate',
              emotion: 'sweating',
              text: 'Bist du sicher, dass du mit allen dreien klarkommst? Conrad wollte heute früh fast über die Reling nach einem Hai greifen…',
            },
            {
              speakerId: 'maya',
              emotion: 'sweating',
              startsMiniGameId: 'kids_sokoban',
              text: 'Ach, Kinder sind doch gar kein Problem – schau, da oben jagen sie schon wieder zwischen den Deckliegen hin und her! Na wartet, ihr kleinen Piraten – ab mit euch in die Spielecke!!',
            },
          ],
        },
        {
          id: 'c2_a3_andrew_schloss_check',
          title: 'Andrew: Schau dir dieses Zellenschloss doch mal an!',
          speakerId: 'andrew',
          requiredFlag: 'flag_c2_a3_andrew_in_zelle',
          hideIfFlag: 'flag_c2_a3_andrew_will_beweis',
          lines: [
            {
              speakerId: 'andrew',
              emotion: 'grumpy',
              shake: true,
              text: 'Bevor du auch nur einmal das Wort „Technik“ in den Mund nimmst, Nate: Nur weil ich in der IT arbeite, heißt das NICHT, dass ich mich mit jedem verdammten Sicherheitsschloss auskenne!! Ich schreibe Datenmodelle und Pflichtenhefte, verstehst du?!',
            },
            {
              speakerId: 'nate',
              emotion: 'sweating',
              text: 'Schon gut, schon gut, Andrew – ich wollte auch keinen Schaltplan von dir. Wirf doch bitte einfach nur mal einen kurzen Blick auf die kleine Konsole links im Türrahmen…',
            },
            {
              speakerId: 'andrew',
              emotion: 'neutral',
              text: 'Na schön… *seufz*… Lass mich wenigstens einen Meter näher ran… Oh. Moment mal. Das ist ja gar kein mechanisches Sonder-Ding – das ist bloß eine stinknormale MS-400-Magnetverriegelung mit integriertem Bus-Controller.',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Aha? Und was genau bedeutet das für jemanden ohne passenden Schlüssel?',
            },
            {
              speakerId: 'andrew',
              emotion: 'neutral',
              text: 'Dass man da überhaupt kein Brecheisen braucht. Ein Magnetschloss hält ja nur, solange der Elektromagnet Saft hat – bricht die Spannung weg, schnappt der Bolzen völlig geräusch- und spurlos zurück.',
            },
            {
              speakerId: 'nate',
              emotion: 'shocked',
              text: 'Moment!! Ohne jede Gewaltspur?! Dann könnte also jemand nachts…',
            },
            {
              speakerId: 'andrew',
              emotion: 'grumpy',
              unlocksEvidence: 'schloss_logbuch',
              unlocksThought: 'thought_c2_a3_magnetschloss',
              setsFlag: 'flag_c2_a3_andrew_will_beweis',
              text: 'Halt mal die Luft an, Sherlock!! Jeder Stromverlust, jede Störung und jeder Reset wird beim MS-400 sofort fest ins interne Zugriffs-Log gebrannt! Guck doch selbst auf das kleine Display hier: Null Einträge zwischen 00:00 und 08:15 Uhr!!',
            },
            {
              speakerId: 'andrew',
              emotion: 'grumpy',
              text: 'Kein Log-Eintrag heißt: kein Stromausfall, keine Öffnung, gar nichts! Ich sage es nicht noch einmal – wenn das System sauber ist, war hier niemand drin. Ich geh wieder hoch zu meinem Liegestuhl!',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: '(Er vertraut dem elektronischen Logbuch der Zelle blind… Irgendwie muss ich ihm zeigen, dass man diesen ganzen Mess- und Protokolldaten in Zelle 08 letzte Nacht eben doch nicht trauen konnte!)',
            },
          ],
        },
        {
          id: 'c2_a3_andrew_wartet_beweis',
          title: 'Andrew: Ohne Gegenbeweis rühre ich kein Kabel an!',
          speakerId: 'andrew',
          requiredFlag: 'flag_c2_a3_andrew_will_beweis',
          hideIfFlag: 'flag_c2_a3_lock_geknackt',
          lines: [
            {
              speakerId: 'andrew',
              emotion: 'grumpy',
              text: 'Ich bleib stur, Nate! Ich habe meinen wohlverdienten Urlaub, für eine halbe Stunde schreit niemand nach mir – und solange es keinen handfesten Beleg gibt, dass hier drin nachts entgegen dem sauberen Logbuch manipuliert wurde, fasse ich diese Tür kein zweites Mal an!',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: '(Was haben wir denn selbst gesehen oder gemessen, das in dieser angeblich verschlossenen Zelle nachts heimlich verstellt wurde?)',
            },
          ],
        },
      ],
      presentRules: [
        {
          evidenceId: 'zellen_klima_protokoll',
          targetCharacterId: 'andrew',
          requiredFlag: 'flag_c2_a3_andrew_will_beweis',
          hideIfFlag: 'flag_c2_a3_lock_geknackt',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              shout: 'MOMENT MAL!',
              shake: true,
              text: 'Dann wirf doch bitte mal einen Blick auf DIESEN Ausdruck aus derselben Zelle, Andrew! Punkt 03:00 Uhr nachts wurde hier drinnen manuell die Kühlung massiv heruntergedreht – obwohl dein hochgelobtes Schloss-Log behauptet, zwischen Mitternacht und dem Morgen sei keine Menschenseele hier gewesen!',
            },
            {
              speakerId: 'andrew',
              emotion: 'neutral',
              text: '… Warte mal. Gib mir das Blatt mal her… „Manueller Eingriff 03:00 Uhr“?! Hier an der Zellenwand? Ohne einen einzigen Tür-Scan oder Wartungseintrag?!',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Ganz genau. Wenn jemand um drei Uhr früh hier drinnen am Ventil stehen konnte, ohne dass dein MS-400 auch nur einen Mucks im Logbuch schreibt…',
            },
            {
              speakerId: 'andrew',
              emotion: 'grumpy',
              text: 'Grrr… na schön!! Jetzt hast du meinen IT-Ehrgeiz tatsächlich geweckt!! Eigentlich kenne ich mich mit diesen Schiffs-Platinen ja überhaupt nicht aus – aber gib mir mal zwei Minuten mit der Verteilerbox unter dem Schloss!',
              startsMiniGameId: 'lock_cables',
            },
          ],
        },
        {
          evidenceId: 'schloss_logbuch',
          targetCharacterId: 'andrew',
          requiredFlag: 'flag_c2_a3_andrew_will_beweis',
          hideIfFlag: 'flag_c2_a3_lock_geknackt',
          lines: [
            {
              speakerId: 'andrew',
              emotion: 'grumpy',
              text: 'Ja, genau auf den leeren Speicher berufe ich mich ja! Wenn du beweisen willst, dass hier drin trotzdem jemand gewerkelt hat, musst du mir schon eine Spur aus der Zelle zeigen, die dem widerspricht!',
            },
          ],
        },
        {
          evidenceId: 'brandt_wachbuch',
          targetCharacterId: 'dimitri',
          requiredFlag: 'flag_c2_a2_brandt_widerspruch_geloest',
          hideIfFlag: 'flag_c2_a2_zelle_offen',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              shout: 'MOMENT MAL!',
              shake: true,
              startsMiniGameId: 'dimitri_pantomime',
              text: 'Schauen Sie her, Kommissar Dimitri – Brandts Wachprotokoll stimmt vorne und hinten nicht! Ich zeige Ihnen den Widerspruch direkt mit Händen und Füßen!',
            },
          ],
        },
        {
          evidenceId: 'lueftung_streich',
          targetCharacterId: 'dimitri',
          requiredFlag: 'flag_c2_a2_brandt_widerspruch_geloest',
          hideIfFlag: 'flag_c2_a2_zelle_offen',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              shout: 'MOMENT MAL!',
              shake: true,
              startsMiniGameId: 'dimitri_pantomime',
              text: 'Kommissar Dimitri, passen Sie auf – genau diese Uhrzeit hier sprengt Brandts komplette Nachtwache! Ich erkläre es Ihnen mit Gesten!',
            },
          ],
        },
        {
          evidenceId: 'obduktion_vorlaeufig',
          targetCharacterId: 'dimitri',
          requiredFlag: 'flag_c2_a2_brandt_widerspruch_geloest',
          hideIfFlag: 'flag_c2_a2_zelle_offen',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              shout: 'MOMENT MAL!',
              shake: true,
              startsMiniGameId: 'dimitri_pantomime',
              text: 'Kommissar Dimitri! Diese Uhrzeit im Arztbericht beißt sich komplett mit Brandts Schicht – schauen Sie genau her, ich zeige es Ihnen!',
            },
          ],
        },
        {
          evidenceId: 'brandt_wachbuch',
          targetCharacterId: 'dimitri',
          hideIfFlag: 'flag_c2_a2_brandt_widerspruch_geloest',
          lines: [
            {
              speakerId: 'dimitri',
              emotion: 'thinking',
              text: 'Χμ; Κύριε Στέρλινγκ, δεν διαβάζω γερμανικά… Πρώτα βρείτε καθαρά τη διαφορά στα στοιχεία σας!',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Mit dem einen Dokument allein weiß er noch nichts anzufangen – prüfe erst im Notizbuch, ob die Zeiten aus Wachprotokoll, Arztbericht und Schacht zusammenpassen!',
            },
          ],
        },
        {
          evidenceId: 'obduktion_vorlaeufig',
          targetCharacterId: 'dimitri',
          hideIfFlag: 'flag_c2_a2_brandt_widerspruch_geloest',
          lines: [
            {
              speakerId: 'dimitri',
              emotion: 'thinking',
              text: 'Χμ; Τι λέει το χαρτί της γιατρού; Δεν ξέρω γερμανικά, κύριε Στέρλινγκ!',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Er versteht das deutsche Formular noch nicht – verbinde im Notizbuch erst alle Zeit-Hinweise miteinander!',
            },
          ],
        },
        {
          evidenceId: 'lueftung_streich',
          targetCharacterId: 'dimitri',
          hideIfFlag: 'flag_c2_a2_brandt_widerspruch_geloest',
          lines: [
            {
              speakerId: 'dimitri',
              emotion: 'thinking',
              text: 'Ένα κλιπ από γουόκι-τόκι; Τι σχέση έχει με το κελί 08, κύριε Στέρλινγκ;;',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Noch sieht Dimitri den Zusammenhang nicht – verbinde im Notizbuch erst deine Zeit-Schlussfolgerung mit dem 02:10-Uhr-Geräusch!',
            },
          ],
        },
      ],
      fallbackPresentLines: [
        {
          speakerId: 'maya',
          emotion: 'thinking',
          text: 'Hier unten an den Stahlschotten bringt dieses Beweisstück gerade niemandem etwas.',
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
        {
          characterId: 'maya',
          visibleIfFlag: 'flag_c2_a3_andrew_verabschiedet',
        },
      ],
      hotspots: [
        {
          id: 'c2_a2_arzt_monitor',
          label: 'Medizinischer Befund am Terminal',
          x: 40,
          y: 46,
          width: 16,
          height: 20,
          hideIfFlag: 'flag_c2_dimitri_weg',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Mal sehen, was auf Dr. Vances Terminal hier an der Station eingetragen ist…',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              setsFlag: 'flag_c2_a2_21grad_notiz',
              text: '„Befund Arrestzelle 08 · Erstuntersuchung 08:15 Uhr · Geschätzter Todeszeitpunkt ca. 07:30 Uhr (Standardtabelle / Normwert 21 °C) · Übergabe an Hafenbehörde Heraklion vorbereitet.“',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Ganz schön knapper medizinischer Standardbogen… Kaum eine handschriftliche Notiz dazu, einfach nur die kalten Eckdaten.',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Aber immerhin stehen ihre Uhrzeit und ihre Berechnungsgrundlage fein säuberlich drauf. Merken wir uns besonders diesen Normwert von 21 °C!',
            },
          ],
        },
        {
          id: 'c2_a3_arznei_schrank',
          label: 'Abgeschlossener Arznei- & Labor-Schrank',
          x: 68,
          y: 34,
          width: 20,
          height: 32,
          visibleIfFlag: 'flag_c2_a3_andrew_verabschiedet',
          lines: [
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Schau mal rüber zum Arznei- und Laborschrank, Nate! Das kleine Entnahmefach steht ein Stück weit angelehnt, und direkt auf dem Ausgabefach des Analysegeräts blinkt ein frischer Labor-Status.',
            },
            {
              speakerId: 'nate',
              emotion: 'shocked',
              text: 'Und hier im geöffneten Einsatz für starke Schlaf- und Beruhigungsmittel klafft eine auffällige Lücke: Eine Durchstechflasche fehlt ausgerechnet aus dem Nachtbestand!',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Moment… wenn die Krankenstation als einzige Abteilung rund um die Uhr besetzt ist, hätte Dr. Vance davon doch etwas mitbekommen müssen! Sprechen wir sie sofort auf ihre Nachtschicht an!',
            },
          ],
        },
      ],
      talkTopics: [
        {
          id: 'vance_todeszeit',
          title: 'Dr. Vance: Zu Ihrer Untersuchung in Zelle 08',
          speakerId: 'vance',
          hideIfFlag: 'flag_c2_dimitri_weg',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Guten Tag, Dr. Vance. Kommissar Dimitri hat uns gebeten, uns ein genaueres Bild von den Vorgängen der letzten Nacht zu machen. Sie waren heute früh die Erste bei Arthur Morgan in Zelle 08?',
            },
            {
              speakerId: 'vance',
              emotion: 'neutral',
              setsFlag: 'flag_c2_a2_vance_befragt',
              unlocksEvidence: 'obduktion_vorlaeufig',
              unlocksThought: 'thought_c2_0730_hafen',
              text: 'Fassen Sie sich bitte kurz, Mr. Sterling, meine Krankenstation füllt sich langsam mit seekranken Passagieren. Ja, ich habe heute früh meinen Befund in Arrestzelle 08 aufgenommen. Äußere Spuren eines Handgemenges gibt es nicht – hier ist meine vorläufige Aktenkopie für Ihre Unterlagen.',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Vielen Dank, Frau Doktor. Darf ich Ihnen noch eine kurze Frage zu Ihren Feststellungen stellen?',
              choices: [
                {
                  label: '„Gehen Sie medizinisch sicher von einem Selbstmord aus?“',
                  nextLines: [
                    {
                      speakerId: 'vance',
                      emotion: 'neutral',
                      text: 'Die Zellentür war von außen ordnungsgemäß verschlossen, es gab keinerlei Kampfspuren. Ob Suizid oder etwas anderes, wird das Seegericht oder die Hafenpolizei abschließend bewerten.',
                    },
                  ],
                },
                {
                  label: '„Wie schnell übernimmt jetzt die Hafenpolizei den Fall?“',
                  nextLines: [
                    {
                      speakerId: 'vance',
                      emotion: 'neutral',
                      text: 'Nach der Abschlussuntersuchung heute Mittag im Großen Ballsaal werden die medizinischen Papiere direkt an Heraklion übergeben, damit das Schiff endlich frei wird.',
                    },
                  ],
                },
                {
                  label: '„Haben Sie in der Zelle selbst noch etwas Besonderes bemerkt?“',
                  nextLines: [
                    {
                      speakerId: 'vance',
                      emotion: 'neutral',
                      text: 'Alles Relevante steht in meinem vorläufigen Arzt-Bericht, Mr. Sterling. Mehr gibt es für mich im Moment nicht hinzuzufügen.',
                    },
                  ],
                },
              ],
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Ziemlich kühl und kurz angebunden… fast so, als wolle sie das Thema am liebsten heute noch vom Schreibtisch haben.',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Schauen wir uns ihren schriftlichen Arzt-Bericht gleich in aller Ruhe in unserer Gerichtsakte genauer an!',
            },
          ],
        },
        {
          id: 'vance_beweise_anforderung',
          title: 'Dr. Vance: Ändert die Temperatur in Zelle 08 etwas?',
          speakerId: 'vance',
          requiredFlag: 'flag_c2_a2_klima_geloest',
          hideIfFlag: 'flag_c2_tatzeit_geloest',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Dr. Vance, wir kommen gerade direkt aus Arrestzelle 08. Da unten ist es nicht nur auffällig kalt – laut Sensor-Protokoll wurde um 03:00 Uhr nachts manuell an der Kühlung gedreht!',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Ihr Bericht rechnet aber mit einem normalen Kabinenwert von 21 °C. Hat eine so kühle Nacht nicht erhebliche Auswirkungen auf Ihre geschätzte Todeszeit?',
            },
            {
              speakerId: 'vance',
              emotion: 'neutral',
              setsFlag: 'flag_c2_a2_vance_temp_gefragt',
              text: 'Ach, Mr. Sterling… na ja, was macht das am Ende schon aus, die paar Stunden hin oder her? Ob etwas früher oder später – tot ist tot, für meine medizinischen Unterlagen spielt das keine Rolle.',
            },
            {
              speakerId: 'maya',
              emotion: 'sweating',
              text: '„Was macht das schon aus, die paar Stunden“?! Seit wann ist es einer Ärztin denn völlig egal, wann jemand genau gestorben ist?!',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: '(Sie weicht dem Temperatur-Thema verdächtig glatt aus… Vielleicht reagiert sie eher, wenn wir ihr statt bloßer Vermutungen direkt den Widerspruch rund um die Nachtwache vorlegen.)',
            },
          ],
        },
        {
          id: 'vance_a3_toxikologie',
          title: 'Dr. Vance: Ihre Nachtwache um 02:00 Uhr & das Labor-Ergebnis',
          speakerId: 'vance',
          requiredFlag: 'flag_c2_a3_andrew_verabschiedet',
          hideIfFlag: 'flag_c2_a3_obduktion_da',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Dr. Vance! Entschuldigen Sie die Störung – Sie sind auf der Krankenstation doch rund um die Uhr im Bereitschaftsdienst. Haben Sie heute Nacht gegen zwei Uhr morgens irgendetwas Ungewöhnliches gesehen oder gehört?',
            },
            {
              speakerId: 'vance',
              emotion: 'neutral',
              text: 'Gegen zwei Uhr? Hmm… lassen Sie mich nachsehen. Um 01:48 Uhr rief mich ein Passagier auf Deck 4 wegen akuter Seekrankheit in die Kabine. Ich war etwa zwanzig Minuten unterwegs, bis ich gegen 02:10 Uhr wieder hier oben war.',
            },
            {
              speakerId: 'maya',
              emotion: 'shocked',
              text: 'Zwanzig Minuten lang war die Krankenstation komplett unbesetzt?! Genau zwischen 01:50 und 02:10 Uhr?!',
            },
            {
              speakerId: 'vance',
              emotion: 'sweating',
              text: 'Leider ja – nachts habe ich keinen Pfleger neben mir am Empfang. Warum fragen Sie so eindringlich, Mr. Sterling?',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Weil genau danach – von 02:04 bis 02:19 Uhr – die elektronische Tür zu Arrestzelle 08 durch einen gezielten Strom-Einbruch volle 15 Minuten lang völlig unbemerkt offen stand!! Und genau dann fiel in der Zelle der Metallhocker um!',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Aber eines passt noch nicht: Ein kräftiger Mann wie Arthur Morgan hätte sich gegen jeden Eindringling gewehrt! Sagen Sie mir bitte ehrlich – was sagt die vollständige Blut- und Toxikologie-Auswertung aus Ihrem Analysegerät?!',
            },
            {
              speakerId: 'vance',
              emotion: 'shocked',
              shake: true,
              setsFlag: 'flag_c2_a3_obduktion_da',
              unlocksEvidence: 'obduktion_betaeubung',
              unlocksThought: 'thought_c2_a3_arthur_betaeubt',
              text: '… Gütiger Himmel. Der vollautomatische Tox-Lauf ist gerade erst vor ein paar Minuten fertig durchgelaufen – heute früh unter dem Druck des Hafeneinlaufs habe ich mir nur die äußeren Befunde angeschaut!',
            },
            {
              speakerId: 'vance',
              emotion: 'shocked',
              text: 'Sehen Sie sich diese Balken auf dem Ausdruck an, Mr. Sterling: Arthur Morgans Blut enthält eine massive Dosis eines schnell wirkenden Sedativums!! Und genau eine solche Flasche fehlt aus meinem Nachtschrank…',
            },
            {
              speakerId: 'maya',
              emotion: 'shocked',
              text: 'BETÄUBT?! Das heißt… jemand hat während Ihrer Abwesenheit das Mittel aus dem Schrank genommen, Arthur wehrlos gemacht und dann dieses 15-Minuten-Fenster in Zelle 08 ausgenutzt!!',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Jetzt gibt es keinen Zweifel mehr an einem Verbrechen! Mit diesen medizinischen Fakten verändert sich unser ganzer Blick auf den Abend…',
            },
          ],
        },
      ],
      presentRules: [
        {
          evidenceId: 'magnet_crash_protokoll',
          targetCharacterId: 'vance',
          requiredFlag: 'flag_c2_a3_lock_geknackt',
          hideIfFlag: 'flag_c2_a3_obduktion_da',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              shout: 'MOMENT MAL!',
              shake: true,
              text: 'Dr. Vance! Ein gezielter Crash legt das Zellenschloss für 15 Minuten spurlos lahm – genau in derselben Nacht, in der Ihre Krankenstation kurz unbesetzt war! Warum hatte Arthur Morgan bei einem Überfall keinerlei Abwehrverletzungen? Schauen Sie bitte sofort in die echte Toxikologie!',
            },
            {
              speakerId: 'vance',
              emotion: 'shocked',
              shake: true,
              setsFlag: 'flag_c2_a3_obduktion_da',
              unlocksEvidence: 'obduktion_betaeubung',
              unlocksThought: 'thought_c2_a3_arthur_betaeubt',
              text: 'Mein Gott… Sie haben Recht!! Das Blut-Panel beweist eine extrem hohe Dosis eines starken Beruhigungsmittels! Arthur Morgan war vor seinem Tod tief betäubt – er konnte sich nicht einmal mehr rühren!!',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Damit wissen wir endlich, warum kein Kampf stattfand… Jetzt fügt sich alles zusammen.',
            },
          ],
        },
        {
          evidenceId: 'spannungseinbruch_log',
          targetCharacterId: 'vance',
          requiredFlag: 'flag_c2_a3_strom_geprueft',
          hideIfFlag: 'flag_c2_a3_obduktion_da',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              shout: 'MOMENT MAL!',
              shake: true,
              text: 'Dr. Vance! Zwischen 02:04 und 02:19 Uhr gab es auf Deck -2 eine exakte 15-Minuten-Stromlücke – genau dann, als ein Eindringling spurlos in die Zelle konnte! Warum gab es keine Gegenwehr?!',
            },
            {
              speakerId: 'vance',
              emotion: 'shocked',
              shake: true,
              setsFlag: 'flag_c2_a3_obduktion_da',
              unlocksEvidence: 'obduktion_betaeubung',
              unlocksThought: 'thought_c2_a3_arthur_betaeubt',
              text: 'Die frische Toxikologie erklärt alles, Mr. Sterling!! Arthur Morgans Blut enthält eine massive Dosis eines Sedativums – und eine Flasche fehlt hier aus dem Schrank! Er war schwer betäubt und völlig wehrlos!!',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Ein klares Fremdverschulden… Jetzt schließt sich der Kreis.',
            },
          ],
        },
        {
          evidenceId: 'zellen_klima_protokoll',
          targetCharacterId: 'vance',
          hideIfFlag: 'flag_c2_tatzeit_geloest',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Dr. Vance, werfen Sie bitte einen Blick auf diesen Sensor-Ausdruck aus Zelle 08! Jemand hat die Temperatur um 03:00 Uhr nachts stark nach unten verstellt.',
            },
            {
              speakerId: 'vance',
              emotion: 'neutral',
              setsFlag: 'flag_c2_a2_vance_temp_gefragt',
              text: 'Na ja, was macht das schon aus, die paar Stunden hin oder her, Mr. Sterling? Tot ist tot – an meinem medizinischen Befund ändert eine kalte Nacht gar nichts.',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Komisch… wie egal ihr mehrere Stunden Unterschied plötzlich zu sein scheinen.',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: '(Über die Temperatur allein lässt sie sich nicht aus der Reserve locken… Vielleicht kommen wir eher weiter, wenn wir ihr die Lügen in den Wach- und Zeitberichten direkt unter die Nase halten.)',
            },
          ],
        },
        {
          evidenceId: 'beweis_brandt_luegt',
          targetCharacterId: 'vance',
          requiredFlag: 'flag_c2_a2_brandt_widerspruch_geloest',
          hideIfFlag: 'flag_c2_a2_bruecke_freigeschaltet',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              shout: 'MOMENT MAL!',
              shake: true,
              text: 'Dr. Vance, schauen Sie sich diesen Widerspruch einmal ganz genau an! Officer Brandt hat protokolliert, bis 06:00 Uhr sei alles ruhig gewesen – dabei krachte es schon um 02:10 Uhr in Zelle 08!',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Und während Brandt den Gefangenen angeblich um 06:00 Uhr tot fand, steht auf Ihrem eigenen Zettel 07:30 Uhr! Wieso decken sich Ihre Berichte nicht einmal im Ansatz mit der Nachtwache?!',
            },
            {
              speakerId: 'vance',
              emotion: 'sweating',
              unlocksLocation: 'bridge',
              setsFlag: 'flag_c2_a2_bruecke_freigeschaltet',
              text: 'Dazu kann ich beim besten Willen nichts sagen, Mr. Sterling! Ich bin Schiffsärztin, kein Vorgesetzter der Bordwache – ich kann der Sicherheit keine Befehle erteilen!',
            },
            {
              speakerId: 'vance',
              emotion: 'sweating',
              text: 'Wenn Sie wegen der Abläufe der Nachtschicht eine Erklärung verlangen, dann wenden Sie sich bitte oben auf der Kommandobrücke an Kapitän Brammer persönlich!',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Aha! Sobald es um Officer Brandt und die Befehlsgewalt an Bord geht, blockt sie sofort ab und schickt uns hoch zur Kommandobrücke… Schauen wir mal, was Kapitän Brammer dazu sagt!',
            },
          ],
        },
        {
          evidenceId: 'brandt_wachbuch',
          targetCharacterId: 'vance',
          requiredFlag: 'flag_c2_a2_brandt_widerspruch_geloest',
          hideIfFlag: 'flag_c2_a2_bruecke_freigeschaltet',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              shout: 'MOMENT MAL!',
              shake: true,
              text: 'Dr. Vance, dieses Wachprotokoll hier lässt Ihren Bericht ziemlich merkwürdig aussehen! Brandt notiert 06:00 Uhr, Sie nennen 07:30 Uhr – und Zeugen hörten schon um 02:10 Uhr Krach!',
            },
            {
              speakerId: 'vance',
              emotion: 'sweating',
              unlocksLocation: 'bridge',
              setsFlag: 'flag_c2_a2_bruecke_freigeschaltet',
              text: 'Dazu kann ich wirklich nichts sagen, Mr. Sterling! Ich bin hier die Ärztin und kann der Sicherheit keine Befehle erteilen – da müssen Sie oben auf der Kommandobrücke Kapitän Brammer fragen!',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Die Kommandobrücke ist ab sofort für uns erreichbar – sehen wir dort oben direkt beim Kapitän weiter!',
            },
          ],
        },
        {
          evidenceId: 'lueftung_streich',
          targetCharacterId: 'vance',
          requiredFlag: 'flag_c2_a2_brandt_widerspruch_geloest',
          hideIfFlag: 'flag_c2_a2_bruecke_freigeschaltet',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              shout: 'MOMENT MAL!',
              shake: true,
              text: 'Dr. Vance, um 02:10 Uhr gab es eindeutigen Lärm in Zelle 08 – das passt weder zu Brandts ruhigem Wachprotokoll noch zu Ihrem Bericht!',
            },
            {
              speakerId: 'vance',
              emotion: 'sweating',
              unlocksLocation: 'bridge',
              setsFlag: 'flag_c2_a2_bruecke_freigeschaltet',
              text: 'Ich bin Ärztin und kann der Sicherheit keine Befehle geben, Mr. Sterling! Wenden Sie sich mit diesen Fragen auf der Kommandobrücke an Kapitän Brammer!',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Alles klar – gehen wir hoch zur Kommandobrücke und hören uns an, was der Kapitän dazu meint!',
            },
          ],
        },
        {
          evidenceId: 'obduktion_vorlaeufig',
          targetCharacterId: 'vance',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Dr. Vance, gibt es zu Ihrem vorläufigen Bericht noch irgendeinen Zusatz oder ein separates Beiblatt?',
            },
            {
              speakerId: 'vance',
              emotion: 'neutral',
              text: 'Nein. Meinen eigenen Bericht kenne ich auswendig, Mr. Sterling – darin steht alles, was für die Übergabe nötig ist.',
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
    bridge: {
      id: 'bridge',
      name: 'Kommandobrücke',
      subtitle: 'Steuerhaus · Kapitän Brammer',
      backgroundUrl: '/src/assets/images/bridge_deck_1795257794601.jpg',
      charactersPresent: [
        {
          characterId: 'captain',
          hideIfFlag: 'flag_c2_dimitri_weg',
        },
        {
          characterId: 'captain',
          visibleIfFlag: 'flag_c2_dimitri_weg',
          hideIfFlag: 'flag_c2_a3_pass_erlaubnis',
        },
        {
          characterId: 'cruisemanager',
          visibleIfFlag: 'flag_c2_dimitri_weg',
          hideIfFlag: 'flag_c2_a3_pass_erlaubnis',
        },
      ],
      hotspots: [
        {
          id: 'c2_a2_radar_konsole',
          label: 'Brücken-Radar & Kurstisch',
          x: 56,
          y: 50,
          width: 24,
          height: 22,
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Beeindruckend hier oben auf der Kommandobrücke… Hier laufen alle elektronischen Seekarten, Funksignale und Positionsdaten der MS Aurora zusammen.',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Und von diesem Panoramafenster aus sieht man nicht nur die ganze Küste von Heraklion, sondern auch das offene blaue Meer bis zum Horizont!',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Ein herrlicher Ausblick – schade nur, dass die Stimmung hier oben beim Kapitän mindestens so frostig ist wie unten in Zelle 08.',
            },
          ],
        },
      ],
      talkTopics: [
        {
          id: 'captain_zelle_erst_pruefen',
          title: 'Kapitän Brammer: Zu Officer Brandt in Zelle 08',
          speakerId: 'captain',
          requiredFlag: 'flag_c2_a2_bruecke_freigeschaltet',
          hideIfFlag: 'flag_c2_a2_klima_geloest',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Kapitän Brammer! Dr. Vance hat uns heraufgeschickt – Officer Brandts Nachtwache widerspricht dem Geräusch um 02:10 Uhr, und er lässt uns nicht einmal in Zelle 08 hinein!',
            },
            {
              speakerId: 'captain',
              emotion: 'neutral',
              text: 'Hören Sie auf, mir wegen jedes Dienstbuchs in den Ohren zu liegen, Herr Sterling! Ich habe oben auf meiner Brücke ein ganzes Schiff vor Anker zu halten.',
            },
            {
              speakerId: 'captain',
              emotion: 'neutral',
              text: 'Wenn Sie meinen, da unten stimmt etwas nicht, dann klären Sie das erst mit Kommissar Dimitri vor Zelle 08 und prüfen den Raum selbst! Ohne handfeste Befunde aus der Zelle brauchen Sie mir hier oben nicht meine Zeit stehlen.',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Na toll, er blockt komplett ab… Dann bleibt uns wohl nichts übrig, als uns wirklich erst selbst Zutritt zu Zelle 08 zu verschaffen!',
            },
          ],
        },
        {
          id: 'captain_temperatur_eleonore',
          title: 'Kapitän Brammer: Brandts Lüge & die Zellentemperatur',
          speakerId: 'captain',
          requiredFlag: 'flag_c2_a2_klima_geloest',
          hideIfFlag: 'flag_c2_tatzeit_geloest',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Kapitän Brammer! Wir waren jetzt selbst in Zelle 08 – Officer Brandt lügt bei seinem Wachprotokoll, und unten wurde um 03:00 Uhr nachts auch noch manuell die Kühlung heruntergedreht!',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Dr. Vance meinte eben bloß lapidar, ein paar Stunden hin oder her würden doch nichts ausmachen. Wie erklären Sie sich das?',
            },
            {
              speakerId: 'captain',
              emotion: 'neutral',
              text: 'Da hat unsere Ärztin recht, Herr Sterling! Was machen Sie hier auf meiner Brücke wegen einer simplen Temperatur-Einstellung so einen Wirbel? Ob Zelle 08 nachts warm oder kalt war, ist doch überhaupt nicht so wichtig!',
            },
            {
              speakerId: 'eleonore',
              emotion: 'shocked',
              animation: 'shock',
              shout: 'MOMENT MAL!',
              shake: true,
              text: 'ENTSCHULDIGUNG, HERR KAPITÄN – aber das ist für den Todeszeitpunkt überhaupt NICHT egal!!',
            },
            {
              speakerId: 'captain',
              emotion: 'neutral',
              shake: true,
              text: 'Donnerwetter!! Wer hat diese Passagierin überhaupt durch die Tür auf meine Kommandobrücke gelassen?! Mrs. Higginson, das ist ein Sicherheitsbereich – verlassen Sie sofort die Brücke!!',
            },
            {
              speakerId: 'eleonore',
              emotion: 'confident',
              text: 'Tut mir leid, aber da muss selbst ich als Hobbydetektivin einschreiten! In jedem guten Krimi und sogar bei Inspektor Barnaby weiß doch jedes Kind: Wenn ein Raum ab 03:00 Uhr eiskalt gekühlt wird, stimmt keine Standard-Tabelle der Welt mehr!',
            },
            {
              speakerId: 'eleonore',
              emotion: 'confident',
              text: 'Dann trat der Tod niemals erst um 07:30 Uhr ein – sondern schon viel früher, gegen 02:10 Uhr, genau als meine Jungs das Krachen gehört haben!!',
            },
            {
              speakerId: 'captain',
              emotion: 'neutral',
              shake: true,
              text: 'Grrr – diese Frau macht mich wahnsinnig!! Na schön!! Dann ist der Todeszeitpunkt eben früher gewesen – meinetwegen um 02:10 Uhr!! Aber das ändert an der Sache doch rein gar nichts!!',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              unlocksEvidence: 'notiz_todeszeit_0210',
              unlocksThought: 'thought_c2_wahre_tatzeit',
              setsFlag: 'flag_c2_tatzeit_geloest',
              text: 'Notiert: „Todeszeitpunkt 02:10 Uhr“! Komisch nur, wie gereizt der Kapitän wurde, als Eleonore genau diesen Punkt angesprochen hat…',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Seltsam… Warum regt er sich über diese Uhrzeit bloß so auf, wenn sie angeblich nichts ändert? Wir sollten Kommissar Dimitri an Bord suchen und ihm unsere neue 02:10-Uhr-Notiz zeigen!',
            },
          ],
        },
        {
          id: 'c2_a3_bruecke_managerin',
          title: 'Kapitän & Sabine Lindemann: Zugang zu Zelle 08 erbitten',
          speakerId: 'captain',
          requiredFlag: 'flag_c2_dimitri_weg',
          hideIfFlag: 'flag_c2_a3_pass_erlaubnis',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Kapitän Brammer! Entschuldigen Sie die erneute Störung – aber wir haben am Strand einen wichtigen Hinweis zu diesem blauen Seidentuch in Zelle 08 entdeckt. Dürften wir das elektronische Türschloss dort unten ein einziges Mal technisch überprüfen?',
            },
            {
              speakerId: 'captain',
              emotion: 'neutral',
              shake: true,
              text: 'SCHLUSS JETZT, HERR STERLING!! Kommissar Dimitri ist von Bord, die Reederei sitzt mir wegen der Verspätung schon stündlich im Nacken – und jetzt wollen Sie ausgerechnet wieder an meine Arrestzellen?! Zutritt strikt abgelehnt! Verlassen Sie sofort meine Brücke!!',
            },
            {
              speakerId: 'cruisemanager',
              emotion: 'confident',
              sfx: 'evidence_chime',
              text: 'Einen winzig kleinen Augenblick, Herr Kapitän! Darf ich als leitende Kreuzfahrtmanagerin ein kurzes Wort aus Perspektive unserer Gäste-Zufriedenheit einwerfen?',
            },
            {
              speakerId: 'captain',
              emotion: 'neutral',
              text: 'Frau Lindemann?! Was wollen SIE denn jetzt schon wieder hier oben?! Ich habe glasklare Anweisung von der Zentrale, diese Sache endlich unter den Teppich— äh, sauber abzuschließen!',
            },
            {
              speakerId: 'cruisemanager',
              emotion: 'confident',
              text: 'Mit größtem Respekt für Ihren Dienstplan, Kapitän – aber schauen Sie bitte einmal in meine Gäste-Bewertungen von heute Mittag! Seit der Verhandlung gestern Abend hat sich unsere Bar-Auslastung auf Deck 5 verdoppelt!',
            },
            {
              speakerId: 'cruisemanager',
              emotion: 'confident',
              text: 'Die Passagiere LIEBEN diese Gerichts-Show!! Im Sonnendeck-Shop fragen sie schon nach „Einspruch!“-Tassen! Wenn wir unseren Gästen heute Abend noch eine zweite Runde liefern, vergessen alle sofort den ganzen Ärger über den verzögerten Landgang – also überstimme ich die Zellensperre kraft Gästebetreuungs-Direktive!',
            },
            {
              speakerId: 'maya',
              emotion: 'shocked',
              text: 'Äh… Sie dürfen dem Kapitän einfach so einen Befehl geben, weil sich die Gäste beim Cocktail-Trinken bestens unterhalten fühlen?!',
            },
            {
              speakerId: 'cruisemanager',
              emotion: 'confident',
              text: 'Gutes Event-Management ist eben die heimliche Macht auf den sieben Weltmeeren, Schätzchen! Betrachten Sie die ganze MS Aurora ab sofort als Europas erstes schwimmendes Kreuzfahrt-Gerichts-LARP! Und wir zwei machen einen ganz einfachen Deal, Mr. Sterling:',
            },
            {
              speakerId: 'cruisemanager',
              emotion: 'confident',
              text: 'Ich öffne Ihnen sofort wieder die Türen zu Arrestzelle 08 und den Technik-Decks – und im Gegenzug versprechen Sie mir heute Abend im Großen Ballsaal eine brandneue, unvergessliche Abend-Gerichtsshow!!',
            },
            {
              speakerId: 'nate',
              emotion: 'sweating',
              text: 'So makaber das Wort „LARP“ bei einem echten Todesfall auch klingt… solange wir dort unten echte Beweise sichern dürfen, schlage ich ein, Frau Lindemann!',
            },
            {
              speakerId: 'cruisemanager',
              emotion: 'confident',
              setsFlag: 'flag_c2_a3_pass_erlaubnis',
              unlocksThought: 'thought_c2_a3_gerichts_larp',
              text: 'Fabelhaft!! *flüstert verträumt vor sich hin:* Mit diesen Zuschauerzahlen ist mir der Platz als Flotten-Managerin im Herbst absolut sicher… Gehen Sie wieder hinunter zu Brandt, Mr. Sterling – der Zugang ist bereits per Funk freigegeben!',
            },
          ],
        },
      ],
      presentRules: [
        {
          evidenceId: 'zellen_klima_protokoll',
          targetCharacterId: 'captain',
          requiredFlag: 'flag_c2_a2_klima_geloest',
          hideIfFlag: 'flag_c2_tatzeit_geloest',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Kapitän Brammer! Schauen Sie sich diesen Sensor-Ausdruck aus Zelle 08 an – die Temperatur wurde um 03:00 Uhr nachts absichtlich heruntergedreht! Dr. Vance tut das einfach ab!',
            },
            {
              speakerId: 'captain',
              emotion: 'neutral',
              text: 'Na und, Herr Sterling?! Ob ein Ventil klemmt oder die Zelle kühler war, ist für diesen Fall doch überhaupt nicht so wichtig!',
            },
            {
              speakerId: 'eleonore',
              emotion: 'shocked',
              animation: 'shock',
              shout: 'MOMENT MAL!',
              shake: true,
              text: 'Das stimmt NICHT, Herr Kapitän! Für den Todeszeitpunkt ist genau diese Temperatur überhaupt nicht egal!!',
            },
            {
              speakerId: 'captain',
              emotion: 'neutral',
              shake: true,
              text: 'Was machen SIE denn hier oben, Mrs. Higginson?! Wer lässt hier Passagiere auf meine Brücke?! Na schön – dann war der Todeszeitpunkt eben schon früher, um 02:10 Uhr!! Das ändert doch trotzdem nichts!!',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              unlocksEvidence: 'notiz_todeszeit_0210',
              unlocksThought: 'thought_c2_wahre_tatzeit',
              setsFlag: 'flag_c2_tatzeit_geloest',
              text: 'Perfekt – „Todeszeitpunkt 02:10 Uhr“ ist festgehalten! Komisch, warum ihn genau diese Uhrzeit so in Rage bringt… Suchen wir Kommissar Dimitri an Bord und zeigen ihm diese neue Notiz!',
            },
          ],
        },
        {
          evidenceId: 'beweis_brandt_luegt',
          targetCharacterId: 'captain',
          requiredFlag: 'flag_c2_a2_klima_geloest',
          hideIfFlag: 'flag_c2_tatzeit_geloest',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Kapitän Brammer! Officer Brandt lügt über die Nachtwache – und Dr. Vance tut so, als wären ein paar Stunden Unterschied wegen der Zellentemperatur völlig egal!',
            },
            {
              speakerId: 'captain',
              emotion: 'neutral',
              text: 'Was reiten Sie auf der Temperatur herum? Das ist doch überhaupt nicht so wichtig!',
            },
            {
              speakerId: 'eleonore',
              emotion: 'shocked',
              animation: 'shock',
              shout: 'MOMENT MAL!',
              shake: true,
              text: 'Aber für den Todeszeitpunkt ist die Temperatur doch überhaupt NICHT egal!! Ohne die Kühlung hätte 07:30 Uhr niemals gestimmt!',
            },
            {
              speakerId: 'captain',
              emotion: 'neutral',
              shake: true,
              text: 'Schaffen Sie diese Hobby-Detektivin von meiner Brücke!! Gut, dann war der Todeszeitpunkt eben früher, um 02:10 Uhr – na und?! Das ändert gar nichts!!',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              unlocksEvidence: 'notiz_todeszeit_0210',
              unlocksThought: 'thought_c2_wahre_tatzeit',
              setsFlag: 'flag_c2_tatzeit_geloest',
              text: 'Notiz gespeichert: „Todeszeitpunkt 02:10 Uhr“! Schauen wir uns auf dem Schiff um, wo Kommissar Dimitri gerade steckt, und zeigen ihm das!',
            },
          ],
        },
      ],
      fallbackPresentLines: [
        {
          speakerId: 'captain',
          emotion: 'neutral',
          text: 'Dafür habe ich hier oben auf der Brücke jetzt keinen Nerv, Herr Sterling.',
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
          characterId: 'brandt',
          visibleIfFlag: 'flag_c2_a2_zelle_offen',
          hideIfFlag: 'flag_c2_a2_brandt_deck_done',
        },
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
              text: 'Wow, hier oben brummt richtig die Luft… Von hier aus führt ein mächtiger stählerner Belüftungsschacht schnurgerade nach unten ins Schiff!',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Kein Wunder, dass sich Schall durch so eine Metallröhre über mehrere Decks überträgt… Moment – was klebt da außen am unteren Metallrand?!',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              setsFlag: 'flag_c2_a2_walkie_indiz',
              text: 'Schau mal zwischen den Lamellen, Maya! Ein abgerissener grüner Gürtel-Clip mit Totenkopf-Sticker und einem dicken „L“ darauf! Genau so ein Walkie-Talkie hatte Leo vorhin am Gurt!',
            },
            {
              speakerId: 'maya',
              emotion: 'shocked',
              text: 'Aha!! Dann haben die zwei uns also nicht alles erzählt, und Leo und Rick haben heute Nacht hier am Schacht sehr wohl etwas getrieben!',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Jetzt haben wir einen handfesten Beweis in der Tasche – stellen wir die beiden hier drüben zur Rede!',
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
          id: 'brandt_oberdeck',
          title: 'Officer Brandt: Warum haben Sie die Zelle verlassen?',
          speakerId: 'brandt',
          requiredFlag: 'flag_c2_a2_zelle_offen',
          hideIfFlag: 'flag_c2_a2_brandt_deck_done',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Nanu, Officer Brandt? Eben noch unten vor Zelle 08 über Ihre „ruhige Schicht“ geprahlt, und jetzt mit Putzlappen und Handschuhen am Oberdeck-Lüftungsschacht?',
            },
            {
              speakerId: 'brandt',
              emotion: 'neutral',
              text: 'Routinekontrolle, Mr. Sterling. Da unten steht ja jetzt Ihr griechischer Kommissar herum. Und das Scharnier dieser Abluftklappe hier hat geklemmt – die Nachtwache ölt die Gelenke bei Bedarf selbst nach.',
              choices: [
                {
                  label: '„Führt dieser Schacht direkt bis in Arrestzelle 08 hinunter?“',
                  nextLines: [
                    {
                      speakerId: 'brandt',
                      emotion: 'sweating',
                      text: 'Durch den halben Schiffsrumpf, ja… Aber durch die Rohre kommt man akustisch normalerweise nicht sauber durch.',
                    },
                  ],
                },
                {
                  label: '„Sie riechen hier oben aber ziemlich stark nach Maschinenöl.“',
                  nextLines: [
                    {
                      speakerId: 'brandt',
                      emotion: 'neutral',
                      text: 'Das bringt das Schmierfett einer Schiffs-Lüftung eben mit sich. Nichts, worüber sich ein Urlauber den Kopf zerbrechen müsste.',
                    },
                  ],
                },
              ],
            },
            {
              speakerId: 'brandt',
              emotion: 'neutral',
              setsFlag: 'flag_c2_a2_brandt_deck_done',
              text: 'Halten Sie übrigens die Kinder dieser Familie Higginson von den Kisten fern. Heute Nacht schlich bereits genug unbefugtes Publikum über die Gänge. Guten Tag noch.',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Irgendwie läuft mir bei dem Typen ein kalter Schauer über den Rücken, Nate…',
            },
          ],
        },
        {
          id: 'leo_rick_streich',
          title: 'Leo & Rick: Wart ihr heute Nacht hier oben unterwegs?',
          speakerId: 'leo',
          hideIfFlag: 'flag_c2_a2_walkie_indiz',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'neutral',
              text: 'Na, ihr zwei? Ihr habt vorhin unten auf dem Promenadendeck doch gewettet, wer zuerst etwas über den Polizeieinsatz herausfindet – wart ihr heute Nacht schon mal hier oben?',
            },
            {
              speakerId: 'leo',
              emotion: 'smug',
              text: 'Wer, wir?! Niemals! Ab 22 Uhr haben wir wie die Engel in unseren Kabinenkojen geschlafen, stimmts, Rick?!',
            },
            {
              speakerId: 'rick',
              emotion: 'smug',
              text: 'Total! Nicht mal ein einziger Schritt vor die Tür! Warum fragen Sie überhaupt, Herr Anwalt?',
              choices: [
                {
                  label: '„Ich dachte, vielleicht habt ihr von hier oben Geräusche gehört.“',
                  nextLines: [
                    {
                      speakerId: 'leo',
                      emotion: 'neutral',
                      text: 'Nö, hier pfeift höchstens der Wind durch die Lüftung. Solange Sie keinen Beweis haben, dass wir hier waren, sagen wir gar nichts!',
                    },
                  ],
                },
                {
                  label: '„Eleonore meinte, euch fehlten Batterien fürs Walkie-Talkie…“',
                  nextLines: [
                    {
                      speakerId: 'rick',
                      emotion: 'sweating',
                      text: 'Äh… Mamas Detektiv-Gespür wieder!! Nein, ehrlich, Mr. Sterling – ohne Beweis verraten wir uns doch nicht selbst vor Papa!',
                    },
                  ],
                },
              ],
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: '(Die zwei grinsen viel zu verschwörerisch… so unschuldig schaut niemand nach einer durchwachten Nacht.)',
            },
          ],
        },
        {
          id: 'leo_rick_gestaendnis',
          title: 'Leo & Rick: Was macht euer Walkie-Talkie-Clip im Lüftungsgitter?!',
          speakerId: 'leo',
          requiredFlag: 'flag_c2_a2_walkie_indiz',
          hideIfFlag: 'flag_c2_dimitri_weg',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Schaut mal her, ihr zwei „Schlafmützen“! Diesen grünen Piraten-Walkie-Talkie-Clip mit einem dicken „L“ darauf habe ich gerade aus den Lamellen dort am Lüftungsgitter gezogen!',
            },
            {
              speakerId: 'rick',
              emotion: 'shocked',
              text: 'Oha!! Leo, ich hab dir doch gesagt, das Schnürsenkel-Seil reißt gleich!!',
            },
            {
              speakerId: 'leo',
              emotion: 'sweating',
              text: 'Pssst!! Sei still! Wenn Papa erfährt, dass wir nach Mitternacht mit dem Walkie-Talkie Geistergeräusche in die unteren Schiffsdecks gefunkt haben, kriegen wir bis Weihnachten Eisverbot!',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: '(Sie sind kurz vorm Einknicken – wie überzeuge ich die beiden am besten?)',
              choices: [
                {
                  label: '„Ehrenwort: Euer Vater erfährt von mir kein Sterbenswort!“',
                  nextLines: [
                    {
                      speakerId: 'maya',
                      emotion: 'confident',
                      text: 'Anwalts-Ehrenwort! Wir brauchen nur die genaue Uhrzeit von eurem Streich – für eine echte Ermittlung!',
                    },
                  ],
                },
                {
                  label: '„Eure Mutter wäre mega stolz auf zwei echte Geheimzeugen!“',
                  nextLines: [
                    {
                      speakerId: 'rick',
                      emotion: 'smug',
                      text: 'Stimmt eigentlich! Mama feiert jeden echten Zeugen total ab – und Papa merkt davon ja gar nichts!',
                    },
                  ],
                },
              ],
            },
            {
              speakerId: 'leo',
              emotion: 'smug',
              text: 'Na gut! Also: Wir wollten um Punkt zwei Uhr nachts mit dem zweiten Walkie-Talkie an einer Schnur ein bisschen „Buuuuh“ in den Schacht rufen, um irgendeine Crew-Schicht zu erschrecken…',
            },
            {
              speakerId: 'rick',
              emotion: 'sweating',
              unlocksEvidence: 'lueftung_streich',
              unlocksThought: 'thought_c2_0210_poltern',
              text: 'Doch um exakt 02:10 Uhr – stand genau auf Leos leuchtender Armbanduhr! – hat es ganz tief unten im Schacht einen riesigen Schlag getan, als wäre ein schwerer Metallhocker umgefallen! Wir haben uns total erschrocken, der Clip ist abgerissen – und wir sind sofort weg in unsere Kabine gerannt!!',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Um exakt 02:10 Uhr nachts ein riesiges Krachen ganz unten aus Zelle 08?! Kein Wunder, dass ihr beiden Reißaus genommen habt – aber diese Uhrzeit ist für uns Gold wert!',
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
              shout: 'MOMENT MAL!',
              shake: true,
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
    switchroom: {
      id: 'switchroom',
      name: 'Schaltzentrale & Bordtechnik',
      subtitle: 'Unterdeck · Energieverteilung & Notstrom-Bus',
      backgroundUrl: '/src/assets/images/scene_ship_switchroom_1795276701791.jpg',
      charactersPresent: [
        {
          characterId: 'electrician',
        },
        {
          characterId: 'andrew',
          visibleIfFlag: 'flag_c2_a3_lock_geknackt',
          hideIfFlag: 'flag_c2_a3_andrew_verabschiedet',
        },
        {
          characterId: 'maya',
          visibleIfFlag: 'flag_c2_a3_andrew_verabschiedet',
        },
      ],
      hotspots: [
        {
          id: 'c2_a3_usv_oszilloskop',
          label: 'Spannungs-Oszilloskop & USV-Rack (Schleife B)',
          x: 56,
          y: 38,
          width: 26,
          height: 24,
          lines: [
            {
              speakerId: 'electrician',
              emotion: 'neutral',
              text: 'Aha, der Herr Anwalt – und sein neuer technischer Chefberater! Na, Herr IT-Experte, lesen Sie die Oberschwingungen auf Phase B gleich im Kopf ab, oder brauchen Sie dafür erst eine kabellose Maus?',
            },
            {
              speakerId: 'andrew',
              emotion: 'grumpy',
              shake: true,
              text: 'ICH BIN DATENBANK-PROJEKTLEITER, KEIN STARKSTROM-MONTEUR!! Warum hält mich auf diesem verdammten Kreuzfahrtschiff eigentlich jeder sofort für den Hausmeister vom Dienst?!',
            },
            {
              speakerId: 'andrew',
              emotion: 'neutral',
              text: '… Obwohl – Moment mal. Halten Sie doch bitte mal Ihren Zeigefinger auf dem Langzeitschreiber zwei Zentimeter weiter links an. Genau da bei Hilfskreis Zellentrakt B.',
            },
            {
              speakerId: 'electrician',
              emotion: 'neutral',
              text: 'Huch? Na gut, gucken wir in die Nacht-Kurve… Da steht alles auf stabilem 24-Volt-Betrieb bis Mitternacht, dann eins Uhr… und… hoppla?!',
            },
            {
              speakerId: 'nate',
              emotion: 'shocked',
              shout: 'MOMENT MAL!',
              shake: true,
              setsFlag: 'flag_c2_a3_strom_geprueft',
              unlocksEvidence: 'spannungseinbruch_log',
              text: 'SEHT EUCH DIESEN EINBRUCH AN!! Genau um 02:04 Uhr sackt die Versorgung auf Zellentrakt-Schleife B schlagartig ab und bleibt bis exakt 02:19 Uhr unten – volle 15 Minuten!! Punktgenau so lange, wie ein MS-400-Absturz dauert!!',
            },
            {
              speakerId: 'electrician',
              emotion: 'neutral',
              text: 'Donnerwetter… Recht hat er, Ihr Datenbank-Mann! Eine normale Sicherung fliegt raus und bleibt draußen – aber eine Überlast-Unterbrechung über exakt 15 Minuten sieht haargenau so aus! Jemand hat dieses Schloss heute Nacht um 02:04 Uhr gezielt abstürzen lassen!',
            },
            {
              speakerId: 'andrew',
              emotion: 'confident',
              text: 'Ha! Siehst du, Nate?! Man muss kein Elektriker sein, um saubere Logik in einer Fehlerkurve zu lesen… Äh, natürlich nur rein ausnahmsweise!',
            },
          ],
        },
        {
          id: 'c2_a3_alarm_puffer',
          label: 'Schaltschrank · Brücken-Alarmpuffer',
          x: 8,
          y: 20,
          width: 20,
          height: 32,
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Moment noch, Herr Kowalski – wenn die Spannung auf dem Arrest-Bus um 02:04 Uhr abfällt, müsste oben auf der Kommandobrücke doch sofort eine rote Warnlampe angehen?! Warum hat da niemand Alarm geschlagen?',
            },
            {
              speakerId: 'electrician',
              emotion: 'neutral',
              text: 'Gute Frage, Herr Anwalt! Sehen Sie diesen kleinen Drehschalter links im Nebenfeld? „Unterspannungsmeldung Brücke“ – der steht seit heute Nacht fein säuberlich auf „Wartungs-Bypass“.',
            },
            {
              speakerId: 'andrew',
              emotion: 'grumpy',
              text: 'Das heißt, man legt einfach diesen simplen Knebel um und oben auf der Brücke bleibt jede Warn-LED komplett stumm?! Großartige Sicherheitsarchitektur auf diesem Dampfer…',
            },
            {
              speakerId: 'electrician',
              emotion: 'neutral',
              text: 'Tja, genau dafür ist der Wartungsschalter eigentlich gedacht – leider weiß fast jeder an Bord, der mal eine Führung durch die Technik mitgemacht hat, wo dieses Kästchen sitzt.',
            },
          ],
        },
      ],
      talkTopics: [
        {
          id: 'kowalski_nachtschicht',
          title: 'Lars Kowalski: Wer könnte um 02:00 Uhr wach gewesen sein?',
          speakerId: 'electrician',
          hideIfFlag: 'flag_c2_a3_andrew_verabschiedet',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Herr Kowalski, Sie hatten heute Nacht doch Dienst hier unten. Haben Sie zwischen ein Uhr und drei Uhr nachts irgendjemanden auf dem Gang gesehen, oder gehört, wie jemand an die Schaltkästen ging?',
            },
            {
              speakerId: 'electrician',
              emotion: 'neutral',
              text: 'Tut mir leid, Herr Anwalt – ich war von halb eins bis fast halb drei tief hinten bei den Hauptgeneratoren auf Kontrollgang. Hier vorn in der Schaltzentrale ist es nachts leider totenstill, wenn man hinten am Diesel steht.',
            },
            {
              speakerId: 'andrew',
              emotion: 'grumpy',
              text: 'Super. Dann tappen wir also schon wieder im Dunkeln, wer da um zwei Uhr durchs Schiff geschlichen ist – und vor allem, wie Arthur Morgan überhaupt wehrlos gemacht wurde!',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Moment… denken wir doch einmal logisch nach! Wenn Herr Kowalski hinten bei den Generatoren war: Wer hat denn um zwei Uhr nachts überhaupt regulär Dienst an Bord, sodass man ihn noch fragen könnte, ob er jemanden gesehen hat?',
              choices: [
                {
                  label: '„Vielleicht die Boutique, der Speisesaal oder das Wellness-Deck?“',
                  nextLines: [
                    {
                      speakerId: 'electrician',
                      emotion: 'neutral',
                      text: 'Um zwei Uhr morgens? Haha, nein, die machen alle spätestens um Mitternacht die Rollläden runter. Selbst in der Küche brennt höchstens ab vier Uhr wieder Licht für die Bäcker.',
                    },
                    {
                      speakerId: 'nate',
                      emotion: 'thinking',
                      text: 'Stimmt… Aber irgendeine wichtige Station auf so einem großen Schiff schläft doch nie!',
                    },
                  ],
                },
                {
                  label: '„Die Security und die Kommandobrücke… und sonst?“',
                  nextLines: [
                    {
                      speakerId: 'andrew',
                      emotion: 'neutral',
                      text: 'Die Brücke hockt ganz oben, und bei der Security steht Officer Brandt selbst schon bis zum Hals in Widersprüchen… Wer hat nachts noch durchgehend geöffnet?',
                    },
                  ],
                },
                {
                  label: '„Die Krankenstation! Die muss doch rund um die Uhr besetzt sein!“',
                  nextLines: [
                    {
                      speakerId: 'electrician',
                      emotion: 'neutral',
                      text: 'Treffer! Genau wie wir im Maschinenraum und die Brückenwache ist die Krankenstation oben als einzige Passagier-Abteilung 24 Stunden am Stück besetzt!',
                    },
                  ],
                },
              ],
            },
            {
              speakerId: 'electrician',
              emotion: 'neutral',
              setsFlag: 'flag_c2_a3_kowalski_hinweis',
              text: 'Wenn auf Deck irgendjemand mitten in der Nacht Schritte auf den Gängen mitbekommen hat – oder wenn es wirklich um ein fehlendes Betäubungsmittel für Ihren Mordfall geht –, dann ist die Krankenstation eigentlich Ihre einzige Anlaufstelle zu so später Stunde. Dr. Vance müsste jede Nachtbereitschaft gehabt haben.',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Natürlich!! Die Krankenstation hat rund um die Uhr Dienst – nicht nur als möglicher Zeuge für die Zeit um zwei Uhr, sondern auch wegen der Medizin-Schränke und dem ausstehenden Blut-Bericht!',
            },
          ],
        },
        {
          id: 'kowalski_mit_maya',
          title: 'Lars Kowalski: Können wir Ihr Spannungsprotokoll im Prozess nutzen?',
          speakerId: 'electrician',
          requiredFlag: 'flag_c2_a3_andrew_verabschiedet',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Herr Kowalski, wir brauchen Ihr Spannungsprotokoll heute Abend eventuell direkt für die Verhandlung im Ballsaal.',
            },
            {
              speakerId: 'electrician',
              emotion: 'neutral',
              text: 'Nehmen Sie den Ausdruck ruhig mit, Herr Anwalt! Und bestellen Sie Ihrem IT-Spezialisten einen schönen Gruß: Für jemanden, der angeblich gar nichts von Hardware versteht, hat er ein verdammt scharfes Auge!',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Hihi, das darf Eleonore heute Abend bloß nicht erfahren – sonst darf Andrew ab morgen auf jeder Familienfeier wieder die Fernseher programmieren!',
            },
          ],
        },
      ],
      presentRules: [
        {
          evidenceId: 'magnet_crash_protokoll',
          targetCharacterId: 'electrician',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Herr Kowalski, wir haben in Zelle 08 nachgewiesen, dass ein gezielter Crash das Magnetschloss MS-400 für genau 15 Minuten stumm öffnet. Sieht man so etwas hier in Ihren Daten?',
            },
            {
              speakerId: 'electrician',
              emotion: 'neutral',
              text: 'Jupp, genau dieses 15-Minuten-Verhalten kenne ich von den alten MS-400-Platinen! Werfen Sie doch mal einen genauen Blick auf das Spannungs-Oszilloskop hier rechts in der Zentrale, ob um 02:04 Uhr wirklich ein Einbruch zu sehen ist!',
            },
          ],
        },
      ],
      fallbackPresentLines: [
        {
          speakerId: 'electrician',
          emotion: 'neutral',
          text: 'Dafür hab ich im Schaltplan leider kein Messgerät, Herr Anwalt.',
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
    testimony_c2_a3_vance: {
      id: 'testimony_c2_a3_vance',
      title: 'Abend-Gerichtsshow · Aussage: Dr. Helena Vance',
      witnessId: 'vance',
      introLines: [
        {
          speakerId: 'cruisemanager',
          emotion: 'confident',
          sfx: 'gavel_double',
          text: 'MEINE DAMEN UND HERREN – WILLKOMMEN ZUR GROSSEN ABEND-GERICHTSSHOW DER MS AURORA!! Applaus für Staatsanwalt von Falk und Ihren Star-Verteidiger Nate Sterling!!',
        },
        {
          speakerId: 'pendelton',
          emotion: 'headshake',
          animation: 'headshake',
          text: 'Ich weise letztmalig darauf hin, dass dies ein ernsthaftes Seegericht und keine Kreuzfahrt-Varieté-Show ist, Frau Lindemann!!',
        },
        {
          speakerId: 'falk',
          emotion: 'smug',
          text: 'Verschwenden Sie Ihren Atem nicht, Euer Ehren. Ich beende dieses Jahrmarkts-Spektakel in fünf Minuten: Dr. Vance bestätigt noch einmal abschließend, dass es in Zelle 08 ein schlichter Selbstmord war!',
        },
      ],
      statements: [
        {
          id: 'c2_a3_v1',
          text: 'Bei meiner Untersuchung von Arthur Morgan fanden sich weder Stichwunden noch Blutergüsse oder Zeichen eines Handgemenges.',
          pressLines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              shout: 'MOMENT MAL!',
              text: 'Haben Sie heute früh unter dem Zeitdruck des Hafeneinlaufs überhaupt schon eine innere Labor-Untersuchung abgewartet, Frau Doktor?',
            },
            {
              speakerId: 'vance',
              emotion: 'sweating',
              text: 'Das vollautomatische Blut-Panel lief erst Stunden später durch… Heute Morgen lag mir tatsächlich nur die rein äußerliche Sichtprüfung vor.',
            },
          ],
        },
        {
          id: 'c2_a3_v2',
          text: 'Auch das feine blaue Seidentuch oben am Zellengitter ändert daran nichts: Als geschniegelter Erste-Klasse-Oberkellner trug Arthur Morgan schließlich ständig solche Halstücher – es war also sein eigenes!',
          pressLines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              shout: 'MOMENT MAL!',
              text: 'Sind Sie da ganz sicher, Dr. Vance?! Haben Sie jemals bei der Wäscherei oder den Passagieren nachgefragt, wem dieses auffällige blaue Kreta-Muster wirklich gehört?!',
            },
            {
              speakerId: 'falk',
              emotion: 'smug',
              text: 'Wenn das kein Kellnertuch gewesen sein soll, Sterling – wem soll dieser blaue Schal denn bitte sonst gehören?! Zeigen Sie dem Gericht Ihren angeblichen Beweis!',
            },
          ],
          contradiction: {
            requiredEvidenceId: 'andrews_verlorener_schal',
            alternativeEvidenceIds: ['seidenschal_spur'],
            successLines: [
              {
                speakerId: 'nate',
                emotion: 'confident',
                shout: 'EINSPRUCH!',
                shake: true,
                text: 'DAS WAR KEIN KELLNERTUCH VON ARTHUR MORGAN, Euer Ehren!! Sehen Sie dort rechts in der Zuschauerreihe auf die Schultern von Mrs. Eleonore Higginson – genau denselben blauen Kreta-Seidenschal gab es als doppeltes Freundschafts-Geschenk nur zweimal an Bord!',
              },
              {
                speakerId: 'nate',
                emotion: 'confident',
                text: 'Und genau das identische Zwillingsstück ihres Ehemannes Andrew Higginson verschwand gestern Abend spurlos an Bord! Das Tuch am Tatort von Zelle 08 gehört also nicht Arthur Morgan – es stammt von einem völlig anderen Passagier!',
              },
              {
                speakerId: 'eleonore',
                emotion: 'confident',
                text: 'Stimmt genau, Euer Ehren!! Ich trage meinen wegen meiner Erkältung – und Andrews Zwillingsschal ist seit gestern weg!',
              },
              {
                speakerId: 'andrew',
                emotion: 'grumpy',
                text: 'Und ich bleibe dabei, der wurde mir gestohlen! Verlegt hab ich den garantiert nicht!!',
              },
              {
                speakerId: 'falk',
                emotion: 'thinking',
                sfx: 'thought_pop',
                text: 'So so… ein gestohlener oder verlorener blauer Kreta-Seidenschal der Familie Higginson… Interessante Randnotiz, Sterling. Aber selbst ein fremder Schal beweist noch lange keinen Mord!',
                startsTestimonyId: 'testimony_c2_a3_vance_mord',
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
          text: 'Das widerlegt weder die fehlenden Kampfspuren noch die Herkunft des blauen Tuches, Sterling!',
        },
      ],
    },
    testimony_c2_a3_vance_mord: {
      id: 'testimony_c2_a3_vance_mord',
      title: 'Abend-Gerichtsshow · Dr. Vance: Selbstmord oder Mord?',
      witnessId: 'vance',
      introLines: [
        {
          speakerId: 'vance',
          emotion: 'neutral',
          text: 'Gut, über das Seidentuch habe ich schlicht eine Vermutung geäußert – aber am medizinischen Kern ändert das nichts.',
        },
      ],
      statements: [
        {
          id: 'c2_a3_v3',
          text: 'Selbst wenn dieses blaue Tuch jemand anderem gehörte – ein kräftiger Mann wie Morgan hätte sich gegen jeden Angreifer gewehrt! Ohne Kampfspuren und bei geschlossener Tür bleibt nur Selbstmord!',
          pressLines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              shout: 'MOMENT MAL!',
              text: 'Warum sollte sich ein kräftiger Mann nicht gegen einen Angriff wehren? Doch wohl dann, wenn er körperlich gar nicht mehr bei Bewusstsein war!',
            },
            {
              speakerId: 'falk',
              emotion: 'smug',
              text: 'Dann reden Sie nicht nur groß daher, Sterling! Legen Sie dem Gericht endlich Ihren medizinischen Beweis vor!',
            },
          ],
          contradiction: {
            requiredEvidenceId: 'obduktion_betaeubung',
            successLines: [
              {
                speakerId: 'nate',
                emotion: 'confident',
                shout: 'EINSPRUCH!',
                shake: true,
                text: 'HIER IST DER MEDIZINISCHE BEWEIS, Staatsanwalt von Falk!! Laut Dr. Vances verspätetem Toxikologie-Bericht lag in Arthur Morgans Blut eine massive Dosis eines schnell wirkenden Betäubungsmittels!!',
              },
              {
                speakerId: 'nate',
                emotion: 'confident',
                text: 'Arthur Morgan hat nicht gegen seinen Angreifer gekämpft, weil er vor der Tat tief betäubt und völlig wehrlos gemacht wurde!! Und in Ihrem Nachtschrank fehlt genau eine solche Flasche, nicht wahr, Frau Doktor?!',
              },
              {
                speakerId: 'vance',
                emotion: 'shocked',
                text: 'Es… stimmt, Euer Ehren. Die Blutwerte sind eindeutig – Arthur Morgan war zum Todeszeitpunkt schwer sediert, und die Krankenstation war zwischen 01:50 und 02:10 Uhr wegen eines Notrufs kurz unbesetzt.',
              },
              {
                speakerId: 'falk',
                emotion: 'shocked',
                shake: true,
                text: 'Tch… WAS?! Betäubt?! Und wenn schon – das erklärt immer noch nicht diesen verschlossenen Raum!! Wie um alles in der Welt soll überhaupt ein Mörder ungesehen in Zelle 08 hinein- und wieder herausgekommen sein, ohne dass das elektronische Schloss irgendetwas aufzeichnet?!',
                requiresFinalEvidencePrompt: {
                  question:
                    'Beweise dem Tribunal, wie das Magnetschloss von Zelle 08 lautlos geöffnet wurde, ohne einen Eintrag im Tür-Logbuch zu hinterlassen!',
                  correctEvidenceId: 'magnet_crash_protokoll',
                  alternativeEvidenceIds: ['spannungseinbruch_log'],
                  successLines: [
                    {
                      speakerId: 'nate',
                      emotion: 'confident',
                      shout: 'VOLLTREFFER!',
                      shake: true,
                      text: 'SO KAM DER MÖRDER HINEIN, Euer Ehren!! Ein gezielter Absturz des MS-400-Controllers legt das Magnetschloss für volle 15 Minuten spurlos frei – und das Spannungsprotokoll aus der Schaltzentrale beweist genau diesen Einbruch von 02:04 bis 02:19 Uhr, ohne ein einziges Bit im Tür-Log!!',
                    },
                    {
                      speakerId: 'pendelton',
                      emotion: 'shocked',
                      animation: 'slam',
                      sfx: 'gavel_double',
                      text: 'EIN UNBEMERKTES 15-MINUTEN-FENSTER UND EIN BETÄUBTES OPFER?! Kann man ein elektronisches Schiffsschloss denn wirklich so einfach überlisten? Das soll uns dieser technische Zeuge gleich selbst erläutern – rufen Sie Mr. Andrew Higginson kurz in den Zeugenstand!',
                    },
                    {
                      speakerId: 'andrew',
                      emotion: 'grumpy',
                      text: 'W-was?! Ich soll jetzt vor den ganzen Zuschauern hier nach vorn?! Hören Sie mal, Euer Ehren – nur weil ich in der IT arbeite, heißt das nicht, dass ich der Schiffsschlosser bin!! Eigentlich kenne ich mich mit so etwas gar nicht aus!',
                    },
                    {
                      speakerId: 'falk',
                      emotion: 'smug',
                      text: 'Ach so? Dann war dieser angebliche 15-Minuten-Absturz also vielleicht doch nur ein billiges Gerücht eines Amateurs, der gar nicht versteht, wie so ein System funktioniert?',
                    },
                    {
                      speakerId: 'andrew',
                      emotion: 'grumpy',
                      shake: true,
                      text: 'EIN AMATEUR?! Jetzt hören Sie mir mal gut zu, Herr Staatsanwalt!! Wenn Sie meinen, dieses zweitklassige MS-400-Relais sei irgendwie schwer zu überlisten, dann passen Sie jetzt mal genau auf!',
                    },
                    {
                      speakerId: 'andrew',
                      emotion: 'confident',
                      text: 'Das Ding hängt an einem trivialen 24-Volt-Bus ohne sauberes Fehler-Logging vor dem Watchdog-Reset! Wenn man auf Schleife B genau sieben Sekunden lang eine gezielte Überlastung erzwingt und die Brücken-Warnung im Neben-Schrank umlegt, stürzt der Speicher-Controller einfach komplett ab!',
                    },
                    {
                      speakerId: 'andrew',
                      emotion: 'confident',
                      text: 'In den nächsten geschlagenen 15 Minuten fällt der Magnetbolzen lautlos ab, jeder Trottel kann durch die Tür spazieren – und wenn sich das System um 02:19 Uhr selbst neu bootet, schreibt es exakt NULL Komma NULL Einträge ins Protokoll!! So primitiv ist diese Kiste programmiert!!',
                    },
                    {
                      speakerId: 'eleonore',
                      emotion: 'confident',
                      text: 'WHOOO!! DAS IST MEIN MANN!! HÖREN SIE DIESE FACHKOMPETENZ?!',
                    },
                    {
                      speakerId: 'pendelton',
                      emotion: 'confident',
                      animation: 'slam',
                      sfx: 'gavel_double',
                      text: 'Ich danke Ihnen für diese überaus… plastische technische Vorführung, Mr. Higginson! Damit gibt es für dieses Tribunal keinen Zweifel mehr!',
                    },
                    {
                      speakerId: 'pendelton',
                      emotion: 'confident',
                      sfx: 'gavel',
                      text: 'Der Tod von Arthur Morgan war KEIN Selbstmord – ES WAR MORD! Ich übergebe die weiteren offiziellen Mordermittlungen hiermit förmlich in die Hände von Kommissar Dimitri und der Hafenpolizei Heraklion! Die Sitzung ist geschlossen!!',
                    },
                    {
                      speakerId: 'cruisemanager',
                      emotion: 'confident',
                      sfx: 'victory',
                      text: 'MEINE DAMEN UND HERREN – WAS FÜR EIN TRIUMPH FÜR UNSEREN STAR-VERTEIDIGER NATE STERLING!! Ein tosender Applaus für diese grandiose Abend-Gerichtsshow!!',
                    },
                    {
                      speakerId: 'nate',
                      emotion: 'confident',
                      text: 'Danke, danke vielmals! Haha… also ich will ja nichts sagen, Maya, aber heute Abend lief das mal wirklich wie im Lehrbuch, oder?',
                    },
                    {
                      speakerId: 'maya',
                      emotion: 'confident',
                      text: 'Und wie, Nate!! Das ganze Publikum steht Kopf! Morgen früh geht es endlich entspannt an den Strand von Kreta – kein Gerichtssaal mehr, nur noch Sonne und Eis!',
                    },
                    {
                      speakerId: 'andrew',
                      emotion: 'neutral',
                      text: 'Na Gott sei Dank ist dieses Theater jetzt vorbei… Komm, Eleonore, schnappen wir die Kinder und holen uns endlich ein ruhiges Abendessen in der Kabine.',
                    },
                    {
                      speakerId: 'falk',
                      emotion: 'neutral',
                      text: 'Einen winzigen Moment noch, Euer Ehren! Bevor Sie endgültig den Hammer weglegen und hier alle mit Sekt anstoßen: Ich beantrage eine kurze fünfminütige Unterbrechung.',
                    },
                    {
                      speakerId: 'pendelton',
                      emotion: 'thinking',
                      text: 'Eine Pause, Mr. von Falk? Nach dem Schlusswort? Nun gut – fünf Minuten gewährt, aber fassen Sie sich kurz.',
                    },
                    {
                      speakerId: 'nate',
                      emotion: 'sweating',
                      hideCharacters: true,
                      sfx: 'page_turn',
                      text: '(Fünf Minuten später… Während die Zuschauer schon ihre Mäntel zusammenpacken, stürmt Staatsanwalt von Falk mit einer frischen Mappe aus dem Sicherheitsbüro zurück in den Ballsaal!)',
                    },
                    {
                      speakerId: 'falk',
                      emotion: 'confident',
                      shout: 'MOMENT MAL!',
                      shake: true,
                      text: 'HALTEN SIE ALLE DEN ATEM AN!! Hier geht heute Abend niemand nach Hause! Rufen Sie diesen Familienvater gefälligst noch EINMAL in den Zeugenstand – ich muss da noch etwas ganz Grundlegendes klären!!',
                    },
                    {
                      speakerId: 'andrew',
                      emotion: 'shocked',
                      shake: true,
                      text: 'W-was?! Ich dachte, wir wären längst fertig?! Wieso starren Sie mich denn plötzlich so an, Herr Staatsanwalt?!',
                    },
                    {
                      speakerId: 'falk',
                      emotion: 'smug',
                      sfx: 'tension',
                      text: 'Weil sich die Anklage nicht einfach mit einem anonymen „Es war Mord!“ zufrieden gibt, Sterling! Schauen Sie sich Ihre eigenen Beweise von heute Abend einmal in einem einzigen Paket an – dann sehen Sie den Mörder genau hier vor uns stehen: ANDREW HIGGINSON!!',
                    },
                    {
                      speakerId: 'andrew',
                      emotion: 'shocked',
                      shake: true,
                      text: 'M-MÖRDER?! ICH?! Haben Sie völlig den Verstand verloren?! Ich bin ein ganz normaler Tourist im Familienurlaub!!',
                    },
                    {
                      speakerId: 'nate',
                      emotion: 'shocked',
                      text: 'Staatsanwalt von Falk, das kann doch nicht Ihr Ernst sein!! Sie werfen einem unbescholtenen Passagier aus heiterem Himmel Mord vor?!',
                    },
                    buildMultiTryDefense(
                      {
                        speakerId: 'falk',
                        emotion: 'confident',
                        text: 'Aus heiterem Himmel?! Gehen wir meine VIER Fakten doch Schritt für Schritt durch!! ERSTENS: TÄTERWISSEN!! Weder der Chef-Elektriker noch Security-Chef Brandt hatten eine Ahnung, wie man das MS-400-Schloss geräuschlos für 15 Minuten abstürzen lässt – bis ausgerechnet „IT-Mann“ Higginson vor fünf Minuten stolz wie ein Pfau jeden Handgriff erklärt hat!!',
                      },
                      [
                        {
                          label: '„Er ist Datenbank-Manager, kein Schiffs-Elektriker!“',
                          lines: [
                            {
                              speakerId: 'nate',
                              emotion: 'confident',
                              text: 'Moment! Andrew hat den ganzen Tag lang beteuert, dass er beruflich nur Datenbanken plant und von Schiffs-Hardware eigentlich gar nichts versteht!',
                            },
                            {
                              speakerId: 'falk',
                              emotion: 'smug',
                              text: 'Ach ja?! Und vor zweihundert Zeugen hat er eben im Zeugenstand aus dem Stegreif das Bus-Relais, den Sieben-Sekunden-Überlasttrick und den Brücken-Schalter heruntergerattert! Eine hübsche Tarnung, solange niemand hinschaut!',
                            },
                            {
                              speakerId: 'andrew',
                              emotion: 'shocked',
                              text: 'Aber ich hab das doch erst unten vor der Tür gesehen!! Ich wollte vor den Leuten nur nicht wie ein Vollidiot dastehen!!',
                            },
                          ],
                        },
                        {
                          label: '„Jeder Techniker hätte diesen Bug finden können!“',
                          lines: [
                            {
                              speakerId: 'nate',
                              emotion: 'thinking',
                              text: 'Das MS-400 ist ein Standardsystem! Jeder Bord-Elektriker hätte denselben Fehler am Bus finden können.',
                            },
                            {
                              speakerId: 'falk',
                              emotion: 'confident',
                              text: 'Hätte, könnte, müsste – nur hat es KEIN Elektriker bemerkt! Erst als Mr. Higginson persönlich zur Zelle spazierte, wusste plötzlich jemand nach genau zwei Minuten, welches Kabel gezogen werden muss!',
                            },
                          ],
                        },
                        {
                          label: '„Nate war die ganze Zeit mit ihm in der Zelle!“',
                          lines: [
                            {
                              speakerId: 'maya',
                              emotion: 'sweating',
                              text: 'Moment mal – Nate stand beim Schloss-Test direkt neben ihm! Andrew konnte das ja wohl kaum allein heimlich ausprobieren!',
                            },
                            {
                              speakerId: 'falk',
                              emotion: 'smug',
                              text: 'Natürlich brauchte Sterling einen Fachmann an der Hand – nur dass genau dieser „Fachmann“ den Trick verdächtig flüssig beherrschte!',
                            },
                          ],
                        },
                      ]
                    ),
                    buildMultiTryDefense(
                      {
                        speakerId: 'falk',
                        emotion: 'confident',
                        text: 'ZWEITENS: DER BLAUE KRETA-SCHAL!! Wie Sie vorhin selbst triumphierend vor Gericht bewiesen haben, hing in Zelle 08 kein Kellnertuch – sondern exakt Andrew Higginsons eigener Kreta-Seidenschal!! Und welch praktischer Zufall: Ausgerechnet gestern Abend soll er ihm angeblich „gestohlen“ worden sein!!',
                      },
                      [
                        {
                          label: '„Eleonore sagte selbst, Andrew lässt alles liegen!“',
                          lines: [
                            {
                              speakerId: 'nate',
                              emotion: 'thinking',
                              text: 'Seine eigene Frau hat bestätigt, dass Andrew seine Sachen ständig irgendwo im Salon oder an Deck liegen lässt! Jeder Passagier hätte den Schal einfach mitnehmen können!',
                            },
                            {
                              speakerId: 'falk',
                              emotion: 'smug',
                              text: 'Noch bequemer!! Dann hätte er nicht einmal eine Ausrede erfinden müssen, falls seine Frau zu Hause fragt, wo das Geschenk geblieben ist – perfekt, wenn man ein Tuch als Tatwerkzeug zurücklässt!',
                            },
                          ],
                        },
                        {
                          label: '„Andrew schwört, er wurde ihm aus der Jacke geklaut!“',
                          lines: [
                            {
                              speakerId: 'andrew',
                              emotion: 'shocked',
                              shake: true,
                              text: 'Aber das STIMMT DOCH AUCH!! Er war sauber zusammengefaltet in meiner Jackentasche!!',
                            },
                            {
                              speakerId: 'falk',
                              emotion: 'confident',
                              text: 'Natürlich, Mr. Higginson! Jedes Schulkind würde bei einer Tatwaffe wohl zuerst behaupten, sie sei gestern Abend leider gestohlen worden!',
                            },
                          ],
                        },
                        {
                          label: '„Der wahre Mörder hat den Schal als falsche Fährte gelegt!“',
                          lines: [
                            {
                              speakerId: 'nate',
                              emotion: 'confident',
                              text: 'Genau deshalb wäre das doch eine viel zu offensichtliche Spur! Der echte Täter schnappt sich einen fremden Schal, um den Verdacht von sich wegzulenken!',
                            },
                            {
                              speakerId: 'falk',
                              emotion: 'smug',
                              text: 'Ach wirklich?! Unter zwölfhundert Gästen klaut ein Mörder also rein zufällig genau den Schal des EINEN Mannes, der am nächsten Tag wie durch Zauberhand weiß, wie man das MS-400 lautlos knackt?! Glauben Sie Ihren eigenen Märchen eigentlich noch, Sterling?!',
                            },
                          ],
                        },
                      ]
                    ),
                    {
                      speakerId: 'falk',
                      emotion: 'confident',
                      text: 'DRITTENS: IHR ALIBI!! Sagen Sie diesem Gericht jetzt frei heraus, Mr. Higginson – wo genau waren Sie heute Nacht zwischen 02:00 Uhr und 02:20 Uhr, als Arthur Morgan in Zelle 08 starb?!',
                    },
                    {
                      speakerId: 'andrew',
                      emotion: 'shocked',
                      text: 'Äh… in unserer Familienkabine natürlich!! Ich habe tief und fest im Bett geschlafen!! Fragen Sie doch Eleonore!!',
                    },
                    {
                      speakerId: 'eleonore',
                      emotion: 'sweating',
                      text: 'Ich… ich hatte wegen meiner Erkältung doch Ohropax in den Ohren und hab die ganze Nacht wie ein Stein durchgeschlafen…',
                    },
                    {
                      speakerId: 'falk',
                      emotion: 'smug',
                      sfx: 'evidence_chime',
                      shake: true,
                      text: 'SO?! SIE HABEN ALSO TIEF UND FEST GESCHLAFEN?! Dann erklären Sie doch bitte einmal diesen Standbildern hier aus den ÜBERWACHUNGSKAMERAS vom Kabinenkorridor, warum ein gewisser Andrew Higginson um 01:58 Uhr allein in den Flur zum Treppenhaus schleicht – und erst um 02:23 Uhr wieder zurückkehrt!!',
                    },
                    {
                      speakerId: 'andrew',
                      emotion: 'shocked',
                      shake: true,
                      text: 'D-DAS… DAS SIND KAMERA-AUFNAHMEN?! Oh Gott… N-nein, hören Sie mir zu!! Ich hab es verschwiegen, ja – aber ich war NICHT bei irgendeiner Zelle!!',
                    },
                    {
                      speakerId: 'andrew',
                      emotion: 'shocked',
                      text: 'Ich hatte gestern Abend vergessen, unsere Kabinentür richtig abzuschließen! Als ich um kurz vor zwei wach wurde, waren die Betten der Jungs leer!! Ich bin heimlich über die Gänge geschlichen, um meine Kinder zu suchen – weil ich Angst hatte, dass Eleonore mir sonst die ganze restliche Kreuzfahrt lang die Hölle heißmacht, wenn sie merkt, dass ich die Tür vergessen habe!!',
                    },
                    {
                      speakerId: 'eleonore',
                      emotion: 'shocked',
                      text: 'ANDREW!! Du hast die Kabinentür nicht abgeschlossen?!',
                    },
                    buildMultiTryDefense(
                      {
                        speakerId: 'falk',
                        emotion: 'smug',
                        text: 'Welch rührende Familien-Geschichte über vergessene Türschlösser! Nur leider passt diese verdächtige Abwesenheit von 01:58 bis 02:23 Uhr auf die Minute genau zu unserem 15-Minuten-Mordfenster um 02:04 bis 02:19 Uhr!!',
                      },
                      [
                        {
                          label: '„Seine Angst vor Eleonore erklärt das Verheimlichen total!“',
                          lines: [
                            {
                              speakerId: 'nate',
                              emotion: 'sweating',
                              text: 'Wer Andrew heute erlebt hat, weiß sofort, dass er sich wirklich mehr vor Eleonores Standpauke gefürchtet hat als vor dem Staatsanwalt!',
                            },
                            {
                              speakerId: 'falk',
                              emotion: 'smug',
                              text: 'Oder es ist exakt die panische Notlüge eines Mannes, der gerade nicht wusste, dass wir die Überwachungskamera noch vor der Pause ausgelesen haben!',
                            },
                          ],
                        },
                        {
                          label: '„Die Kamera zeigt ihn nur oben im Flur, nie im Zellentrakt!“',
                          lines: [
                            {
                              speakerId: 'nate',
                              emotion: 'confident',
                              text: 'Auf diesem Foto verlässt er lediglich den Kabinengang auf Deck 5! Das beweist nicht im Geringsten, dass er jemals unten bei Zelle 08 oder in der Krankenstation war!',
                            },
                            {
                              speakerId: 'falk',
                              emotion: 'confident',
                              text: 'Und genau vor der Treppe Achtern enden die Passagierkameras – ab dort führen nur die Personal-Stufen hinab zur Krankenstation und zum Zellentrakt! Und von seinen drei Söhnen ist auf dem Video übrigens weit und breit keiner zu sehen!',
                            },
                          ],
                        },
                        {
                          label: '„Ein besorgter Vater sucht nachts eben seine Kinder!“',
                          lines: [
                            {
                              speakerId: 'maya',
                              emotion: 'confident',
                              text: 'Leo, Rick und Conrad waren ja um 02:10 Uhr wirklich wach auf dem Rettungsboot-Deck! Das beweist doch, dass seine Geschichte stimmt!',
                            },
                            {
                              speakerId: 'falk',
                              emotion: 'smug',
                              text: 'Oder er wusste, dass seine Kinder ohnehin herumstreunen, und nutzt genau das jetzt nachträglich als bequeme Ausrede für seinen eigenen nächtlichen Ausflug!',
                            },
                          ],
                        },
                      ]
                    ),
                    {
                      speakerId: 'falk',
                      emotion: 'confident',
                      sfx: 'tension',
                      shake: true,
                      text: 'UND VIERTENS – DAS FINANZIELLE MOTIV AUS FALL 1!! Erinnern Sie sich noch an den weingetränkten Droh- und Zahlungsbrief über 45.000 Euro bis zur Ankunft auf Kreta, den wir gestern im VIP-Salon sicherstellten?!',
                    },
                    {
                      speakerId: 'falk',
                      emotion: 'confident',
                      text: 'Unter dem verschmierten Rotweinfleck las gestern Abend jeder hastig „A. M.“! Doch unsere Spurensicherung hat das Blatt gestern Nacht noch einmal unter Schräglicht gescannt: Der verschmierte letzte Buchstabe ist kein M… DA STEHT „A. H.“ – ANDREW HIGGINSON!!',
                    },
                    {
                      speakerId: 'falk',
                      emotion: 'smug',
                      text: 'Darum frage ich Sie direkt vor diesem gesamten Schiff, Mr. Higginson: Haben Sie zurzeit hohe Schulden oder ernste finanzielle Probleme?!',
                    },
                    {
                      speakerId: 'andrew',
                      emotion: 'shocked',
                      shake: true,
                      text: 'Äh… i-ich… nun ja… w-wir haben drei wachsende Kinder, ein großes Haus abzubezahlen, und dann diese teure Mittelmeer-Kreuzfahrt hier oben drauf… w-wer hat denn bei den Preisen heutzutage bitteschön KEINE Schulden?!',
                    },
                    {
                      speakerId: 'andrew',
                      emotion: 'shocked',
                      text: 'Ja, das Konto ist manchmal knapp – aber das beweist doch noch lange nicht, dass ich irgendjemanden umgebracht habe oder diesen „A. H.“-Brief überhaupt kenne!!',
                    },
                    buildMultiTryDefense(
                      {
                        speakerId: 'falk',
                        emotion: 'confident',
                        text: 'Hohe Schulden eingeräumt, eine Zahlungsfrist über 45.000 Euro auf die Initialen „A. H.“ direkt vor Kreta, spezielles Täterwissen am Zellenschloss, der eigene Schal am Tatort und ein durch die Überwachungskamera widerlegtes Alibi!! Für eine sofortige Festnahme reicht diese Indizienkette zehnmal!!',
                      },
                      [
                        {
                          label: '„Die Initialen ‚A. H.‘ könnten zu dutzenden Gästen passen!“',
                          lines: [
                            {
                              speakerId: 'nate',
                              emotion: 'confident',
                              text: 'An Bord befinden sich über tausend Menschen! Auf wie viele Passagiere oder Crew-Mitglieder mögen wohl die bloßen Anfangsbuchstaben „A. H.“ zutreffen?!',
                            },
                            {
                              speakerId: 'falk',
                              emotion: 'smug',
                              text: 'Wie viele davon hatten gestandene Geldnöte, verlieren exakt zur selben Zeit ihren blauen Seidenschal in Zelle 08, erklären stolz das MS-400-Schloss und schleichen um 02:10 Uhr durch die Gänge, Sterling?!',
                            },
                          ],
                        },
                        {
                          label: '„Normale Familienschulden sind kein Mordmotiv!“',
                          lines: [
                            {
                              speakerId: 'nate',
                              emotion: 'thinking',
                              text: 'Ein Hauskredit und drei Kinder machen noch keinen Mörder! Sie haben keinerlei direkten Beweis, dass zwischen Andrew und Arthur Morgan jemals Geld geflossen ist!',
                            },
                            {
                              speakerId: 'falk',
                              emotion: 'confident',
                              text: 'Was genau hinter diesem 45.000-Euro-Schreiben steckt, wird die genaue Untersuchung in Haft schon zutage fördern! Die Indizienlage genügt vollkommen!',
                            },
                          ],
                        },
                        {
                          label: '„Ohne direkten Beweis vom Tatort dürfen Sie ihn nicht verurteilen!“',
                          lines: [
                            {
                              speakerId: 'nate',
                              emotion: 'confident',
                              text: 'Sie haben weder Fingerabdrücke an der Arznei-Flasche noch Zeugen unten im Zellentrakt! Das reicht im Leben nicht für ein Urteil!',
                            },
                            {
                              speakerId: 'falk',
                              emotion: 'smug',
                              text: 'Ich verlange heute Abend auch kein Endurteil, Herr Kollege – ich beantrage wegen dringenden Tatverdachts sofortige Untersuchungshaft!!',
                            },
                          ],
                        },
                      ]
                    ),
                    {
                      speakerId: 'pendelton',
                      emotion: 'neutral',
                      animation: 'slam',
                      sfx: 'gavel_double',
                      text: 'Ordnung im Saal!! Die Indizienkette der Staatsanwaltschaft – technisches Sonderwissen, persönliches Tatmittel, kamera-belegte Abwesenheit während der Tatzeit sowie ein bestätigtes finanzielles Motiv rund um „A. H.“ – begründet zweifellos einen dringenden Tatverdacht! Sicherheitsleute: Nehmen Sie Mr. Andrew Higginson bis zur Hauptverhandlung in Untersuchungshaft!',
                    },
                    {
                      speakerId: 'eleonore',
                      emotion: 'shocked',
                      shake: true,
                      text: 'ANDREW!! NEIN!! MR. STERLING, BITTE HELFEN SIE IHM – ER WAR ES NICHT!!',
                    },
                    {
                      speakerId: 'cruisemanager',
                      emotion: 'confident',
                      sfx: 'foghorn',
                      triggersOutro: true,
                      text: 'UND WAS FÜR EIN FINALE, MEINE DAMEN UND HERREN!! Die Hafenbehörde hat bestätigt, dass wir unsere Ermittlungen an Bord fortführen – also LEINEN LOS!! Die MS Aurora legt noch heute Nacht von Kreta ab, und unser großes Gerichts-LARP geht auf hoher See in die nächste Runde!!',
                    },
                  ],
                  wrongLines: [
                    {
                      speakerId: 'falk',
                      emotion: 'facepalm',
                      animation: 'facepalm',
                      sfx: 'facepalm',
                      text: 'Was soll das beweisen?! Zeigen Sie uns den technischen Befund zum Magnetschloss oder den 15-Minuten-Spannungseinbruch, Sterling!',
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
          text: 'Damit widerlegen Sie keine ärztliche Aussage über fehlende Kampfspuren, Sterling!',
        },
      ],
    },
    testimony_c2_brandt_kurz: {
      id: 'testimony_c2_brandt_kurz',
      title: 'Kurz-Aussage: Officer Lukas Brandt',
      witnessId: 'brandt',
      introLines: [
        {
          speakerId: 'brandt',
          emotion: 'neutral',
          text: 'Euer Ehren, Herr Kommissar – ich weiß zwar nicht, warum wir wegen einer simplen Nachtwache noch eine Sitzung einberufen, aber meine Aussage ist kurz und eindeutig.',
        },
        {
          speakerId: 'falk',
          emotion: 'smug',
          text: 'Machen wir es tatsächlich zügig, Euer Ehren. Officer Brandt hat ein makelloses Wachbuch vorgelegt – ich hoffe, die Verteidigung verschwendet nicht wieder die kostbare Zeit des Seegerichts.',
        },
        {
          speakerId: 'nate',
          emotion: 'thinking',
          text: '(Falk will das Ganze natürlich wieder blitzschnell abhaken… Konzentrieren wir uns genau auf jede Zeile von Brandts Aussage!)',
        },
      ],
      statements: [
        {
          id: 'c2_kb_s1',
          text: 'Ich versah heute Nacht planmäßig die Wache im Arresttrakt bis um 06:00 Uhr morgens.',
          pressLines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              shout: 'MOMENT MAL!',
              text: 'Waren Sie während dieser gesamten Nachtschicht durchgehend unten auf Ihrem Posten vor Arrestzelle 08?',
            },
            {
              speakerId: 'brandt',
              emotion: 'neutral',
              text: 'Selbstverständlich, Mr. Sterling. Eine Wache vor einer besetzten Arrestzelle verlässt man nicht ohne Ablösung.',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: '(Hmm… also müsste er doch erst recht alles mitbekommen haben, was dort unten passiert ist!)',
            },
          ],
        },
        {
          id: 'c2_kb_s2',
          text: 'Die ganze Nacht über blieb es vor Zelle 08 vollkommen ruhig – es gab keinerlei Geräusche oder Zwischenfälle!',
          pressLines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              shout: 'MOMENT MAL!',
              text: 'Vollkommen ruhig? Nicht einmal ein ungewohntes Geräusch, ein Poltern oder ein Fall aus dem Zellentrakt?!',
            },
            {
              speakerId: 'brandt',
              emotion: 'neutral',
              text: 'Ich bleibe bei meinem Protokoll: Kein Lärm, kein Zwischenfall. Wenn Ihnen etwas anderes zu Ohren gekommen ist, müssten Sie das schon belegen.',
            },
          ],
          contradiction: {
            requiredEvidenceId: 'beweis_brandt_luegt',
            alternativeEvidenceIds: ['lueftung_streich', 'brandt_wachbuch'],
            successLines: [
              {
                speakerId: 'nate',
                emotion: 'confident',
                shout: 'EINSPRUCH!',
                shake: true,
                text: 'BRANDT LÜGT, Euer Ehren! Von einer „vollkommen ruhigen Schicht bis 06:00 Uhr“ kann überhaupt keine Rede sein!',
              },
              {
                speakerId: 'nate',
                emotion: 'confident',
                text: 'Zwei Passagiere haben um exakt 02:10 Uhr nachts durch den Lüftungsschacht ein lautes Krachen direkt aus Zelle 08 gehört – genau zu der Zeit, als Sie angeblich direkt davor Wache schoben!',
              },
              {
                speakerId: 'brandt',
                emotion: 'sweating',
                shake: true,
                text: 'Tch… na schön!! Wenn die Passagiere es schon so genau wissen wollen: Ja, irgendwann mitten in der Nacht gab es ein dumpfes Geräusch – ich habe es eben nicht ins Wachbuch eingetragen, weil es mir nach außen hin ruhig erschien!',
              },
              {
                speakerId: 'falk',
                emotion: 'facepalm',
                animation: 'facepalm',
                sfx: 'facepalm',
                text: 'Sie haben ein nächtliches Geräusch in einer besetzten Arrestzelle einfach aus dem offiziellen Wachbuch WEGGELASSEN?!',
              },
              {
                speakerId: 'pendelton',
                emotion: 'neutral',
                sfx: 'gavel',
                text: 'Eine höchst bedenkliche Lücke im Wachprotokoll, Officer Brandt! Wenn schon um 02:10 Uhr etwas in Zelle 08 geschehen ist, dann hören wir als Nächstes Dr. Helena Vance zur zeitlichen Einordnung!',
                startsTestimonyId: 'testimony_c2_vance_kurz',
              },
            ],
          },
        },
        {
          id: 'c2_kb_s3',
          text: 'Erst beim Kontrollgang am Morgen fand ich den Gefangenen tot auf.',
          pressLines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              shout: 'MOMENT MAL!',
              text: 'Sie haben ihn also erst unmittelbar vor Ihrem Schichtende gegen 06:00 Uhr entdeckt – obwohl es stundenlang zuvor still gewesen sein soll?',
            },
            {
              speakerId: 'brandt',
              emotion: 'neutral',
              text: 'So steht es in meinem Bericht, Mr. Sterling. Bei Schichtwechsel habe ich pflichtgemäß hineingesehen und sofort Alarm geschlagen.',
            },
          ],
        },
      ],
      wrongObjectionLines: [
        {
          speakerId: 'falk',
          emotion: 'facepalm',
          animation: 'facepalm',
          sfx: 'facepalm',
          text: 'Wenn Sie Officer Brandts Aussage angreifen, legen Sie das passende Protokoll oder den Zeugenbeweis zu seiner Nachtwache vor!',
        },
      ],
    },
    testimony_c2_vance_kurz: {
      id: 'testimony_c2_vance_kurz',
      title: 'Kurz-Aussage: Dr. Helena Vance',
      witnessId: 'vance',
      introLines: [
        {
          speakerId: 'vance',
          emotion: 'neutral',
          text: 'Euer Ehren, Herr Kommissar – ich habe heute Morgen eine rein medizinische Einschätzung nach den mir vorliegenden Werten abgegeben.',
        },
        {
          speakerId: 'falk',
          emotion: 'neutral',
          text: 'Dann erläutern Sie dem Gericht kurz Ihre Messung, Frau Doktor, damit diese Diskussion um Uhrzeiten endlich ein Ende findet.',
        },
      ],
      statements: [
        {
          id: 'c2_kv_s1',
          text: 'Ich habe den Leichnam heute früh um 08:15 Uhr in Arrestzelle 08 untersucht.',
          pressLines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              shout: 'MOMENT MAL!',
              text: 'Und wie wirkten die Umgebungsbedingungen dort unten auf Sie, Frau Doktor? Ist Ihnen gar nichts Ungewöhnliches aufgefallen?',
            },
            {
              speakerId: 'vance',
              emotion: 'neutral',
              text: 'Ich habe mich auf meine medizinische Untersuchung konzentriert, Mr. Sterling, nicht auf die Haustechnik der Zellen.',
            },
          ],
        },
        {
          id: 'c2_kv_s2',
          text: 'Nach meiner Messung bestand kein Anlass zur Abweichung – der Tod trat eindeutig erst gegen 07:30 Uhr ein!',
          pressLines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              shout: 'MOMENT MAL!',
              text: 'Eindeutig erst um 07:30 Uhr?! Sind Sie wirklich sicher, dass Ihre Standard-Tabelle für 21 °C in dieser Zelle über die ganze Nacht hinweg gegolten hat?',
            },
            {
              speakerId: 'vance',
              emotion: 'sweating',
              text: 'Ohne gegenteilige technische Messdaten aus dem Zellentrakt lege ich selbstverständlich die übliche Schiffs-Normtemperatur zugrunde!',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: '(Genau das Stichwort, Nate! Wir haben die Messdaten aus Zelle 08 direkt in der Akte!)',
            },
          ],
          contradiction: {
            requiredEvidenceId: 'zellen_klima_protokoll',
            alternativeEvidenceIds: ['notiz_todeszeit_0210'],
            successLines: [
              {
                speakerId: 'nate',
                emotion: 'confident',
                shout: 'EINSPRUCH!',
                shake: true,
                text: 'Hier liegt der technische Beweis direkt vom Zellensensor vor, Euer Ehren! Ihre 21-Grad-Tabelle war in dieser Zelle völlig wertlos!',
              },
              {
                speakerId: 'nate',
                emotion: 'confident',
                text: 'Punkt 03:00 Uhr nachts wurde die Zellentemperatur manuell massiv heruntergedreht – und in einer eiskalten Zelle kühlt ein Körper natürlich viel langsamer oder täuscht jede Standardformel!',
              },
              {
                speakerId: 'vance',
                emotion: 'shocked',
                shake: true,
                text: 'Was…?! Wenn die Kühlung nachts tatsächlich so weit heruntergedreht war, dann stimmen meine Standard-Werte natürlich nicht – dann kann der Tod durchaus schon viel früher eingetreten sein, und mein Bericht stimmt so nicht!',
              },
              {
                speakerId: 'falk',
                emotion: 'shocked',
                text: 'Wie bitte?! Ihr eigener offizieller Todeszeitpunkt stimmt um mehrere Stunden nicht, Frau Doktor?!',
              },
              {
                speakerId: 'pendelton',
                emotion: 'shocked',
                sfx: 'gavel',
                text: 'Wenn der Todeszeitpunkt demnach viel früher in der Nacht lag – dann klären wir jetzt sofort, welche Position die MS Aurora in jener Nacht hatte! Rufen Sie Kapitän Brammer in den Zeugenstand!',
                startsTestimonyId: 'testimony_c2_captain_kurz',
              },
            ],
          },
        },
        {
          id: 'c2_kv_s3',
          text: 'Mein Bericht sollte einfach heute Vormittag bei den Behörden vorliegen.',
          pressLines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              shout: 'MOMENT MAL!',
              text: 'Und wieso musste es ausgerechnet heute Vormittag so eilig gehen, während noch nicht einmal alle Umstände aus der Zelle geprüft waren?',
            },
            {
              speakerId: 'vance',
              emotion: 'neutral',
              text: 'Bei einem Todesfall vor dem Einlaufen erwartet der Hafen zügig Klarheit. Mehr lag nicht in meiner Hand.',
            },
          ],
        },
      ],
      wrongObjectionLines: [
        {
          speakerId: 'falk',
          emotion: 'facepalm',
          animation: 'facepalm',
          sfx: 'facepalm',
          text: 'Belegen Sie Ihre Behauptung zur Kühlung oder zum echten Todeszeitpunkt direkt mit der Akte, Sterling!',
        },
      ],
    },
    testimony_c2_captain_kurz: {
      id: 'testimony_c2_captain_kurz',
      title: 'Kurz-Aussage: Kapitän Brammer',
      witnessId: 'captain',
      introLines: [
        {
          speakerId: 'captain',
          emotion: 'neutral',
          text: 'Sparen wir uns große Reden, Herr Vorsitzender. Ich trage die Verantwortung für dieses Schiff – stellen Sie Ihre Fragen.',
        },
        {
          speakerId: 'pendelton',
          emotion: 'neutral',
          text: 'Dann schildern Sie dem Tribunal knapp, warum Sie gegenüber Mr. Sterling eben auf der Brücke erklärten, ein früherer Todeszeitpunkt ändere nichts!',
        },
      ],
      statements: [
        {
          id: 'c2_kc_s1',
          text: 'Ich hatte heute Morgen einzig den Auftrag, die MS Aurora pünktlich in Heraklion festzumachen.',
          pressLines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              shout: 'MOMENT MAL!',
              text: 'Und um pünktlich im Hafen festzumachen, war Ihnen wirklich jedes Mittel und jede verdrehte Uhrzeit recht?!',
            },
            {
              speakerId: 'captain',
              emotion: 'neutral',
              text: 'Ein Kapitän hat tausend Urlauber und eine Reederei im Nacken, Herr Sterling. Da zählt am Ende, ob das Schiff im Hafen liegt oder nicht.',
            },
          ],
        },
        {
          id: 'c2_kc_s2',
          text: 'Wo sich mein Schiff um 02:10 Uhr nachts befand, hat mit diesem Todesfall und dem Hafen von Kreta nicht das Geringste zu tun!',
          pressLines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              shout: 'MOMENT MAL!',
              text: 'Nicht das Geringste?! Dann nennen Sie dem Tribunal doch gleich exakt, wie viele Seemeilen wir um 02:10 Uhr von Kreta entfernt waren, Kapitän!',
            },
            {
              speakerId: 'captain',
              emotion: 'neutral',
              text: 'Pah… ich trage nicht jede nächtliche Meile im Kopf herum. Wenn Sie Zahlen wollen, dann legen Sie hier etwas Handfestes vor!',
            },
          ],
          contradiction: {
            requiredEvidenceId: 'bruecken_log',
            alternativeEvidenceIds: ['notiz_todeszeit_0210'],
            successLines: [
              {
                speakerId: 'nate',
                emotion: 'confident',
                shout: 'EINSPRUCH!',
                shake: true,
                text: 'DA LIEGT DIE WAHRHEIT, KAPITÄN BRAMMER!! Es hat ALLES mit dem Hafen von Kreta zu tun!!',
              },
              {
                speakerId: 'nate',
                emotion: 'confident',
                text: 'Um 02:10 Uhr lag die MS Aurora laut Ihrem eigenen Brücken-Log noch 42 Seemeilen vor Kreta – weit außerhalb der griechischen 12-Meilen-Grenze, mitten in INTERNATIONALEN GEWÄSSERN!',
              },
              {
                speakerId: 'captain',
                emotion: 'neutral',
                sfx: 'gavel',
                text: '… Genug. Sie haben recht, Herr Sterling. Ich streite es nicht länger ab.',
              },
              {
                speakerId: 'captain',
                emotion: 'neutral',
                text: 'Ja – ich gebe es vor diesem Tribunal offen zu: Ich habe Dr. Vance und Officer Brandt heute Morgen angestiftet, den wahren Todeszeitpunkt nach vorn in die Morgenstunden zu schieben, um den echten Todesort auf hoher See zu verschleiern.',
              },
              {
                speakerId: 'captain',
                emotion: 'neutral',
                text: 'Bei einem ungeklärten Todesfall vor der 12-Meilen-Grenze hätte uns das Hafenamt von Heraklion die Einfahrt verweigert. Wir wären tagelang vor Kreta blockiert gewesen und die ganze Kreuzfahrt wäre für alle Passagiere verdorben gewesen.',
              },
              {
                speakerId: 'captain',
                emotion: 'neutral',
                text: 'Ich entschuldige mich aufrichtig bei Ihnen allen – ich wollte unseren Gästen diesen Urlaub auf Kreta einfach nicht kaputtmachen.',
              },
              {
                speakerId: 'falk',
                emotion: 'facepalm',
                animation: 'facepalm',
                sfx: 'facepalm',
                shake: true,
                text: 'UNVERZEIHLICH, Kapitän!! Mich als Staatsanwalt und dieses gesamte Gericht dermaßen zu veralbern!! Die Reederei wird noch heute von mir hören!',
              },
              {
                speakerId: 'falk',
                emotion: 'smug',
                text: 'Aber bei allem Ärger über Uhrzeiten und Seekarten bleibt am Ende doch nur eine einzige entscheidende Frage, Sterling:',
              },
              {
                speakerId: 'falk',
                emotion: 'smug',
                text: 'Spricht denn IRGENDETWAS Handfestes gegen einen ganz gewöhnlichen Selbstmord in einer von außen verschlossenen Zelle?!',
              },
              {
                speakerId: 'nate',
                emotion: 'thinking',
                text: '(Verdammt… Falk hat recht, juristisch stehe ich gerade in einer Sackgasse – aber irgendetwas an dieser Zelle stört mich trotzdem! Kann ich überhaupt noch irgendetwas einwenden?)',
                choices: [
                  {
                    label: '„Das seltsame blaue ‚Seidentuch‘ am Zellengitter!“',
                    nextLines: [
                      {
                        speakerId: 'falk',
                        emotion: 'smug',
                        text: 'Ha! Ein feines Kellnertuch eines ehemaligen Oberkellners! Das taugt vielleicht für die Erste Klasse, aber niemals als Beweis gegen Selbstmord!',
                      },
                    ],
                  },
                  {
                    label: '„Der umgekippte Metallhocker klang nach einem Kampf!“',
                    nextLines: [
                      {
                        speakerId: 'falk',
                        emotion: 'smug',
                        text: 'Oder schlicht danach, dass ein Verzweifelter den Hocker selbst weggestoßen hat! Reine Spekulation ohne den geringsten Beweis!',
                      },
                    ],
                  },
                  {
                    label: '„Das elektronische Schloss war gar nicht aufgebrochen!“',
                    nextLines: [
                      {
                        speakerId: 'falk',
                        emotion: 'smug',
                        text: 'Gratulation, Sterling – genau DAS spricht bei einer von außen verschlossenen Zelle ja ERST RECHT für Selbstmord!',
                      },
                    ],
                  },
                ],
              },
              {
                speakerId: 'nate',
                emotion: 'sweating',
                text: '(Mist… so sehr ich es auch drehe und wende: Im Moment habe ich keinen einzigen stichhaltigen Beweis, der einen Selbstmord widerlegt…)',
              },
              {
                speakerId: 'maya',
                emotion: 'sweating',
                text: '(Schade… Immerhin haben wir das Versteckspiel von Brandt, Dr. Vance und dem Kapitän aufgedeckt – und vielleicht dürfen die Passagiere jetzt endlich an Land!)',
              },
              {
                speakerId: 'pendelton',
                emotion: 'neutral',
                animation: 'slam',
                sfx: 'gavel_double',
                text: 'Da kein Beweis für ein Fremdverschulden vorliegt, wird das Not-Verfahren hiermit beendet! Der Fall wird als Suizid in internationalen Gewässern geschlossen; das Verhalten des Kapitäns wird disziplinarisch vermerkt.',
              },
              {
                speakerId: 'dimitri',
                emotion: 'confident',
                setsFlag: 'flag_c2_dimitri_weg',
                triggersOutro: true,
                text: 'Καταλαβαίνω, κύριε πρόεδρε… Διεθνή ύδατα, λοιπόν. Θα κανονίσουμε αμέσως τη μεταφορά της σορού στην ξηρά για την κηδεία – καλές διακοπές σε όλους!',
              },
            ],
          },
        },
        {
          id: 'c2_kc_s3',
          text: 'Alles Weitere war reine Schiffsroutine.',
          pressLines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              shout: 'MOMENT MAL!',
              text: 'Reine Schiffsroutine – galt das etwa auch für Ihre nächtlichen Kursdaten und die verschwiegene 12-Meilen-Grenze, Kapitän?',
            },
            {
              speakerId: 'captain',
              emotion: 'neutral',
              text: 'Jeder Seemann führt ein Logbuch, Herr Sterling. Schauen Sie es sich an, wenn Sie an meiner Aussage zweifeln.',
            },
          ],
        },
      ],
      wrongObjectionLines: [
        {
          speakerId: 'falk',
          emotion: 'facepalm',
          animation: 'facepalm',
          sfx: 'facepalm',
          text: 'Zeigen Sie die genaue Schiffsposition aus dem Brücken-Logbuch, Sterling – nicht irgendetwas!',
        },
      ],
    },
    testimony_c2_vance: {
      id: 'testimony_c2_vance',
      title: 'Aussage: Dr. Helena Vance (Todeszeitpunkt & Hafeneinlauf)',
      witnessId: 'vance',
      introLines: [
        {
          speakerId: 'vance',
          emotion: 'neutral',
          text: 'Euer Ehren, Herr Kommissar – ich wiederhole meine offizielle Feststellung vom Vormittag, damit die Akte ohne weitere Verzögerung an Heraklion gehen kann.',
        },
      ],
      statements: [
        {
          id: 'c2_vance_s1',
          text: 'Um 08:15 Uhr nahm ich direkt in Arrestzelle 08 die medizinische Messung auf.',
          pressLines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              shout: 'MOMENT MAL!',
              text: 'Haben Sie vor oder während Ihrer Messung mit Kapitän Brammer gesprochen, bevor Sie Ihren Bericht schrieben?',
            },
            {
              speakerId: 'vance',
              emotion: 'sweating',
              text: 'Nun… der Kapitän erkundigte sich natürlich sofort über Funk, wann genau der Vorfall wohl geschehen sei. Das ist reine Schiffsroutine!',
            },
          ],
        },
        {
          id: 'c2_vance_s2',
          text: 'Auf meinem Bogen habe ich ganz normal die übliche Kabinentemperatur von 21 °C zugrunde gelegt.',
          pressLines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              shout: 'MOMENT MAL!',
              text: 'Obwohl man sich unten in Zelle 08 fast den Atem gefroren hat?! Haben Sie die Kälte dort unten einfach absichtlich ignoriert?!',
            },
            {
              speakerId: 'vance',
              emotion: 'sweating',
              text: 'Ich… musste mich beeilen! Niemand wollte ein stundenlanges technisches Gutachten, wir lagen schließlich kurz vor dem Pier!',
            },
          ],
        },
        {
          id: 'c2_vance_s3',
          text: 'Ob die Uhrzeit nun etwas früher oder später lag, spielt rechtlich ohnehin keine Rolle – der Vorfall wird genauso behandelt.',
          pressLines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              shout: 'MOMENT MAL!',
              text: 'Ach ja?! Für die MS Aurora und Kapitän Brammer machte genau diese Uhrzeit den Unterschied zwischen Hafeneinfahrt und tagelanger Sperre auf offener See!',
            },
            {
              speakerId: 'falk',
              emotion: 'smug',
              text: 'Wilde Unterstellungen, Sterling! Beweisen Sie erst einmal, dass Dr. Vances 07:30-Uhr-Zeitpunkt überhaupt falsch war!',
            },
          ],
        },
        {
          id: 'c2_vance_s4',
          text: 'Der Tod trat eindeutig gegen 07:30 Uhr morgens ein – und an diesem Ergebnis gibt es nichts zu rütteln!',
          pressLines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              shout: 'MOMENT MAL!',
              text: '07:30 Uhr ist komplett erfunden, Frau Doktor! Zeigen wir dem Tribunal die echten Zahlen aus Zelle 08!',
            },
            {
              speakerId: 'falk',
              emotion: 'smug',
              text: 'Dann reden Sie nicht nur, Sterling – legen Sie die Beweise genau hier vor!',
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
                text: 'HIER IST DIE WAHRHEIT, Euer Ehren! Um exakt 03:00 Uhr wurde die Temperatur in Zelle 08 massiv auf eisige 9 °C heruntergedreht – und um 02:10 Uhr hörten zwei Zeugen durch den Lüftungsschacht den Metallhocker krachen! Arthur starb schon um 02:15 Uhr, NICHT um 07:30 Uhr!',
              },
              {
                speakerId: 'dimitri',
                emotion: 'shocked',
                text: 'Τι?! Αλλαγή θερμοκρασίας στις 03:00 και θόρυβος στις 02:10?! Κυρία γιατρέ, αυτό ανατρέπει όλη την ώρα θανάτου!!',
              },
              {
                speakerId: 'vance',
                emotion: 'shocked',
                shake: true,
                text: 'Genug!! Ich… ich halte das nicht mehr aus!! Ja!! Ich habe schon um 08:15 Uhr gemerkt, dass der Raum viel zu kalt war und meine 21-Grad-Zahl nicht stimmen kann – aber KAPITÄN BRAMMER hat mir heute früh persönlich befohlen, mindestens 07:30 Uhr in den Bericht zu schreiben!!',
              },
              {
                speakerId: 'pendelton',
                emotion: 'shocked',
                animation: 'slam',
                sfx: 'gavel_double',
                text: 'WAS?! Kapitän Brammer hat der Schiffsärztin eine falsche Todeszeit befohlen?!',
              },
              {
                speakerId: 'falk',
                emotion: 'facepalm',
                animation: 'facepalm',
                sfx: 'facepalm',
                text: 'Gah!! Was soll dieser Irrsinn, Käpt’n?! Und selbst wenn Sie um 02:15 Uhr herum herumgetrickst haben – zeigen Sie dem Tribunal endlich den konkreten Beweis, Sterling, WO das Schiff um 02:15 Uhr war und warum Brammer überhaupt diese Stunden verschleppen wollte!!',
                requiresFinalEvidencePrompt: {
                  question:
                    'Zeige Staatsanwalt von Falk, Judge Pendelton und Kommissar Dimitri den Beweis für die Position um 02:15 Uhr und Kapitän Brammers Motiv!',
                  correctEvidenceId: 'bruecken_log',
                  successLines: [
                    {
                      speakerId: 'nate',
                      emotion: 'confident',
                      shout: 'VOLLTREFFER!',
                      shake: true,
                      text: 'Hier ist Ihr Beweis, Staatsanwalt von Falk! Laut Kapitän Brammers Brücken-Log passierte die MS Aurora die griechische 12-Meilen-Grenze erst um 05:45 Uhr! Um 02:15 Uhr trieben wir noch 42 Seemeilen vor Kreta – mitten in INTERNATIONALEN GEWÄSSERN!',
                    },
                    {
                      speakerId: 'captain',
                      emotion: 'neutral',
                      text: '… Verdammt. Ja, ich hab Dr. Vance befohlen, den Zeitpunkt nach dem Einlaufen anzusetzen! Nach Hafenordnung § 14 hätte uns Heraklion bei einem ungeklärten Todesfall auf hoher See überhaupt nicht anlegen lassen! Die Reederei hätte mir den Kopf abgerissen, wenn wir Tage auf Außenreede blockiert geblieben wären!',
                    },
                    {
                      speakerId: 'pendelton',
                      emotion: 'headshake',
                      animation: 'headshake',
                      sfx: 'gavel',
                      text: 'Eine grobe Pflichtverletzung, Kapitän! Das wird ein eigenes Disziplinar-Nachspiel haben!',
                    },
                    {
                      speakerId: 'dimitri',
                      emotion: 'confident',
                      sfx: 'gavel_double',
                      text: 'Απίστευτο!! Στις 02:15 στα 42 ναυτικά μίλια – καθαρά διεθνή ύδατα!! Κύριε Στέρλινγκ, είστε ιδιοφυΐα! Αυτό σημαίνει ότι η Ελληνική Ακτοφυλακή δεν έχει καμία απολύτως αρμοδιότητα! Εγώ φεύγω για έναν καλό φρέντο εσπρέσο στο λιμάνι – γεια σας!!',
                    },
                    {
                      speakerId: 'maya',
                      emotion: 'sweating',
                      text: 'Äh… Kapitän Brammer? Warum klappt Kommissar Dimitri plötzlich fröhlich seine Akte zu und marschiert gemütlich Richtung Gangway?!',
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
                      text: 'WAS?! Sie lassen uns jetzt einfach sitzen, Kommissar?! Dann bleibt der gesamte Fall wieder beim Bord-Tribunal – und die Gangway für Passagiere bleibt bis auf Weiteres komplett verrammelt!',
                    },
                    {
                      speakerId: 'andrew',
                      emotion: 'grumpy',
                      shake: true,
                      text: 'DAS DARF DOCH WOHL NICHT WAHR SEIN!! Der griechische Kommissar geht gerade in aller Seelenruhe an Land Kaffee trinken – und wir Passagiere stecken hier weiterhin fest?! Auf dem Promenadendeck toben bereits alle Gäste!!',
                    },
                    {
                      speakerId: 'maya',
                      emotion: 'thinking',
                      text: 'Au weia, die Stimmung draußen kippt komplett, Nate… Immerhin haben wir gestoppt, dass der Fall einfach heimlich unter den Teppich gekehrt wird.',
                    },
                    {
                      speakerId: 'nate',
                      emotion: 'thinking',
                      sfx: 'tension',
                      text: 'Stimmt – wir wissen jetzt, warum Kapitän Brammer und Dr. Vance die Uhrzeit verschleppt haben. Aber eines ist immer noch völlig offen: War Arthurs Tod um 02:15 Uhr nun tatsächlich ein Selbstmord… oder hat jemand in Zelle 08 nachgeholfen? Genau das müssen wir als Nächstes herausfinden!',
                      completesChapter: {
                        completedChapterTitle: 'Akt 2.2 abgeschlossen',
                        completedTimeLabel: 'Tag 4 · Mittag beendet',
                        summary:
                          'Du hast aufgedeckt, dass Kapitän Brammer Dr. Vance befahl, die Todeszeit auf 07:30 Uhr zu verschieben, damit das Schiff in den Hafen einlaufen durfte. In Wahrheit starb Arthur um 02:15 Uhr in internationalen Gewässern – Dimitri geht entspannt von Bord, alle Passagiere sind außer sich vor Wut über die gesperrte Gangway, und ob es Suizid war oder nicht, bleibt völlig offen!',
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
                            text: 'Na toll – Dimitri sitzt schon gemütlich im Hafencafé, draußen schimpfen alle Passagiere wegen der Ausgangssperre, und ob es wirklich Selbstmord war, wissen wir immer noch nicht… Moment, warum winkt uns Familie Higginson da vorn so hektisch zu?!',
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
                      text: 'Was soll das über unsere Position um 02:15 Uhr beweisen?! Schauen Sie auf die Schiffsroute des Kapitäns, Sterling!',
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
          text: 'Widerlegen Sie gefälligst die 07:30-Uhr-Tatzeit direkt mit harten technischen oder nächtlichen Fakten, Sterling!',
        },
        {
          speakerId: 'pendelton',
          emotion: 'headshake',
          animation: 'headshake',
          sfx: 'headshake',
          text: 'Dieser Einwand überzeugt das Tribunal an dieser Stelle noch nicht, Mr. Sterling.',
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
                      text: 'DAS HIER IST DIE ANDERE HÄLFTE!! Die Bruchkante aus Conrads Rucksack passt millimetergenau auf Ihre Karte SEC-04!! Deshalb haben Sie dem kleinen Jungen seinen Rucksack gestohlen – und deshalb verstellten Sie um 03:00 Uhr die Zellentemperatur!',
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
