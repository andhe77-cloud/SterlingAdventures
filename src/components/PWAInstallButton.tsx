import { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  compact?: boolean;
}

export function PWAInstallButton({ compact = false }: PWAInstallButtonProps) {
  const { isInstallable, isInstalled, isIOS, isAndroid, isInIframe, install } =
    usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={() => void install()}
        aria-label="App installieren"
        title="Auf Tablet oder Startbildschirm installieren"
        className={
          compact
            ? 'flex items-center gap-1.5 px-2.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer'
            : 'flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer'
        }
      >
        <Download className="w-3.5 h-3.5 shrink-0" />
        <span className={compact ? 'hidden sm:inline' : ''}>App installieren</span>
      </button>
    );
  }

  // On compact in-game HUD, only show direct native install button to keep header uncluttered;
  // on Title Menu (non-compact), offer installation instructions for Android tablets / iPadOS.
  if (compact && !isIOS) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setShowGuide(true)}
        aria-label="Als App installieren"
        className={
          compact
            ? 'flex items-center gap-1.5 px-2.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer'
            : 'flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer'
        }
      >
        <Smartphone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span className={compact ? 'hidden sm:inline' : ''}>
          {isIOS ? 'Zum Home-Bildschirm' : 'Als App installieren'}
        </span>
      </button>

      {showGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
          onClick={() => setShowGuide(false)}
        >
          <div
            className="w-full max-w-md rounded-xl bg-slate-900 border border-slate-700 p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h2 className="font-display text-lg font-bold text-slate-50">
                  {isIOS ? 'Auf iPad / iPhone installieren' : 'Als Vollbild-App installieren'}
                </h2>
                <p className="text-xs text-slate-400">
                  Starte das Spiel ohne Browser-Adressleiste direkt vom Startbildschirm.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                aria-label="Anleitung schließen"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isInIframe && (
              <div className="rounded-lg bg-amber-500/10 border border-amber-500/40 px-3.5 py-2.5 text-xs text-amber-200 leading-relaxed">
                Hinweis: In einer eingebetteten Vorschau blockieren Browser oft das
                Installations-Popup. Öffne die App direkt im eigenen Chrome- oder Safari-Tab,
                um sie zu installieren.
              </div>
            )}

            {isIOS ? (
              <ol className="space-y-2 text-xs sm:text-sm text-slate-200 leading-relaxed list-decimal list-inside">
                <li>
                  Tippe in Safari auf das <strong className="text-amber-300">Teilen-Symbol</strong>{' '}
                  (Rechteck mit Pfeil nach oben).
                </li>
                <li>
                  Wähle im Menü{' '}
                  <strong className="text-amber-300">„Zum Home-Bildschirm“</strong>.
                </li>
                <li>
                  Öffne die App danach vom Home-Bildschirm – sie startet automatisch ohne Safari-Leiste.
                </li>
              </ol>
            ) : (
              <ol className="space-y-2 text-xs sm:text-sm text-slate-200 leading-relaxed list-decimal list-inside">
                <li>
                  Öffne die Seite {isAndroid ? 'auf deinem Android-Tablet ' : ''}direkt in{' '}
                  <strong className="text-amber-300">Chrome</strong> oder{' '}
                  <strong className="text-amber-300">Edge</strong>.
                </li>
                <li>
                  Tippe oben rechts auf das Menü (<strong className="text-amber-300">⋮</strong>) und
                  wähle <strong className="text-amber-300">„App installieren“</strong> oder{' '}
                  <strong className="text-amber-300">„Zum Startbildschirm hinzufügen“</strong>.
                </li>
                <li>
                  Alternativ kannst du jederzeit direkt im Spiel oben rechts auf das{' '}
                  <strong className="text-amber-300">Vollbild-Symbol</strong> tippen, um wie bei
                  einem Videoplayer die System- und Browserleisten auszublenden.
                </li>
              </ol>
            )}

            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
            >
              Verstanden
            </button>
          </div>
        </div>
      )}
    </>
  );
}
