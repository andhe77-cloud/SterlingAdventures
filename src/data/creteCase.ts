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
          emotion: 'thinking',
          text: 'Warte mal, Nate… egal, wen wir auf den oberen Decks gefragt haben – überall heißt es nur noch, alle Offiziere seien Hals über Kopf nach ganz unten gelaufen.',
        },
        {
          speakerId: 'nate',
          emotion: 'thinking',
          text: 'Und auf dem Sicherheits-Terminal hat genau ein Bereich geblinkt: das Unterdeck. Irgendwo dort unten liegt also der Grund, warum wir nicht von Bord dürfen.',
        },
        {
          speakerId: 'maya',
          emotion: 'confident',
          text: 'Wenn sonst niemand oben mehr durchgelassen wird, bleibt eigentlich nur noch ein Weg: Wir gehen direkt hinunter ins Unterdeck zur Arrestzelle und sehen selbst nach, was Marston dort vor uns versteckt!',
        },
      ],
    },
  ],
  autoChapterTransitions: [
    {
      id: 'c2_a2_to_court',
      chapterId: 'c2_akt2_mittag',
      requiredFlags: ['flag_c2_tatzeit_geloest', 'flag_c2_a2_bruecke_geloest'],
      toast: 'Wahre Tatzeit & Seekarte abgeglichen! Auf zur Anhörung im Ballsaal!',
      lines: [
        {
          speakerId: 'maya',
          emotion: 'confident',
          text: 'Alles greift ineinander, Nate! Die eisige Abkühlung ab 03:00 Uhr hat Dr. Vances Schätzung komplett verzerrt – der Vorfall geschah schon viel früher, gegen 02:15 Uhr!',
        },
        {
          speakerId: 'nate',
          emotion: 'confident',
          text: 'Jetzt wissen wir auch, warum hier jemand die Uhrzeit unbedingt auf 07:30 Uhr biegen wollte: wegen des Hafeneinlaufs! Ab in den Großen Ballsaal zu Kommissar Dimitri, Dr. Vance – und Kapitän Brammer!',
          completesChapter: {
            completedChapterTitle: 'Akt 2.2 · Ermittlung abgeschlossen',
            completedTimeLabel: 'Genaue Tatzeit & Motiv ermittelt',
            summary:
              'Durch Eleonores Barnaby-Einfall, die Kühlrohr-Diagnose (Temperaturänderung um 03:00 Uhr), Leo & Ricks 02:10-Uhr-Streich und die Hafenordnung § 14 samt Seekarte hast du alle Fakten gegen das verschleppte 07:30-Uhr-Protokoll zusammen.',
            nextChapterId: 'c2_akt2_mittag',
            nextLocationId: 'courtroom',
            nextPhase: 'court',
            nextTimeOfDay: 'tag',
            unlocksLocations: ['courtroom'],
            nextButtonLabel: 'Weiter zur Anhörung (Dr. Vance & Kapitän Brammer)',
            nextIntroLines: [
              {
                speakerId: 'pendelton',
                emotion: 'neutral',
                animation: 'slam',
                sfx: 'gavel_double',
                text: 'Ruhe im Großen Ballsaal! Kommissar Dimitri hat um eine außerordentliche Mittagsanhörung gebeten, bevor die griechische Hafenpolizei den Vorfall übernimmt.',
              },
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
                text: 'Mit Vergnügen, Käpt’n! Dr. Helena Vance wird gleich bestätigen, dass wir beim Tod längst im Hafen lagen – und dass Ihre Uhrzeit-Spielereien vollkommen gegenstandslos sind, Sterling!',
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
      bio: 'Grün-weiß gestreiftes Shirt, wacher Blick und macht bei jedem noch so verrückten Streich auf dem Schiff sofort begeistert mit.',
      accentColor: '#a855f7',
      portraitUrl: '/src/assets/images/sprite_leo_higginson_1795164437738.jpg',
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
        'Technischer Sensor-Ausdruck der Arrestzelle: Um exakt 03:00 Uhr nachts hat jemand manuell über das Regel-Ventil eingegriffen und den Raum auf eisige 9 °C abgekühlt – wodurch Dr. Vances 21-°C-Standardtabelle um Stunden verfälscht wird!',
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
        'Jemand hat die Zellentemperatur um 03:00 Uhr manuell stark nach unten verändert – aber ändert das etwas an Dr. Vances 21-°C-Berechnung?',
      kind: 'observation',
    },
    thought_c2_klima_verdacht: {
      id: 'thought_c2_klima_verdacht',
      title: 'Eleonores Krimi-Einfall: Raumtemperatur!',
      detail:
        'Nach Eleonores Barnaby- und Gerichtsspiel-Anekdote: Bei manipulativ heruntergekühltem Raum statt normaler 21 °C versagt jede Standard-Todeszeit-Tabelle um mehrere Stunden!',
      kind: 'observation',
    },
    thought_c2_wahre_tatzeit: {
      id: 'thought_c2_wahre_tatzeit',
      title: 'Todeszeit ~02:15 Uhr (Warum verschwiegen?)',
      detail:
        'Arthur starb schon gegen 02:15 Uhr statt 07:30 Uhr – doch die Schiffsleitung behauptet, die Uhrzeit spiele keine Rolle!',
      kind: 'deduction',
    },
    thought_c2_hafen_regel: {
      id: 'thought_c2_hafen_regel',
      title: 'Hafenordnung § 14: Einlaufstopp!',
      detail:
        'Ein ungeklärter Todesfall auf hoher See hätte die MS Aurora vor dem Hafen blockiert! Genau deshalb musste 07:30 Uhr im Bericht stehen!',
      kind: 'observation',
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
          text: 'Laut Brandts Wachprotokoll hat er den Gefangenen bereits am Ende seiner Schicht um 06:00 Uhr tot in Zelle 08 gefunden – aber im offiziellen Bericht der Schiffsärztin steht Todeszeitpunkt 07:30 Uhr?! Niemand stirbt anderthalb Stunden, NACHDEM er tot aufgefunden wurde!! Was ist heute Nacht also wirklich geschehen?!',
        },
      ],
    },
    {
      id: 'c2_logic_brandt_luege',
      thoughtA: 'thought_c2_zeit_unmoeglich',
      thoughtB: 'thought_c2_0210_poltern',
      resultThoughtId: 'thought_c2_brandt_luegt',
      setsFlag: 'flag_c2_a2_brandt_widerspruch_geloest',
      feedbackLines: [
        {
          speakerId: 'nate',
          emotion: 'confident',
          shout: 'VOLLTREFFER!',
          shake: true,
          text: 'HAB ICH IHN!! Um 02:10 Uhr nachts hat es in Zelle 08 laut gekracht – mitten in Brandts Schicht! Trotzdem behauptet er, nachts sei alles ruhig gewesen, während 06:00 Uhr und 07:30 Uhr vorn und hinten nicht zusammenpassen! Brandt LÜGT!! Zurück in die Arrestzelle zu Kommissar Dimitri – machen wir ihm diesen Widerspruch mit Händen und Füßen klar!',
        },
      ],
    },
    {
      id: 'c2_logic_tatzeit',
      thoughtA: 'thought_c2_kuehlung_9grad',
      thoughtB: 'thought_c2_klima_verdacht',
      resultThoughtId: 'thought_c2_wahre_tatzeit',
      setsFlag: 'flag_c2_tatzeit_geloest',
      feedbackLines: [
        {
          speakerId: 'nate',
          emotion: 'confident',
          shout: 'VOLLTREFFER!',
          shake: true,
          text: 'SO SCHLIESST SICH DER KREIS!! Um 02:10 Uhr fiel der Metallhocker in Zelle 08, und um 03:00 Uhr wurde die Temperatur im Raum absichtlich extrem heruntergedreht – damit Dr. Vances Standard-21-°C-Rechnung Stunden daneben liegt! Arthur starb schon gegen 02:15 Uhr, NICHT um 07:30 Uhr!! Damit stoppen wir die überstürzte Hafenübergabe!',
        },
        {
          speakerId: 'falk',
          emotion: 'smug',
          text: 'Und selbst wenn er schon um 02:15 Uhr starb statt um 07:30 Uhr – NA UND, Sterling?! Ist doch völlig egal, zu welcher Uhrzeit jemand in Zelle 08 das Zeitliche segnet!',
        },
        {
          speakerId: 'vance',
          emotion: 'sweating',
          text: 'Mr. von Falk hat recht… ein Todesfall bleibt ein Todesfall. Warum sollte überhaupt irgendjemand an Bord die Uhrzeit künstlich nach hinten verlegen wollen?!',
        },
        {
          speakerId: 'nate',
          emotion: 'thinking',
          setsFlag: 'flag_c2_a2_warum_zeit_wichtig',
          text: 'Moment… warum weichen sie mir alle genau bei dieser Frage aus?! Irgendjemand MUSS ein handfestes Interesse daran gehabt haben, dass Arthur angeblich erst nach dem Einlaufen im Hafen gestorben ist! Finden wir heraus, warum diese fünf Stunden so wichtig waren!',
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
          shout: 'MOMENT MAL!',
          shake: true,
          text: 'Eleonore hatte gar keine Security-Keycard – aber jemand mit genau so einer Karte war nachts unten, nahm ihren verlorenen Schal und klaute später Conrads Rucksack!',
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
          hideIfFlag: 'flag_c2_dimitri_weg',
        },
        {
          characterId: 'dimitri',
          visibleIfFlag: 'flag_c2_a1_rauswurf',
          hideIfFlag: 'flag_c2_a1_angenommen',
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
              text: 'Die ganze Gangway wurde tatsächlich mit gelb-schwarzem Absperrband dichtgemacht. Zwei stämmige Matrosen stehen davor und lassen nicht einmal die Kofferträger durch.',
            },
            {
              speakerId: 'maya',
              emotion: 'shocked',
              text: 'Und schau mal ganz nach unten auf den Kai, Nate! Da blinkt doch blaues Licht – mindestens zwei Streifenwagen der griechischen Hafenpolizei sind schon vorgefahren!',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Eine Zollkontrolle erklärt noch keine zwei Streifenwagen und eine komplette Ausgangssperre. Vor allem: Wo steckt eigentlich Detective Marston in so einem Moment?',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              setsFlag: 'flag_c2_a1_promenade',
              text: 'Der Steward da vorn hat auf meine Frage nur nervös geschluckt und in Richtung der unteren Decks genickt… Schauen wir auf jeden Fall auch noch im Musiksalon und im VIP-Salon nach!',
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
              text: 'Kein einziges Wort. Aber er lächelt und deutet auf seine Dienstmarke… Fragen wir wohl doch besser nochmal Kapitän Brammer, was er genau von uns will.',
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
                setsFlag: 'flag_c2_a1_angenommen',
                isComingSoon: true,
                nextButtonLabel: 'Demnächst: Tag 4 · Mittag (Akt 2.2)',
                comingSoonNote: 'Akt 2.1 endet hier als Vorschau – an Akt 2.2 wird gerade weitergearbeitet.',
                nextIntroLines: [
                  {
                    speakerId: 'maya',
                    emotion: 'thinking',
                    setsFlag: 'flag_c2_a1_angenommen',
                    text: 'Tag 4, Mittag! Kommissar Dimitri hat durchgesetzt, dass neben der Arrestzelle jetzt auch die Krankenstation für unsere Fragen offen steht – bis zur Mittagsanhörung bleibt nicht viel Zeit.',
                  },
                  {
                    speakerId: 'nate',
                    emotion: 'thinking',
                    text: 'Fangen wir in der Krankenstation bei Dr. Vance an und hören uns ganz unvoreingenommen um, was die Akten über die Nacht sagen.',
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
              text: 'Mittag ist durch, und wir stehen immer noch in der Hitze vor Heraklion! Wenigstens habe ich Conrad gerade mit einer Tüte Cracker unter dem Sonnensegel festgenagelt. Kommen Sie denn überhaupt voran, Mr. Sterling?',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Schwierig… unten vor Zelle 08 steht Officer Brandt wie eine Wand und lässt uns keinen Schritt in die Zelle hinein.',
              choices: [
                {
                  label: '„Wenn wenigstens jemand nachts etwas gehört hätte…“',
                  nextLines: [
                    {
                      speakerId: 'eleonore',
                      emotion: 'confident',
                      text: 'Oh! In jedem guten Krimi gibt es genau dann einen geheimen Ohrenzeugen, der wach war, als niemand wach sein sollte!',
                    },
                  ],
                },
                {
                  label: '„Sie wollen einfach alles blitzschnell als Selbstmord abhaken.“',
                  nextLines: [
                    {
                      speakerId: 'eleonore',
                      emotion: 'shocked',
                      text: 'Typisch!! Genau so fängt Fall 2 in den Klassikern immer an – schnelle Abschlussberichte sind IMMER verdächtig!',
                    },
                  ],
                },
              ],
            },
            {
              speakerId: 'andrew',
              emotion: 'neutral',
              text: 'Also gehört hab ich nachts gar nichts – ich hab ja durchgeschlafen. Nur unsere beiden Großen, Leo und Rick, schleichen seit heute früh auffällig oft oben aufs Rettungsboot-Deck und tuscheln über ihr grünes Walkie-Talkie… keine Ahnung, was die da oben wieder ausgefressen haben.',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              unlocksLocation: 'lifeboat_deck',
              setsFlag: 'flag_c2_a2_rettungsdeck_offen',
              text: 'Auf dem Rettungsboot-Deck?! Danke, Mr. Higginson – schauen wir uns doch gleich oben auf dem Rettungsboot-Deck um und reden dort mit Leo und Rick!',
            },
          ],
        },
        {
          id: 'eleonore_barnaby_einfall',
          title: 'Eleonore: Die rätselhafte Temperatur in Zelle 08!',
          speakerId: 'eleonore',
          requiredFlag: 'flag_c2_a2_klima_geloest',
          hideIfFlag: 'flag_c2_a2_eleonore_klima_idee',
          lines: [
            {
              speakerId: 'andrew',
              emotion: 'grumpy',
              text: 'Na, Mr. Sterling? Immer noch an Bord? Oder haben Sie unten im Rumpf inzwischen herausgefunden, warum niemand das Schiff verlässt?',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Kommissar Dimitri hat uns zwar endlich Zelle 08 öffnen lassen, aber eins verstehe ich nicht: Um 03:00 Uhr nachts hat jemand die Temperatur dort unten extrem heruntergeregelt – obwohl in Dr. Vances Bericht pauschal „Normwert 21 °C“ steht!',
            },
            {
              speakerId: 'eleonore',
              emotion: 'shocked',
              animation: 'shock',
              shout: 'MOMENT MAL!',
              shake: true,
              text: 'EINE HERUNTERGEKÜHLTE ZELLE UM 03:00 UHR UND EIN STANDARD-BERICHT BEI 21 °C?! Mr. Sterling!! Genau DIESEN Trick gab es doch mal in dieser alten Inspektor-Barnaby-Folge mit dem tiefgekühlten Weinkeller – und auch in meinem allerliebsten Anwalts-Spiel!!',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Wie bitte, Mrs. Higginson? Inspektor Barnaby…?',
            },
            {
              speakerId: 'eleonore',
              emotion: 'confident',
              text: 'Na klar!! Wenn ein Raum manipuliert extrem heruntergekühlt wird statt normaler 21 Grad, stimmt KEINE Standard-Abkühltabelle der Welt mehr! Jeder Arzt, der stumpf mit „21 °C Normwert“ rechnet, verschätzt sich oder biegt sich die Todeszeit gleich um MEHRERE STUNDEN zurecht!!',
            },
            {
              speakerId: 'andrew',
              emotion: 'grumpy',
              text: 'Eleonore!! Wir sind hier auf einem Kreuzfahrtschiff vor Kreta und nicht in Midsomer County bei Inspektor Barnaby!!',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              setsFlag: 'flag_c2_a2_eleonore_klima_idee',
              unlocksThought: 'thought_c2_klima_verdacht',
              text: 'Moment… ganz so verrückt ist Inspektor Barnaby hier leider überhaupt nicht!! Kombinieren wir diese Krimi-Erkenntnis sofort in unserem Notizbuch mit der Temperatur-Notiz von 03:00 Uhr!',
            },
          ],
        },
        {
          id: 'captain_seemeilen_warten',
          title: 'Kapitän Brammer: Wie geht es hier weiter?',
          speakerId: 'captain',
          requiredFlag: 'flag_c2_a1_angenommen',
          hideIfFlag: 'flag_c2_a2_hafenregel_gelesen',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Kapitän Brammer – wie lange sollen die Passagiere hier an Deck noch festgehalten werden?',
            },
            {
              speakerId: 'captain',
              emotion: 'neutral',
              text: 'Die Schiffsärztin hat ihren Bericht vorgelegt, und um Punkt Mittag gibt es die offizielle Abschlussuntersuchung vor dem Seegericht im Großen Ballsaal. Bis dahin trägt Kommissar Dimitri alles zusammen – und danach übernimmt das Hafenamt, damit meine Passagiere endlich von Bord kommen.',
            },
          ],
        },
        {
          id: 'captain_seemeilen',
          title: 'Kapitän Brammer: Warum war Ihnen 07:30 Uhr beim Einlaufen so wichtig?!',
          speakerId: 'captain',
          requiredFlag: 'flag_c2_a2_hafenregel_gelesen',
          hideIfFlag: 'flag_c2_a2_bruecke_geloest',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              shout: 'MOMENT MAL!',
              shake: true,
              text: 'Jetzt weichen Sie mir nicht mehr aus, Kapitän Brammer! Ich habe Hafenordnung § 14 gelesen! Bei einem ungeklärten Todesfall VOR der 12-Meilen-Grenze hätte Heraklion der MS Aurora heute Morgen überhaupt keine Einlauferlaubnis erteilt!',
            },
            {
              speakerId: 'captain',
              emotion: 'neutral',
              text: '… Hmm. Sie schnüffeln eindeutig in Funk-Protokollen herum, die keinen Passagier etwas angehen, Herr Sterling.',
            },
            {
              speakerId: 'dimitri',
              emotion: 'confident',
              text: 'Τι είπατε τώρα, κύριε Στέρλινγκ?! Κανονισμός Λιμένα § 14?! Καπετάνιε! Δείξτε μας αμέσως τον ναυτικό χάρτη – αν το περιστατικό έγινε πριν τα 12 ναυτικά μίλια, όλη η αναφορά αλλάζει!',
            },
            {
              speakerId: 'captain',
              emotion: 'neutral',
              text: 'Schon gut, Kommissar… Hier ist mein Radar-Kurs auf dem Brücken-Tablet. Prüfen Sie selbst auf der Seekarte, Herr Verteidiger: Wann wir die griechische 12-Meilen-Grenze passiert haben – und wo die Aurora um 02:15 Uhr wirklich lag.',
              choices: [
                {
                  label: '„Legen Sie die Seekarte auf den Tisch – ich prüfe es!“',
                  nextLines: [
                    {
                      speakerId: 'maya',
                      emotion: 'confident',
                      startsMiniGameId: 'sea_chart',
                      text: 'Na los, Nate – zeigen wir Kapitän Brammer, dass man Seerecht und Uhrzeiten nicht einfach unterm Teppich verschwinden lässt!',
                    },
                  ],
                },
                {
                  label: '„Sie wollten das Schiff um jeden Preis in den Hafen bringen!“',
                  nextLines: [
                    {
                      speakerId: 'captain',
                      emotion: 'neutral',
                      text: 'Lesen Sie erst die Koordinaten ab, bevor Sie hier große Reden schwingen! Hier ist das Radar.',
                      startsMiniGameId: 'sea_chart',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 'captain_seemeilen_done',
          title: 'Kapitän Brammer: Zur Seekarten-Bestätigung',
          speakerId: 'captain',
          requiredFlag: 'flag_c2_a2_bruecke_geloest',
          hideIfFlag: 'flag_c2_dimitri_weg',
          lines: [
            {
              speakerId: 'captain',
              emotion: 'neutral',
              text: 'Das beglaubigte Brücken-Log liegt in Ihrer Akte. 05:45 Uhr war die 12-Meilen-Grenze – alles vor dieser Marke war hohe See. Sehen Sie zu, wie Sie das im Ballsaal vertreten.',
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
              emotion: 'grumpy',
              setsFlag: 'flag_c2_a3_start',
              text: 'Mr. Sterling! Endlich sind Sie wieder da! Conrads blauer Rucksack wurde vorhin einfach gestohlen!! Irgendein Kerl hat ihn weggerissen und ist weggerannt!',
            },
            {
              speakerId: 'nate',
              emotion: 'sweating',
              text: 'Ähm… tut mir leid, Mr. Higginson, aber ich muss gerade wegen der Untersuchung in Zelle 08 an die Schiffs-Akten und bin wirklich kein Kreuzfahrt-Fundbüro.',
            },
            {
              speakerId: 'eleonore',
              emotion: 'shocked',
              setsFlag: 'flag_c2_a3_rucksack_gesichtet',
              text: 'Aber mein schöner blauer Kreta-Seidenschal hängt doch auch schon unten in der Arrestzelle?! Und dabei hatte ich meinen Schal schon gestern Abend verloren! Ach, halten Sie wenigstens am Rettungsboot-Deck mal die Augen offen!',
            },
            {
              speakerId: 'nate',
              emotion: 'shocked',
              shout: 'MOMENT MAL!',
              shake: true,
              text: 'Warte mal… dieses feine blaue „Seidentuch“, das ich unten in der Zelle gesehen und für eines von Arthurs Kellner-Tüchern gehalten habe – das war gar kein Krawattentuch, sondern IHR Kreta-Seidenschal, Mrs. Higginson?!',
            },
            {
              speakerId: 'marston',
              emotion: 'thinking',
              unlocksEvidence: 'seidenschal_spur',
              unlocksThought: 'thought_c2_schal_vermisst',
              text: 'Tut mir leid, Mrs. Higginson – Ihr Schal wurde unten wirklich als Beweis am Zellengitter gesichert. Falk will Sie heute Abend dazu vor dem Tribunal befragen!',
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
              emotion: 'grumpy',
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
          evidenceId: 'zellen_klima_protokoll',
          targetCharacterId: 'eleonore',
          requiredFlag: 'flag_c2_a2_klima_geloest',
          hideIfFlag: 'flag_c2_a2_eleonore_klima_idee',
          lines: [
            {
              speakerId: 'eleonore',
              emotion: 'shocked',
              animation: 'shock',
              shout: 'MOMENT MAL!',
              shake: true,
              text: 'Temperaturänderung um 03:00 Uhr in Zelle 08 – und im Arztbericht steht „Normwert 21 °C“?! GENAU SO ETWAS GAB ES IN EINER ALTEN INSPEKTOR-BARNABY-FOLGE (und in meinem Lieblings-Anwaltsspiel)!!',
            },
            {
              speakerId: 'eleonore',
              emotion: 'confident',
              setsFlag: 'flag_c2_a2_eleonore_klima_idee',
              unlocksThought: 'thought_c2_klima_verdacht',
              text: 'Wenn der Raum manipuliert heruntergekühlt war, stimmt KEINE Standard-Todeszeit-Rechnung mehr! Dann lag der Vorfall in Wahrheit Stunden früher!!',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Brillant, Mrs. Higginson! Kombinieren wir diese Erkenntnis gleich im Notizbuch mit unserer Temperatur-Notiz!',
            },
          ],
        },
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
              text: 'Wie merkwürdig still es hier im Musiksalon ist… Gestern Abend hat hier noch die Abendgala gespielt, und jetzt stehen auf dem Tisch halbvolle Kaffeetassen, als wären die Gäste mitten im Frühstück aufgestanden.',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Schau mal auf den Konzertflügel, Nate – da liegt ein zerknitterter Dienstplan der Stewards. Jemand hat mit rotem Stift die gesamte Morgenbesatzung vom Frühstücksbuffet abgezogen.',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Abgezogen? Wohin denn – etwa zu den Kabinen?',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              setsFlag: 'flag_c2_a1_music',
              text: 'Nein, eher in den Service-Trakt! Ein Kellner an der Tür meinte gerade noch flüsternd, Detective Marston und Staatsanwalt von Falk seien vor zehn Minuten kreidebleich die hintere Treppe ganz nach unten gestürzt!',
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
              text: 'Alle oberen Decks sind auf Grün… bis auf ein einziges blinkendes Warnsignal ganz unten auf Deck -2.',
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
          id: 'c2_a2_hafen_vorschrift',
          label: 'Hafenbehörde-Protokoll & Einlaufordnung',
          x: 34,
          y: 44,
          width: 16,
          height: 22,
          visibleIfFlag: 'flag_c2_a2_warum_zeit_wichtig',
          hideIfFlag: 'flag_c2_dimitri_weg',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Mal sehen, was auf der Funk-Konsole noch im Posteingang der Brücke blinkt… Hier: „Hafenamt Heraklion – Einlaufbestimmungen für Passagierschiffe, § 14“.',
            },
            {
              speakerId: 'maya',
              emotion: 'shocked',
              setsFlag: 'flag_c2_a2_hafenregel_gelesen',
              unlocksThought: 'thought_c2_hafen_regel',
              text: 'NATE!! Lies dir diesen Absatz laut vor!! „Meldet ein Schiff einen ungeklärten Todesfall aus internationalen Gewässern (vor Passieren der 12-Meilen-Zone), wird die Hafeneinfahrt verweigert und das Schiff auf Außenreede blockiert! Nur Vorfälle nach Erreichen des Hoheitsgebiets werden direkt am Pier übernommen.“',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              shout: 'MOMENT MAL!',
              shake: true,
              text: 'DESWEGEN wollten sie die 07:30 Uhr!! Hätte Dr. Vance 02:15 Uhr gemeldet, hätte Kapitän Brammer mit der MS Aurora heute Morgen GAR NICHT erst in den Hafen von Kreta einlaufen dürfen! Ab aufs Promenadendeck – stellen wir den Kapitän mit seiner Seekarte zur Rede!',
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
              text: 'Stimmt – kein einziger Mann in Uniform weit und breit. Selbst die kleinen Funkgeräte auf dem Tresen wurden einfach liegen gelassen, als alle weggerufen wurden.',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Und auf der Status-Anzeige leuchtet ausschließlich der Zellentrakt ganz unten im Rumpf auf.',
            },
            {
              speakerId: 'maya',
              emotion: 'sweating',
              setsFlag: 'flag_c2_a1_vip',
              text: 'Wenn wir wissen wollen, warum niemand an Land darf und was mit Arthur Morgan los ist, führt wohl leider kein Weg an diesem Zellentrakt vorbei…',
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
      subtitle: 'Tatort & Innenansicht der Zelle',
      backgroundUrl: '/src/assets/images/case2_brig_cell_day_1795164438127.jpg',
      alternateBackground: {
        flag: 'flag_c2_a2_zelle_offen',
        backgroundUrl: '/src/assets/images/cell_08_inside_1795211919808.jpg',
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
          characterId: 'dimitri',
          visibleIfFlag: 'flag_c2_a1_angenommen',
          hideIfFlag: 'flag_c2_dimitri_weg',
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
              speakerId: 'brandt',
              emotion: 'neutral',
              text: 'Stopp, Mr. Sterling! Zelle 08 steht unter strengem Sicherheitsverschluss. Solange mein Wachbericht gilt, darf hier kein Unbefugter hinein.',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Solange Officer Brandt sich vor das Gitter stellt, kommen wir nicht ins Innere… Nur Kommissar Dimitri könnte ihm befehlen aufzuschließen – dafür brauchen wir erst einen echten Widerspruch gegen das, was uns hier erzählt wird.',
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
          lines: [
            {
              speakerId: 'nate',
              emotion: 'shocked',
              shout: 'MOMENT MAL!',
              shake: true,
              text: 'Im ersten Funkspruch hieß es doch „Gefangener erhängt“ – aber sieh dir dieses angebliche „Seil“ hier oben aus der Nähe an, Maya!',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              setsFlag: 'flag_c2_a2_seil_gesehen',
              text: 'Nanu?! Das ist gar kein grobes Schiffstau aus dem Arrest… das fasst sich an wie ein ganz feines, glattes **Seidentuch**!',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Ein edles blaues Seidentuch? Eigentlich gar nicht so ungewöhnlich bei einem geschniegelten Oberkellner aus der Ersten Klasse – Arthur trug so etwas ja oft unterm Kragen. Merkwürdig ist höchstens, dass man ihm das in der Zelle gelassen hat… behalten wir es im Hinterkopf.',
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
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              setsFlag: 'flag_c2_a2_schloss_gesehen',
              text: 'Schauen wir uns das elektronische Sicherheits-Schloss direkt am Türrahmen an: Kein einziger Kratzer, keine Aufbruchspur – und laut Display-Log gab es zwischen 00:00 und 08:15 Uhr keinen einzigen Keycard-Scan!',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Die Tür ging also von außen die ganze Nacht kein einziges Mal auf… Falls das hier also kein Selbstmord war, wäre die Zelle ein perfekter verschlossener Raum! Behalten wir das Schloss auf jeden Fall für später im Hinterkopf!',
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
              text: 'Brrr!! Jetzt, wo wir direkt in Zelle 08 stehen, spürt man es sofort: Die Wandklappe hier drüben ist ja regelrecht mit Reif überzogen – hier drin ist es eisig kalt!!',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Und dahinter ist ein Wartungsmodul für die Zellentemperatur! Die Leitungen stehen völlig quer – richten wir die Rohre sauber bis zum Sensor aus, um zu prüfen, wann und ob hier jemand gedreht hat!',
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
          lines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Das Protokoll der Kühlklappe ist eindeutig: Punkt 03:00 Uhr nachts wurde die Zellentemperatur manuell stark nach unten verändert.',
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
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Da liegt genau der schwere Metallhocker, dessen Krachen Leo und Rick um 02:10 Uhr bis aufs Rettungsboot-Deck gehört haben! Die Kratzspur verläuft quer unter dem oberen Lüftungsgitter.',
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
              speakerId: 'dimitri',
              emotion: 'confident',
              text: 'Κύριε Στέρλινγκ, δεν μπορώ να ανοίξω έτσι απλά ένα σφραγισμένο κελί! Ο αξιωματικός ασφαλείας έχει την ευθύνη – φέρτε μου πρώτα μια ξεκάθαρη απόδειξη ότι κάτι δεν πάει καλά στα έγγραφα!',
            },
            {
              speakerId: 'maya',
              emotion: 'sweating',
              text: 'Er schüttelt den Kopf und deutet auf das Schloss und den Wachoffizier… Ohne handfesten Widerspruch aus unseren eigenen Ermittlungen lässt er uns die Zelle wohl noch nicht öffnen.',
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
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Jetzt haben wir die Lügen auf dem Tisch, Nate! Aber Kapitän Brammer ist nicht hier unten zum Übersetzen… du musst es Kommissar Dimitri mit Uhrzeiten und Gesten klarmachen!',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              shout: 'MOMENT MAL!',
              shake: true,
              startsMiniGameId: 'dimitri_pantomime',
              text: 'Kommissar Dimitri, schauen Sie genau her – gleich reicht mein Pantomime-Griechisch für ein „Brandt lügt, Zelle auf!“!',
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
              speakerId: 'dimitri',
              emotion: 'confident',
              text: 'Εξετάστε όλο το κελί με ησυχία, κύριε Στέρλινγκ! Εγώ κρατώ το πόστο εδώ μέχρι να βρείτε κάθε λεπτομέρεια!',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Kommissar Dimitri hält uns den Eingang frei – schau dich einfach in Ruhe im Inneren von Zelle 08 um, Nate!',
            },
          ],
        },
      ],
      presentRules: [
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
              text: 'Schauen Sie her, Kommissar Dimitri – ich zeige Ihnen den Widerspruch aus Brandts Wachprotokoll direkt mit Händen und Füßen!',
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
              text: 'Kommissar Dimitri, passen Sie auf – hier ist der Widerspruch zu Brandts Nachtwache!',
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
              text: 'Kommissar Dimitri! Diese Uhrzeit im Arztbericht passt nicht zu Brandts Schicht – ich zeige es Ihnen!',
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
      ],
      hotspots: [
        {
          id: 'c2_a2_arzt_monitor',
          label: 'Medizinischer Befund am Terminal',
          x: 40,
          y: 46,
          width: 16,
          height: 20,
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              setsFlag: 'flag_c2_a2_21grad_notiz',
              text: 'Mal sehen, was auf Dr. Vances Terminal steht: „Befund Arrestzelle 08 · Erstuntersuchung 08:15 Uhr · Geschätzter Todeszeitpunkt ca. 07:30 Uhr (Standardtabelle / Normwert 21 °C) · Übergabe an Hafenbehörde Heraklion vorbereitet.“',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Ganz schön knapper medizinischer Standardbogen… Aber immerhin stehen alle Messwerte fein säuberlich drauf.',
            },
          ],
        },
      ],
      talkTopics: [
        {
          id: 'vance_todeszeit',
          title: 'Dr. Vance: Zu Ihrer Untersuchung in Zelle 08',
          speakerId: 'vance',
          lines: [
            {
              speakerId: 'vance',
              emotion: 'neutral',
              setsFlag: 'flag_c2_a2_vance_befragt',
              unlocksEvidence: 'obduktion_vorlaeufig',
              unlocksThought: 'thought_c2_0730_hafen',
              text: 'Fassen Sie sich bitte kurz, Mr. Sterling. Ich habe heute früh meinen Befund in Arrestzelle 08 aufgenommen. Äußere Spuren eines Handgemenges gibt es nicht – hier ist meine vorläufige Aktenkopie für Ihre Unterlagen.',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Danke, Frau Doktor. Darf ich Ihnen noch eine kurze Frage zu Ihren Feststellungen stellen?',
              choices: [
                {
                  label: '„Gehen Sie medizinisch sicher von einem Selbstmord aus?“',
                  nextLines: [
                    {
                      speakerId: 'vance',
                      emotion: 'neutral',
                      text: 'Die Zellentür war verschlossen, es gab keinen Kampf. Ob Suizid oder etwas anderes, wird das Seegericht oder die Hafenpolizei abschließend bewerten.',
                    },
                  ],
                },
                {
                  label: '„Wie schnell übernimmt jetzt die Hafenpolizei den Fall?“',
                  nextLines: [
                    {
                      speakerId: 'vance',
                      emotion: 'neutral',
                      text: 'Nach der Abschlussuntersuchung heute Mittag im Großen Ballsaal werden die Papiere direkt an Heraklion übergeben.',
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
              text: 'Ziemlich kühl und kurz angebunden… Schauen wir uns ihren schriftlichen Arzt-Bericht gleich in der Gerichtsakte genauer an!',
            },
          ],
        },
        {
          id: 'vance_beweise_anforderung',
          title: 'Dr. Vance: Ändert die Temperatur in Zelle 08 etwas?',
          speakerId: 'vance',
          requiredFlag: 'flag_c2_a2_klima_geloest',
          hideIfFlag: 'flag_c2_a2_eleonore_klima_idee',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Dr. Vance, uns ist unten in Zelle 08 aufgefallen, dass es dort eiskalt ist – laut Sensor-Protokoll wurde die Temperatur um 03:00 Uhr nachts manuell geändert. Hat das für Ihren Bericht irgendeine Bedeutung?',
            },
            {
              speakerId: 'vance',
              emotion: 'neutral',
              text: 'Ein verstelltes Bordventil ist ein Fall für die Haustechnik, nicht für meine Krankenakte, Mr. Sterling. Solange niemand einen konkreten Zusammenhang beweist, ändert eine kalte Zelle an meinem Befund nicht das Geringste!',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Puh, die Ärztin speist uns einfach ab… Aber seltsam bleibt es schon, warum jemand um 03:00 Uhr an der Kühlung dreht. Reden wir oben auf dem Promenadendeck mal mit Eleonore – vielleicht kennt sie so einen Fall aus ihren Krimis!',
            },
          ],
        },
      ],
      presentRules: [
        {
          evidenceId: 'zellen_klima_protokoll',
          targetCharacterId: 'vance',
          hideIfFlag: 'flag_c2_a2_eleonore_klima_idee',
          lines: [
            {
              speakerId: 'vance',
              emotion: 'neutral',
              text: 'Heruntergekühlt um 03:00 Uhr? Ein klemmendes Bordventil vielleicht – aber das allein erklärt doch niemandem, warum mein 07:30-Uhr-Bericht deshalb um Stunden falsch sein soll.',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Solange wir das nicht sauber begründen können, blockt sie sofort ab… Vielleicht fällt jemandem wie Hobbydetektivin Eleonore auf dem Promenadendeck etwas zu diesem Temperatur-Trick ein!',
            },
          ],
        },
        {
          evidenceId: 'zellen_klima_protokoll',
          targetCharacterId: 'vance',
          requiredFlag: 'flag_c2_a2_eleonore_klima_idee',
          hideIfFlag: 'flag_c2_tatzeit_geloest',
          lines: [
            {
              speakerId: 'vance',
              emotion: 'shocked',
              setsFlag: 'flag_c2_a2_vance_klimaschock',
              text: 'Tch… Sie reden also schon über die manipulierte Abkühlkurve ab 03:00 Uhr?! Aber selbst wenn Sie das in Ihren Notizen verknüpfen – an der Hafenübergabe ändert das gar nichts!',
            },
          ],
        },
        {
          evidenceId: 'zellen_klima_protokoll',
          targetCharacterId: 'vance',
          requiredFlag: 'flag_c2_tatzeit_geloest',
          lines: [
            {
              speakerId: 'vance',
              emotion: 'sweating',
              text: 'Wie gesagt, Mr. Sterling – selbst wenn es 02:15 Uhr war statt 07:30 Uhr: Wen auf der Brücke oder im Hafen soll diese Uhrzeit bitteschön interessieren?!',
            },
          ],
        },
        {
          evidenceId: 'lueftung_streich',
          targetCharacterId: 'vance',
          lines: [
            {
              speakerId: 'vance',
              emotion: 'thinking',
              text: 'Zwei Teenager mit einem Walkie-Talkie um 02:10 Uhr? Die bestätigen höchstens ein Geräusch – keinen medizinischen Befund.',
            },
          ],
        },
        {
          evidenceId: 'obduktion_vorlaeufig',
          targetCharacterId: 'vance',
          lines: [
            {
              speakerId: 'vance',
              emotion: 'neutral',
              text: 'Meinen eigenen Bericht kenne ich auswendig, Mr. Sterling.',
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
              text: 'Puh, hier geht ein mächtiger Schacht direkt nach unten ins Schiff! Und direkt am äußeren Metallrand klebt irgendetwas Buntes…',
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
              text: 'Aha!! Dann haben Leo und Rick heute Nacht hier am Schacht also sehr wohl etwas getrieben! Stellen wir die beiden gleich hier drüben zur Rede!',
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
