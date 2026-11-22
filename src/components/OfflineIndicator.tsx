import { useOnlineStatus } from '../hooks/useOnlineStatus';

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-slate-950 shadow-lg"
    >
      <span className="h-2 w-2 rounded-full bg-slate-950 animate-pulse" />
      <span>Offline-Modus — Zwischengespeicherte Daten aktiv</span>
    </div>
  );
}
