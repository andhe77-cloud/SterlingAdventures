import type { GameCase } from '../types/game';

export const CRUISE_CASE: GameCase = {
  id: 'fall-01-chronometer',
  title: 'Akte MS Aurora: Diebstahl auf hoher See',
  subtitle: 'Fall 1 komplett · Kapitel 1–4 & Epilog',
  description:
    'Sieben Tage Urlaub auf dem Luxusliner MS Aurora – so war zumindest der Plan von Strafverteidiger Nate Sterling und seiner Assistentin Maya. Doch schon beim Willkommens-Dinner verschwindet ein unbezahlbares Erbstück.',
  initialChapterId: 'kap1_tag1_abend',
  chapters: {
    kap1_tag1_abend: {
      id: 'kap1_tag1_abend',
      dayLabel: 'Tag 1 · Abend',
      timeOfDay: 'abend',
      title: 'Kapitel 1: Urlaub wider Willen & Spurensuche',
      subtitle: 'VIP-Salon, Bord-Arrest & Promenadendeck',
    },
    kap2_tag2_morgen: {
      id: 'kap2_tag2_morgen',
      dayLabel: 'Tag 2 · Morgen',
      timeOfDay: 'tag',
      title: 'Kapitel 2: Der schnelle Freispruch',
      subtitle: 'Großer Ballsaal · Schiffs-Tribunal',
    },
    kap3_tag2_abend: {
      id: 'kap3_tag2_abend',
      dayLabel: 'Tag 2 · Abend',
      timeOfDay: 'abend',
      title: 'Kapitel 3: Das falsche Spiel',
      subtitle: 'Kabine 312, VIP-Salon & Promenadendeck',
    },
    kap4_tag3_morgen: {
      id: 'kap4_tag3_morgen',
      dayLabel: 'Tag 3 · Morgen',
      timeOfDay: 'tag',
      title: 'Kapitel 4: Das große Finale',
      subtitle: 'Großer Ballsaal · Hauptverfahren',
    },
    kap4_tag3_abend: {
      id: 'kap4_tag3_abend',
      dayLabel: 'Tag 3 · Abend',
      timeOfDay: 'abend',
      title: 'Kapitel 4 · Epilog: Klang der Freiheit',
      subtitle: 'Musiksalon & Ankunft vor Kreta',
    },
  },
  initialLocationId: 'deck',
  initialUnlockedLocations: ['deck', 'suite', 'brig'],
  initialEvidenceIds: [],
  initialThoughtIds: [],
  courtroomUnlockFlags: ['flag_zeit_geloest', 'flag_flucht_geloest'],
  courtroomLocationId: 'courtroom',

  // =========================================================================
  // AKT 1: INTRO („URLAUB WIDER WILLEN“ — SZENE 1.1, 1.2, 1.3)
  // =========================================================================
  introLines: [
    // --- SZENE 1.1: PROMENADENDECK ---
    {
      speakerId: 'nate',
      emotion: 'neutral',
      text: '(Milde Meeresbrise, kein Aktenberg auf dem Schreibtisch, kein schreiender Staatsanwalt… ich glaube, ich träume.)',
    },
    {
      speakerId: 'maya',
      emotion: 'confident',
      text: 'Erde an Nate! Hör auf, das Meer anzustarren, als wäre es ein Kreuzverhör. Wir haben tatsächlich eine ganze Woche komplett frei!',
    },
    {
      speakerId: 'nate',
      emotion: 'confident',
      text: 'Vergiss nicht, dass du mir diesen Gewinn erst aufgezwungen hast, Maya. „Nimm an dem Rätsel-Gewinnspiel teil“, hast du gesagt. „Wir gewinnen sowieso nichts“, habe ich gesagt.',
    },
    {
      speakerId: 'maya',
      emotion: 'smug',
      text: 'Und jetzt stehen wir auf dem Promenadendeck der MS Aurora! All-inclusive-Buffet, Live-Musik im Salon und… äh… Nate?',
    },
    {
      speakerId: 'nate',
      emotion: 'neutral',
      text: 'Hm? Was schaust du denn plötzlich so verdächtig auf mein Revers?',
    },
    {
      speakerId: 'maya',
      emotion: 'thinking',
      text: 'Du hast dein goldenes Anwaltsabzeichen am Urlaubs-Sakko gelassen.',
    },
    {
      speakerId: 'nate',
      emotion: 'sweating',
      text: 'W-was?! Nein, das… das ist reine Gewohnheit! Wenn ich morgens ein Sakko anziehe, wandert meine Hand eben automatisch zur Anstecknadel!',
    },
    {
      speakerId: 'maya',
      emotion: 'confident',
      text: 'Jaja. „Ich rühre diesmal wirklich keine einzige Akte an.“ Wetten, dass wir noch vor dem Dessert irgendein Problem an der Backe haben?',
    },
    {
      speakerId: 'nate',
      emotion: 'thinking',
      text: '(Man soll sein Glück niemals herausfordern. Trotzdem – mitten auf dem offenen Mittelmeer? Was soll hier schon passieren?)',
    },
    {
      speakerId: 'maya',
      emotion: 'shocked',
      text: 'Ähm, Nate… sag mal: Spinne ich, oder hat diese Kreuzfahrt ein ziemlich seltsames VIP-Aufgebot?',
    },
    {
      speakerId: 'nate',
      emotion: 'neutral',
      text: 'Wie kommst du denn jetzt darauf?',
    },
    {
      speakerId: 'maya',
      emotion: 'thinking',
      text: 'Schau mal zehn Meter weiter an die Reling. Der ältere Herr mit dem schneeweißen Bart und dem Käpt’n-Drink in der Hand…',
    },
    {
      speakerId: 'nate',
      emotion: 'shocked',
      text: 'Moment mal – das ist doch Judge Pendelton?! Euer Ehren?!',
    },
    {
      speakerId: 'pendelton',
      emotion: 'confident',
      text: 'Oh! Mr. Sterling! Und Miss Maya! Welch wunderbarer Zufall! Die Reederei hat mich als Ehrengast für das große Kapitäns-Jubiläum eingeladen.',
    },
    {
      speakerId: 'nate',
      emotion: 'neutral',
      text: 'Es ist wirklich schön, Sie mal außerhalb eines Gerichtssaals zu treffen, Euer Ehren. Ganz ohne Richterhammer.',
    },
    {
      speakerId: 'pendelton',
      emotion: 'smug',
      text: 'Haha! Glauben Sie mir, ich vermisse ihn kein bisschen. Nun gut, ich muss weiter zum Empfang – man sieht sich am Gala-Buffet!',
    },
    {
      speakerId: 'maya',
      emotion: 'sweating',
      text: 'Okay, ein Richter im Urlaub ist noch witzig. Aber dreh dich bloß nicht nach links um…',
    },
    {
      speakerId: 'falk',
      emotion: 'smug',
      text: '…Welch betrüblicher Anblick. Selbst tausend Seemeilen von der Küste entfernt stolpert man über drittklassige Verteidiger.',
    },
    {
      speakerId: 'nate',
      emotion: 'shocked',
      text: 'Victor von Falk?! Was um alles in der Welt machen Sie denn auf einer Kreuzfahrt?!',
    },
    {
      speakerId: 'falk',
      emotion: 'smug',
      text: 'Das geht Sie zwar nichts an, Sterling, aber meine Familie hält Anteile an dieser Reederei. Ich prüfe lediglich den Service-Standard. Und offensichtlich… sinkt er rapide.',
    },
    {
      speakerId: 'maya',
      emotion: 'smug',
      text: 'Also für jemanden, der nur den Service prüft, klammern Sie sich ganz schön fest ans Geländer, Mr. von Falk. Ein bisschen seekrank?',
    },
    {
      speakerId: 'falk',
      emotion: 'shocked',
      shake: true,
      text: 'U-Unsinn! Ich bewundere lediglich die… architektonische Stabilität dieser Reling! Ich gehe jetzt in den VIP-Salon. Bleiben Sie mir aus den Augen!',
    },
    {
      speakerId: 'nate',
      emotion: 'thinking',
      text: '(Ein Richter und Victor von Falk auf demselben Schiff. Mein anwaltliches Bauchgefühl fängt schon wieder verdächtig an zu klingeln…)',
    },

    // --- SZENE 1.2: DER VORFALL ---
    {
      speakerId: 'maya',
      emotion: 'shocked',
      sfx: 'alarm',
      shake: true,
      text: 'Whoa! Hast du diesen Alarm gehört?! Das kam direkt aus Richtung des VIP-Salons!',
    },
    {
      speakerId: 'nate',
      emotion: 'thinking',
      text: 'Und sieh mal, wie plötzlich alle Stewards hektisch durch die Glastüren nach drinnen laufen…',
    },
    {
      speakerId: 'maya',
      emotion: 'confident',
      text: 'Komm, Nate! Lass uns kurz rübergehen und nachschauen, was da passiert ist!',
    },
    {
      speakerId: 'nate',
      emotion: 'sweating',
      text: 'Moment mal – Stopp! Auf gar keinen Fall! Ich habe URLAUB, Maya! Weißt du eigentlich, was dieses Wort bedeutet?',
    },
    {
      speakerId: 'nate',
      emotion: 'confident',
      text: 'Keine Tatorte. Keine zerbrochenen Vitrinen. Keine verängstigten Verdächtigen. Wir bleiben exakt hier stehen und schauen uns höchstens die Möwen an!',
    },
    {
      speakerId: 'maya',
      emotion: 'smug',
      text: 'Ach komm schon, Mr. „Ich-trage-trotzdem-mein-Anwaltsabzeichen“. Du stirbst doch innerlich längst vor Neugier, was da drin los ist!',
    },
    {
      speakerId: 'nate',
      emotion: 'sweating',
      text: 'Stimmt überhaupt nicht! Ich bin völlig entspannt und genieße einfach die… Moment, hat da drin gerade jemand „Haltet den Sicherheitsbereich frei!“ gerufen?',
      choices: [
        {
          label: '„Na schön… aber wir schauen wirklich nur fünf Minuten!“',
          nextLines: [
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Abgemacht! Fünf Minuten – großes Assistentinnen-Ehrenwort. Los geht’s in den VIP-Salon!',
            },
          ],
        },
        {
          label: '„Nein! Wir bleiben hier an der Reling!“',
          nextLines: [
            {
              speakerId: 'maya',
              emotion: 'smug',
              text: 'Oh, schade… dabei stürmt gerade ein Typ im zerknitterten Trenchcoat samt baumelnder Polizeimarke in den VIP-Salon.',
            },
            {
              speakerId: 'nate',
              emotion: 'shocked',
              text: '…Trenchcoat plus baumelnde Polizeimarke?! Oh nein, ich weiß genau, wer das ist! Okay, vergiss den Urlaub – wir müssen nachsehen!',
            },
          ],
        },
      ],
    },



    // --- SZENE 1.3: ANKUNFT AM TATORT (VIP-SALON) ---
    {
      speakerId: 'nate',
      emotion: 'thinking',
      switchesLocationId: 'suite',
      text: '(Wir betreten den abgesperrten VIP-Salon – und schon von der Tür aus sieht man die Scherben am Boden glitzern.)',
    },
    {
      speakerId: 'maya',
      emotion: 'shocked',
      text: 'Schau dir den Schaukasten in der Mitte an, Nate! Das dicke Sicherheitsglas liegt komplett in Trümmern!',
    },
    {
      speakerId: 'marston',
      emotion: 'sweating',
      text: 'Halt! Keinen Schritt weiter, abgesperrter Berei– …Oh! Nate?! Maya?! Was macht ihr denn auf diesem Dampfer?!',
    },
    {
      speakerId: 'nate',
      emotion: 'shocked',
      text: 'Detective Frank Marston?! Das wollte ich Sie eigentlich auch gerade fragen! Ist heute das gesamte Justizviertel auf der MS Aurora eingebucht?!',
    },
    {
      speakerId: 'marston',
      emotion: 'sweating',
      text: 'Pauschal-Schnäppchen für Staatsbedienstete! Kaum wollte ich hier ein Urlaubsfoto vom Sonnenuntergang knipsen – zack – fliegt mir eine Vitrine um die Ohren!',
    },
    {
      speakerId: 'maya',
      emotion: 'thinking',
      text: 'Was wurde denn überhaupt gestohlen, Detective?',
    },
    {
      speakerId: 'marston',
      emotion: 'neutral',
      text: 'Der Goldene Schiffs-Chronometer! Ein über hundert Jahre altes Erbstück der Reederei, das hier beim Empfang ausgestellt war – spurlos verschwunden!',
    },
    {
      speakerId: 'nate',
      emotion: 'thinking',
      text: 'Gestohlen? Mitten während des Empfangs? Aber tausend Seemeilen vor der Küste kommt doch niemand vom Schiff!',
    },
    {
      speakerId: 'marston',
      emotion: 'sweating',
      text: 'Eben! Deshalb hat der Kapitän die Sicherheitsleute gerufen. Und die haben die Hauptverdächtige direkt hier an der Salontür geschnappt.',
    },
    {
      speakerId: 'maya',
      emotion: 'shocked',
      text: 'Wen denn?!',
    },
    {
      speakerId: 'marston',
      emotion: 'neutral',
      text: 'Die junge Bord-Pianistin, Anya Brooks. Oberkellner Arthur Morgan schwört Stein und Bein, er habe sie direkt beim Hinausstürmen gesehen.',
    },
    {
      speakerId: 'falk',
      emotion: 'confident',
      text: 'Eine offene und geschlossene Sache, Detective Marston. Und da wir noch drei Tage bis zum nächsten Hafen brauchen, duldet der Kapitän keine Unruhe unter den Passagieren.',
    },
    {
      speakerId: 'nate',
      emotion: 'thinking',
      text: 'Warten Sie mal – was soll das heißen, von Falk?',
    },
    {
      speakerId: 'falk',
      emotion: 'smug',
      text: 'Der Kapitän hat soeben ein außerordentliches Schiffs-Tribunal im Großen Ballsaal angeordnet – morgen früh als Vorverfahren! Judge Pendelton führt den Vorsitz, und ich übernehme selbstverständlich die Anklage.',
    },
    {
      speakerId: 'maya',
      emotion: 'shocked',
      text: 'Moment mal! Morgen früh schon?! Und wer verteidigt die arme Pianistin?!',
    },
    {
      speakerId: 'falk',
      emotion: 'smug',
      text: 'Niemand, vermute ich. Außer, hier gäbe es jemanden, der töricht genug wäre, seinen kostbaren Urlaub für eine offensichtlich Schuldige wegzuwerfen.',
    },
    {
      speakerId: 'anya',
      emotion: 'sweating',
      text: 'B-bitte! Sind Sie wirklich Strafverteidiger?! Ich habe Ihren Namen eben gehört! Bitte glauben Sie mir, ich habe diesen Chronometer nicht angerührt!',
    },
    {
      speakerId: 'marston',
      emotion: 'sweating',
      text: 'Ähm, Miss Brooks, bitte bleiben Sie kurz bei der Tür stehen, wir müssen Sie gleich in die Sicherheitskabine bringen…',
    },
    {
      speakerId: 'anya',
      emotion: 'shocked',
      text: 'Ich wollte nur meine vergessene Notenmappe vom Flügel holen! Als ich in den Salon trat, war die Vitrine schon zerschlagen – und dann brüllte mich plötzlich der Oberkellner an!',
    },
    {
      speakerId: 'nate',
      emotion: 'thinking',
      text: '(Sie zittert am ganzen Körper. Wenn ich ablehne, zieht von Falk morgen früh ohne jede Gegenwehr eine Show ab, und ihre Karriere ist ruiniert…)',
    },
    {
      speakerId: 'maya',
      emotion: 'confident',
      text: 'Na, Chef? Jetzt stehen wir schon direkt am Tatort. Was sagen wir: Zurück zur Liege oder Mandat annehmen?',
      choices: [
        {
          label: '„Wir übernehmen den Fall, Anya!“',
          nextLines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              sfx: 'objection',
              text: 'Keine Sorge, Miss Brooks. Ab sofort übernehme ich Ihre Verteidigung!',
            },
          ],
        },
        {
          label: '„Eigentlich wollte ich wirklich nur Urlaub machen…“',
          nextLines: [
            {
              speakerId: 'maya',
              emotion: 'smug',
              text: 'Klar – und den ganzen Rückweg von Falks breites Grinsen ertragen? Vergiss es!',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: '…Na schön. Ich übernehme den Fall!',
            },
          ],
        },
      ],
    },
    {
      speakerId: 'anya',
      emotion: 'neutral',
      text: 'D-danke, Mr. Sterling! Vielen, vielen Dank!',
    },
    {
      speakerId: 'marston',
      emotion: 'confident',
      text: 'Typisch Nate! Kann einfach nicht wegschauen. Hier – ich drücke zwei Augen zu und gebe dir meinen Ausweis-Vermerk sowie die vorläufige Tatort-Notiz in deine Gerichtsakte.',
      unlocksEvidence: 'anwaltsausweis',
    },
    {
      speakerId: 'marston',
      emotion: 'neutral',
      text: 'Ich gehe wieder aufs Promenadendeck frische Luft schnappen – offiziell hab ich schließlich Urlaub! Anya wartet unten in der Sicherheitskabine (Bord-Arrest).',
      unlocksEvidence: 'tatort_notiz',
    },
    {
      speakerId: 'maya',
      emotion: 'thinking',
      text: 'Warte mal, Nate… schau dich hier im VIP-Salon um! Oberkellner Arthur Morgan steht noch drüben bei den Stühlen – und irgendwas stimmt an diesem Tatort ganz und gar nicht!',
    },
    {
      speakerId: 'nate',
      emotion: 'confident',
      text: 'Du hast recht, Maya. Sprechen wir erst mit Arthur Morgan, untersuchen dann den Salon Schritt für Schritt – und schauen, welche Widersprüche ans Licht kommen!',
    },
  ],

  characters: {
    nate: {
      id: 'nate',
      name: 'Nate Sterling',
      role: 'Verteidiger (im Urlaub)',
      bio: 'Strafverteidiger wider Willen auf Urlaubsreise. Verlässt sich auf scharfe Logik, genaue Beobachtung und perfektes Timing beim Einspruch.',
      accentColor: '#2563eb',
      side: 'left',
      portraitUrl: '/src/assets/images/sprite_nate_neutral_1795080943216.jpg',
      portraits: {
        confident: '/src/assets/images/sprite_nate_confident_1795080941029.jpg',
      },
    },
    maya: {
      id: 'maya',
      name: 'Maya',
      role: 'Assistentin',
      bio: 'Nates schlagfertige Ermittlungsassistentin. Hat statt eines Reiseführers direkt ihren Notizblock mit aufs Schiff geschmuggelt.',
      accentColor: '#d97706',
      side: 'left',
      portraitUrl: '/src/assets/images/sprite_maya_neutral_1795080941915.jpg',
    },
    pendelton: {
      id: 'pendelton',
      name: 'Judge Arthur Pendelton',
      role: 'Vorsitzender (Seegericht)',
      bio: 'Ehrengast der Reederei und erfahrener Richter. Leitet das außerordentliche Schiffs-Tribunal im Großen Ballsaal.',
      accentColor: '#b45309',
      side: 'center',
      portraitUrl: '/src/assets/images/sprite_pendelton_neutral_1795080941377.jpg',
      portraits: {
        headshake: '/src/assets/images/sprite_pendelton_disappointed_1795091176237.jpg',
      },
    },
    falk: {
      id: 'falk',
      name: 'Victor von Falk',
      role: 'Staatsanwalt (Gegner)',
      bio: 'Aristokratischer Ankläger auf Kreuzfahrt. Kämpft heimlich gegen Seekrankheit, aber niemals gegen eine Chance, Nate zu schlagen.',
      accentColor: '#dc2626',
      side: 'right',
      portraitUrl: '/src/assets/images/sprite_falk_neutral_1795080942096.jpg',
      portraits: {
        shocked: '/src/assets/images/sprite_falk_shocked_1795080941650.jpg',
        facepalm: '/src/assets/images/sprite_falk_facepalm_1795091158455.jpg',
      },
    },
    marston: {
      id: 'marston',
      name: 'Detective Frank Marston',
      role: 'Ermittler im Urlaub',
      bio: 'Gutgelaunter Veteran im zerknitterten Trenchcoat mit Polizeimarke. Eigentlich auf Pauschalreise, hilft Nate aber heimlich mit Akten weiter.',
      accentColor: '#0284c7',
      side: 'right',
      portraitUrl: '/src/assets/images/sprite_marston_detective_1795080940855.jpg',
    },
    anya: {
      id: 'anya',
      name: 'Anya Brooks',
      role: 'Mandantin (Bord-Pianistin)',
      bio: 'Talentierte Bord-Pianistin der MS Aurora. Wurde kurz nach dem Diebstahl direkt vor dem VIP-Salon aufgegriffen.',
      accentColor: '#059669',
      side: 'right',
      portraitUrl: '/src/assets/images/sprite_anya_neutral_1795080941598.jpg',
    },
    arthur: {
      id: 'arthur',
      name: 'Arthur Morgan',
      role: 'Oberkellner (Hauptzeuge)',
      bio: 'Steifer Chefkellner der Ersten Klasse. Behauptet, Anya beim Verlassen des Salons auf frischer Tat ertappt zu haben.',
      accentColor: '#6366f1',
      side: 'right',
      portraitUrl: '/src/assets/images/sprite_arthur_neutral_1795080941600.jpg',
      portraits: {
        shocked: '/src/assets/images/sprite_arthur_shocked_1795080942364.jpg',
      },
    },
  },

  evidence: {
    anwaltsausweis: {
      id: 'anwaltsausweis',
      name: 'Anwaltsausweis',
      category: 'evidence',
      iconName: 'key',
      summary: 'Offizielle Verteidiger-Zulassung von Nate Sterling.',
      detail:
        'Ermächtigt Nate Sterling zur Akteneinsicht und zur Verteidigung von Anya Brooks vor dem außerordentlichen Schiffs-Tribunal.',
    },
    tatort_notiz: {
      id: 'tatort_notiz',
      name: 'Vorläufige Tatort-Notiz',
      category: 'evidence',
      iconName: 'file',
      summary: 'Diebstahl des Goldenen Chronometers · ca. 20:30 Uhr im VIP-Salon.',
      detail:
        'Gestohlenes Objekt: Goldener Schiffs-Chronometer. Laut Erstmeldung wurde die Vitrine um 20:30 Uhr zerschlagen. Hauptbelastungszeuge: Oberkellner Arthur Morgan.',
    },
    vitrine_glocke: {
      id: 'vitrine_glocke',
      name: 'Schiffsglocke & Vitrinen-Befund',
      category: 'evidence',
      iconName: 'trophy',
      summary: 'Scherben außen an der Glocke – Vitrinenschloss unversehrt!',
      detail:
        'Am Rand der schweren Messing-Schiffsglocke kleben Sicherheitsglas-Splitter. Gleichzeitig ist das Messingschloss der Vitrine unbeschädigt und regulär aufgeschlossen worden!',
      updatedByFlag: {
        flag: 'flag_arthur_abgewehrt',
        summary: 'Scherben & offenes Schloss – Arthur Morgan geriet dabei ins Schwitzen!',
        detail:
          'Am Rand der Messingglocke kleben Glassplitter, doch das Schloss wurde sauber aufgeschlossen. Als Nate Arthur Morgan damit konfrontierte, brach ihm der Schweiß aus.',
      },
    },
    weinglas_spur: {
      id: 'weinglas_spur',
      name: 'Umgestürztes Rotweinglas',
      category: 'evidence',
      iconName: 'wine',
      summary: 'Frisch verschütteter Rotwein – am Stiel klebt etwas Winziges.',
      detail:
        'Auf dem Mahagoni-Schreibtisch lag ein umgekipptes Rotweinglas über einem Brief. Direkt am Glasstiel klebt etwas Winziges – mit bloßem Auge lässt sich aber nicht erkennen, was es genau ist.',
      updatedByFlag: {
        flag: 'flag_weinglas_untersucht',
        name: 'Rotweinglas & Handschuh-Fussel',
        summary: 'Frisch verschütteter Rotwein mit weißer Kellner-Handschuhfaser.',
        detail:
          'Unter Mayas Lupe eindeutig identifiziert: Am Glasstiel klebt eine feine weiße Baumwollfaser – typisch für die weißen Servierhandschuhe der Ersten Klasse.',
      },
      inspectRules: [
        {
          hideIfFlag: 'flag_lupe_erhalten',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Mal ganz nah ran… da klebt tatsächlich ein winziges Partikel direkt am Glasstiel! Aber ohne Vergrößerung verschwimmt alles – ich kann nicht erkennen, was das genau ist.',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              setsFlag: 'flag_weinglas_lupe_noetig',
              text: 'Hmm… mit bloßem Auge ist das unmöglich zu erkennen! Vielleicht kann ich helfen, wenn wir kurz miteinander reden.',
            },
          ],
        },
        {
          requiredFlag: 'flag_lupe_erhalten',
          hideIfFlag: 'flag_weinglas_untersucht',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'So, jetzt halte ich Mayas Messing-Lupe mal direkt über den Glasstiel…',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              sfx: 'deduction',
              setsFlag: 'flag_weinglas_untersucht',
              text: 'Aha!! Unter der Linse sieht man es gestochen scharf: Das ist eine schneeweiße, fein gewebte Baumwollfaser – genau von den Servierhandschuhen der Ersten Klasse!',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              removesEvidence: 'mayas_lupe',
              text: 'Volltreffer! Her damit, ich steck meine Lupe gleich wieder ein – nicht dass du sie hier noch liegen lässt!',
            },
            {
              speakerId: 'nate',
              emotion: 'sweating',
              text: '(Wie in aller Welt passt in diese kleine Handtasche eigentlich ein halber Detektivkoffer…?) Jetzt hat Arthur Morgan jedenfalls keine Ausrede mehr!',
            },
          ],
        },
        {
          requiredFlag: 'flag_weinglas_untersucht',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Unter Mayas Lupe war es eindeutig zu erkennen: Eine schneeweiße Baumwollfaser von den Servierhandschuhen der Ersten Klasse klebt direkt am Stiel.',
            },
          ],
        },
      ],
    },
    mayas_lupe: {
      id: 'mayas_lupe',
      name: 'Mayas Detektiv-Lupe',
      category: 'evidence',
      iconName: 'search',
      summary: 'Messing-Vergrößerungsglas aus den unendlichen Tiefen von Mayas Handtasche.',
      detail:
        'Eine überraschend schwere Detektiv-Lupe mit echtem Messinggriff. Maya hat sie neben Schokoriegeln, Trillerpfeife und Ersatzsocken einfach aus ihrer kleinen Umhängetasche gezogen.',
      inspectRules: [
        {
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Eine echte Messing-Lupe mit geschliffener Glaslinse… Maya, warum genau hast du das auf einer Mittelmeer-Kreuzfahrt dabei?',
            },
            {
              speakerId: 'maya',
              emotion: 'smug',
              text: 'Man weiß nie, wann ein Verbrechen passiert! Jetzt wähle lieber das Rotweinglas in deiner Gerichtsakte aus und klick dort auf „Genauer untersuchen“!',
            },
          ],
        },
      ],
    },
    musik_alibi: {
      id: 'musik_alibi',
      name: 'Abendprogramm & Zeugen-Alibi',
      category: 'evidence',
      iconName: 'file',
      summary: 'Anya spielte bis 20:28 Uhr live im Musiksalon vor Passagieren.',
      detail:
        'Offizieller Programmzettel der MS Aurora nebst Anyas Notiz: Ihr Klavier-Set im Musiksalon am anderen Ende des Decks endete unter Applaus erst um 20:28 Uhr.',
    },
    balkon_fluchtweg: {
      id: 'balkon_fluchtweg',
      name: 'Balkon-Schloss & Service-Band',
      category: 'evidence',
      iconName: 'door',
      summary: 'Von innen entriegelt · führt über schmalen Steg zur Crew-Treppe.',
      detail:
        'Der Riegel der Balkontür wurde von innen gelöst. Am äußeren Geländer Richtung Personal-Treppe klemmt ein abgerissenes Stück dunkelblaues Crew-Servierband.',
    },
    keycard_log: {
      id: 'keycard_log',
      name: 'Schlüsselkarten-Log (VIP-Salon)',
      category: 'evidence',
      iconName: 'key',
      summary: '20:15 Uhr Crew-Mastercard #04 (Arthur) · 20:31 Uhr Anya Brooks.',
      detail:
        'Ausdruck aus dem elektronischen Türspeicher des VIP-Salons (von Detective Marston besorgt): Arthur Morgans Crew-Karte öffnete die Tür bereits um 20:15 Uhr – 15 Minuten vor Anya!',
    },
    chronometer_kabine_fund: {
      id: 'chronometer_kabine_fund',
      name: 'Kabinen-Fund: Goldener Chronometer',
      category: 'evidence',
      iconName: 'clock',
      summary: 'Am Morgen nach dem Freispruch unter Anyas Bett entdeckt (Kabine 312).',
      detail:
        'Sicherstellungs-Protokoll von Tag 2 (Morgen): Der verschwundene Goldene Schiffs-Chronometer tauchte um 09:35 Uhr plötzlich in Anyas Privatkabine auf – obwohl sie die ganze Nacht im Bord-Arrest saß!',
    },
    kabinen_tuch: {
      id: 'kabinen_tuch',
      name: 'Servier-Tuch aus Kabine 312',
      category: 'evidence',
      iconName: 'wine',
      summary: 'Erstklass-Leinen mit Goldsaum & Rotweinfleck – lag unter Anyas Bett.',
      detail:
        'Direkt unter dem Bett von Kabine 312 entdeckt: Ein feines Zimmerservice-Tuch der Ersten Klasse mit frischem Rotweinfleck an der Ecke. Darin war offenbar der Chronometer eingewickelt.',
    },
    kabine_312_log: {
      id: 'kabine_312_log',
      name: 'Tür-Log Kabine 312',
      category: 'evidence',
      iconName: 'key',
      summary: '08:42 Uhr: Crew-Mastercard #04 (Arthur Morgan) · 09:35 Uhr: Sicherheit.',
      detail:
        'Elektronisches Türprotokoll von Anyas Privatkabine (von Detective Marston ausgelesen): Arthur Morgans Crew-Mastercard #04 öffnete Kabine 312 um 08:42 Uhr – 18 Minuten vor Prozessbeginn – für exakt zwei Minuten.',
    },
    schuldschein_brief: {
      id: 'schuldschein_brief',
      name: 'Weingetränkte Zahlungsfrist („A. M.“)',
      category: 'evidence',
      iconName: 'receipt',
      summary: '45.000 € bis Kreta – teures Büttenpapier mit „Konto-Ref: KRETA-77“.',
      detail:
        'Lag unter dem umgekippten Rotweinglas auf dem Schreibtisch im VIP-Salon: „Letzte Frist: 45.000 Euro bis zum Einlaufen auf Kreta. Der Chronometer deckt den Rest – sonst erfahren alle von Ihren Geschäften.“ Keine Unterschrift, Adressat „A. M.“.',
    },
  },

  thoughts: {
    thought_vitrine_inszeniert: {
      id: 'thought_vitrine_inszeniert',
      title: 'Schloss heil trotz zerschlagener Scheibe',
      detail:
        'Warum zerschlägt man eine Vitrine mit der Schiffsglocke, wenn man zuvor das Schloss ganz regulär aufgeschlossen hat? Der Einbruch wirkt inszeniert!',
      kind: 'observation',
    },
    thought_anya_alibi: {
      id: 'thought_anya_alibi',
      title: 'Anya spielte bis 20:28 Uhr – Balkontür war noch zu',
      detail:
        'Anya war bis zwei Minuten vor dem Alarm vor Publikum am Klavier und sah um 20:30 Uhr noch einen Schatten durch den Salon huschen.',
      kind: 'observation',
    },
    thought_balkon_weg: {
      id: 'thought_balkon_weg',
      title: 'Balkontür von innen gelöst + Crew-Band',
      detail:
        'Über den Balkon gelangt man ungesehen direkt zur Personal-Treppe. Jemand aus der Crew hat diesen Fluchtweg benutzt.',
      kind: 'observation',
    },
    thought_keycard_log: {
      id: 'thought_keycard_log',
      title: 'Arthur Morgan öffnete Tür schon um 20:15 Uhr',
      detail:
        'Laut Keycard-Log betrat Arthur Morgan den Salon bereits eine Viertelstunde vor dem Alarm – obwohl er behauptete, erst um 20:30 Uhr gekommen zu sein.',
      kind: 'observation',
    },
    thought_zeit_manipuliert: {
      id: 'thought_zeit_manipuliert',
      title: 'Schlussfolgerung: Zeitfenster für Anya unmöglich!',
      detail:
        'Anya hatte zwischen 20:28 und 20:30 Uhr gar keine Zeit, die Vitrine aufzuschließen, sie nachträglich mit der Glocke zu zertrümmern und die Beute zu verstecken.',
      kind: 'deduction',
    },
    thought_flucht_und_luege: {
      id: 'thought_flucht_und_luege',
      title: 'Schlussfolgerung: Verborgener Crew-Zugang & Balkonflucht!',
      detail:
        'Jemand mit Crew-Karte war schon vor 20:30 Uhr im Salon und ist über die Balkontür verschwunden. Arthur Morgan verschweigt seinen eigenen Zutritt um 20:15 Uhr!',
      kind: 'deduction',
    },
    thought_kap3_tuch: {
      id: 'thought_kap3_tuch',
      title: 'Serviertuch mit Rotwein unter Anyas Bett',
      detail:
        'Unter dem Bett in Kabine 312 lag ein Erstklass-Serviertuch mit frischem Rotweinfleck – genau wie der verschüttete Wein im VIP-Salon!',
      kind: 'observation',
    },
    thought_kap3_kabinenlog: {
      id: 'thought_kap3_kabinenlog',
      title: 'Arthurs Keycard öffnete Kabine 312 um 08:42 Uhr',
      detail:
        '18 Minuten vor dem Morgen-Tribunal öffnete Arthur Morgan mit seiner Crew-Mastercard #04 für zwei Minuten Anyas Privatkabine.',
      kind: 'observation',
    },
    thought_kap3_brief: {
      id: 'thought_kap3_brief',
      title: 'Brief an „A. M.“: 45.000 € Frist bis Kreta',
      detail:
        'Auf dem Schreibtisch im VIP-Salon lag unter dem Rotwein eine dringende Forderung über 45.000 Euro bis zum Hafen Kreta. Papier und Konto-Code wirken jedoch merkwürdig…',
      kind: 'observation',
    },
    thought_kap3_arthur_panik: {
      id: 'thought_kap3_arthur_panik',
      title: 'Arthurs Ausbruch: Kennt den Brief angeblich nicht',
      detail:
        'Beim Vorlegen des 45.000-€-Briefs bestritt Arthur Morgan vehement, das Papier je gesehen zu haben – wirkte dabei aber völlig verängstigt und verstrickt.',
      kind: 'observation',
    },
    thought_kap3_trick_geloest: {
      id: 'thought_kap3_trick_geloest',
      title: 'Schlussfolgerung: Arthur legte die Uhr um 08:42 Uhr in 312!',
      detail:
        'Arthur Morgan deponierte den in ein Serviertuch gewickelten Chronometer um 08:42 Uhr unter Anyas Bett – als Absicherung noch vor Prozessbeginn.',
      kind: 'deduction',
    },
    thought_kap3_motiv_geloest: {
      id: 'thought_kap3_motiv_geloest',
      title: 'Schlussfolgerung: Arthur ist der Täter – aber das Motiv hakt!',
      detail:
        'Alles überführt Arthur Morgan als Dieb und Kabinen-Manipulator. Warum er beim 45.000-€-Brief von Zwang sprach, sollen Marstons Bankprüfungen nach der Verhandlung klären.',
      kind: 'deduction',
    },
  },

  logicCombinations: [
    {
      id: 'combo_1',
      thoughtA: 'thought_vitrine_inszeniert',
      thoughtB: 'thought_anya_alibi',
      resultThoughtId: 'thought_zeit_manipuliert',
      setsFlag: 'flag_zeit_geloest',
      feedbackLines: [
        {
          speakerId: 'nate',
          emotion: 'confident',
          sfx: 'deduction',
          text: 'Heureka! Schau dir die Minuten an, Maya: Anya beendet um 20:28 Uhr ihren Auftritt – und drinnen wurde die Vitrine erst regulär aufgeschlossen und dann als Show mit der Glocke zerschlagen!',
        },
        {
          speakerId: 'maya',
          emotion: 'confident',
          text: 'In weniger als zwei Minuten inklusive Rückweg durchs halbe Deck? Komplett ausgeschlossen, dass Anya das gewesen ist!',
        },
      ],
    },
    {
      id: 'combo_2',
      thoughtA: 'thought_balkon_weg',
      thoughtB: 'thought_keycard_log',
      resultThoughtId: 'thought_flucht_und_luege',
      setsFlag: 'flag_flucht_geloest',
      feedbackLines: [
        {
          speakerId: 'nate',
          emotion: 'confident',
          sfx: 'deduction',
          text: 'Alles greift ineinander! Arthur Morgan behauptete steif und fest, er sei erst um 20:30 Uhr hochgekommen – doch seine Keycard war schon um 20:15 Uhr hier!',
        },
        {
          speakerId: 'maya',
          emotion: 'confident',
          text: 'Und über die Balkontür gelangt man direkt zur Crew-Treppe – niemand musste durch den Haupteingang verschwinden!',
        },
      ],
    },
    {
      id: 'combo_3_kabinen_trick',
      thoughtA: 'thought_kap3_tuch',
      thoughtB: 'thought_kap3_kabinenlog',
      resultThoughtId: 'thought_kap3_trick_geloest',
      setsFlag: 'flag_kap3_trick_geloest',
      feedbackLines: [
        {
          speakerId: 'nate',
          emotion: 'confident',
          sfx: 'deduction',
          text: 'Da ist die ganze Wahrheit über Kabine 312! Arthur Morgan musste während der Verhandlung gar nicht dort sein – er hat die Uhr schon um 08:42 Uhr morgens in dem Serviertuch unter Anyas Bett geschoben!',
        },
        {
          speakerId: 'maya',
          emotion: 'confident',
          text: 'Genau! So stand er um neun Uhr scheinheilig im Zeugenstand, während die Falle in Anyas Kabine längst scharfgestellt war!',
        },
      ],
    },
    {
      id: 'combo_4_motiv_raetsel',
      thoughtA: 'thought_kap3_brief',
      thoughtB: 'thought_kap3_arthur_panik',
      resultThoughtId: 'thought_kap3_motiv_geloest',
      setsFlag: 'flag_kap3_motiv_geloest',
      feedbackLines: [
        {
          speakerId: 'nate',
          emotion: 'thinking',
          sfx: 'deduction',
          text: 'Also gut: Der 45.000-Euro-Brief an „A. M.“ verbindet Arthur Morgan direkt mit dem Diebstahl. Vor dem Tribunal morgen reicht das vollkommen, um ihn als Täter festzunageln!',
        },
        {
          speakerId: 'maya',
          emotion: 'thinking',
          text: 'Trotzdem… warum wirkte er so, als würde ihn irgendjemand zu dieser Sache zwingen? Irgendetwas stimmt an diesem Brief und seinen Finanzen nicht!',
        },
      ],
    },
  ],

  locations: {
    suite: {
      id: 'suite',
      name: 'VIP-Salon (Tatort)',
      subtitle: 'Akt 2 · Erste Spurensuche',
      backgroundUrl: '/src/assets/images/cruise_captain_suite_1795039845113.jpg',
      alternateBackground: {
        flag: 'flag_kap2_freispruch',
        backgroundUrl: '/src/assets/images/cruise_suite_day_clean_1795093696232.jpg',
      },
      charactersPresent: [
        { characterId: 'maya' },
        { characterId: 'arthur', hideIfFlag: 'flag_arthur_abgewehrt' },
      ],
      hotspots: [
        {
          id: 'suite_bell',
          label: 'Schiffsglocke & Vitrine',
          x: 71,
          y: 59,
          width: 17,
          height: 29,
          lines: [
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Huch? Warum liegt denn diese schwere Messing-Schiffsglocke („OCEANUS“) mitten auf dem Teppich neben dem zersplitterten Sockel?',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Schau dir den unteren Rand der Glocke mal bei Licht an, Maya… da stecken winzige, messerscharfe Splitter von Sicherheitsglas!',
            },
            {
              speakerId: 'maya',
              emotion: 'shocked',
              text: 'Moment mal – dann wurde die Vitrine mit der Schiffsglocke eingeschlagen! Aber… wieso liegt das Messingschloss der Vitrine hier völlig unversehrt und offen?!',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              sfx: 'deduction',
              setsFlag: 'flag_glocke_gefunden',
              unlocksEvidence: 'vitrine_glocke',
              unlocksThought: 'thought_vitrine_inszeniert',
              text: 'Genau das meine ich mit „Irgendwas stimmt hier nicht“! Wer erst sauber aufschließt und danach die Scheibe mit einer Glocke zertrümmert, will einen Einbruch nur vortäuschen!',
            },
          ],
        },
        {
          id: 'suite_desk',
          label: 'Schreibtisch & Rotweinglas',
          x: 7,
          y: 62,
          width: 40,
          height: 31,
          hideIfFlag: 'flag_kap2_freispruch',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Ein umgekipptes Weinglas mitten auf einem handgeschriebenen Brief. Der Rotwein ist noch glänzend und überhaupt nicht eingetrocknet.',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Sieh mal da unten am Glasstiel – hängt da nicht irgendetwas Winziges dran? So richtig erkennen kann man es aus der Entfernung aber nicht.',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              setsFlag: 'flag_wein_gefunden',
              unlocksEvidence: 'weinglas_spur',
              text: 'Stimmt, ich nehme das Glas erst mal in die Gerichtsakte auf. Schauen wir es uns dort gleich noch genauer an, bevor wir vorschnelle Schlüsse ziehen!',
            },
          ],
        },
        {
          id: 'suite_desk_letter',
          label: 'Rotweingetränkter Brief auf dem Schreibtisch',
          x: 7,
          y: 62,
          width: 40,
          height: 31,
          visibleIfFlag: 'flag_kap2_freispruch',
          lines: [
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Schau, Nate – jetzt bei Tageslicht sieht man sofort, dass jemand das umgekippte Rotweinglas inzwischen abgeräumt hat. Aber der weinbefleckte Brief klebt immer noch halb getrocknet hier auf dem Tisch!',
            },
            {
              speakerId: 'nate',
              emotion: 'shocked',
              text: 'Moment mal… jetzt, wo wir ihn vorsichtig entfalten, kann man die Tinte lesen! Hör dir das an: „Letzte Frist: 45.000 Euro bis zum Einlaufen auf Kreta. Der Chronometer deckt den Rest – sonst erfahren alle von Ihren Geschäften.“',
            },
            {
              speakerId: 'maya',
              emotion: 'shocked',
              text: '45.000 Euro?! Und unten steht als Empfänger „A. M.“ – also ARTHUR MORGAN?! Dann hätte er tatsächlich ein klares Diebstahl-Motiv!',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              sfx: 'deduction',
              setsFlag: 'flag_kap3_brief_gefunden',
              unlocksEvidence: 'schuldschein_brief',
              unlocksThought: 'thought_kap3_brief',
              text: 'Auf den ersten Blick ja… aber schau dir dieses teure Erste-Klasse-Büttenpapier und den Code „Konto-Ref: KRETA-77“ an. Warum sollte ein einfacher Oberkellner so ein Dokument auf dem Tisch haben? Konfrontieren wir Arthur draußen auf dem Promenadendeck!',
            },
          ],
        },
        {
          id: 'suite_thermostat',
          label: 'Digitales Wand-Panel (21°C)',
          x: 56,
          y: 34,
          width: 9,
          height: 15,
          lines: [
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Ein smartes Kabinen-Thermostat. Steht auf angenehmen 21 Grad… warte, unten blinkt ein kleines Log für die Präsenz-Automatik!',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: '„Präsenz erkannt: 20:15 Uhr.“ Hm – um 20:15 Uhr sollte der VIP-Salon vor dem großen Empfang doch angeblich noch komplett abgeschlossen gewesen sein…',
            },
          ],
        },
        {
          id: 'suite_balcony',
          label: 'Offene Balkontür',
          x: 12,
          y: 8,
          width: 38,
          height: 52,
          hideIfFlag: 'flag_balkon_spur_aktiv',
          lines: [
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Die Glastür zum Außenbalkon steht sperrangelweit offen. Puh, ganz schön frischer Seewind hier drin.',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Merkwürdig… Warum reißt jemand abends bei voller Fahrt die Balkontür auf? Aber ohne zu wissen, wie es hier um 20:30 Uhr aussah, tappen wir noch im Dunkeln.',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Lass uns erst im Bord-Arrest genau nachfragen, was Anya gesehen hat – vielleicht hat sie bemerkt, ob die Tür da schon offen war!',
            },
          ],
        },
        {
          id: 'suite_balcony_detail',
          label: 'Balkon-Schloss & Geländer',
          x: 12,
          y: 8,
          width: 38,
          height: 52,
          visibleIfFlag: 'flag_balkon_spur_aktiv',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Jetzt, wo wir wissen, dass die Tür um 20:30 Uhr noch geschlossen war… schauen wir uns den Riegel und das Außengeländer mal ganz genau an!',
            },
            {
              speakerId: 'maya',
              emotion: 'shocked',
              text: 'Guck mal, Nate! Der Messing-Riegel hat keine Kratzspuren von außen – er wurde eindeutig VON INNEN entriegelt!',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Und dort drüben am Ende des schmalen Stegs geht es direkt zur Personal-Treppe der Crew… warte! Was hängt da unten am Gitter?',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              sfx: 'deduction',
              setsFlag: 'flag_balkon_untersucht',
              unlocksEvidence: 'balkon_fluchtweg',
              unlocksThought: 'thought_balkon_weg',
              text: 'Ein abgerissenes Stück dunkelblaues Crew-Serviceband! Der echte Täter ist nicht durch die Haupttür an Anya vorbei, sondern genau hier über den Balkon entkommen!',
            },
          ],
        },
      ],
      talkTopics: [
        {
          id: 'suite_arthur_story',
          title: 'Was haben Sie um 20:30 Uhr genau gesehen?',
          speakerId: 'arthur',
          hideIfFlag: 'flag_arthur_abgewehrt',
          lines: [
            {
              speakerId: 'arthur',
              emotion: 'neutral',
              text: 'Mein Name ist Arthur Morgan, Chefkellner Erster Klasse. Und die Fakten sind so kristallklar wie unsere Kristallgläser, Sir.',
            },
            {
              speakerId: 'arthur',
              emotion: 'smug',
              text: 'Ich betrat Punkt 20:30 Uhr das obere Foyer, hörte lautes Klirren – und im nächsten Augenblick stürmte Miss Brooks aus dem VIP-Salon!',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Und Sie selbst waren vorher wirklich keinen einzigen Fußbreit in diesem Raum?',
            },
            {
              speakerId: 'arthur',
              emotion: 'neutral',
              text: 'Selbstverständlich nicht! Ich war bis 20:29 Uhr unten im Speisesaal beschäftigt. Niemand außer Miss Brooks konnte also die Vitrine eingeschlagen haben.',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: '(Flüstert) Nate… irgendwas stimmt an dieser glatten Geschichte überhaupt nicht! Schau dich per „Untersuchen“ im Raum um – wir brauchen Beweise gegen sein Märchen!',
            },
          ],
        },
        {
          id: 'suite_arthur_schloss',
          title: 'Wie erklären Sie das unbeschädigte Schloss?',
          speakerId: 'arthur',
          requiredFlag: 'flag_glocke_gefunden',
          hideIfFlag: 'flag_arthur_abgewehrt',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Mr. Morgan, Sie behaupten, die Pianistin hätte die Vitrine hektisch eingeschlagen. Warum ist das Schloss der Vitrine dann sauber aufgeschlossen?!',
            },
            {
              speakerId: 'arthur',
              emotion: 'sweating',
              text: 'N-nun… vielleicht hatte diese Person einen… einen Dietrich? Oder das Schloss war gar nicht richtig eingerastet! Ich rede hier nicht über Mutmaßungen!',
            },
            {
              speakerId: 'arthur',
              emotion: 'neutral',
              text: 'Wenn Sie mir tatsächlich Unregelmäßigkeiten unterstellen wollen, Mr. Verteidiger, dann PRÄSENTIEREN Sie mir bitte einen konkreten Beweis – statt nur zu reden!',
            },
          ],
        },
        {
          id: 'suite_maya_eindruck',
          title: 'Was ist dein erster Eindruck vom Tatort?',
          speakerId: 'maya',
          hideIfFlag: 'flag_balkon_untersucht',
          lines: [
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Also: Wir müssen beweisen, dass Anya zwischen 20:28 und 20:30 Uhr gar keine Zeit hatte, das hier alles zu veranstalten.',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Am besten untersuchen wir zuerst Schreibtisch und Glocke, konfrontieren Arthur damit – und holen uns im Bord-Arrest Anyas exakte Erinnerungen!',
            },
          ],
        },
        {
          id: 'suite_maya_keycard_hinweis',
          title: 'Wie beweisen wir, wer vorher drin war?',
          speakerId: 'maya',
          requiredFlag: 'flag_balkon_untersucht',
          hideIfFlag: 'flag_kap2_freispruch',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Fassen wir zusammen, Maya: Die Vitrine wurde aufgeschlossen, Anya kam erst um 20:30 Uhr, und über den Balkon führt ein Crew-Weg weg.',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Wenn jemand vor 20:30 Uhr hier drin war, muss die elektronische Tür des VIP-Salons das gespeichert haben! Nur… wo kriegen wir das Schlüsselkarten-Log her?',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Detective Frank Marston draußen auf dem Promenadendeck! Der tut zwar so, als wäre er nur Tourist, aber mit den richtigen Beweisen knacken wir seine Blockade!',
            },
          ],
        },
        {
          id: 'suite_maya_lupe_handtasche',
          title: 'Hast du zufällig eine Lupe für das Weinglas?',
          speakerId: 'maya',
          requiredFlag: 'flag_weinglas_lupe_noetig',
          hideIfFlag: 'flag_lupe_erhalten',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Sag mal, Maya – am Stiel von dem Rotweinglas klebt irgendetwas Winziges, aber mit bloßem Auge erkenne ich es einfach nicht. Eine Lupe hast du nicht zufällig… oder?',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              sfx: 'bag_rummage',
              text: 'Ha! Wart’s ab… Moment: Sonnencreme, ein halber Müsliriegel, zwei Kugelschreiber, eine Trillerpfeife, Ersatz-Haargummis…',
            },
            {
              speakerId: 'maya',
              emotion: 'smug',
              setsFlag: 'flag_lupe_erhalten',
              unlocksEvidence: 'mayas_lupe',
              text: '…und TADAA! Eine echte Messing-Detektivlupe mit 10-facher Vergrößerung!',
            },
            {
              speakerId: 'nate',
              emotion: 'shocked',
              text: 'Was?! Warum schleppst du auf einer Mittelmeer-Kreuzfahrt eine schwere Messing-Lupe in dieser winzigen Handtasche mit?!',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Berufskrankheit in der Kanzlei Sterling! Hier, schau dir damit jetzt einfach das Rotweinglas in deiner Gerichtsakte genauer an!',
            },
          ],
        },
        {
          id: 'suite_maya_brief_kap3',
          title: 'Was stimmt an diesem 45.000-€-Brief nicht?',
          speakerId: 'maya',
          requiredFlag: 'flag_kap3_brief_gefunden',
          lines: [
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Einerseits schreit „A. M.“ geradezu nach Arthur Morgan. Andererseits – wieso steht kein echter Gläubiger drauf, sondern nur „Konto-Ref: KRETA-77“?',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Genau das müssen wir herausfinden! Geh auf das Promenadendeck und PRÄSENTIER Arthur Morgan diesen Brief – mal sehen, wie sein Gesicht darauf reagiert!',
            },
          ],
        },
      ],
      presentRules: [
        {
          evidenceId: 'vitrine_glocke',
          targetCharacterId: 'arthur',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              shout: 'MOMENT MAL!',
              sfx: 'objection',
              text: 'Sehen Sie sich diese Schiffsglocke genau an, Mr. Morgan! Glassplitter kleben am Metall – aber das Vitrinenschloss selbst ist völlig unversehrt!',
            },
            {
              speakerId: 'arthur',
              emotion: 'shocked',
              shake: true,
              text: 'W-was?! Die Schiffsglocke?! Aber ich… ich hatte gar nicht bemerkt, dass das Schloss offen war!',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Die Scheibe wurde erst NACH dem Aufschließen zerschlagen, um einen schnellen Einbruch vorzutäuschen! Und da es dafür einen Schlüssel braucht…',
            },
            {
              speakerId: 'arthur',
              emotion: 'sweating',
              text: 'Unerhört! Wollen Sie etwa behaupten, ICH hätte die Balkontür geöffnet und das selbst inszeniert?! Ich bin ein tadelloser Chefkellner!',
            },
            {
              speakerId: 'maya',
              emotion: 'smug',
              text: 'Oho! Von der Balkontür hat Nate doch eben noch gar kein Wort gesagt, Mr. Morgan!',
            },
            {
              speakerId: 'arthur',
              emotion: 'shocked',
              setsFlag: 'flag_arthur_abgewehrt',
              text: 'Gah!! I-ich muss zurück zu meinen Gästen im Speisesaal! Wir sehen uns morgen früh vor dem Tribunal, Mr. Sterling!',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Volltreffer! Der ist ja geflüchtet wie geölt! Komm, lass uns Anya im Bord-Arrest diesen Tatort-Fund zeigen, dann fasst sie endlich Mut!',
            },
          ],
        },
        {
          evidenceId: 'weinglas_spur',
          targetCharacterId: 'arthur',
          hideIfFlag: 'flag_weinglas_untersucht',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Mr. Morgan! Auf dem Schreibtisch stand dieses frisch umgekippte Rotweinglas – was sagen Sie dazu?',
            },
            {
              speakerId: 'arthur',
              emotion: 'smug',
              text: 'Ein verschüttetes Rotweinglas in einem VIP-Salon, Mr. Sterling? Bitte… hier bewirten wir den ganzen Abend Gäste der Ersten Klasse! Das Glas kann von jedem x-beliebigen Passagier stammen!',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              setsFlag: 'flag_weinglas_lupe_noetig',
              text: '(Flüstert) Mist, so einfach redet er sich raus… Solange wir nicht erkennen, was da Winziges am Stiel klebt, reicht das Glas noch nicht gegen ihn.',
            },
          ],
        },
        {
          evidenceId: 'weinglas_spur',
          targetCharacterId: 'arthur',
          requiredFlag: 'flag_weinglas_untersucht',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              shout: 'MOMENT MAL!',
              sfx: 'objection',
              text: '„Jeder x-beliebige Gast“?! Am Stiel dieses frisch umgekippten Glases klebt eine schneeweiße Baumwollfaser – von den Servierhandschuhen des Erste-Klasse-Personals!',
            },
            {
              speakerId: 'arthur',
              emotion: 'shocked',
              shake: true,
              text: 'Uff… wa–was?! Eine Faser?! Das… das Glas muss schon vom Nachmittags-Check gestanden haben! Und außerdem hatte ich die Balkontür die ganze Zeit gar nicht im Blick!',
            },
            {
              speakerId: 'maya',
              emotion: 'smug',
              text: 'Seltsam nervös für einen bloßen Zeugen, finden Sie nicht? Und wieso erwähnen Sie von sich aus sofort die Balkontür?',
            },
            {
              speakerId: 'arthur',
              emotion: 'sweating',
              setsFlag: 'flag_arthur_abgewehrt',
              text: 'Genug der dreisten Unterstellungen! Meine Pflicht ruft im Speisesaal. Überzeugen Sie morgen ruhig Judge Pendelton, wenn Sie können!',
            },
          ],
        },
        {
          evidenceId: 'balkon_fluchtweg',
          targetCharacterId: 'maya',
          lines: [
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Dieses Service-Band vom Balkon beweist den zweiten Ausgang! Jetzt fehlt uns nur noch das Tür-Log von Detective Marston auf dem Promenadendeck!',
            },
          ],
        },
      ],
      fallbackPresentLines: [
        {
          speakerId: 'maya',
          emotion: 'neutral',
          text: 'Hm, damit lässt sich hier im Salon gerade noch nichts Neues auslösen. Schau mal, wen wir damit wirklich unter Druck setzen können!',
        },
      ],
    },

    brig: {
      id: 'brig',
      name: 'Bord-Arrest · Sicherheitskabine',
      subtitle: 'Akt 2 · Mandantin Anya Brooks',
      backgroundUrl: '/src/assets/images/cruise_brig_room_1795039845360.jpg',
      charactersPresent: [
        { characterId: 'maya' },
        { characterId: 'anya' },
      ],
      hotspots: [
        {
          id: 'brig_table',
          label: 'Tisch & Notizblock',
          x: 60,
          y: 52,
          width: 34,
          height: 34,
          lines: [
            {
              speakerId: 'nate',
              emotion: 'neutral',
              text: 'Ein kleiner Metalltisch mit einem leeren Notizblock. Anya hat hier sogar noch ihr zusammengefaltetes Abendprogramm abgelegt.',
            },
            {
              speakerId: 'anya',
              emotion: 'sweating',
              text: 'Ich wollte direkt nach dem Auftritt einfach nur schnell meine Partitur aus dem VIP-Salon holen… ich schwöre es!',
            },
          ],
        },
        {
          id: 'brig_porthole',
          label: 'Bullauge zur Nachtsee',
          x: 33,
          y: 23,
          width: 17,
          height: 27,
          lines: [
            {
              speakerId: 'maya',
              emotion: 'neutral',
              text: 'Stockdunkles Mittelmeer bis zum Horizont. Auf einem Schiff kann wirklich niemand verschwinden – jeder Verdächtige ist genau hier an Bord!',
            },
          ],
        },
      ],
      talkTopics: [
        {
          id: 'anya_was_geschah',
          title: 'Erzähl uns alles über 20:30 Uhr',
          speakerId: 'anya',
          lines: [
            {
              speakerId: 'anya',
              emotion: 'sweating',
              text: 'Ich hatte bis kurz vor halb neun mein Abendkonzert unten im Musiksalon. Dutzende Gäste haben mir noch beim Verbeugen zugesehen!',
            },
            {
              speakerId: 'anya',
              emotion: 'neutral',
              text: 'Danach fiel mir ein, dass meine Lieblings-Notenmappe noch auf dem Beistelltisch im VIP-Salon lag. Ich bin schnell die Treppe hochgelaufen…',
            },
            {
              speakerId: 'anya',
              emotion: 'shocked',
              text: 'Als ich die Tür öffnete, hörte ich ein Klirren, stolperte fast über Scherben – und genau in der Sekunde riss Arthur Morgan draußen die Tür auf und brüllte los!',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Hast du denn sonst irgendetwas im VIP-Salon bemerkt? Jeder kleinste Eindruck zählt, Anya!',
            },
            {
              speakerId: 'anya',
              emotion: 'sweating',
              text: 'Es ging alles so furchtbar schnell… und ehrlich gesagt glaubt mir gegen einen so feinen Oberkellner doch sowieso niemand ohne handfesten Beweis!',
            },
          ],
        },
        {
          id: 'anya_warum_salon',
          title: 'Warum lag deine Notenmappe überhaupt dort?',
          speakerId: 'anya',
          lines: [
            {
              speakerId: 'anya',
              emotion: 'thinking',
              text: 'Am späten Nachmittag sollte ich dort kurz beim Soundcheck helfen. Doch kurz nach 19:30 Uhr schickte mich Mr. Morgan plötzlich ganz hektisch hinaus.',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Moment – Arthur Morgan selbst hat dich vor dem Empfang aus dem VIP-Salon geschickt?!',
            },
            {
              speakerId: 'anya',
              emotion: 'sweating',
              text: 'Ja! Er sagte recht schroff: „Das Personal bereitet hier gleich etwas Exklusives vor, Fräulein Brooks!“ Deshalb vergaß ich in der Eile meine Mappe.',
            },
          ],
        },
        {
          id: 'anya_reaktion_tatort',
          title: 'Wir haben Beweise vom Tatort mitgebracht!',
          speakerId: 'anya',
          requiredFlag: 'flag_glocke_gefunden',
          hideIfFlag: 'flag_balkon_spur_aktiv',
          lines: [
            {
              speakerId: 'anya',
              emotion: 'shocked',
              text: 'Wirklich?! Ihr habt im VIP-Salon etwas gefunden, das zeigt, dass ich die Vitrine nicht einfach eingeschlagen habe?!',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Ja! Zeig mir kurz, was wir gleich vorlegen – dann gehen wir jede Sekunde nochmal durch!',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Zeig ihr einfach eins unserer Fundstücke vom Tatort, Nate!',
            },
          ],
        },
        {
          id: 'anya_balkon_erinnerung',
          title: 'Was genau geschah an der Balkontür?',
          speakerId: 'anya',
          requiredFlag: 'flag_balkon_spur_aktiv',
          hideIfFlag: 'flag_kap2_freispruch',
          lines: [
            {
              speakerId: 'anya',
              emotion: 'thinking',
              text: 'Jetzt erinnere ich mich wieder ganz klar! Als ich den Salon um 20:30 Uhr betrat, war die Balkontür zuerst noch ZU – und ein dunkler Schatten zog den Vorhang beiseite!',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Das bedeutet, der echte Dieb hat die Balkontür von innen genau dann aufgemacht, als du vorn eingetreten bist! Schauen wir uns den Balkon im Salon sofort nochmal genauer an!',
            },
          ],
        },
        {
          id: 'brig_maya_lupe_handtasche',
          title: 'Hast du zufällig eine Lupe für das Weinglas?',
          speakerId: 'maya',
          requiredFlag: 'flag_weinglas_lupe_noetig',
          hideIfFlag: 'flag_lupe_erhalten',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Sag mal, Maya – am Stiel von dem Rotweinglas klebt irgendetwas Winziges, aber ohne Vergrößerung erkenne ich es nicht. Hast du zufällig eine Lupe dabei?',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              sfx: 'bag_rummage',
              text: 'Wart’s ab… Sonnencreme, ein halber Müsliriegel, zwei Kulis, eine Notfall-Trillerpfeife, ein Mini-Nähset…',
            },
            {
              speakerId: 'maya',
              emotion: 'smug',
              setsFlag: 'flag_lupe_erhalten',
              unlocksEvidence: 'mayas_lupe',
              text: '…und TADAA! Eine echte Messing-Detektivlupe mit 10-facher Vergrößerung!',
            },
            {
              speakerId: 'nate',
              emotion: 'shocked',
              text: 'Ernsthaft?! Wo kommt dieses halbe Detektiv-Büro in dieser winzigen Handtasche bloß her?!',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Geheimnis der Damenwelt! Jetzt kannst du dir das Rotweinglas in deiner Gerichtsakte aus der Nähe ansehen!',
            },
          ],
        },
        {
          id: 'anya_kap3_kabine312',
          title: 'Hat gestern jemand nach deiner Kabine 312 gefragt?',
          speakerId: 'anya',
          requiredFlag: 'flag_kap2_freispruch',
          lines: [
            {
              speakerId: 'anya',
              emotion: 'thinking',
              text: 'Jetzt, wo Sie fragen… kurz vor meinem Abendkonzert, so gegen 19:40 Uhr, sprach mich Arthur Morgan auf dem Gang an!',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Arthur Morgan?! Was wollte er denn von dir vor dem Auftritt?',
            },
            {
              speakerId: 'anya',
              emotion: 'sweating',
              setsFlag: 'flag_kap3_anya_gesprochen',
              text: 'Er fragte scheinheilig, ob ich noch in Kabine 312 wohne – angeblich für frisches Eiswasser. Und dabei blitzte aus seiner Brusttasche ein cremefarbener Brief mit rotem Siegel hervor!',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Ein cremefarbener Brief?! Nate, hast du das gehört?! Vielleicht liegt genau dieses Papier noch im VIP-Salon unter dem Weinglas!',
            },
          ],
        },
      ],
      presentRules: [
        {
          evidenceId: 'vitrine_glocke',
          targetCharacterId: 'anya',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Schau dir das an, Anya: Die Vitrine war längst sauber aufgeschlossen – erst danach hat jemand die Schiffsglocke genommen und auf die Scheibe geschlagen!',
            },
            {
              speakerId: 'anya',
              emotion: 'shocked',
              text: 'Aufgeschlossen?! Aber dann… dann wollte jemand bloß, dass es für jeden wie ein blinder Überfall aussieht, sobald ich zur Tür reinkomme!',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Genau! Du bist keine Diebin, Anya – du wurdest als perfekter Sündenbock abgepasst. Aber dazu brauchen wir dein komplettes Alibi!',
            },
            {
              speakerId: 'anya',
              emotion: 'neutral',
              unlocksEvidence: 'musik_alibi',
              unlocksThought: 'thought_anya_alibi',
              setsFlag: 'flag_balkon_spur_aktiv',
              text: 'Hier – mein offizielles Abendprogramm vom Musiksalon! Ich spielte bis exakt 20:28 Uhr vor vollem Publikum! Und noch etwas Wichtiges…',
            },
            {
              speakerId: 'anya',
              emotion: 'shocked',
              text: 'Als ich um 20:30 Uhr durch die Tür trat, war die Balkontür noch ZU – aber ich hörte direkt neben dem Vorhang ein metallisches Klicken und sah einen Schatten!',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Ein metallisches Klicken am Balkon?! Maya, zurück in den VIP-Salon – jetzt wissen wir endlich, wonach wir an der Balkontür suchen müssen!',
            },
          ],
        },
        {
          evidenceId: 'weinglas_spur',
          targetCharacterId: 'anya',
          hideIfFlag: 'flag_weinglas_untersucht',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Schau mal, Anya – dieses umgekippte Rotweinglas stand auf dem Schreibtisch im VIP-Salon.',
            },
            {
              speakerId: 'anya',
              emotion: 'sweating',
              text: 'Hm… tut mir leid, Mr. Sterling, so wirkt das erst mal wie ein normales Gästeglas. Obwohl… glänzt da direkt am Stiel nicht etwas Winziges? Mit bloßem Auge erkenne ich es leider nicht.',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              setsFlag: 'flag_weinglas_lupe_noetig',
              text: 'Stimmt, solange wir nicht wissen, was da am Stiel klebt, reicht uns das Glas noch nicht als Beweis!',
            },
          ],
        },
        {
          evidenceId: 'weinglas_spur',
          targetCharacterId: 'anya',
          requiredFlag: 'flag_weinglas_untersucht',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Schau mal, Anya – auf dem Schreibtisch im Salon lag ein frisch umgekipptes Rotweinglas mit einem Fussel von weißen Kellnerhandschuhen!',
            },
            {
              speakerId: 'anya',
              emotion: 'shocked',
              text: 'Kellnerhandschuhe?! Aber dann war gar kein normaler Passagier vorher in dem Raum… ich habe wirklich gedacht, ich bilde mir alles ein!',
            },
            {
              speakerId: 'anya',
              emotion: 'neutral',
              unlocksEvidence: 'musik_alibi',
              unlocksThought: 'thought_anya_alibi',
              setsFlag: 'flag_balkon_spur_aktiv',
              text: 'Hier ist mein Programmzettel – bis 20:28 Uhr habe ich im Musiksalon vor Gästen gespielt! Und als ich um 20:30 Uhr in den VIP-Salon kam, war die Balkontür noch zu – ich hörte dort ein Klicken!',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Danke, Anya! Das verändert alles! Maya, zurück in den VIP-Salon – wir prüfen jetzt sofort die Balkontür!',
            },
          ],
        },
        {
          evidenceId: 'kabinen_tuch',
          targetCharacterId: 'anya',
          lines: [
            {
              speakerId: 'anya',
              emotion: 'shocked',
              text: 'Ein Erste-Klasse-Serviertuch unter meinem Bett?! Nein, ich habe überhaupt keinen Zimmerservice bestellt – ich saß doch die ganze Nacht hier im Arrest!',
            },
          ],
        },
        {
          evidenceId: 'kabine_312_log',
          targetCharacterId: 'anya',
          lines: [
            {
              speakerId: 'anya',
              emotion: 'confident',
              text: 'Um 08:42 Uhr war Arthur Morgan in meiner Kabine?! Mr. Sterling, das beweist doch, dass er die Uhr noch vor der Verhandlung dort versteckt hat!',
            },
          ],
        },
        {
          evidenceId: 'schuldschein_brief',
          targetCharacterId: 'anya',
          lines: [
            {
              speakerId: 'anya',
              emotion: 'shocked',
              text: 'Genau so ein cremefarbenes Papier ragte gestern Abend aus Mr. Morgans Jacketttasche, als er mich nach Kabine 312 fragte!',
            },
          ],
        },
      ],
      fallbackPresentLines: [
        {
          speakerId: 'anya',
          emotion: 'sweating',
          text: 'D-das erkenne ich leider nicht wieder, Mr. Sterling… gibt es in Kabine 312 oder im Salon noch etwas Handfesteres?',
        },
      ],
    },

    deck: {
      id: 'deck',
      name: 'MS Aurora · Promenadendeck',
      subtitle: 'Frische Seeluft & scharfe Konfrontationen',
      backgroundUrl: '/src/assets/images/cruise_deck_promenade_1795039844574.jpg',
      charactersPresent: [
        { characterId: 'maya' },
        { characterId: 'marston', hideIfFlag: 'flag_kap2_freispruch' },
        {
          characterId: 'arthur',
          visibleIfFlag: 'flag_kap2_freispruch',
          hideIfFlag: 'flag_kap3_arthur_abgetreten',
        },
      ],
      hotspots: [
        {
          id: 'deck_railing',
          label: 'Reling & Ozeanblick',
          x: 58,
          y: 44,
          width: 34,
          height: 36,
          lines: [
            {
              speakerId: 'nate',
              emotion: 'neutral',
              text: 'Eigentlich wollten Maya und ich hier den Sonnenuntergang genießen… naja, sobald Anya frei ist, holen wir das hoffentlich nach!',
            },
          ],
        },
      ],
      talkTopics: [
        {
          id: 'marston_urlaub',
          title: 'Frank, wir brauchen das elektronische Tür-Log!',
          speakerId: 'marston',
          hideIfFlag: 'flag_marston_ueberzeugt',
          lines: [
            {
              speakerId: 'marston',
              emotion: 'sweating',
              text: 'Whoa, langsam, Nate! Ich hab mir schon den Ausweis-Vermerk aus den Rippen geleiert – wenn ich jetzt ohne triftigen Grund im Sicherheits-Computer schnüffle, streicht mir der Kapitän das Frühstücksbuffet!',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Aber es steht fest, dass Anya reingelegt wurde! Die Tür-Daten müssen zeigen, wer vorher drin war!',
            },
            {
              speakerId: 'marston',
              emotion: 'neutral',
              text: 'Zeig mir erst mal einen handfesten Beweis aus deiner Ermittlung – Alibi, Fluchtweg, irgendwas! PRÄSENTIER mir was Echtes, dann schauen wir weiter.',
            },
          ],
        },
        {
          id: 'marston_tuerlog_details',
          title: 'Wie läuft das Schiffs-Tribunal morgen früh ab?',
          speakerId: 'marston',
          requiredFlag: 'flag_marston_ueberzeugt',
          hideIfFlag: 'flag_kap2_freispruch',
          lines: [
            {
              speakerId: 'marston',
              emotion: 'confident',
              text: 'Morgen um Punkt neun Uhr sitzt Judge Pendelton im Großen Ballsaal. Victor von Falk wird alles auf Arthur Morgans Aussage stützen.',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Vergiss nicht, Nate: Sobald wir alle Beobachtungen im „Notizbuch“ oben im Menü kombiniert haben, schließen wir heute Abend ab!',
            },
          ],
        },
        {
          id: 'deck_arthur_spott',
          title: 'Wie war Ihr Morgen vor dem Fund in Kabine 312?',
          speakerId: 'arthur',
          requiredFlag: 'flag_kap2_freispruch',
          hideIfFlag: 'flag_kap3_arthur_gestand',
          lines: [
            {
              speakerId: 'arthur',
              emotion: 'smug',
              text: 'Ah, Mr. Sterling! Ein herrlicher Abend auf dem Deck, nicht wahr? Bedauerlich natürlich, dass man die Beute nun direkt unter dem Bett Ihrer Mandantin gefunden hat…',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Sie standen beim Tribunal doch die ganze Zeit vor unseren Augen im Ballsaal, Mr. Morgan. Wo waren Sie eigentlich direkt davor – so gegen dreiviertel neun?',
            },
            {
              speakerId: 'arthur',
              emotion: 'neutral',
              text: 'Im Speisesaal beim Morgenservice selbstverständlich! Ich bin zwischen acht und neun Uhr kein einziges Mal auf einem Passagier-Deck gewesen. Und ein Motiv für Diebstahl hätte ein angesehener Oberkellner wie ich ohnehin nicht!',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: '(Flüstert) Oh, wie der grinst! Wenn wir ihm erst mal seinen Besuch in Kabine 312 oder ein Motiv unter die Nase reiben können, vergeht ihm das Lachen!',
            },
          ],
        },
        {
          id: 'deck_arthur_nach_konfrontation',
          title: 'Wollen Sie endlich sagen, was hier wirklich läuft?',
          speakerId: 'arthur',
          requiredFlag: 'flag_kap3_arthur_gestand',
          hideIfFlag: 'flag_kap3_arthur_abgetreten',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Hören Sie, Morgan – wenn Sie jemand anderes in diese Sache hineingezogen hat, können wir nur helfen, wenn Sie jetzt reden!',
            },
            {
              speakerId: 'arthur',
              emotion: 'sweating',
              setsFlag: 'flag_kap3_arthur_abgetreten',
              text: 'Ich… ich habe diesem Gespräch nichts mehr hinzuzufügen, Mr. Sterling! Es ist bereits spät – ich muss mich jetzt um die Gäste im Speisesaal kümmern. Guten Abend!',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Schon ist er verschwunden… Der hat regelrecht die Flucht ergriffen, sobald es unangenehm wurde!',
            },
          ],
        },
        {
          id: 'deck_maya_lupe_handtasche',
          title: 'Hast du zufällig eine Lupe für das Weinglas?',
          speakerId: 'maya',
          requiredFlag: 'flag_weinglas_lupe_noetig',
          hideIfFlag: 'flag_lupe_erhalten',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Maya, am Stiel des Rotweinglases klebt etwas Winziges – ohne Vergrößerung komme ich einfach nicht weiter. Hast du zufällig eine Lupe dabei?',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              sfx: 'bag_rummage',
              text: 'Haha, unterschätze niemals meine Handtasche! … Taschentücher, Reise-Monopoly, Ersatz-Haarklammer, halber Apfel…',
            },
            {
              speakerId: 'maya',
              emotion: 'smug',
              setsFlag: 'flag_lupe_erhalten',
              unlocksEvidence: 'mayas_lupe',
              text: '…und TADAA! Meine treue Messing-Detektivlupe!',
            },
            {
              speakerId: 'nate',
              emotion: 'shocked',
              text: 'Ein ganzes Reise-Monopoly UND eine schwere Messing-Lupe?! Ist diese Tasche innen größer als außen?!',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Streng geheim! Damit lässt sich das Rotweinglas in deiner Akte jetzt aus der Nähe untersuchen.',
            },
          ],
        },
        {
          id: 'deck_maya_kabine_tipp',
          title: 'Wo sollten wir heute Abend als Nächstes ansetzen?',
          speakerId: 'maya',
          requiredFlag: 'flag_kap2_freispruch',
          lines: [
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Frank Marston bewacht gerade Anyas Kabine 312 – über „Reisen“ kommen wir direkt dorthin! Dort finden wir bestimmt heraus, wie die Uhr unter das Bett kam.',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Und vergiss nicht den VIP-Salon! Vielleicht liegt auf dem Schreibtisch ja immer noch dieser weinbefleckte Brief, den wir gestern nur halb beachtet haben.',
            },
          ],
        },
      ],
      presentRules: [
        {
          evidenceId: 'balkon_fluchtweg',
          targetCharacterId: 'marston',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              shout: 'MOMENT MAL!',
              sfx: 'objection',
              text: 'Sieh dir dieses Crew-Serviceband von außen am VIP-Balkon an, Frank! Die Tür wurde um 20:30 Uhr von innen entriegelt und führt direkt zur Personal-Treppe!',
            },
            {
              speakerId: 'marston',
              emotion: 'shocked',
              text: 'Moment… ein abgerissenes Serviceband am Balkongeländer?! Das erklärt, wie jemand verschwinden konnte, als Anya vorne durch die Tür kam!',
            },
            {
              speakerId: 'marston',
              emotion: 'confident',
              setsFlag: 'flag_marston_ueberzeugt',
              unlocksEvidence: 'keycard_log',
              unlocksThought: 'thought_keycard_log',
              text: 'Verdammt, Nate, du lässt einem einfach keinen Urlaub! Hier – ich hab den Türspeicher längst abfotografiert: Crew-Mastercard #04 von Arthur Morgan um 20:15 Uhr!',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: '20:15 Uhr?! Dann hat Arthur Morgan über seine eigene Anwesenheit im VIP-Salon eiskalt gelogen!',
            },
          ],
        },
        {
          evidenceId: 'musik_alibi',
          targetCharacterId: 'marston',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Hier, Frank: Anyas offizielles Abendprogramm! Sie stand bis exakt 20:28 Uhr unter den Augen von Dutzenden Zeugen auf der Bühne im Musiksalon!',
            },
            {
              speakerId: 'marston',
              emotion: 'shocked',
              text: 'Bis 20:28 Uhr?! Dann hätte sie unmöglich in zwei Minuten hochrennen, die Vitrine aufschließen, alles zerschlagen und den Chronometer verschwinden lassen können!',
            },
            {
              speakerId: 'marston',
              emotion: 'confident',
              setsFlag: 'flag_marston_ueberzeugt',
              unlocksEvidence: 'keycard_log',
              unlocksThought: 'thought_keycard_log',
              text: 'Okay, du hast mich überzeugt! Hier ist das geheime Schlüsselkarten-Log des Salons: Arthur Morgans Karte öffnete die Tür bereits um 20:15 Uhr!',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Stark, Nate! Bis 20:28 Uhr am Klavier, während Arthur schon um 20:15 Uhr im Salon war – langsam fügt sich alles zusammen!',
            },
          ],
        },
        {
          evidenceId: 'vitrine_glocke',
          targetCharacterId: 'marston',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Schau her, Frank: Glassplitter an der Schiffsglocke, aber das Schloss der Vitrine ist völlig unversehrt und aufgeschlossen! Das war inszeniert!',
            },
            {
              speakerId: 'marston',
              emotion: 'shocked',
              text: 'Aufgeschlossen UND zerschlagen?! Na schön, du alter Spürhund – da steckt jemand drin, der Zugang hatte!',
            },
            {
              speakerId: 'marston',
              emotion: 'confident',
              setsFlag: 'flag_marston_ueberzeugt',
              unlocksEvidence: 'keycard_log',
              unlocksThought: 'thought_keycard_log',
              text: 'Hier unter uns das elektronische Tür-Log: Arthur Morgans Crew-Karte hat den VIP-Salon schon um 20:15 Uhr geöffnet!',
            },
          ],
        },
        {
          evidenceId: 'kabine_312_log',
          targetCharacterId: 'arthur',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              shout: 'EINSPRUCH!',
              sfx: 'objection',
              shake: true,
              text: 'Zwischen acht und neun Uhr auf keinem Passagierdeck?! Und was tat Ihre Crew-Mastercard #04 dann um 08:42 Uhr genau zwei Minuten lang in Anyas Kabine 312?!',
            },
            {
              speakerId: 'arthur',
              emotion: 'shocked',
              shake: true,
              text: 'Gah!! D-das Kabinen-Log?! I-ich… ich habe dort lediglich überprüft, ob ein frisches Serviertuch gebracht werden muss! Ein bloßer Türkontakt beweist weder Diebstahl noch irgendein Motiv, Sir!',
            },
            {
              speakerId: 'maya',
              emotion: 'smug',
              setsFlag: 'flag_kap3_arthur_log_gezeigt',
              text: 'Aha! Mit so einer billigen Ausrede kommen Sie uns auf Dauer nicht davon, Mr. Morgan!',
            },
          ],
        },
        {
          evidenceId: 'kabinen_tuch',
          targetCharacterId: 'arthur',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              shout: 'MOMENT MAL!',
              sfx: 'objection',
              text: 'Erkennen Sie dieses Erste-Klasse-Serviertuch mit dem Rotweinfleck wieder, Mr. Morgan? Es lag genau dort unter Anyas Bett, wo der Chronometer gefunden wurde!',
            },
            {
              speakerId: 'arthur',
              emotion: 'sweating',
              text: 'Pah! Hunderte von Tüchern laufen jeden Tag durch die Wäscherei. Ohne zu beweisen, dass ICH zu der Zeit in Kabine 312 war – oder warum ich eine Uhr stehlen sollte – ist das reiner Rauch!',
            },
          ],
        },
        {
          evidenceId: 'schuldschein_brief',
          targetCharacterId: 'arthur',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              shout: 'MOMENT MAL!',
              sfx: 'objection',
              shake: true,
              text: 'Kein Motiv, Mr. Morgan?! Dann erklären Sie mir bitte diese weinbefleckte Zahlungsfrist aus dem VIP-Salon: 45.000 Euro bis zum Einlaufen auf Kreta – adressiert an „A. M.“!',
            },
            {
              speakerId: 'arthur',
              emotion: 'shocked',
              shake: true,
              text: 'W-was?! 45.000 Euro?! Nein… diese Notiz habe ich in meinem ganzen Leben noch nicht gesehen! Woher soll die überhaupt stammen?!',
            },
            {
              speakerId: 'arthur',
              emotion: 'sweating',
              setsFlag: 'flag_kap3_arthur_gestand',
              unlocksThought: 'thought_kap3_arthur_panik',
              text: 'Ich schulde niemandem auch nur einen Penny – das schwöre ich! Aber… fragen Sie mich bloß nichts weiter. Sie ahnen ja nicht, was hier an Bord vor sich geht!',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Moment mal, Nate… hast du diesen Blick gesehen? Er wirkt, als kenne er den Brief tatsächlich nicht – und trotzdem zittert er am ganzen Leib!',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Seltsam… Vor Gericht liefert uns das Schreiben an „A. M.“ trotzdem einen schweren Verdachtsmoment gegen ihn.',
            },
          ],
        },
      ],
      fallbackPresentLines: [
        {
          speakerId: 'maya',
          emotion: 'neutral',
          text: 'Hm, damit lässt sich hier auf dem Deck gerade niemand aus der Reserve locken.',
        },
      ],
    },

    cabin_312: {
      id: 'cabin_312',
      name: 'Anyas Kabine 312',
      subtitle: 'Kapitel 3 · Fundort des Chronometers',
      backgroundUrl: '/src/assets/images/cruise_cabin_312_1795088168314.jpg',
      charactersPresent: [
        { characterId: 'maya' },
        { characterId: 'marston' },
      ],
      hotspots: [
        {
          id: 'cabin_bed_cloth',
          label: 'Bettkante & weißes Serviertuch',
          x: 27,
          y: 66,
          width: 41,
          height: 27,
          lines: [
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: 'Hier unter diesem Bett soll der Goldene Chronometer gelegen haben? Schau mal, Nate – direkt neben den Kratzern auf dem Teppich liegt ein fein gefaltetes weißes Tuch!',
            },
            {
              speakerId: 'nate',
              emotion: 'shocked',
              text: 'Moment mal… das ist kein normales Gästehandtuch! Goldsaum mit „MS Aurora First Class“-Monogramm – das ist ein Serviertuch der Ersten Klasse! Und an der Ecke klebt ein frischer Rotweinfleck!',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              sfx: 'deduction',
              setsFlag: 'flag_kap3_tuch_gefunden',
              unlocksEvidence: 'kabinen_tuch',
              unlocksThought: 'thought_kap3_tuch',
              text: 'Ein Serviertuch mit Rotwein?! Genau darin muss der Täter den Chronometer unter das Bett geschoben haben!',
            },
          ],
        },
        {
          id: 'cabin_door_lock',
          label: 'Elektronischer Keycard-Leser (312)',
          x: 25,
          y: 34,
          width: 7,
          height: 16,
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              setsFlag: 'flag_kap3_tuerleser_geprueft',
              text: 'Auch Kabine 312 hat einen digitalen Kartenspeicher mit grüner Kontroll-LED. Wenn heute Morgen jemand hier drin war, steht es sekundengenau im System – wir brauchen Marstons Hilfe!',
            },
          ],
        },
        {
          id: 'cabin_vanity_music',
          label: 'Schminktisch & Notenblätter',
          x: 75,
          y: 62,
          width: 24,
          height: 36,
          lines: [
            {
              speakerId: 'maya',
              emotion: 'neutral',
              text: 'Anyas Klavierpartituren für heute Abend… und sieh mal in den kleinen Holzständer daneben: Ihre eigene Ersatz-Schlüsselkarte steckt noch unberührt im Papierumschlag.',
            },
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Kein Einbruch am Türschloss, keine gestohlene Gästekarte. Wer auch immer die Uhr hier platziert hat, benutzte eine Master-Keycard der Crew!',
            },
          ],
        },
        {
          id: 'cabin_porthole',
          label: 'Bullauge zur Abendsee',
          x: 59,
          y: 11,
          width: 21,
          height: 42,
          lines: [
            {
              speakerId: 'maya',
              emotion: 'neutral',
              text: 'Langsam legt sich die Abenddämmerung übers Meer. Morgen früh laufen wir angeblich schon im Hafen von Kreta ein… bis dahin müssen wir Anyas Unschuld endgültig beweisen!',
            },
          ],
        },
      ],
      talkTopics: [
        {
          id: 'cabin_marston_fund',
          title: 'Wie genau lief die Durchsuchung von Kabine 312 ab?',
          speakerId: 'marston',
          hideIfFlag: 'flag_kap3_log_erhalten',
          lines: [
            {
              speakerId: 'marston',
              emotion: 'sweating',
              text: 'Standard-Prozedur nach einem Freispruch, Nate. Zwei Sicherheitsleute kamen um 09:35 Uhr her, um Anyas Sachen freizugeben – und unter dem Bett blinkte plötzlich das Goldgehäuse.',
            },
            {
              speakerId: 'nate',
              emotion: 'confident',
              text: 'Frank, du weißt genau, dass Anya seit gestern Abend im Arrest saß! Gib mir das elektronische Tür-Log dieser Kabine!',
            },
            {
              speakerId: 'marston',
              emotion: 'neutral',
              text: 'Nach heute Morgen steht der Kapitän persönlich hinter mir, Nate. Ohne eine konkrete Spur aus dieser Kabine, dass hier etwas vom Personal abgelegt wurde, darf ich den Türspeicher nicht anzapfen. PRÄSENTIER mir erst einen Fund!',
            },
          ],
        },
        {
          id: 'cabin_marston_bank',
          title: 'Kannst du Arthur Morgans Konten & Hintergrund prüfen?',
          speakerId: 'marston',
          requiredFlag: 'flag_kap3_log_erhalten',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'thinking',
              text: 'Frank, falls es morgen wieder gegen Arthur Morgan geht: Irgendwas sagt mir, wir sollten auch seine Bankunterlagen und möglichen Schulden durchleuchten lassen.',
            },
            {
              speakerId: 'marston',
              emotion: 'confident',
              text: 'Gute Idee, aber über das Bord-Funknetz dauert so eine Bankauskunft bis morgen nach dem Prozess. Ich gebe eine Anfrage raus – sobald wir Kreta ansteuern, liegen mir die Akten vor!',
            },
          ],
        },
        {
          id: 'cabin_maya_plan',
          title: 'Was fehlt uns jetzt noch für das Tribunal?',
          speakerId: 'maya',
          lines: [
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: 'Wir brauchen zwei Dinge: Erstens das Tür-Log von Kabine 312 (untersuche das Bett genau!), und zweitens den Grund für diesen Diebstahl – schau dir den Schreibtisch im VIP-Salon nochmal an!',
            },
          ],
        },
      ],
      presentRules: [
        {
          evidenceId: 'kabinen_tuch',
          targetCharacterId: 'marston',
          lines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              shout: 'MOMENT MAL!',
              sfx: 'objection',
              text: 'Sieh dir dieses feine Erstklass-Serviertuch an, das unter Anyas Bett lag, Frank! Goldsaum – und ein frischer Rotweinfleck, genau wie gestern Abend auf dem Tisch im VIP-Salon!',
            },
            {
              speakerId: 'marston',
              emotion: 'shocked',
              text: 'Ein Kellner-Serviertuch mit Rotwein?! Verdammt… das hat mit einer Pianistin wirklich nichts zu tun!',
            },
            {
              speakerId: 'marston',
              emotion: 'confident',
              setsFlag: 'flag_kap3_log_erhalten',
              unlocksEvidence: 'kabine_312_log',
              unlocksThought: 'thought_kap3_kabinenlog',
              text: 'Na schön, ich riskiere meinen letzten Urlaubstag! Hier ist der Auszug aus Tür 312: Um 08:42 Uhr – achtzehn Minuten vor Prozessbeginn – war Crew-Mastercard #04 von Arthur Morgan für zwei Minuten hier drin!',
            },
            {
              speakerId: 'maya',
              emotion: 'confident',
              text: '08:42 Uhr – direkt vor der Verhandlung! Damit steht fest, wer in der Kabine war… bleibt nur noch die Frage, WARUM Arthur so etwas getan hat.',
            },
          ],
        },
        {
          evidenceId: 'schuldschein_brief',
          targetCharacterId: 'marston',
          lines: [
            {
              speakerId: 'marston',
              emotion: 'thinking',
              text: '„45.000 Euro bis Kreta – Konto-Ref: KRETA-77“? Hm… seltsames Papier für einen Oberkellner. Ich prüfe über die Hafenpolizei gleich nach dem Tribunal morgen Arthurs echte Bankunterlagen!',
            },
          ],
        },
      ],
      fallbackPresentLines: [
        {
          speakerId: 'marston',
          emotion: 'neutral',
          text: 'Damit kommen wir bei Kabine 312 noch nicht weiter, Nate. Sieh dich hier im Zimmer erst genau um!',
        },
      ],
    },

    music_salon: {
      id: 'music_salon',
      name: 'MS Aurora · Musiksalon',
      subtitle: 'Kapitel 4 · Abendlicher Epilog',
      backgroundUrl: '/src/assets/images/cruise_music_salon_1795089043481.jpg',
      charactersPresent: [
        { characterId: 'maya' },
        { characterId: 'marston' },
        { characterId: 'anya' },
      ],
      hotspots: [],
      talkTopics: [
        {
          id: 'epilog_start',
          title: 'Anyas Dankes-Konzert anhören',
          speakerId: 'anya',
          lines: [
            {
              speakerId: 'anya',
              emotion: 'confident',
              text: 'Dieses Lied ist für meine Helden!',
              triggersOutro: true,
            },
          ],
        },
      ],
      presentRules: [],
      fallbackPresentLines: [
        {
          speakerId: 'maya',
          emotion: 'confident',
          text: 'Heute Abend feiern wir erst mal Anyas Freispruch, Nate!',
        },
      ],
    },

    courtroom: {
      id: 'courtroom',
      name: 'Großer Ballsaal · Schiffs-Tribunal',
      subtitle: 'Schiffs-Tribunal der MS Aurora',
      backgroundUrl: '/src/assets/images/cruise_court_ballroom_1795039845955.jpg',
      charactersPresent: [
        { characterId: 'pendelton' },
        { characterId: 'falk' },
      ],
      hotspots: [],
      talkTopics: [
        {
          id: 'start_trial',
          title: 'Kreuzverhör von Arthur Morgan beginnen',
          speakerId: 'pendelton',
          hideIfFlag: 'flag_kap2_freispruch',
          lines: [
            {
              speakerId: 'pendelton',
              emotion: 'neutral',
              sfx: 'gavel',
              text: 'Das außerordentliche Schiffs-Tribunal wird eröffnet! Mr. von Falk, rufen Sie Ihren Zeugen auf.',
            },
            {
              speakerId: 'falk',
              emotion: 'smug',
              text: 'Arthur Morgan wird beweisen, dass Miss Brooks den Chronometer gestohlen hat!',
              startsTestimonyId: 'testimony_arthur_1',
            },
          ],
        },
        {
          id: 'start_final_trial',
          title: 'Endgültiges Hauptverfahren beginnen',
          speakerId: 'pendelton',
          requiredFlag: 'flag_kap3_motiv_geloest',
          hideIfFlag: 'flag_kap4_freispruch',
          lines: [
            {
              speakerId: 'pendelton',
              emotion: 'neutral',
              sfx: 'gavel',
              text: 'Ruhe im Saal! Das Hauptverfahren im Fall des Goldenen Schiffs-Chronometers ist hiermit eröffnet.',
            },
            {
              speakerId: 'falk',
              emotion: 'smug',
              text: 'Heute gibt es kein Entkommen mehr, Sterling! Ich rufe Detective Frank Marston als ersten Zeugen auf!',
              startsTestimonyId: 'testimony_kap4_marston',
            },
          ],
        },
      ],
      presentRules: [],
      fallbackPresentLines: [
        {
          speakerId: 'pendelton',
          emotion: 'neutral',
          text: 'Bitte beginnen Sie das Kreuzverhör über „Reden“.',
        },
      ],
    },
  },

  testimonies: {
    // =========================================================================
    // KAPITEL 2 · TAG 2 (MORGEN) — VERHÖR PHASE 1: ZEIT & VITRINE
    // =========================================================================
    testimony_arthur_1: {
      id: 'testimony_arthur_1',
      title: 'Zeugenaussage (1/3): „Der Einbruch um 20:30 Uhr“',
      witnessId: 'arthur',
      introLines: [
        {
          speakerId: 'arthur',
          emotion: 'neutral',
          text: 'Euer Ehren, mein Gedächtnis ist so makellos wie das Tafelsilber der Ersten Klasse.',
        },
        {
          speakerId: 'falk',
          emotion: 'smug',
          text: 'Schildern Sie dem Tribunal präzise, was Sie gestern Abend beobachtet haben, Mr. Morgan.',
        },
      ],
      statements: [
        {
          id: 'arthur_p1_1',
          text: 'Ich war bis 20:29 Uhr unten im Speisesaal mit den Gala-Vorbereitungen beschäftigt.',
          pressLines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              shout: 'MOMENT MAL!',
              sfx: 'objection',
              text: 'Bis 20:29 Uhr durchgehend? Sie sind zwischendurch nicht ein einziges Mal hinauf in den VIP-Salon gegangen?',
            },
            {
              speakerId: 'arthur',
              emotion: 'neutral',
              text: 'Selbstverständlich nicht, Sir! Ein Chefkellner lässt seine Station vor dem Empfang niemals im Stich.',
            },
            {
              speakerId: 'falk',
              emotion: 'smug',
              text: 'Verschwenden Sie keine Zeit auf Nebenschauplätzen, Sterling. Hören Sie dem Zeugen lieber zu.',
            },
          ],
        },
        {
          id: 'arthur_p1_2',
          text: 'Als ich um Punkt 20:30 Uhr ins obere Foyer trat, hörte ich lautes Glas-Splittern!',
          pressLines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              shout: 'MOMENT MAL!',
              sfx: 'objection',
              text: 'Sie kamen exakt in dem Moment an, als die Scheibe zerbrach? Ziemlich glücklicher Zufall, oder?',
            },
            {
              speakerId: 'arthur',
              emotion: 'sweating',
              text: 'N-nun, ich wollte prüfen, ob im Salon alles für den Empfang bereitsteht! Und da schepperte es bereits!',
            },
          ],
        },
        {
          id: 'arthur_p1_3',
          text: 'Sekunden später stürzte Miss Brooks aus dem VIP-Salon – außer ihr war niemand im Raum!',
          pressLines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              shout: 'MOMENT MAL!',
              sfx: 'objection',
              text: 'Hatten Sie beim Eintreten sofort den gesamten Salon bis in die hinterste Ecke im Blick?',
            },
            {
              speakerId: 'arthur',
              emotion: 'neutral',
              text: 'Die Flügeltür stand offen, und direkt dahinter war nur Miss Brooks mit völlig entsetztem Gesicht zu sehen!',
            },
          ],
        },
        {
          id: 'arthur_p1_4',
          text: 'Sie muss die Vitrine also um 20:30 Uhr brutal eingeschlagen und die Uhr an sich gerissen haben!',
          pressLines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              shout: 'MOMENT MAL!',
              sfx: 'objection',
              text: 'Moment mal – sind Sie sich wirklich sicher, dass Anya überhaupt Zeit für einen solchen Blitz-Einbruch hatte?',
            },
            {
              speakerId: 'falk',
              emotion: 'smug',
              text: 'Ein Schlag auf Glas dauert eine Sekunde, Sterling! Wenn Sie etwas Gegenteiliges beweisen wollen, legen Sie Fakten vor!',
            },
            {
              speakerId: 'maya',
              emotion: 'thinking',
              text: '(Flüstert) Nate, schau doch mal, ob Anya um 20:30 Uhr überhaupt Zeit dafür hatte – oder ob die Vitrine wirklich eingeschlagen wurde!',
            },
          ],
          contradiction: {
            requiredEvidenceId: 'vitrine_glocke',
            alternativeEvidenceIds: ['musik_alibi'],
            successLines: [
              {
                speakerId: 'nate',
                emotion: 'confident',
                shout: 'EINSPRUCH!',
                sfx: 'objection',
                shake: true,
                text: 'Diese ganze „Blitz-Einbruch“-Geschichte fällt sofort in sich zusammen, Euer Ehren!',
              },
              {
                speakerId: 'nate',
                emotion: 'confident',
                text: 'Erstens stand Anya Brooks nachweislich bis 20:28 Uhr vor vollem Saal am Klavier im Musiksalon! Und zweitens…',
              },
              {
                speakerId: 'nate',
                emotion: 'confident',
                text: '…war das Messingschloss der Vitrine völlig unversehrt und AUFGESCHLOSSEN, bevor die Schiffsglocke die Scheibe zertrümmerte! Wozu sollte eine Diebin ohne Schlüssel erst regulär aufschließen und dann Lärm schlagen?!',
              },
              {
                speakerId: 'pendelton',
                emotion: 'shocked',
                text: 'Was?! Das Schloss der Vitrine war unbeschädigt aufgeschlossen?!',
              },
              {
                speakerId: 'arthur',
                emotion: 'shocked',
                shake: true,
                text: 'Gah!! A-aufgeschlossen?! Aber ich habe doch nur die Scherben gesehen!',
              },
              {
                speakerId: 'falk',
                emotion: 'smug',
                text: 'Pah! Netter Taschenspielertrick, Sterling – aber das beweist keineswegs die Unschuld Ihrer Mandantin!',
              },
              {
                speakerId: 'falk',
                emotion: 'confident',
                text: 'Selbst wenn die Vitrine leicht geöffnet war: Niemand von der Crew war vorher im Salon, und aus dem Raum führt kein anderer Weg! Also konnte es TROTZDEM nur Miss Brooks gewesen sein!',
              },
              {
                speakerId: 'pendelton',
                emotion: 'thinking',
                text: 'Hmm… Mr. von Falk hat einen Punkt. Mr. Morgan, bestätigen Sie unter Eid, ob außer Miss Brooks jemand zutreten oder fliehen konnte!',
                startsTestimonyId: 'testimony_arthur_2',
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
          text: 'Bei allen Weltmeeren, Sterling! Dieser Beweis widerlegt die Tatzeit 20:30 Uhr nicht im Geringsten!',
        },
        {
          speakerId: 'pendelton',
          emotion: 'headshake',
          animation: 'headshake',
          sfx: 'headshake',
          text: 'Einspruch abgelehnt. So kommen wir nicht weiter, Mr. Sterling – überprüfen Sie Ihre Akte genauer!',
        },
      ],
    },

    // =========================================================================
    // KAPITEL 2 · VERHÖR PHASE 2: ZUTRITT VOR 20:30 UHR (KEYCARD-LOG)
    // =========================================================================
    testimony_arthur_2: {
      id: 'testimony_arthur_2',
      title: 'Zeugenaussage (2/3): „Zutritt zum VIP-Salon“',
      witnessId: 'arthur',
      introLines: [
        {
          speakerId: 'arthur',
          emotion: 'sweating',
          text: 'N-natürlich, Euer Ehren! Ich stehe vollkommen zu meinen Aussagen!',
        },
      ],
      statements: [
        {
          id: 'arthur_p2_1',
          text: 'Ich selbst habe den abgesperrten VIP-Salon vor dem Vorfall am Abend kein einziges Mal betreten!',
          pressLines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              shout: 'MOMENT MAL!',
              sfx: 'objection',
              text: 'Kein einziges Mal, Mr. Morgan? Auch nicht um kurz vor halb neun, um den Raum für die VIPs herzurichten?',
            },
            {
              speakerId: 'arthur',
              emotion: 'sweating',
              text: 'I-ich sagte doch: Ich war durchgehend im Speisesaal! Die Tür zum Salon war elektronisch verriegelt!',
            },
          ],
          contradiction: {
            requiredEvidenceId: 'keycard_log',
            successLines: [
              {
                speakerId: 'nate',
                emotion: 'confident',
                shout: 'EINSPRUCH!',
                sfx: 'objection',
                shake: true,
                text: 'Ihre elektronische Tür lässt Sie hier gerade eiskalt auffliegen, Mr. Morgan!',
              },
              {
                speakerId: 'nate',
                emotion: 'confident',
                text: 'Dieses Schlüsselkarten-Log der MS Aurora belegt schwarz auf weiß: Crew-Mastercard #04 – Ihre persönliche Karte – öffnete den VIP-Salon bereits um 20:15 Uhr!',
              },
              {
                speakerId: 'arthur',
                emotion: 'shocked',
                shake: true,
                text: 'W-was?! D-das Tür-Protokoll?! Aber das darf doch nur die Sicherheit—',
              },
              {
                speakerId: 'falk',
                emotion: 'shocked',
                shake: true,
                text: 'Morgan!! Sie haben mir vor der Sitzung verschwiegen, dass Sie um 20:15 Uhr im Salon waren?!',
              },
              {
                speakerId: 'arthur',
                emotion: 'sweating',
                text: 'E-es tut mir leid, Mr. von Falk! Ich habe es vor Schreck vergessen! Ich… ich wollte nur schnell eine Flasche Rotwein auf den Schreibtisch stellen – und da stieß ich aus Versehen das Glas um!',
              },
              {
                speakerId: 'maya',
                emotion: 'smug',
                text: '(Flüstert) Aha! Das erklärt den weißen Handschuh-Fussel am Rotweinglas!',
              },
              {
                speakerId: 'falk',
                emotion: 'facepalm',
                animation: 'facepalm',
                sfx: 'facepalm',
                text: 'Tch! Ein höchst ärgerlicher Patzer meines Zeugen, zugegeben, Euer Ehren. Doch das ändert nichts an der entscheidenden Tatsache: Um 20:16 Uhr war Morgan wieder draußen – und um 20:30 Uhr gab es KEINEN zweiten Ausgang!',
              },
              {
                speakerId: 'pendelton',
                emotion: 'headshake',
                animation: 'headshake',
                sfx: 'headshake',
                text: 'Mr. Morgan, so etwas darf unter Eid nicht vergessen werden! Bestätigen Sie nun, ob außer durch die Haupttür jemand anderes den VIP-Salon verlassen konnte!',
                startsTestimonyId: 'testimony_arthur_3',
              },
            ],
          },
        },
        {
          id: 'arthur_p2_2',
          text: 'Auch sonst besitzt kein Mitarbeiter eine funktionierende Karte für diesen Empfangs-Abend.',
          pressLines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              shout: 'MOMENT MAL!',
              sfx: 'objection',
              text: 'Die elektronischen Türschlösser auf diesem Schiff speichern doch jede einzelne Öffnung mit Uhrzeit!',
            },
            {
              speakerId: 'arthur',
              emotion: 'sweating',
              text: 'Na und?! Selbst wenn – meine Karte taucht dort jedenfalls nicht vor 20:30 Uhr auf!',
            },
          ],
          contradiction: {
            requiredEvidenceId: 'keycard_log',
            successLines: [
              {
                speakerId: 'nate',
                emotion: 'confident',
                shout: 'EINSPRUCH!',
                sfx: 'objection',
                shake: true,
                text: 'Oh doch, sie taucht auf! Crew-Mastercard #04 – Ihre persönliche Keycard – öffnete den VIP-Salon schon um 20:15 Uhr!',
              },
              {
                speakerId: 'arthur',
                emotion: 'shocked',
                shake: true,
                text: 'Gah!! D-das Log?!',
              },
              {
                speakerId: 'falk',
                emotion: 'shocked',
                shake: true,
                text: 'Morgan!! Sie haben vor der Verhandlung behauptet, Sie seien unten im Speisesaal gewesen!',
              },
              {
                speakerId: 'arthur',
                emotion: 'sweating',
                text: 'I-ich hab es vor Nervosität vergessen! Ich habe um 20:15 Uhr bloß kurz Rotwein auf den Schreibtisch gestellt und bin sofort wieder gegangen!',
              },
              {
                speakerId: 'falk',
                emotion: 'confident',
                text: 'Sei’s drum, Euer Ehren! Selbst wenn der Zeuge um 20:15 Uhr Wein servierte – die Vitrine war heil, und um 20:30 Uhr gab es KEINEN zweiten Fluchtweg aus dem Salon!',
                startsTestimonyId: 'testimony_arthur_3',
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
          text: 'Autsch… Mein armer Verstand! Was genau soll dieses Beweisstück mit dem Zutritt vor 20:30 Uhr zu tun haben, Sterling?!',
        },
        {
          speakerId: 'pendelton',
          emotion: 'headshake',
          animation: 'headshake',
          sfx: 'headshake',
          text: 'Nein, nein, nein, Mr. Sterling. Das reicht dem Gericht für einen Einspruch beim besten Willen nicht aus.',
        },
      ],
    },

    // =========================================================================
    // KAPITEL 2 · VERHÖR PHASE 3: FLUCHTWEG & FREISPRUCH + KABINEN-TWIST
    // =========================================================================
    testimony_arthur_3: {
      id: 'testimony_arthur_3',
      title: 'Zeugenaussage (3/3): „Der verschlossene Raum“',
      witnessId: 'arthur',
      introLines: [
        {
          speakerId: 'arthur',
          emotion: 'sweating',
          text: 'D-das mit dem Rotwein tut mir aufrichtig leid! Aber ab 20:30 Uhr stand ich direkt an der Tür!',
        },
      ],
      statements: [
        {
          id: 'arthur_p3_1',
          text: 'Um 20:16 Uhr verließ ich den Salon wieder – und der Chronometer stand noch sicher in der Vitrine.',
          pressLines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              shout: 'MOMENT MAL!',
              sfx: 'objection',
              text: 'Aber Sie geben also zu, kurz vor dem Vorfall im Raum gewesen zu sein. Was ist in den 14 Minuten danach passiert?',
            },
            {
              speakerId: 'arthur',
              emotion: 'sweating',
              text: 'Ich weiß es nicht! Jedenfalls kam bis Miss Brooks niemand mehr durch die Haupttür!',
            },
          ],
        },
        {
          id: 'arthur_p3_2',
          text: 'Alle Fenster zum Deck sind fest versiegelt, und auch der Balkon war verriegelt!',
          pressLines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              shout: 'MOMENT MAL!',
              sfx: 'objection',
              text: 'Verriegelt? Haben Sie den Riegel der Balkontür denn selbst überprüft, Mr. Morgan?',
            },
            {
              speakerId: 'arthur',
              emotion: 'sweating',
              text: 'Die Vorschriften sagen klipp und klar: Nachts bleiben alle Balkone verschlossen! Außerdem geht es dort nirgendwo hin!',
            },
          ],
          contradiction: {
            requiredEvidenceId: 'balkon_fluchtweg',
            successLines: [
              {
                speakerId: 'nate',
                emotion: 'confident',
                shout: 'EINSPRUCH!',
                sfx: 'objection',
                shake: true,
                text: 'Genau diese Ausrede haben Sie schon gestern Abend versucht, Mr. Morgan – doch die Beweise am Balkon sprechen eine völlig andere Sprache!',
              },
              {
                speakerId: 'nate',
                emotion: 'confident',
                text: 'Die Balkontür wurde VON INNEN entriegelt – exakt in dem Augenblick, als Miss Brooks vorn eintrat! Und draußen am Geländer klemmte dieses abgerissene Crew-Serviceband direkt auf dem Weg zur Personal-Treppe!',
              },
              {
                speakerId: 'arthur',
                emotion: 'shocked',
                shake: true,
                text: 'N-nein!! D-das Band?! Wie haben Sie—',
              },
              {
                speakerId: 'falk',
                emotion: 'shocked',
                text: 'Unmöglich… Der Salon hatte also doch einen direkten Crew-Ausgang über den Außensteg?!',
              },
              {
                speakerId: 'nate',
                emotion: 'confident',
                shout: 'VOLLTREFFER!',
                sfx: 'deduction',
                text: 'Euer Ehren! Meine Mandantin spielte bis 20:28 Uhr vor Dutzenden Zeugen Klavier, die Vitrine war längst aufgeschlossen, und der Balkon bot einen freien Fluchtweg! Anya Brooks war schlicht zur falschen Zeit am falschen Ort!',
              },
              {
                speakerId: 'pendelton',
                emotion: 'confident',
                sfx: 'gavel',
                text: 'Hmm… in der Tat! Der Hauptbelastungszeuge hat seine eigene Anwesenheit verschwiegen, und die Fluchtmöglichkeit über den Balkon weckt erhebliche Zweifel an der Schuld der Angeklagten!',
              },
              {
                speakerId: 'pendelton',
                emotion: 'confident',
                shout: 'NICHT SCHULDIG!',
                sfx: 'victory',
                text: 'Mangels Tatnachweis spricht dieses Schiffs-Tribunal Miss Anya Brooks im Anklagepunkt des Vitrinen-Einbruchs hiermit FREI!',
              },

              // --- SZENE 2.4: NACH DEM FREISPRUCH (PROMENADENDECK) & DER TWIST ---
              {
                speakerId: 'anya',
                emotion: 'confident',
                setsFlag: 'flag_kap2_freispruch',
                setsPhase: 'investigation',
                switchesLocationId: 'deck',
                text: 'Mr. Sterling! Maya! Ich… ich kann es gar nicht fassen! Vielen, vielen Dank – Sie haben mir meine Freiheit zurückgegeben!',
              },
              {
                speakerId: 'nate',
                emotion: 'confident',
                text: 'Gern geschehen, Anya! Mandantin freigesprochen, Victor von Falk eiskalt ausgekontert – so gefällt mir mein Kurztrip vor Gericht!',
              },
              {
                speakerId: 'nate',
                emotion: 'smug',
                text: 'Und weißt du was das Beste ist, Maya? Ab exakt dieser Sekunde beginnt offiziell mein Urlaub! Sonnenliege, Meeresbrise und das größte Eis vom Buffet!',
              },
              {
                speakerId: 'maya',
                emotion: 'thinking',
                text: 'Ähm… Moment mal, Nate?! Hallo?! Freust du dich da gerade nicht ein bisschen zu früh?!',
              },
              {
                speakerId: 'nate',
                emotion: 'neutral',
                text: 'Wie bitte? Wieso zu früh? Das Urteil ist gefallen!',
              },
              {
                speakerId: 'maya',
                emotion: 'confident',
                text: 'Ja, Anya ist frei – aber der Goldene Schiffs-Chronometer ist immer noch SPURLOS VERSCHWUNDEN! Und Arthur Morgan hat unter Eid über 20:15 Uhr gelogen! Da draußen auf dem Schiff läuft immer noch der echte Dieb herum!',
              },
              {
                speakerId: 'nate',
                emotion: 'sweating',
                text: 'Puh, Maya, ich bitte dich… dafür hat die MS Aurora ihre Schiffs-Sicherheit und Detective Frank Marston an Bord! Ich bin Strafverteidiger, kein unbezahlter Teilzeit-Kommissar.',
              },
              {
                speakerId: 'nate',
                emotion: 'confident',
                text: 'Mein Mandat endet exakt beim Freispruch. Keine Akten mehr, keine Tatorte, keine Nachtschichten. Ich fasse diesen Fall nicht mehr an!',
              },
              {
                speakerId: 'maya',
                emotion: 'sweating',
                text: 'Typisch Nate! Manchmal bist du echt unmöglich, wenn du deine Ruhe haben willst…',
              },

              // --- DER TWIST: DIE UHR IN ANYAS KABINE ---
              {
                speakerId: 'marston',
                emotion: 'shocked',
                sfx: 'alarm',
                shake: true,
                text: 'HALTE EIN, NATE!! Miss Brooks – bewegen Sie sich keinen Millimeter!!',
              },
              {
                speakerId: 'nate',
                emotion: 'shocked',
                text: 'Frank?! Victor von Falk?! Was um alles in der Welt ist denn jetzt schon wieder passiert?!',
              },
              {
                speakerId: 'falk',
                emotion: 'smug',
                text: 'Oh, genießen Sie bloß noch Ihren kurzen Triumph, Mr. „Ich-habe-Urlaub“! Ihr billiger Verfahrenstrick ist soeben in tausend Stücke zerbrochen!',
              },
              {
                speakerId: 'marston',
                emotion: 'sweating',
                unlocksEvidence: 'chronometer_kabine_fund',
                setsFlag: 'flag_kabinen_twist',
                text: 'Bei der routinemäßigen Freigabe und Durchsuchung von Miss Brooks’ Privatkabine 312 haben unsere Sicherheitsleute vor drei Minuten unter ihrem Bett nachgesehen… und dort lag der gestohlene Goldene Schiffs-Chronometer!',
              },
              {
                speakerId: 'anya',
                emotion: 'shocked',
                shake: true,
                text: 'W-WAS?! Der Chronometer?! In MEINER Kabine?! Nein!! Das ist unmöglich – ich saß doch seit gestern Abend durchgehend im Bord-Arrest!',
              },
              {
                speakerId: 'anya',
                emotion: 'sweating',
                text: 'Irgendjemand muss mir die Uhr heimlich dorthin gelegt haben, während alle bei der Verhandlung waren!!',
              },
              {
                speakerId: 'falk',
                emotion: 'smug',
                text: 'Eine höchst bequeme Geschichte, Miss Brooks. Der Kapitän hat soeben ein neues, endgültiges Hauptverfahren angeordnet – wegen Beute-Funds am Wohnsitz der Verdächtigen! Man sieht sich, Sterling!',
              },
              {
                speakerId: 'marston',
                emotion: 'sweating',
                text: 'Es tut mir wirklich leid, Nate. Bei einem direkten Beutefund in ihrer Kabine sind mir die Hände gebunden – Anya muss wieder zurück unter Arrest.',
              },
              {
                speakerId: 'maya',
                emotion: 'smug',
                text: 'Na, Herr „Ich fasse diesen Fall nicht mehr an“? Sieht ganz so aus, als hätte der echte Täter gerade versucht, Anya endgültig ans Messer zu liefern!',
              },
              {
                speakerId: 'nate',
                emotion: 'sweating',
                text: '…Tja. Das war’s dann wohl endgültig mit der Sonnenliege und dem Buffet.',
              },
              {
                speakerId: 'nate',
                emotion: 'confident',
                text: 'Na schön! Wenn jemand meiner Mandantin direkt nach ihrem Freispruch die Beute unterjubelt, wird es persönlich. Heute Abend drehen wir jeden einzelnen Raum auf der MS Aurora auf links!',
                completesChapter: {
                  completedChapterTitle: 'Kapitel 2 abgeschlossen',
                  completedTimeLabel: 'Tag 2 · Morgen beendet',
                  summary:
                    'Du hast Anya Brooks vor dem Schiffs-Tribunal erfolgreich verteidigt und ihren ersten Freispruch („Nicht schuldig!“) erkämpft. Doch der Triumph hielt nur wenige Minuten: Jemand hat Anya den Goldenen Chronometer heimlich in ihre Kabine gelegt – die Jagd nach dem wahren Täter geht weiter!',
                  nextChapterId: 'kap3_tag2_abend',
                  nextLocationId: 'deck',
                  nextPhase: 'investigation',
                  nextTimeOfDay: 'abend',
                  unlocksLocations: ['cabin_312'],
                  locksLocations: ['courtroom'],
                  nextButtonLabel: 'Weiter zu Tag 2 · Abend (Kapitel 3)',
                  nextIntroLines: [
                    {
                      speakerId: 'maya',
                      emotion: 'thinking',
                      text: 'Tag 2, Abenddämmerung… Die ganze MS Aurora tuschelt über den Chronometer-Fund in Anyas Kabine 312.',
                    },
                    {
                      speakerId: 'marston',
                      emotion: 'neutral',
                      text: 'Ich hab Kabine 312 erstmal abgesperrt und warte unten direkt im Zimmer auf dich, Nate. Offiziell darf niemand rein – aber für dich mach ich die Tür einen Spalt auf.',
                    },
                    {
                      speakerId: 'nate',
                      emotion: 'confident',
                      text: 'Danke, Frank! Und sieh mal dort vorn an der Reling – Arthur Morgan grinst schon so selbstgefällig. Schauen wir uns erst Kabine 312 und den VIP-Salon genau an, bevor wir ihn stellen!',
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          id: 'arthur_p3_3',
          text: 'Es ist schlicht unmöglich, dass um 20:30 Uhr irgendjemand durch den Balkon entkommen ist!',
          pressLines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              shout: 'MOMENT MAL!',
              sfx: 'objection',
              text: 'Das klingt sehr endgültig, Mr. Morgan – aber wir haben diesen Balkon gestern Abend mit eigenen Augen untersucht!',
            },
            {
              speakerId: 'arthur',
              emotion: 'sweating',
              text: 'Hmpf! Ein gewöhnlicher Gast kommt dort sicher nicht einfach hinaus!',
            },
          ],
          contradiction: {
            requiredEvidenceId: 'balkon_fluchtweg',
            successLines: [
              {
                speakerId: 'nate',
                emotion: 'confident',
                shout: 'EINSPRUCH!',
                sfx: 'objection',
                shake: true,
                text: 'Unmöglich? Dieses Beweisstück vom Balkon beweist genau das Gegenteil, Euer Ehren!',
              },
              {
                speakerId: 'nate',
                emotion: 'confident',
                text: 'Die Balkontür wurde VON INNEN entriegelt – und am äußeren Geländer Richtung Crew-Treppe klemmte dieses abgerissene dunkelblaue Serviceband!',
              },
              {
                speakerId: 'arthur',
                emotion: 'shocked',
                shake: true,
                text: 'N-nein!! D-das Serviceband?!',
              },
              {
                speakerId: 'falk',
                emotion: 'shocked',
                text: 'Was?! Der Balkon führt direkt zur Personal-Treppe?!',
              },
              {
                speakerId: 'nate',
                emotion: 'confident',
                shout: 'VOLLTREFFER!',
                sfx: 'deduction',
                text: 'Meine Mandantin hatte bis 20:28 Uhr ein wasserfestes Bühnen-Alibi, die Vitrine war regulär aufgeschlossen, und der Balkon diente jemand anderem als Fluchtweg!',
              },
              {
                speakerId: 'pendelton',
                emotion: 'confident',
                sfx: 'gavel',
                text: 'Angesichts dieser schwerwiegenden Zweifel und des zweiten Fluchtwegs kann die Schuld der Angeklagten nicht festgestellt werden!',
              },
              {
                speakerId: 'pendelton',
                emotion: 'confident',
                shout: 'NICHT SCHULDIG!',
                sfx: 'victory',
                text: 'Miss Anya Brooks wird hiermit von diesem Schiffs-Tribunal freigesprochen!',
              },
              {
                speakerId: 'anya',
                emotion: 'confident',
                setsFlag: 'flag_kap2_freispruch',
                setsPhase: 'investigation',
                switchesLocationId: 'deck',
                text: 'Mr. Sterling! Maya! Vielen, vielen Dank! Ich habe geglaubt, niemand auf diesem Schiff würde mir jemals glauben!',
              },
              {
                speakerId: 'nate',
                emotion: 'confident',
                text: 'Gern geschehen, Anya! Mandantin frei, Falk blamiert – und ab exakt dieser Sekunde beginnt mein wohlverdienter Urlaub! Sonnenliege, ich komme!',
              },
              {
                speakerId: 'maya',
                emotion: 'thinking',
                text: 'Ähm, Hallo?! Nate?! Schön, dass Anya frei ist – aber der Chronometer ist immer noch WEG und Arthur hat gelogen! Irgendwo läuft hier noch der echte Täter herum!',
              },
              {
                speakerId: 'nate',
                emotion: 'sweating',
                text: 'Dafür gibt’s Detective Marston und die Schiffs-Sicherheit, Maya! Ich bin Strafverteidiger – mein Job endet beim Freispruch. Ich fasse keine einzige Akte mehr an!',
              },
              {
                speakerId: 'marston',
                emotion: 'shocked',
                sfx: 'alarm',
                shake: true,
                text: 'HALT, NATE!! Miss Brooks – bitte laufen Sie nicht weg!!',
              },
              {
                speakerId: 'falk',
                emotion: 'smug',
                text: 'Ihr kurzer Triumph ist soeben geplatzt, Sterling! Bei der Kontrolle von Miss Brooks’ Kabine 312 haben unsere Stewards vor drei Minuten einen höchst brisanten Fund gemacht…',
              },
              {
                speakerId: 'marston',
                emotion: 'sweating',
                unlocksEvidence: 'chronometer_kabine_fund',
                setsFlag: 'flag_kabinen_twist',
                text: 'Unter ihrem Bett lag der gestohlene Goldene Schiffs-Chronometer! Tut mir leid, Nate – bei einem direkten Beutefund muss Anya sofort wieder zurück in den Arrest.',
              },
              {
                speakerId: 'anya',
                emotion: 'shocked',
                shake: true,
                text: 'Nein!! Ich war die ganze Zeit im Bord-Arrest – jemand muss mir die Uhr heimlich in meine Kabine gelegt haben!!',
              },
              {
                speakerId: 'falk',
                emotion: 'smug',
                text: 'Der Kapitän hat soeben ein neues Hauptverfahren angesetzt. Man sieht sich auf der anderen Seite des Pults, Sterling!',
              },
              {
                speakerId: 'maya',
                emotion: 'smug',
                text: 'Na, Herr „Ich-hab-wieder-Urlaub“? Jemand will Anya hier ganz gezielt reinlegen!',
              },
              {
                speakerId: 'nate',
                emotion: 'confident',
                text: '…Vergiss die Sonnenliege. Jetzt wird’s persönlich – heute Abend ermitteln wir weiter, bis der wahre Dieb hinter Gittern sitzt!',
                completesChapter: {
                  completedChapterTitle: 'Kapitel 2 abgeschlossen',
                  completedTimeLabel: 'Tag 2 · Morgen beendet',
                  summary:
                    'Du hast Anya Brooks im ersten Schiffs-Tribunal erfolgreich verteidigt und ihren Freispruch („Nicht schuldig!“) erkämpft. Doch der Triumph hielt nur wenige Minuten: Jemand hat Anya den Goldenen Chronometer heimlich in ihre Kabine gelegt – die Jagd nach dem wahren Täter geht weiter!',
                  nextChapterId: 'kap3_tag2_abend',
                  nextLocationId: 'deck',
                  nextPhase: 'investigation',
                  nextTimeOfDay: 'abend',
                  unlocksLocations: ['cabin_312'],
                  locksLocations: ['courtroom'],
                  nextButtonLabel: 'Weiter zu Tag 2 · Abend (Kapitel 3)',
                  nextIntroLines: [
                    {
                      speakerId: 'maya',
                      emotion: 'thinking',
                      text: 'Tag 2, Abenddämmerung… Die ganze MS Aurora tuschelt über den Chronometer-Fund in Anyas Kabine 312.',
                    },
                    {
                      speakerId: 'marston',
                      emotion: 'neutral',
                      text: 'Ich hab Kabine 312 erstmal abgesperrt und warte unten direkt im Zimmer auf dich, Nate. Offiziell darf niemand rein – aber für dich mach ich die Tür einen Spalt auf.',
                    },
                    {
                      speakerId: 'nate',
                      emotion: 'confident',
                      text: 'Danke, Frank! Und sieh mal dort vorn an der Reling – Arthur Morgan grinst schon so selbstgefällig. Schauen wir uns erst Kabine 312 und den VIP-Salon genau an, bevor wir ihn stellen!',
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
          text: 'Ist das Ihr Ernst, Sterling?! Ich halte mir gleich beide Augen zu! Das beweist rein gar nichts über den Ausgang aus dem VIP-Salon!',
        },
        {
          speakerId: 'pendelton',
          emotion: 'headshake',
          animation: 'headshake',
          sfx: 'headshake',
          text: 'Das Gericht kann diesem Einspruch leider nicht folgen, Mr. Sterling. Zeigen Sie uns einen echten Fluchtweg-Beweis!',
        },
      ],
    },

    // =========================================================================
    // KAPITEL 4 · TAG 3 (MORGEN) — FINALE VERHANDLUNG: ZEUGE 1 (MARSTON)
    // =========================================================================
    testimony_kap4_marston: {
      id: 'testimony_kap4_marston',
      title: 'Hauptverfahren · Zeuge 1: Detective Frank Marston',
      witnessId: 'marston',
      introLines: [
        {
          speakerId: 'falk',
          emotion: 'smug',
          text: 'Detective Marston, legen Sie dem Tribunal dar, warum Sie Miss Brooks gestern direkt nach dem Freispruch wieder festnehmen mussten!',
        },
        {
          speakerId: 'marston',
          emotion: 'sweating',
          text: '(Sorry, Nate – unter Eid muss ich genau das zu Protokoll geben, was bei der Durchsuchung vorlag…)',
        },
      ],
      statements: [
        {
          id: 'kap4_marston_1',
          text: 'Um 09:35 Uhr nach dem Freispruch durchsuchten unsere Beamten routinemäßig Miss Brooks’ Privatkabine 312.',
          pressLines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              shout: 'MOMENT MAL!',
              sfx: 'objection',
              text: 'Um 09:35 Uhr – während Anya noch neben uns oben auf dem Deck stand?!',
            },
            {
              speakerId: 'marston',
              emotion: 'neutral',
              text: 'Stimmt, sie war seit dem Abend davor unter Arrest. Aber der Fundort war eindeutig ihre eigene Kabine.',
            },
          ],
        },
        {
          id: 'kap4_marston_2',
          text: 'Unter ihrem Bett fanden wir den Goldenen Chronometer – eingewickelt in ein weißes Leinentuch, ohne Einbruchsspuren am Schloss.',
          pressLines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              shout: 'MOMENT MAL!',
              sfx: 'objection',
              text: 'Kein aufgebrochenes Schloss… und was genau hatte es mit diesem Leinentuch auf sich, Frank?',
            },
            {
              speakerId: 'falk',
              emotion: 'smug',
              text: 'Ein Handtuch aus der Schiffswäscherei beweist gar nichts, Sterling! Entscheidend ist, wer Zugang zur Kabine hatte!',
            },
          ],
        },
        {
          id: 'kap4_marston_3',
          text: 'Kabine 312 ist ihr Privatquartier und war verriegelt – außer Miss Brooks selbst kann dort niemand hinein, also musste ich sie verhaften!',
          pressLines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              shout: 'MOMENT MAL!',
              sfx: 'objection',
              text: 'Wirklich niemand?! Haben Sie denn geprüft, welche Schlüsselkarte Tür 312 vor Prozessbeginn geöffnet hat?',
            },
            {
              speakerId: 'marston',
              emotion: 'sweating',
              text: 'Offiziell durfte ich das Tür-Log erst nicht abrufen, Nate – vor dem Kapitän zählte nur, wem die Kabine gehört.',
            },
          ],
          contradiction: {
            requiredEvidenceId: 'kabine_312_log',
            successLines: [
              {
                speakerId: 'nate',
                emotion: 'confident',
                shout: 'EINSPRUCH!',
                sfx: 'objection',
                shake: true,
                text: 'Dass außer Miss Brooks niemand in Kabine 312 gelangt ist, stimmt nachweislich nicht, Euer Ehren!',
              },
              {
                speakerId: 'nate',
                emotion: 'confident',
                text: 'Dieses elektronische Tür-Log von Kabine 312 belegt sekundengenau: Um 08:42 Uhr – achtzehn Minuten vor Prozessbeginn – öffnete Crew-Mastercard #04 von Arthur Morgan diese Tür!',
              },
              {
                speakerId: 'marston',
                emotion: 'shocked',
                text: '08:42 Uhr… und mit diesem Rotwein-Serviertuch aus der Ersten Klasse neben der Uhr erklärt sich auch, wie die Beute unter ihr Bett kam!',
              },
              {
                speakerId: 'falk',
                emotion: 'shocked',
                shake: true,
                text: 'W-was?! Morgans Master-Karte in Kabine 312?! Warum erfahre ich davon erst im Gerichtssaal?!',
              },
              {
                speakerId: 'pendelton',
                emotion: 'thinking',
                animation: 'nod',
                sfx: 'gavel',
                text: 'Crew-Mastercard #04 in der Kabine der Angeklagten… Das verändert die Lage grundlegend. Wir sollten uns wohl noch einmal mit Herrn Morgan unterhalten! Mr. Morgan, in den Zeugenstand!',
                startsTestimonyId: 'testimony_kap4_arthur_1',
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
          text: 'Himmel hilf… Was hat DIESES Stück bitte mit dem verschlossenen Zugang zu Kabine 312 zu tun, Sterling?!',
        },
        {
          speakerId: 'pendelton',
          emotion: 'headshake',
          animation: 'headshake',
          sfx: 'headshake',
          text: 'Enttäuschend, Mr. Sterling. Widerlegen Sie die Behauptung, dass niemand anderes in Kabine 312 gelangen konnte!',
        },
      ],
    },

    // =========================================================================
    // KAPITEL 4 · ZEUGE 2: ARTHUR MORGAN — TEIL 1 (KABINE 312)
    // =========================================================================
    testimony_kap4_arthur_1: {
      id: 'testimony_kap4_arthur_1',
      title: 'Hauptverfahren · Zeuge 2 (1/2): Arthur Morgans Morgen',
      witnessId: 'arthur',
      introLines: [
        {
          speakerId: 'arthur',
          emotion: 'sweating',
          text: 'E-Euer Ehren, was soll diese erneute Vorladung?! Ich bin ein tadelloser Oberkellner – keine Diebesbande!',
        },
      ],
      statements: [
        {
          id: 'kap4_arthur_1_1',
          text: 'Gestern Morgen zwischen acht und neun Uhr bereitete ich ausschließlich unten den Speisesaal für die Gäste vor.',
          pressLines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              shout: 'MOMENT MAL!',
              sfx: 'objection',
              text: 'Zwischen acht und neun Uhr ohne jede Ausnahme? Nicht einmal für zwei Minuten auf dem Kabinendeck?',
            },
            {
              speakerId: 'arthur',
              emotion: 'sweating',
              text: 'N-niemals! Ich hatte vor der Verhandlung auf keinem einzigen Passagierdeck etwas zu suchen!',
            },
          ],
        },
        {
          id: 'kap4_arthur_1_2',
          text: 'Ich habe Kabine 312 zu keiner Sekunde betreten und meine Schlüsselkarte dort niemals benutzt!',
          pressLines: [
            {
              speakerId: 'falk',
              emotion: 'smug',
              text: 'Lassen Sie Ihre Wortspielereien, Sterling! Legen Sie Beweise auf den Tisch – oder lassen Sie den Zeugen in Ruhe!',
            },
          ],
          contradiction: {
            requiredEvidenceId: 'kabine_312_log',
            successLines: [
              {
                speakerId: 'nate',
                emotion: 'confident',
                shout: 'EINSPRUCH!',
                sfx: 'objection',
                shake: true,
                text: 'Genau wie gestern werden Sie von Ihrem eigenen elektronischen Tür-Log vernichtet, Mr. Morgan!',
              },
              {
                speakerId: 'nate',
                emotion: 'confident',
                text: 'Ihre persönliche Crew-Mastercard #04 hat Kabine 312 um 08:42 Uhr geöffnet – direkt vor der Verhandlung! Und unter Anyas Bett lag genau so ein rotweinbeflecktes Erstklass-Serviertuch wie auf dem Tisch im VIP-Salon!',
              },
              {
                speakerId: 'arthur',
                emotion: 'shocked',
                shake: true,
                text: 'GAAAH!! N-na gut… ich war um 08:42 Uhr für einen Augenblick dort – ich habe bloß kontrolliert, ob ein frisches Handtuch fehlt!',
              },
              {
                speakerId: 'pendelton',
                emotion: 'headshake',
                animation: 'headshake',
                sfx: 'gavel_double',
                text: 'Schon wieder verschweigen Sie unter Eid Ihren eigenen Besuch am Tatort, Mr. Morgan!',
              },
              {
                speakerId: 'falk',
                emotion: 'sweating',
                text: 'E-ein unglücklicher Gedächtnislücken-Patzer, Euer Ehren! Doch selbst wenn Morgan wegen Service-Wäsche dort war: Ein Oberkellner hat doch keinerlei Grund, ein unbezahlbares Erbstück zu stehlen!',
              },
              {
                speakerId: 'arthur',
                emotion: 'sweating',
                text: 'Ganz recht!! Aber warum sollte ICH das denn überhaupt tun?!',
                startsTestimonyId: 'testimony_kap4_arthur_2',
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
          text: 'Nein, nein, nein… Widerlegen Sie endlich seine Behauptung über Kabine 312, Sterling!',
        },
        {
          speakerId: 'pendelton',
          emotion: 'headshake',
          animation: 'headshake',
          sfx: 'headshake',
          text: 'Das überzeugt das Tribunal in keiner Weise, Mr. Sterling. Zeigen Sie uns den Beweis für seinen Zutritt zu Kabine 312!',
        },
      ],
    },

    // =========================================================================
    // KAPITEL 4 · ZEUGE 2: ARTHUR MORGAN — TEIL 2 (WARUM SOLLTE ICH DAS TUN?)
    // =========================================================================
    testimony_kap4_arthur_2: {
      id: 'testimony_kap4_arthur_2',
      title: 'Hauptverfahren · Zeuge 2 (2/2): „Warum sollte ich das tun?“',
      witnessId: 'arthur',
      introLines: [
        {
          speakerId: 'arthur',
          emotion: 'sweating',
          text: 'Hören Sie mir endlich zu, Euer Ehren! Ich habe doch überhaupt keinen Grund für ein solches Verbrechen!',
        },
      ],
      statements: [
        {
          id: 'kap4_arthur_2_1',
          text: 'Ich stehe seit zwanzig Jahren in gesicherten Verhältnissen und habe nicht einen Penny Schulden!',
          pressLines: [
            {
              speakerId: 'nate',
              emotion: 'confident',
              shout: 'MOMENT MAL!',
              sfx: 'objection',
              text: 'Keine Schulden, Mr. Morgan? Und keine heimliche Frist bis zum Einlaufen auf Kreta?',
            },
            {
              speakerId: 'arthur',
              emotion: 'sweating',
              text: 'W-wovon reden Sie da überhaupt?! Niemand auf diesem Schiff könnte mir eine Zahlungsforderung vorhalten!!',
            },
          ],
        },
        {
          id: 'kap4_arthur_2_2',
          text: 'Warum also sollte ich so etwas tun?! Kein Zeuge und kein Dokument an Bord liefert irgendein Motiv gegen mich!',
          pressLines: [
            {
              speakerId: 'falk',
              emotion: 'smug',
              text: 'Der Mann hat recht, Sterling! Ohne echtes Motiv bricht Ihre gesamte Theorie gegen Mr. Morgan in sich zusammen!',
            },
          ],
          contradiction: {
            requiredEvidenceId: 'schuldschein_brief',
            successLines: [
              {
                speakerId: 'nate',
                emotion: 'confident',
                shout: 'EINSPRUCH!',
                sfx: 'objection',
                shake: true,
                text: 'Dann erklären Sie dem Gericht bitte dieses Schreiben vom Schreibtisch im VIP-Salon – gefunden direkt unter Ihrem verschütteten Rotwein!',
              },
              {
                speakerId: 'nate',
                emotion: 'confident',
                text: '„Letzte Frist: 45.000 Euro bis zum Einlaufen auf Kreta. Der Chronometer deckt den Rest – sonst erfahren alle von Ihren Geschäften.“ Adressiert an: A. M. – ARTHUR MORGAN!',
              },
              {
                speakerId: 'arthur',
                emotion: 'shocked',
                shake: true,
                text: 'WAS?! Nein!! Dieses Dokument kenne ich überhaupt nicht – das habe ich in meinem Leben noch nie gesehen!!',
              },
              {
                speakerId: 'arthur',
                emotion: 'sweating',
                shake: true,
                text: 'Glauben Sie mir doch!! Ich bin unschuldig!! Irgendjemand hat mir diesen Brief und die ganze Sache untergeschoben – ich habe das alles nicht gewollt, Sie verhaften den Falschen!!',
              },
              {
                speakerId: 'falk',
                emotion: 'shocked',
                shake: true,
                text: '45.000 Euro bis Kreta – adressiert an A. M.…?! Zusammen mit Ihren Tür-Logs um 20:15 Uhr im Salon und um 08:42 Uhr in Kabine 312 ist die Beweislage erdrückend! Die Anklage zieht sämtliche Vorwürfe gegen Miss Brooks zurück!',
              },
              {
                speakerId: 'pendelton',
                emotion: 'confident',
                sfx: 'gavel',
                text: 'Auch wenn Sie Ihre Unschuld beteuern, Mr. Morgan – sämtliche Beweise sprechen gegen Sie. Sie werden hiermit vorläufig verhaftet und morgen den Behörden auf Kreta übergeben!',
              },
              {
                speakerId: 'marston',
                emotion: 'confident',
                text: 'Kommen Sie mit, Morgan – ab nach unten in die Arrestzelle, bis wir morgen früh auf Kreta einlaufen.',
              },
              {
                speakerId: 'arthur',
                emotion: 'sweating',
                text: 'Nein… Sie ahnen ja nicht, was Sie anrichten… Wenn die herausfinden, dass es vorbei ist…',
              },
              {
                speakerId: 'pendelton',
                emotion: 'confident',
                shout: 'NICHT SCHULDIG!',
                sfx: 'victory',
                setsFlag: 'flag_kap4_freispruch',
                text: 'Miss Anya Brooks ist endgültig und in allen Punkten FREIGESPROCHEN!',
              },
              {
                speakerId: 'anya',
                emotion: 'confident',
                text: 'Mr. Sterling! Maya! Ich danke Ihnen von ganzem Herzen! Heute Abend im Musiksalon gebe ich ein ganz besonderes Konzert für Sie beide!',
                completesChapter: {
                  completedChapterTitle: 'Verhandlung gewonnen!',
                  completedTimeLabel: 'Tag 3 · Morgen beendet',
                  summary:
                    'Du hast den Fall vor dem Tribunal gelöst und Anya Brooks endgültig freigesprochen. Arthur Morgan beteuerte bis zuletzt seine Unschuld, wurde jedoch verhaftet. Am Abend wartet ein ruhiger Ausklang im Musiksalon…',
                  nextChapterId: 'kap4_tag3_abend',
                  nextLocationId: 'music_salon',
                  nextPhase: 'investigation',
                  nextTimeOfDay: 'abend',
                  unlocksLocations: ['music_salon'],
                  locksLocations: ['courtroom'],
                  nextButtonLabel: 'Weiter zu Tag 3 · Abend (Epilog)',
                  nextIntroLines: [
                    {
                      speakerId: 'nate',
                      emotion: 'confident',
                      text: '(Tag 3, Abend im Musiksalon der MS Aurora… Endlich sitzen wir einmal nicht vor Gericht, sondern ganz gemütlich bei warmem Licht am Rand der Bühne.)',
                    },
                    {
                      speakerId: 'maya',
                      emotion: 'confident',
                      text: 'Herrlich! Keine zerbrochenen Vitrinen mehr, Arthur sitzt sicher unter Deck – und jetzt gibt es gleich Live-Klaviermusik!',
                    },
                    {
                      speakerId: 'nate',
                      emotion: 'smug',
                      text: 'Weißt du, Maya… wenn ich so über unseren ersten Fall auf hoher See nachdenke – am Ende war das Ganze doch überraschend einfach, oder?',
                    },
                    {
                      speakerId: 'maya',
                      emotion: 'smug',
                      text: 'Haha – ja, fast wie ein Tutorial, Nate! Warte nur ab, bis unser nächster Fall losgeht!',
                    },
                    {
                      speakerId: 'marston',
                      emotion: 'thinking',
                      text: 'Tja… genießt es bloß, ihr zwei. Mir geht nur Arthur Morgans verzweifelter Blick vorhin bei seiner Verhaftung nicht ganz aus dem Kopf.',
                    },
                    {
                      speakerId: 'nate',
                      emotion: 'thinking',
                      text: 'Wie meinst du das, Frank? Seine letzten Worte vor dem Pult klangen ziemlich panisch – fast so, als hätte er Angst vor jemand ganz anderem gehabt…',
                    },
                    {
                      speakerId: 'marston',
                      emotion: 'sweating',
                      text: 'Genau das meine ich. Irgendwas stimmt hier trotzdem nicht – aber da sollen sich ab morgen Vormittag andere drum kümmern.',
                    },
                    {
                      speakerId: 'marston',
                      emotion: 'confident',
                      text: 'Wir übergeben ihn beim Einlaufen auf Kreta sauber an die Hafenpolizei, und dann ist endlich Feierabend. Genießt heute Abend das Konzert!',
                    },
                    {
                      speakerId: 'maya',
                      emotion: 'confident',
                      text: 'Da hat Frank recht! Pssst – schaut zur Bühne, Anya setzt sich gerade an den großen Flügel!',
                    },
                    {
                      speakerId: 'anya',
                      emotion: 'confident',
                      text: 'Meine lieben Gäste… und vor allem Nate Sterling, Maya und Detective Marston: Ohne Sie stünde ich heute Abend nicht in Freiheit vor diesen Tasten. Dieses Lied ist für meine Helden!',
                      triggersOutro: true,
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
          text: 'Kurz vor der Zielgeraden und Sie präsentieren SOWAS?! Meine Seekrankheit wird von Ihrem Einspruch gerade noch schlimmer!',
        },
        {
          speakerId: 'pendelton',
          emotion: 'headshake',
          animation: 'headshake',
          sfx: 'headshake',
          text: 'Das genügt nicht für den finalen Schlag, Mr. Sterling! Zeigen Sie uns ein Dokument, das ein echtes Motiv beweist!',
        },
      ],
    },
  },
};
