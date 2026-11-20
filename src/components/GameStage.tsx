import { useEffect, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Compass,
  Eye,
  Gavel,
  Hand,
  MessageSquare,
  Moon,
  ShieldAlert,
  Sun,
} from 'lucide-react';
import type {
  Character,
  DialogLine,
  GameCase,
  GameSaveState,
  LocationScene,
  ShoutType,
  TestimonyStatement,
} from '../types/game';
import { CharacterPortrait } from './CharacterPortrait';
import { ShoutOverlay } from './ShoutOverlay';
import { preloadCharacterSprites } from '../utils/chromaKey';
import { soundFx } from '../utils/soundFx';

export type InvestigationMenu = 'none' | 'inspect' | 'talk' | 'travel';

interface GameStageProps {
  gameCase: GameCase;
  state: GameSaveState;
  location: LocationScene;
  presentCharacters: Character[];
  dialogQueue: DialogLine[];
  activeShout: ShoutType | null;
  stageShake: boolean;
  presentMode: boolean;
  investigationMenu: InvestigationMenu;
  visibleStatements: TestimonyStatement[];
  onAdvanceDialog: () => void;
  onSelectChoice: (choiceIndex: number) => void;
  onSetInvestigationMenu: (menu: InvestigationMenu) => void;
  onInspectHotspot: (hotspotId: string) => void;
  onInspectEmpty: () => void;
  onSelectTalkTopic: (topicId: string) => void;
  onTravelTo: (locationId: string) => void;
  onTogglePresentMode: () => void;
  onNavigateStatement: (delta: number) => void;
  onPressStatement: () => void;
  onConfirmChapterTransition: () => void;
}

export function GameStage({
  gameCase,
  state,
  location,
  presentCharacters,
  dialogQueue,
  activeShout,
  stageShake,
  presentMode,
  investigationMenu,
  visibleStatements,
  onAdvanceDialog,
  onSelectChoice,
  onSetInvestigationMenu,
  onInspectHotspot,
  onInspectEmpty,
  onSelectTalkTopic,
  onTravelTo,
  onTogglePresentMode,
  onNavigateStatement,
  onPressStatement,
  onConfirmChapterTransition,
}: GameStageProps) {
  const [imgError, setImgError] = useState(false);
  const currentLine = dialogQueue[0] ?? null;
  const [typedCount, setTypedCount] = useState(0);

  const activeBackgroundUrl =
    location.alternateBackground && state.flags[location.alternateBackground.flag]
      ? location.alternateBackground.backgroundUrl
      : location.backgroundUrl;

  // Reset image error state when location or background variant changes
  useEffect(() => {
    setImgError(false);
  }, [activeBackgroundUrl]);

  // Pre-process all chroma-key character cutouts for instant speaker/emotion switches
  useEffect(() => {
    const urls: string[] = [];
    for (const char of Object.values(gameCase.characters)) {
      if (char.portraitUrl) urls.push(char.portraitUrl);
      if (char.portraits) {
        for (const variant of Object.values(char.portraits)) {
          if (variant) urls.push(variant);
        }
      }
    }
    preloadCharacterSprites(urls);
  }, [gameCase]);

  // Typewriter reveal for current dialog line with speaker-pitched Ace-Attorney text blips
  useEffect(() => {
    if (!currentLine) {
      setTypedCount(0);
      return;
    }
    setTypedCount(0);
    const total = currentLine.text.length;
    const isInnerThought = currentLine.text.trimStart().startsWith('(');
    const startedAt = performance.now();
    let cursor = 0;
    let tick = 0;

    const interval = window.setInterval(() => {
      cursor = Math.min(total, cursor + 2);
      tick += 1;
      setTypedCount(cursor);

      if (cursor >= total) {
        window.clearInterval(interval);
        return;
      }

      const shoutDelayActive =
        Boolean(currentLine.shout) && performance.now() - startedAt < 950;

      if (!shoutDelayActive && tick % 3 === 1) {
        const chunk = currentLine.text.slice(Math.max(0, cursor - 2), cursor);
        if (/[A-Za-zÄÖÜäöüß0-9]/.test(chunk)) {
          soundFx.playTextBlip(currentLine.speakerId, isInnerThought);
        }
      }
    }, 18);

    return () => window.clearInterval(interval);
  }, [currentLine]);

  const isTyping = currentLine ? typedCount < currentLine.text.length : false;

  const handleDialogClick = () => {
    if (!currentLine) return;
    if (isTyping) {
      setTypedCount(currentLine.text.length);
      return;
    }
    if (currentLine.choices || currentLine.requiresFinalEvidencePrompt) {
      return;
    }
    onAdvanceDialog();
  };

  // Determine active speaker portrait & emotion from DialogLine (or court witness fallback)
  const testimony = state.activeTestimonyId
    ? gameCase.testimonies[state.activeTestimonyId]
    : null;

  const activeSpeakerId =
    currentLine?.speakerId ||
    (state.phase === 'court' && testimony ? testimony.witnessId : null);

  const activeSpeaker = activeSpeakerId ? gameCase.characters[activeSpeakerId] : null;
  const stageEmotion = currentLine?.emotion ?? 'neutral';

  const portraitAlignmentClass = (() => {
    if (!activeSpeaker?.side || activeSpeaker.side === 'center') {
      return 'justify-center';
    }
    return activeSpeaker.side === 'left'
      ? 'justify-start pl-4 sm:pl-10'
      : 'justify-end pr-4 sm:pr-10';
  })();

  const showRoomCast =
    !currentLine &&
    !state.pendingChapterTransition &&
    investigationMenu !== 'inspect' &&
    state.phase !== 'court' &&
    presentCharacters.length > 0;

  const showActiveSpeaker =
    (Boolean(currentLine) || state.phase === 'court') &&
    Boolean(activeSpeaker) &&
    !state.pendingChapterTransition &&
    investigationMenu !== 'inspect';

  const currentStatement =
    testimony && visibleStatements.length > 0
      ? visibleStatements[Math.min(state.statementIndex, visibleStatements.length - 1)]
      : null;

  const visibleHotspots = location.hotspots.filter(
    (hs) =>
      (!hs.visibleIfFlag || state.flags[hs.visibleIfFlag]) &&
      (!hs.hideIfFlag || !state.flags[hs.hideIfFlag])
  );

  const visibleTopics = location.talkTopics.filter(
    (t) =>
      (!t.requiredFlag || state.flags[t.requiredFlag]) &&
      (!t.hideIfFlag || !state.flags[t.hideIfFlag])
  );

  const activeChapter = gameCase.chapters?.[state.currentChapterId];

  return (
    <div className="flex flex-col gap-3">
      {/* 16:9 Stage Viewport */}
      <div
        className={`relative w-full aspect-video rounded-xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl ${
          stageShake ? 'animate-stage-shake' : ''
        }`}
      >
        {/* Background Image with resilient fallback */}
        {!imgError ? (
          <img
            src={activeBackgroundUrl}
            alt={location.name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover select-none"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex flex-col items-center justify-center p-6 text-center">
            <Compass className="w-10 h-10 text-amber-400/70 mb-2" />
            <p className="font-display text-lg text-slate-200">{location.name}</p>
            <p className="text-xs text-slate-400 mt-1">{location.subtitle}</p>
          </div>
        )}

        {/* Measured contrast scrim at bottom for character grounding */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-slate-950/85 via-slate-950/35 to-transparent" />

        {/* Scene Label + Day/Evening Indicator */}
        <div className="pointer-events-none absolute top-3 left-3 z-20 bg-slate-950/85 backdrop-blur-sm border border-slate-700/70 rounded-lg px-3 py-1.5">
          <div className="flex items-center gap-2">
            {activeChapter && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300">
                {activeChapter.timeOfDay === 'abend' ? (
                  <Moon className="w-3 h-3 shrink-0" />
                ) : (
                  <Sun className="w-3 h-3 shrink-0" />
                )}
                <span>{activeChapter.dayLabel}</span>
              </span>
            )}
            {activeChapter && <span className="text-slate-600">·</span>}
            <span className="text-xs font-semibold text-slate-100">{location.name}</span>
          </div>
          <div className="text-[11px] text-slate-400">{location.subtitle}</div>
        </div>

        {/* Inspect Mode: Clean invisible hotspots over the scene for self-discovery */}
        {investigationMenu === 'inspect' && !currentLine && (
          <div
            onClick={onInspectEmpty}
            className="absolute inset-0 z-20 cursor-zoom-in"
          >
            {visibleHotspots.map((hs) => (
              <button
                key={hs.id}
                type="button"
                aria-label={hs.label}
                onClick={(e) => {
                  e.stopPropagation();
                  onInspectHotspot(hs.id);
                }}
                style={{
                  left: `${hs.x}%`,
                  top: `${hs.y}%`,
                  width: `${hs.width}%`,
                  height: `${hs.height}%`,
                }}
                className="absolute bg-transparent border-0 cursor-zoom-in focus:outline-none"
              />
            ))}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSetInvestigationMenu('none');
              }}
              className="absolute top-3 right-3 bg-slate-950/90 hover:bg-slate-900 border border-slate-700 text-slate-100 text-xs font-semibold px-3.5 py-2 rounded-lg cursor-pointer shadow-lg"
            >
              Untersuchen beenden
            </button>
          </div>
        )}

        {/* Idle Room Presence: Show ALL people currently in the room side by side */}
        {showRoomCast && (
          <div
            className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[78%] sm:h-[83%] flex items-end ${
              presentCharacters.length === 1
                ? presentCharacters[0].side === 'left'
                  ? 'justify-start pl-4 sm:pl-10'
                  : presentCharacters[0].side === 'center'
                    ? 'justify-center'
                    : 'justify-end pr-4 sm:pr-10'
                : 'justify-between px-3 sm:px-8'
            }`}
          >
            {presentCharacters.map((char) => (
              <div key={char.id} className="h-full flex items-end">
                <CharacterPortrait
                  character={char}
                  emotion="neutral"
                  size="stage"
                  isSpeaking
                />
              </div>
            ))}
          </div>
        )}

        {/* Active Dialog or Court Speaker Cutout Portrait */}
        {showActiveSpeaker && activeSpeaker && (
          <div
            className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[80%] sm:h-[85%] flex items-end ${portraitAlignmentClass}`}
          >
            <CharacterPortrait
              character={activeSpeaker}
              emotion={stageEmotion}
              animation={currentLine?.animation}
              lineKey={currentLine ? `${currentLine.speakerId}-${currentLine.text.slice(0, 24)}` : 'court'}
              size="stage"
              isSpeaking={Boolean(currentLine)}
              isTyping={isTyping}
            />
          </div>
        )}

        {/* Chapter Completed Transition Overlay */}
        {state.pendingChapterTransition && (
          <div className="absolute inset-0 z-30 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-5">
            <div className="max-w-lg w-full bg-slate-900 border border-amber-500/40 rounded-xl p-6 text-center space-y-4 shadow-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-amber-300 uppercase">
                <Moon className="w-4 h-4 shrink-0" />
                <span>{state.pendingChapterTransition.completedTimeLabel}</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-slate-50">
                {state.pendingChapterTransition.completedChapterTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {state.pendingChapterTransition.summary}
              </p>
              <button
                type="button"
                onClick={onConfirmChapterTransition}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer"
              >
                {state.pendingChapterTransition.nextTimeOfDay === 'abend' ? (
                  <Moon className="w-4 h-4 shrink-0" />
                ) : (
                  <Sun className="w-4 h-4 shrink-0" />
                )}
                <span>
                  {state.pendingChapterTransition.nextButtonLabel ??
                    'Nächstes Kapitel starten'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Shout Splash */}
        <ShoutOverlay shout={activeShout} />
      </div>

      {/* Bottom Interactive Console */}
      {state.pendingChapterTransition ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center text-xs text-slate-400">
          Kapitel abgeschlossen. Klicke oben auf „Weiter“, um den nächsten Tagesabschnitt zu beginnen.
        </div>
      ) : currentLine ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-3">
          {/* Speaker Nameplate */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span
                className="inline-block w-2.5 h-2.5 rounded-sm shrink-0"
                style={{
                  backgroundColor:
                    gameCase.characters[currentLine.speakerId]?.accentColor ?? '#f59e0b',
                }}
              />
              <span className="text-sm font-bold text-slate-100">
                {gameCase.characters[currentLine.speakerId]?.name ?? currentLine.speakerId}
              </span>
              <span className="text-xs text-slate-400">
                {gameCase.characters[currentLine.speakerId]?.role}
              </span>
            </div>

            {!currentLine.choices && !currentLine.requiresFinalEvidencePrompt && (
              <span className="text-xs text-slate-400">
                {isTyping ? 'Klicken zum Überspringen' : 'Weiter (Klick / Leertaste)'}
              </span>
            )}
          </div>

          {/* Typewriter Text */}
          <div
            onClick={handleDialogClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleDialogClick();
              }
            }}
            className="min-h-[4.5rem] text-sm sm:text-base leading-relaxed text-slate-100 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-md"
          >
            {currentLine.text.slice(0, typedCount)}
          </div>

          {/* Branching Choices */}
          {!isTyping && currentLine.choices && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {currentLine.choices.map((choice, idx) => (
                <button
                  key={choice.label}
                  type="button"
                  onClick={() => onSelectChoice(idx)}
                  className="text-left px-4 py-2.5 bg-slate-800 hover:bg-blue-700 border border-slate-700 hover:border-blue-400 text-slate-100 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer"
                >
                  {choice.label}
                </button>
              ))}
            </div>
          )}

          {/* Final Evidence Prompt */}
          {!isTyping && currentLine.requiresFinalEvidencePrompt && (
            <div className="bg-amber-950/35 border border-amber-600/50 rounded-lg p-3 text-xs text-amber-100 flex items-center justify-between gap-3">
              <span>{currentLine.requiresFinalEvidencePrompt.question}</span>
              <span className="font-semibold text-amber-300 shrink-0">
                Oben über „Gerichtsakte“ vorlegen ↑
              </span>
            </div>
          )}
        </div>
      ) : state.phase === 'court' && testimony && currentStatement ? (
        /* CROSS-EXAMINATION INTERFACE */
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
              <Gavel className="w-4 h-4 shrink-0" />
              <span>{testimony.title}</span>
            </div>
            <span className="font-mono-num text-xs text-slate-400">
              Aussage {state.statementIndex + 1} / {visibleStatements.length}
            </span>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-4 text-sm sm:text-base leading-relaxed text-emerald-100">
            „{currentStatement.text}“
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2.5">
            {/* Pager */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  soundFx.play('page_turn');
                  onNavigateStatement(-1);
                }}
                className="flex items-center gap-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Vorherige</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  soundFx.play('page_turn');
                  onNavigateStatement(1);
                }}
                className="flex items-center gap-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Nächste</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Ace Attorney Core Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onPressStatement}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Hand className="w-4 h-4 shrink-0" />
                <span>Moment mal! (Nachhaken)</span>
              </button>
              <button
                type="button"
                onClick={onTogglePresentMode}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  presentMode
                    ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                    : 'bg-red-600 hover:bg-red-500 text-white'
                }`}
              >
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{presentMode ? 'Abbrechen' : 'Einspruch! (Beweis)'}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* INVESTIGATION ACTION BAR */
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => {
                soundFx.play('page_turn');
                onSetInvestigationMenu(
                  investigationMenu === 'inspect' ? 'none' : 'inspect'
                );
              }}
              disabled={visibleHotspots.length === 0}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                investigationMenu === 'inspect'
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border-slate-700'
              }`}
            >
              <Eye className="w-4 h-4 shrink-0" />
              <span>Untersuchen</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundFx.play('page_turn');
                onSetInvestigationMenu(investigationMenu === 'talk' ? 'none' : 'talk');
              }}
              disabled={visibleTopics.length === 0}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap cursor-pointer disabled:opacity-40 ${
                investigationMenu === 'talk'
                  ? 'bg-blue-600 text-white border-blue-400'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border-slate-700'
              }`}
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span>Reden</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundFx.play('page_turn');
                onTogglePresentMode();
              }}
              disabled={presentCharacters.length === 0}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap cursor-pointer disabled:opacity-40 ${
                presentMode
                  ? 'bg-red-600 text-white border-red-400'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border-slate-700'
              }`}
            >
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{presentMode ? 'Abbrechen' : 'Präsentieren'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundFx.play('page_turn');
                onSetInvestigationMenu(
                  investigationMenu === 'travel' ? 'none' : 'travel'
                );
              }}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
                investigationMenu === 'travel'
                  ? 'bg-emerald-600 text-white border-emerald-400'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border-slate-700'
              }`}
            >
              <Compass className="w-4 h-4 shrink-0" />
              <span>Reisen</span>
            </button>
          </div>

          {/* Sub-menu: Talk Topics (with Speaker badge & New indicator) */}
          {investigationMenu === 'talk' && (
            <div className="pt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {visibleTopics.map((topic) => {
                const visited = state.visitedTopics.includes(topic.id);
                const speaker = topic.speakerId
                  ? gameCase.characters[topic.speakerId]
                  : presentCharacters[0] ?? null;
                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => onSelectTalkTopic(topic.id)}
                    className="flex items-center justify-between gap-2 text-left px-3.5 py-2.5 bg-slate-950/70 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-medium text-slate-100 transition-colors cursor-pointer"
                  >
                    <div className="min-w-0 flex items-center gap-2">
                      {speaker && (
                        <span
                          className="w-2 h-2 rounded-sm shrink-0"
                          style={{ backgroundColor: speaker.accentColor }}
                        />
                      )}
                      <div className="min-w-0">
                        {speaker && presentCharacters.length > 1 && (
                          <div className="text-[11px] text-slate-400 truncate">
                            {speaker.name}
                          </div>
                        )}
                        <div className="truncate">{topic.title}</div>
                      </div>
                    </div>
                    {visited ? (
                      <span className="text-[11px] text-emerald-400 shrink-0">
                        Gelesen
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-amber-300 shrink-0">
                        Neu
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Sub-menu: Travel Locations */}
          {investigationMenu === 'travel' && (
            <div className="pt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {state.unlockedLocations.map((locId) => {
                const target = gameCase.locations[locId];
                if (!target) return null;
                const isHere = locId === location.id;
                return (
                  <button
                    key={locId}
                    type="button"
                    disabled={isHere}
                    onClick={() => onTravelTo(locId)}
                    className={`flex items-center justify-between gap-2 text-left px-3.5 py-2.5 rounded-lg border text-xs transition-colors ${
                      isHere
                        ? 'bg-slate-800/60 border-amber-500/40 text-amber-300 cursor-default'
                        : 'bg-slate-950/70 hover:bg-slate-800 border-slate-800 text-slate-100 cursor-pointer'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="font-semibold truncate">{target.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {target.subtitle}
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0">
                      {isHere ? 'Aktuell' : 'Hinreisen'}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
