import { useEffect, useState } from 'react';
import { Anchor, FastForward, Music, Pause, Play, RotateCcw } from 'lucide-react';
import { CharacterPortrait } from './CharacterPortrait';
import type { Character } from '../types/game';
import { soundFx } from '../utils/soundFx';

interface HorizontalCreditsProps {
  muted: boolean;
  onFinish: () => void;
  onReturnToMenu: () => void;
}

interface CreditCastEntry {
  character: Character;
  casesLabel: string;
  caption: string;
}

const CREDIT_CAST: CreditCastEntry[] = [
  {
    character: {
      id: 'cred_nate',
      name: 'Nate Sterling',
      role: 'Strafverteidiger · Hauptfigur',
      bio: '',
      accentColor: '#3b82f6',
      portraitUrl: '/src/assets/images/sprite_nate_confident_1795080941029.jpg',
    },
    casesLabel: 'Fall 1 – 4',
    caption: 'Wollte eigentlich nur sechs Tage All-inclusive-Urlaub am Pool.',
  },
  {
    character: {
      id: 'cred_maya',
      name: 'Maya',
      role: 'Kanzlei-Assistentin',
      bio: '',
      accentColor: '#f59e0b',
      portraitUrl: '/src/assets/images/sprite_maya_neutral_1795080941915.jpg',
    },
    casesLabel: 'Fall 1 – 4',
    caption: 'Meisterte Multivitamin-Saft, drei Wildfänge und unzählige Akten.',
  },
  {
    character: {
      id: 'cred_marston',
      name: 'Detective Frank Marston',
      role: 'Chef-Ermittler auf Urlaubsreise',
      bio: '',
      accentColor: '#64748b',
      portraitUrl: '/src/assets/images/sprite_marston_detective_1795080940855.jpg',
    },
    casesLabel: 'Fall 1 – 4',
    caption: 'Bürgte persönlich für die Wahrheit – und überlebte Valletta mit Eistüten.',
  },
  {
    character: {
      id: 'cred_pendelton',
      name: 'Judge Pendelton',
      role: 'Vorsitzender Richter des Seegerichts',
      bio: '',
      accentColor: '#1e3a8a',
      portraitUrl: '/src/assets/images/sprite_pendelton_neutral_1795080941377.jpg',
    },
    casesLabel: 'Fall 1 – 4',
    caption: 'Kam als Jubiläums-Ehrengast und schwang häufiger den Hammer als geplant.',
  },
  {
    character: {
      id: 'cred_falk',
      name: 'Staatsanwalt von Falk',
      role: 'Ankläger vor dem Seegericht',
      bio: '',
      accentColor: '#991b1b',
      portraitUrl: '/src/assets/images/sprite_falk_neutral_1795080942096.jpg',
    },
    casesLabel: 'Fall 1 – 4',
    caption: 'Zog jede Seemeile schneidend scharfe Augenbrauen – bis alle Beweise fielen.',
  },
  {
    character: {
      id: 'cred_sabine',
      name: 'Sabine Lindemann',
      role: 'Kreuzfahrtmanagerin der MS Aurora',
      bio: '',
      accentColor: '#ec4899',
      portraitUrl: '/src/assets/images/sprite_cruise_manager_chroma_1795294462722.jpg',
    },
    casesLabel: 'Fall 2 – 4',
    caption: 'Verwandelte echte Krisen in Bühnenshows – und hat schon neue Stars im Blick.',
  },
  {
    character: {
      id: 'cred_captain',
      name: 'Kapitän A. W. Brammer',
      role: 'Kapitän · 40 Dienstjahre',
      bio: '',
      accentColor: '#0284c7',
      portraitUrl: '/src/assets/images/sprite_captain_brammer_1795164437466.jpg',
    },
    casesLabel: 'Fall 2 – 4',
    caption: 'Steuerte die MS Aurora ein letztes Mal würdevoll in den Heimathafen Athen.',
  },
  {
    character: {
      id: 'cred_andrew',
      name: 'Andrew Higginson',
      role: 'Familienvater & Bauingenieur',
      bio: '',
      accentColor: '#f97316',
      portraitUrl: '/src/assets/images/sprite_andrew_friendly_1795181599060.jpg',
    },
    casesLabel: 'Fall 2 – 4',
    caption: 'Vollständig freigesprochen – nur vor Sabines Show-Idee noch leicht geschockt.',
  },
  {
    character: {
      id: 'cred_eleonore',
      name: 'Eleonore Higginson',
      role: 'Ehefrau & Hobby-Detektivin',
      bio: '',
      accentColor: '#14b8a6',
      portraitUrl: '/src/assets/images/eleonore_friendly_chroma_1795426716556.jpg',
    },
    casesLabel: 'Fall 2 – 4',
    caption: 'Unerschütterliche Assistentin mit Notizblock – und bereit für das Rampenlicht!',
  },
  {
    character: {
      id: 'cred_leo',
      name: 'Leo Higginson',
      role: 'Älterer Higginson-Sohn',
      bio: '',
      accentColor: '#22c55e',
      portraitUrl: '/src/assets/images/sprite_rick_higginson_1795164437974.jpg',
    },
    casesLabel: 'Fall 2 – 4',
    caption: 'Nutze Marstons Aktenmappe vor Malta kurzerhand als Piraten-Schatzkarte.',
  },
  {
    character: {
      id: 'cred_rick',
      name: 'Rick Higginson',
      role: 'Technikbegeisterter Sohn',
      bio: '',
      accentColor: '#a855f7',
      portraitUrl: '/src/assets/images/sprite_rick_white_shirt_1795294462808.jpg',
    },
    casesLabel: 'Fall 2 – 4',
    caption: 'Hatte selbst auf den Festungsmauern von Valletta noch Bau-Vorschläge parat.',
  },
  {
    character: {
      id: 'cred_conrad',
      name: 'Conrad Higginson',
      role: 'Jüngster Higginson-Sohn',
      bio: '',
      accentColor: '#eab308',
      portraitUrl: '/src/assets/images/sprite_conrad_higginson_1795164437468.jpg',
    },
    casesLabel: 'Fall 2 – 4',
    caption: 'Retter des Schlüsselkarten-Stücks und Besitzer eines berühmten blauen Rucksacks.',
  },
  {
    character: {
      id: 'cred_anya',
      name: 'Anya Brooks',
      role: 'Bord-Pianistin im Musiksalon',
      bio: '',
      accentColor: '#8b5cf6',
      portraitUrl: '/src/assets/images/sprite_anya_neutral_1795080941598.jpg',
    },
    casesLabel: 'Fall 1',
    caption: 'Nates erste Mandantin an Bord – bedankte sich mit einem Balladen-Abend.',
  },
  {
    character: {
      id: 'cred_arthur',
      name: 'Arthur Morgan',
      role: 'Oberkellner im VIP-Salon',
      bio: '',
      accentColor: '#dc2626',
      portraitUrl: '/src/assets/images/sprite_arthur_neutral_1795080941600.jpg',
    },
    casesLabel: 'Fall 1',
    caption: 'Sein fataler Chronometer-Tausch setzte die ganze Kette in Gang.',
  },
  {
    character: {
      id: 'cred_dimitri',
      name: 'Kommissar Dimitri',
      role: 'Hafenpolizei Heraklion · Kreta',
      bio: '',
      accentColor: '#38bdf8',
      portraitUrl: '/src/assets/images/sprite_dimitri_cop_1795164437945.jpg',
    },
    casesLabel: 'Fall 2',
    caption: 'Ließ Nate per wilder Pantomime ermitteln, während der Kapitän übersetzte.',
  },
  {
    character: {
      id: 'cred_vance',
      name: 'Dr. Helena Vance',
      role: 'Leitende Schiffsärztin',
      bio: '',
      accentColor: '#0d9488',
      portraitUrl: '/src/assets/images/sprite_dr_vance_1795164436449.jpg',
    },
    casesLabel: 'Fall 2 – 4',
    caption: 'Lieferte die entscheidende Abkühl-Kurve und das Toxikologie-Gutachten.',
  },
  {
    character: {
      id: 'cred_brandt',
      name: 'Officer Lukas Brandt',
      role: 'Leiter Schiffs-Sicherheit',
      bio: '',
      accentColor: '#475569',
      portraitUrl: '/src/assets/images/sprite_brandt_security_1795164437396.jpg',
    },
    casesLabel: 'Fall 2 – 4',
    caption: 'Wusste genau, welche Sicherheitstüren selbst für ihn verschlossen blieben.',
  },
  {
    character: {
      id: 'cred_kowalski',
      name: 'Lars Kowalski',
      role: 'Chef-Elektriker · Technikraum',
      bio: '',
      accentColor: '#eab308',
      portraitUrl: '/src/assets/images/sprite_electrician_chroma_1795294462693.jpg',
    },
    casesLabel: 'Fall 2 – 4',
    caption: 'Hütet die MS-400-Schaltpläne – allerdings nicht alle Handbücher persönlich.',
  },
  {
    character: {
      id: 'cred_miriam',
      name: 'Miriam König',
      role: 'Leiterin Rezeption & Fundbüro',
      bio: '',
      accentColor: '#8b5cf6',
      portraitUrl: '/src/assets/images/sprite_receptionist_chroma_1795345216266.jpg',
    },
    casesLabel: 'Fall 3 – 4',
    caption: 'Prüft vor Kabinennummern stets die Regeln – und führt akribisch Buch.',
  },
  {
    character: {
      id: 'cred_berg',
      name: 'Alois von Berg',
      role: 'VIP-Passagier · Hobby-Fotograf',
      bio: '',
      accentColor: '#d97706',
      portraitUrl: '/src/assets/images/sprite_vip_guest_chroma_1795388139404.jpg',
    },
    casesLabel: 'Fall 3',
    caption: 'Fotografierte die halbe Reise – und damit zufällig Andrews verschwundenen Schal.',
  },
  {
    character: {
      id: 'cred_elara',
      name: 'Elara',
      role: 'Mitarbeiterin Bord-Wäscherei',
      bio: '',
      accentColor: '#06b6d4',
      portraitUrl: '/src/assets/images/sprite_laundry_worker_chroma_1795388140057.jpg',
    },
    casesLabel: 'Fall 3',
    caption: 'Brachte das verlorene Seidentuch ordentlich ins Fundbüro unter F-418.',
  },
  {
    character: {
      id: 'cred_kalle',
      name: 'Matrose Kalle Jensen',
      role: 'Nachtwache · Sonnendeck 10',
      bio: '',
      accentColor: '#0ea5e9',
      portraitUrl: '/src/assets/images/sprite_sailor_kalle_chroma_1795388138985.jpg',
    },
    casesLabel: 'Fall 3',
    caption: 'Mit zwei frischen Batterien im Walkman der verlässlichste Alibi-Zeuge.',
  },
  {
    character: {
      id: 'cred_borg',
      name: 'Matteo Borg',
      role: 'Maritimer Repliken-Händler · Malta',
      bio: '',
      accentColor: '#d97706',
      portraitUrl: '/src/assets/images/sprite_malta_shopkeeper_chroma_1795445500560.jpg',
    },
    casesLabel: 'Fall 4',
    caption: 'Sein Handwerk in Valletta brachte die geheime Chronometer-Kopie ans Licht.',
  },
];

function CreditsRibbonContent({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div className="flex items-stretch gap-5 shrink-0" aria-hidden={ariaHidden}>
      {/* Eröffnungskarte */}
      <div className="w-72 sm:w-80 shrink-0 rounded-xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 border border-amber-500/35 p-6 flex flex-col justify-between shadow-2xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
            <Anchor className="w-4 h-4 shrink-0" />
            <span>Akte MS Aurora</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-50 leading-tight">
            Advokat-Engine
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Vier Fälle auf hoher See — von der ersten zerbrochenen Vitrine bis zur Heimkehr im
            Hafen von Athen.
          </p>
        </div>
        <div className="pt-4 border-t border-slate-800/80 text-xs text-slate-400">
          Athen · Kreta · Seetag · Malta · Athen
        </div>
      </div>

      {/* Alle 23 Gesichter und Namen */}
      {CREDIT_CAST.map((entry) => (
        <article
          key={`${ariaHidden ? 'dup' : 'main'}-${entry.character.id}`}
          className="w-56 sm:w-64 shrink-0 rounded-xl bg-slate-900/95 border border-slate-800 overflow-hidden flex flex-col shadow-xl"
        >
          <div className="relative h-64 sm:h-72 bg-gradient-to-b from-slate-800/75 via-slate-900 to-slate-950 border-b border-slate-800/90 overflow-hidden">
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-28 opacity-25"
              style={{
                background: `radial-gradient(circle at 50% 85%, ${entry.character.accentColor}, transparent 72%)`,
              }}
            />
            <CharacterPortrait character={entry.character} size="card" />
          </div>

          <div className="p-4 flex-1 flex flex-col justify-between gap-2">
            <div className="space-y-1">
              <div className="text-[11px] font-medium text-amber-400 truncate">
                {entry.casesLabel} · {entry.character.role}
              </div>
              <h3 className="font-display text-base sm:text-lg font-bold text-slate-50 leading-snug">
                {entry.character.name}
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{entry.caption}</p>
          </div>
        </article>
      ))}

      {/* Schlusskarte */}
      <div className="w-72 sm:w-80 shrink-0 rounded-xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 border border-amber-500/40 p-6 flex flex-col justify-between shadow-2xl">
        <div className="space-y-3">
          <div className="text-xs font-semibold text-amber-400">Ende der Kreuzfahrt</div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-50 tracking-wide">
            ENDE
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Vielen herzlichen Dank fürs Ermitteln, Kombinieren und „Einspruch!“-Rufen an Bord der
            MS Aurora!
          </p>
        </div>
        <div className="pt-4 border-t border-slate-800/80 text-xs text-emerald-300 font-medium">
          Freier Urlaub voraus · Nate &amp; Maya
        </div>
      </div>
    </div>
  );
}

export function HorizontalCredits({
  muted,
  onFinish,
  onReturnToMenu,
}: HorizontalCreditsProps) {
  const [paused, setPaused] = useState(false);
  const [fastSpeed, setFastSpeed] = useState(false);

  useEffect(() => {
    if (!muted) {
      soundFx.startPianoBallad();
    }
    return () => {
      soundFx.stopPianoBallad();
    };
  }, [muted]);

  return (
    <div className="min-h-screen min-h-dvh bg-slate-950 text-slate-100 flex flex-col justify-between overflow-hidden select-none">
      {/* Kopfzeile */}
      <header className="border-b border-slate-800/80 bg-slate-900/75 backdrop-blur-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="font-display text-lg font-bold text-amber-400 whitespace-nowrap">
              Advokat-Engine
            </span>
            <span className="text-slate-600">·</span>
            <span className="flex items-center gap-1.5 text-xs text-slate-300 whitespace-nowrap">
              <Music className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Abspann · Besetzung aller 4 Fälle</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer"
            >
              {paused ? (
                <>
                  <Play className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Fortsetzen</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Pause</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setFastSpeed((f) => !f)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                fastSpeed
                  ? 'bg-amber-500/20 border-amber-500/60 text-amber-200'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
              }`}
            >
              <FastForward className="w-3.5 h-3.5 shrink-0" />
              <span>{fastSpeed ? '2× Tempo' : '1× Tempo'}</span>
            </button>

            <button
              type="button"
              onClick={onFinish}
              className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors whitespace-nowrap cursor-pointer"
            >
              Abspann beenden
            </button>
          </div>
        </div>
      </header>

      {/* Mittelteil: Titel + Horizontal scrollender Abspann */}
      <main className="flex-1 flex flex-col justify-center py-8 sm:py-10 gap-8 overflow-hidden">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-8 space-y-1.5">
          <div className="text-xs font-semibold text-amber-400">
            Heimathafen Athen · Abschlusschronik der MS Aurora
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-bold text-slate-50 leading-tight">
            Alle Gesichter an Bord
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Mandanten, Zeugen, Crewmitglieder und Gegenspieler aus allen vier Kreuzfahrt-Fällen.
          </p>
        </div>

        <div className="relative w-full">
          {/* Sanfte Seiten-Blenden */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-24 bg-gradient-to-r from-slate-950 to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-24 bg-gradient-to-l from-slate-950 to-transparent z-10" />

          <div className={paused ? 'overflow-x-auto px-6 sm:px-12 pb-2' : 'overflow-hidden'}>
            <div
              className={`w-max flex items-stretch gap-5 px-4 animate-credits-scroll ${
                paused ? 'animate-credits-scroll-paused' : ''
              }`}
              style={{
                animationDuration: fastSpeed ? '40s' : '78s',
              }}
            >
              <CreditsRibbonContent />
              {!paused && <CreditsRibbonContent ariaHidden />}
            </div>
          </div>
        </div>
      </main>

      {/* Fußzeile */}
      <footer className="border-t border-slate-800/80 bg-slate-900/50 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <span>
            {paused
              ? 'Pausiert · Du kannst waagerecht durch alle Charaktere scrollen oder fortsetzen.'
              : 'Läuft automatisch von rechts nach links · Jederzeit pausier- oder beendbar.'}
          </span>
          <button
            type="button"
            onClick={onReturnToMenu}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium transition-colors whitespace-nowrap cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 shrink-0" />
            <span>Zur Fallauswahl</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
