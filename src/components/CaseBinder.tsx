import { useEffect, useState } from 'react';
import {
  BookOpen,
  Brain,
  Briefcase,
  Clock,
  DoorOpen,
  FileText,
  GitBranch,
  Key,
  Receipt,
  Search,
  Sparkles,
  Thermometer,
  Trophy,
  User,
  Wine,
  X,
  Zap,
} from 'lucide-react';
import type { EvidenceItem, GameCase, GameSaveState } from '../types/game';
import { CharacterPortrait } from './CharacterPortrait';

export type BinderTab = 'akte' | 'notizbuch' | 'struktur';
type AkteSubTab = 'evidence' | 'profiles';

interface CaseBinderProps {
  gameCase: GameCase;
  state: GameSaveState;
  activeTab: BinderTab;
  presentMode: boolean;
  onChangeTab: (tab: BinderTab) => void;
  onClose: () => void;
  onSelectEvidenceToPresent: (evidenceId: string) => void;
  onInspectEvidence: (evidenceId: string) => void;
  onCombineThoughts: (thoughtA: string, thoughtB: string) => void;
}

function EvidenceIcon({ iconName }: { iconName: EvidenceItem['iconName'] }) {
  const cls = 'w-5 h-5 text-amber-400 shrink-0';
  switch (iconName) {
    case 'clock':
      return <Clock className={cls} />;
    case 'file':
      return <FileText className={cls} />;
    case 'receipt':
      return <Receipt className={cls} />;
    case 'key':
      return <Key className={cls} />;
    case 'trophy':
      return <Trophy className={cls} />;
    case 'bolt':
      return <Zap className={cls} />;
    case 'thermometer':
      return <Thermometer className={cls} />;
    case 'door':
      return <DoorOpen className={cls} />;
    case 'wine':
      return <Wine className={cls} />;
    case 'search':
      return <Search className={cls} />;
    case 'bag':
      return <Briefcase className={cls} />;
    default:
      return <User className={cls} />;
  }
}

export function CaseBinder({
  gameCase,
  state,
  activeTab,
  presentMode,
  onChangeTab,
  onClose,
  onSelectEvidenceToPresent,
  onInspectEvidence,
  onCombineThoughts,
}: CaseBinderProps) {
  const [akteSubTab, setAkteSubTab] = useState<AkteSubTab>('evidence');
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(
    state.collectedEvidence[0] ?? null
  );
  const [selectedThoughts, setSelectedThoughts] = useState<string[]>([]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const collectedItems = state.collectedEvidence
    .map((id) => gameCase.evidence[id])
    .filter(Boolean);

  const activeEvidence =
    collectedItems.find((item) => item.id === selectedEvidenceId) ??
    collectedItems[0] ??
    null;

  const getResolvedEvidenceText = (item: EvidenceItem) => {
    if (item.updatedByFlag && state.flags[item.updatedByFlag.flag]) {
      return {
        name: item.updatedByFlag.name ?? item.name,
        summary: item.updatedByFlag.summary ?? item.summary,
        detail: item.updatedByFlag.detail,
        isUpdated: true,
      };
    }
    return {
      name: item.name,
      summary: item.summary,
      detail: item.detail,
      isUpdated: false,
    };
  };

  const toggleThought = (id: string) => {
    setSelectedThoughts((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const handleCombineClick = () => {
    if (selectedThoughts.length !== 2) return;
    onCombineThoughts(selectedThoughts[0], selectedThoughts[1]);
    setSelectedThoughts([]);
  };

  const effectiveTab: BinderTab = presentMode ? 'akte' : activeTab;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/75 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Ermittlungsmappe"
      onClick={onClose}
    >
      <aside
        className="w-full max-w-md h-full flex flex-col bg-slate-900 border-l border-slate-800 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/60">
          <span className="font-display text-sm font-bold text-amber-400 tracking-wide">
            {presentMode ? 'Beweis vorlegen' : 'Ermittlungsmappe'}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Menü schließen"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Schließen</span>
          </button>
        </div>

        {/* Segmented Binder Tabs */}
        <div className="grid grid-cols-3 gap-1 p-1.5 bg-slate-950/70 border-b border-slate-800">
          <button
            type="button"
            onClick={() => onChangeTab('akte')}
            className={`flex items-center justify-center gap-1.5 px-2.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              effectiveTab === 'akte'
                ? 'bg-slate-800 text-amber-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            <span>Gerichtsakte</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeTab('notizbuch')}
            disabled={presentMode}
            className={`flex items-center justify-center gap-1.5 px-2.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-40 ${
              effectiveTab === 'notizbuch'
                ? 'bg-slate-800 text-amber-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Brain className="w-3.5 h-3.5 shrink-0" />
            <span>Notizbuch</span>
            <span className="font-mono-num text-[11px] text-slate-400">
              ({state.unlockedThoughts.length})
            </span>
          </button>

          <button
            type="button"
            onClick={() => onChangeTab('struktur')}
            disabled={presentMode}
            className={`flex items-center justify-center gap-1.5 px-2.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-40 ${
              effectiveTab === 'struktur'
                ? 'bg-slate-800 text-amber-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5 shrink-0" />
            <span>Struktur</span>
          </button>
        </div>

        {/* TAB 1: GERICHTSAKTEN (Beweise & Profile) */}
        {effectiveTab === 'akte' && (
          <div className="flex flex-col flex-1 min-h-0 p-4 gap-4 overflow-y-auto">
            {presentMode && (
              <div className="bg-red-950/50 border border-red-700/60 rounded-lg px-3.5 py-2.5 text-xs text-red-100">
                Wähle einen Beweis aus und klicke auf <strong className="font-semibold">„Präsentieren“</strong>, um ihn vorzulegen.
              </div>
            )}

            {/* Sub-tabs: Beweise / Personen */}
            {!presentMode && (
              <div className="flex items-center gap-1 p-1 bg-slate-950/60 rounded-lg border border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setAkteSubTab('evidence')}
                  className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    akteSubTab === 'evidence'
                      ? 'bg-slate-800 text-slate-100'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Beweise ({collectedItems.length})
                </button>
                <button
                  type="button"
                  onClick={() => setAkteSubTab('profiles')}
                  className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    akteSubTab === 'profiles'
                      ? 'bg-slate-800 text-slate-100'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Personen ({Object.keys(gameCase.characters).length})
                </button>
              </div>
            )}

            {(akteSubTab === 'evidence' || presentMode) ? (
              <div className="flex flex-col flex-1 min-h-0 gap-3">
                {/* List of collected evidence */}
                <div className="flex flex-col gap-1.5 overflow-y-auto pr-1 flex-1">
                  {collectedItems.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-lg">
                      Noch keine Beweise eingesammelt.
                    </div>
                  ) : (
                    collectedItems.map((item) => {
                      const isSelected = activeEvidence?.id === item.id;
                      const resolved = getResolvedEvidenceText(item);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedEvidenceId(item.id)}
                          className={`w-full text-left flex items-start gap-3 p-2.5 rounded-lg border transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-slate-800 border-amber-500/60 text-slate-100'
                              : 'bg-slate-950/40 border-slate-800/80 text-slate-300 hover:bg-slate-800/60'
                          }`}
                        >
                          <div className="mt-0.5">
                            <EvidenceIcon iconName={item.iconName} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-semibold truncate">{resolved.name}</span>
                              {resolved.isUpdated && (
                                <span className="text-[11px] font-medium text-amber-400 shrink-0">
                                  Aktualisiert
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                              {resolved.summary}
                            </p>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>

                {/* Detail Card */}
                {activeEvidence && (() => {
                  const activeResolved = getResolvedEvidenceText(activeEvidence);
                  return (
                    <div className="mt-auto bg-slate-950/70 border border-slate-800 rounded-lg p-3.5 space-y-2.5">
                      <div className="flex items-center gap-2.5">
                        <EvidenceIcon iconName={activeEvidence.iconName} />
                        <h4 className="text-sm font-semibold text-slate-100">
                          {activeResolved.name}
                        </h4>
                      </div>
                      <p className="text-xs leading-relaxed text-slate-300">
                        {activeResolved.detail}
                      </p>
                      <div className="flex flex-col gap-2 pt-0.5">
                        {presentMode && (
                          <button
                            type="button"
                            onClick={() => onSelectEvidenceToPresent(activeEvidence.id)}
                            className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                          >
                            „{activeResolved.name}“ präsentieren!
                          </button>
                        )}
                        {!presentMode && (
                          <button
                            type="button"
                            onClick={() => onInspectEvidence(activeEvidence.id)}
                            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                          >
                            <Search className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>Genauer untersuchen</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="flex flex-col gap-2.5 overflow-y-auto pr-1">
                {Object.values(gameCase.characters).map((char) => (
                  <div
                    key={char.id}
                    className="flex items-start gap-3 p-3 bg-slate-950/50 border border-slate-800/90 rounded-lg"
                  >
                    <div className="w-12 h-12 rounded-lg bg-slate-800 overflow-hidden shrink-0 border border-slate-700">
                      <CharacterPortrait character={char} size="card" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <h4 className="text-sm font-semibold text-slate-100">{char.name}</h4>
                        <span className="text-xs text-amber-400/90">{char.role}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{char.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: NOTIZBUCH (GEDANKEN VERBINDEN) */}
        {effectiveTab === 'notizbuch' && (
          <div className="flex flex-col flex-1 min-h-0 p-4 gap-3.5">
            <div className="text-xs text-slate-400 leading-relaxed">
              Wähle <strong className="text-slate-200">zwei zusammengehörige Hinweise</strong> aus und klicke auf „Verbinden“, um eine neue Schlussfolgerung zu ziehen.
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {state.unlockedThoughts.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-lg">
                  Noch keine Gedanken notiert. Untersuche den Tatort und sprich mit Personen.
                </div>
              ) : (
                state.unlockedThoughts.map((thoughtId) => {
                  const node = gameCase.thoughts[thoughtId];
                  if (!node) return null;
                  const isSelected = selectedThoughts.includes(thoughtId);
                  const isDeduction = node.kind === 'deduction';

                  return (
                    <button
                      key={thoughtId}
                      type="button"
                      onClick={() => !isDeduction && toggleThought(thoughtId)}
                      disabled={isDeduction}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        isDeduction
                          ? 'bg-amber-950/25 border-amber-600/40 cursor-default'
                          : isSelected
                            ? 'bg-blue-950/60 border-blue-400 cursor-pointer'
                            : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-100">
                          {node.title}
                        </span>
                        <span className="text-[11px] text-slate-400 shrink-0">
                          {isDeduction ? 'Schlussfolgerung' : isSelected ? 'Ausgewählt' : 'Hinweis'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {node.detail}
                      </p>
                    </button>
                  );
                })
              )}
            </div>

            <button
              type="button"
              onClick={handleCombineClick}
              disabled={selectedThoughts.length !== 2}
              className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 text-xs font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer disabled:cursor-not-allowed"
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>
                {selectedThoughts.length === 2
                  ? 'Ausgewählte Gedanken verbinden'
                  : `Gedanken verbinden (${selectedThoughts.length}/2)`}
              </span>
            </button>
          </div>
        )}

        {/* TAB 3: LIVE FALL-STRUKTUR INSPEKTOR */}
        {effectiveTab === 'struktur' && (
          <div className="flex flex-col flex-1 min-h-0 p-4 gap-4 overflow-y-auto text-xs">
            <p className="text-slate-400 leading-relaxed">
              Hier siehst du live, wie das Gerüst deinen Spielfortschritt über <strong className="text-slate-200">Flags</strong>, <strong className="text-slate-200">Schauplätze</strong> und <strong className="text-slate-200">Logik-Ketten</strong> steuert:
            </p>

            <div className="space-y-2">
              <h4 className="font-semibold text-slate-200">Freigeschaltete Schauplätze</h4>
              <div className="space-y-1.5">
                {Object.values(gameCase.locations).map((loc) => {
                  const unlocked = state.unlockedLocations.includes(loc.id);
                  const current = state.currentLocationId === loc.id;
                  return (
                    <div
                      key={loc.id}
                      className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-950/60 border border-slate-800"
                    >
                      <span className={unlocked ? 'text-slate-200 font-medium' : 'text-slate-500'}>
                        {loc.name}
                      </span>
                      <span className="font-mono-num text-[11px] text-slate-400">
                        {current ? 'Aktiv' : unlocked ? 'Frei' : 'Gesperrt'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-slate-200">Gelöste Notizbuch-Kombinationen</h4>
              <div className="space-y-1.5">
                {gameCase.logicCombinations.map((combo) => {
                  const solved = state.solvedDeductions.includes(combo.id);
                  return (
                    <div
                      key={combo.id}
                      className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-950/60 border border-slate-800"
                    >
                      <span className="text-slate-300 truncate pr-2">{combo.id}</span>
                      <span className={`font-mono-num text-[11px] ${solved ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {solved ? 'Gelöst' : 'Offen'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-slate-200">Aktive Story-Flags</h4>
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 font-mono-num text-[11px] text-slate-300 space-y-1">
                {Object.keys(state.flags).length === 0 ? (
                  <span className="text-slate-500">Noch keine Flags gesetzt.</span>
                ) : (
                  Object.entries(state.flags).map(([key, val]) => (
                    <div key={key} className="flex justify-between gap-2">
                      <span className="truncate text-amber-300/90">{key}</span>
                      <span>{String(val)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
