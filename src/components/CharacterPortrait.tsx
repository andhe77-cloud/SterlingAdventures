import { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import type { Character, Emotion, PortraitAnimation } from '../types/game';
import { getCachedCutoutUrl, removeChromaBackground } from '../utils/chromaKey';

interface CharacterPortraitProps {
  character: Character;
  emotion?: Emotion;
  animation?: PortraitAnimation;
  lineKey?: string;
  size?: 'stage' | 'card';
  isSpeaking?: boolean;
  isTyping?: boolean;
}

export function resolvePortraitUrl(character: Character, emotion: Emotion = 'neutral'): string {
  return character.portraits?.[emotion] ?? character.portraitUrl;
}

function resolveAnimationClass(
  emotion: Emotion,
  animation?: PortraitAnimation,
  isSpeaking?: boolean
): string {
  const effective: PortraitAnimation | null =
    animation ??
    (emotion === 'facepalm'
      ? 'facepalm'
      : emotion === 'headshake'
        ? 'headshake'
        : emotion === 'shocked'
          ? 'shock'
          : emotion === 'sweating' && isSpeaking
            ? 'tremble'
            : null);

  switch (effective) {
    case 'facepalm':
      return 'animate-portrait-facepalm';
    case 'headshake':
      return 'animate-portrait-headshake';
    case 'nod':
      return 'animate-portrait-nod';
    case 'shock':
      return 'animate-portrait-shock';
    case 'slam':
      return 'animate-portrait-slam';
    case 'tremble':
      return 'animate-portrait-tremble';
    default:
      return 'animate-portrait-pop';
  }
}

export function CharacterPortrait({
  character,
  emotion = 'neutral',
  animation,
  lineKey,
  size = 'stage',
  isSpeaking = false,
  isTyping = false,
}: CharacterPortraitProps) {
  const rawUrl = resolvePortraitUrl(character, emotion);
  const [cutoutUrl, setCutoutUrl] = useState<string | null>(() => getCachedCutoutUrl(rawUrl));
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setImgError(false);

    const cached = getCachedCutoutUrl(rawUrl);
    if (cached) {
      setCutoutUrl(cached);
      return;
    }

    setCutoutUrl(null);
    void removeChromaBackground(rawUrl).then((processed) => {
      if (!cancelled) {
        setCutoutUrl(processed);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [rawUrl]);

  if (size === 'card') {
    if (imgError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400">
          <User className="w-5 h-5" />
        </div>
      );
    }

    return cutoutUrl ? (
      <img
        src={cutoutUrl}
        alt={character.name}
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
        className="w-full h-full object-cover object-top select-none"
      />
    ) : (
      <div className="w-full h-full bg-slate-800/70" />
    );
  }

  const entranceClass =
    character.side === 'left'
      ? 'animate-portrait-left'
      : character.side === 'right'
        ? 'animate-portrait-right'
        : 'animate-portrait-pop';

  const emotionScaleClass =
    emotion === 'shocked' || emotion === 'confident' ? 'scale-[1.03]' : 'scale-100';

  const reactionAnimClass = resolveAnimationClass(emotion, animation, isSpeaking);
  const reactionKey =
    animation || emotion === 'facepalm' || emotion === 'headshake'
      ? `${character.id}-${emotion}-${animation ?? 'auto'}-${lineKey ?? ''}`
      : `${character.id}-${emotion}`;

  const speakingBobClass =
    isSpeaking &&
    isTyping &&
    emotion !== 'facepalm' &&
    emotion !== 'headshake'
      ? 'animate-speaking-bob'
      : '';

  return (
    <div
      key={character.id}
      className={`relative h-full flex items-end justify-center ${entranceClass}`}
    >
      <div
        key={reactionKey}
        className={`relative h-full flex items-end justify-center transition-all duration-200 ${reactionAnimClass} ${emotionScaleClass} ${
          isSpeaking ? 'brightness-105 opacity-100' : 'brightness-90 opacity-95'
        }`}
      >
        <div className={`h-full flex items-end justify-center ${speakingBobClass}`}>
          {!imgError ? (
            cutoutUrl ? (
              <img
                src={cutoutUrl}
                alt={character.name}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="h-full w-auto max-w-none object-contain object-bottom select-none drop-shadow-[0_14px_24px_rgba(0,0,0,0.72)]"
              />
            ) : null
          ) : (
            <div className="w-40 h-48 mb-2 flex flex-col items-center justify-center rounded-xl bg-slate-900/80 border border-slate-700/60 p-4 text-center">
              <User className="w-12 h-12 text-slate-400 mb-2" />
              <span className="text-xs font-semibold text-slate-200">{character.name}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
