import type { ShoutType, SoundEffect } from '../types/game';
import einspruchWav from '../assets/audio/einspruch.wav';
import momentMalWav from '../assets/audio/moment_mal.wav';
import volltrefferWav from '../assets/audio/volltreffer.wav';
import nichtSchuldigWav from '../assets/audio/nicht_schuldig.wav';

const SHOUT_AUDIO_URLS: Record<ShoutType, string> = {
  'EINSPRUCH!': einspruchWav,
  'MOMENT MAL!': momentMalWav,
  'VOLLTREFFER!': volltrefferWav,
  'NICHT SCHULDIG!': nichtSchuldigWav,
};

const SHOUT_SPOKEN_TEXT: Record<ShoutType, string> = {
  'EINSPRUCH!': 'Einspruch!',
  'MOMENT MAL!': 'Moment mal!',
  'VOLLTREFFER!': 'Volltreffer!',
  'NICHT SCHULDIG!': 'Nicht schuldig!',
};

class SoundEngine {
  private ctx: AudioContext | null = null;
  private pianoTimer: number | null = null;
  private pianoFadeTimer: number | null = null;
  private pianoMasterGain: GainNode | null = null;
  private pianoStep = 0;
  private greekTimer: number | null = null;
  private greekFadeTimer: number | null = null;
  private greekMasterGain: GainNode | null = null;
  private greekStep = 0;
  private rawShoutBytes = new Map<ShoutType, ArrayBuffer>();
  private decodedShouts = new Map<ShoutType, AudioBuffer>();
  private shoutPreloadStarted = false;
  public muted = false;

  private getContext(): AudioContext | null {
    if (this.muted || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public preloadShouts(): void {
    if (this.shoutPreloadStarted || typeof window === 'undefined') return;
    this.shoutPreloadStarted = true;

    (Object.entries(SHOUT_AUDIO_URLS) as Array<[ShoutType, string]>).forEach(
      ([shout, url]) => {
        fetch(url)
          .then((res) => {
            if (!res.ok) throw new Error('Audio unavailable');
            return res.arrayBuffer();
          })
          .then((buf) => {
            this.rawShoutBytes.set(shout, buf);
            const ctx = this.getContext();
            if (ctx) {
              void this.decodeAndStore(ctx, shout, buf);
            }
          })
          .catch(() => {
            // Fallback handled in playShout
          });
      }
    );
  }

  private async decodeAndStore(
    ctx: AudioContext,
    shout: ShoutType,
    raw: ArrayBuffer
  ): Promise<AudioBuffer | null> {
    const existing = this.decodedShouts.get(shout);
    if (existing) return existing;
    try {
      const decoded = await ctx.decodeAudioData(raw.slice(0));
      this.decodedShouts.set(shout, decoded);
      return decoded;
    } catch {
      return null;
    }
  }

  public playShout(shout: ShoutType): void {
    if (this.muted) return;
    const ctx = this.getContext();
    if (ctx) {
      this.playShoutImpact(ctx, shout);
    }

    const decoded = this.decodedShouts.get(shout);
    if (ctx && decoded) {
      this.playBoostedVoiceBuffer(ctx, decoded);
      return;
    }

    const raw = this.rawShoutBytes.get(shout);
    if (ctx && raw) {
      void this.decodeAndStore(ctx, shout, raw).then((buf) => {
        if (buf && !this.muted) {
          this.playBoostedVoiceBuffer(ctx, buf);
        } else {
          this.speakFallback(shout);
        }
      });
      return;
    }

    // Load bundled static WAV if preload hasn't finished yet
    fetch(SHOUT_AUDIO_URLS[shout])
      .then((res) => {
        if (!res.ok) throw new Error('Static shout WAV unavailable');
        return res.arrayBuffer();
      })
      .then((buf) => {
        this.rawShoutBytes.set(shout, buf);
        if (ctx && !this.muted) {
          return this.decodeAndStore(ctx, shout, buf).then((decodedBuf) => {
            if (decodedBuf && !this.muted) {
              this.playBoostedVoiceBuffer(ctx, decodedBuf);
            } else {
              this.speakFallback(shout);
            }
          });
        }
        return undefined;
      })
      .catch(() => {
        this.speakFallback(shout);
      });
  }

  private playBoostedVoiceBuffer(ctx: AudioContext, buffer: AudioBuffer): void {
    const startAt = ctx.currentTime + 0.01;

    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-18, startAt);
    compressor.knee.setValueAtTime(10, startAt);
    compressor.ratio.setValueAtTime(8, startAt);
    compressor.attack.setValueAtTime(0.003, startAt);
    compressor.release.setValueAtTime(0.15, startAt);

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(1.85, startAt);

    // Dry punchy vocal
    const srcDry = ctx.createBufferSource();
    srcDry.buffer = buffer;
    srcDry.connect(compressor);

    // Subtle courtroom slap-reverb layer for dramatic presence
    const delay = ctx.createDelay();
    delay.delayTime.setValueAtTime(0.068, startAt);
    const echoGain = ctx.createGain();
    echoGain.gain.setValueAtTime(0.24, startAt);

    srcDry.connect(delay);
    delay.connect(echoGain);
    echoGain.connect(compressor);

    compressor.connect(masterGain);
    masterGain.connect(ctx.destination);

    srcDry.start(startAt);
  }

  private playShoutImpact(ctx: AudioContext, shout: ShoutType): void {
    const now = ctx.currentTime;

    // 1. Courtroom desk slam (short filtered noise burst + heavy sub punch)
    const slapLen = Math.floor(ctx.sampleRate * 0.085);
    const noiseBuf = ctx.createBuffer(1, slapLen, ctx.sampleRate);
    const ch = noiseBuf.getChannelData(0);
    for (let i = 0; i < slapLen; i++) {
      ch[i] = (Math.random() * 2 - 1) * Math.exp(-i / (slapLen * 0.28));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuf;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(950, now);
    filter.Q.setValueAtTime(1.1, now);
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.45, now);
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);

    // Sub-bass desk thud
    this.tone(ctx, 125, 0.2, 'sine', 0.34, now, 38);

    // 2. Keep EINSPRUCH!/MOMENT MAL! vocal frequencies clean (only punchy sub-slam, no high synth beep).
    // Play celebratory fanfare chord gently for VOLLTREFFER! / NICHT SCHULDIG!
    if (shout === 'VOLLTREFFER!') {
      this.tone(ctx, 523.25, 0.12, 'triangle', 0.07, now + 0.25);
      this.tone(ctx, 659.25, 0.14, 'triangle', 0.08, now + 0.34);
      this.tone(ctx, 783.99, 0.34, 'triangle', 0.09, now + 0.43);
    } else if (shout === 'NICHT SCHULDIG!') {
      this.tone(ctx, 523.25, 0.14, 'triangle', 0.07, now + 0.35);
      this.tone(ctx, 659.25, 0.14, 'triangle', 0.07, now + 0.46);
      this.tone(ctx, 783.99, 0.16, 'triangle', 0.08, now + 0.57);
      this.tone(ctx, 1046.5, 0.45, 'triangle', 0.1, now + 0.68);
    }
  }

  private speakFallback(shout: ShoutType): void {
    if (this.muted || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(SHOUT_SPOKEN_TEXT[shout]);
      utter.lang = 'de-DE';
      utter.rate = shout === 'NICHT SCHULDIG!' ? 0.95 : 1.15;
      utter.pitch = shout === 'NICHT SCHULDIG!' ? 0.78 : 0.92;
      utter.volume = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const germanVoice =
        voices.find((v) => v.lang.toLowerCase().startsWith('de')) ?? null;
      if (germanVoice) {
        utter.voice = germanVoice;
      }
      window.speechSynthesis.speak(utter);
    } catch {
      // Ignore speech synthesis restrictions
    }
  }

  private speakerPitchHz(speakerId: string, isInnerThought?: boolean): number {
    if (isInnerThought) return 395;
    switch (speakerId) {
      case 'pendelton':
        return 275;
      case 'marston':
        return 335;
      case 'falk':
        return 365;
      case 'arthur':
        return 390;
      case 'nate':
        return 435;
      case 'anya':
        return 520;
      case 'maya':
        return 585;
      default:
        return 460;
    }
  }

  public playTextBlip(speakerId: string, isInnerThought = false): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const baseHz = this.speakerPitchHz(speakerId, isInnerThought);
    const jitter = 0.96 + Math.random() * 0.08;
    const freq = baseHz * jitter;

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = isInnerThought || speakerId === 'maya' || speakerId === 'anya' ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.92, now + 0.028);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(isInnerThought ? 1100 : 1750, now);

    const vol = isInnerThought ? 0.024 : 0.042;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(vol, now + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.03);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.036);
  }

  private playNoiseBurst(
    ctx: AudioContext,
    duration: number,
    filterType: BiquadFilterType,
    centerFreq: number,
    q: number,
    volume: number,
    startTime: number
  ): void {
    const len = Math.max(1, Math.floor(ctx.sampleRate * duration));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len * 0.35));
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;

    const filter = ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.setValueAtTime(centerFreq, startTime);
    filter.Q.setValueAtTime(q, startTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, startTime);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start(startTime);
  }

  public play(effect: SoundEffect): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    switch (effect) {
      case 'blip': {
        this.playTextBlip('nate', false);
        break;
      }
      case 'gavel': {
        this.playNoiseBurst(ctx, 0.06, 'bandpass', 620, 1.4, 0.25, now);
        this.tone(ctx, 135, 0.15, 'sine', 0.24, now, 52);
        this.tone(ctx, 215, 0.09, 'triangle', 0.13, now + 0.01, 90);
        break;
      }
      case 'gavel_double': {
        for (const offset of [0, 0.16, 0.33]) {
          const isFinal = offset === 0.33;
          this.playNoiseBurst(
            ctx,
            isFinal ? 0.075 : 0.05,
            'bandpass',
            isFinal ? 640 : 720,
            1.3,
            isFinal ? 0.3 : 0.2,
            now + offset
          );
          this.tone(
            ctx,
            isFinal ? 132 : 148,
            isFinal ? 0.18 : 0.11,
            'sine',
            isFinal ? 0.28 : 0.18,
            now + offset,
            52
          );
        }
        break;
      }
      case 'objection': {
        this.tone(ctx, 330, 0.12, 'sawtooth', 0.12, now);
        this.tone(ctx, 440, 0.18, 'sawtooth', 0.14, now + 0.06);
        this.tone(ctx, 659.25, 0.34, 'triangle', 0.18, now + 0.12);
        break;
      }
      case 'deduction': {
        this.tone(ctx, 523.25, 0.12, 'sine', 0.12, now);
        this.tone(ctx, 659.25, 0.12, 'sine', 0.12, now + 0.09);
        this.tone(ctx, 783.99, 0.28, 'triangle', 0.15, now + 0.18);
        break;
      }
      case 'evidence_chime': {
        const notes = [587.33, 739.99, 880, 1174.66];
        notes.forEach((n, idx) => {
          this.tone(ctx, n, idx === 3 ? 0.38 : 0.14, 'triangle', 0.11, now + idx * 0.065);
        });
        break;
      }
      case 'thought_pop': {
        this.tone(ctx, 523.25, 0.09, 'sine', 0.1, now, 783.99);
        this.tone(ctx, 1046.5, 0.18, 'triangle', 0.09, now + 0.07);
        break;
      }
      case 'facepalm': {
        // Comedic palm-slap + descending exasperated brass "wah-wah"
        this.playNoiseBurst(ctx, 0.07, 'bandpass', 1250, 0.9, 0.36, now);
        this.tone(ctx, 160, 0.11, 'sine', 0.22, now, 72);
        this.tone(ctx, 392.0, 0.14, 'sawtooth', 0.08, now + 0.08, 369.99);
        this.tone(ctx, 349.23, 0.16, 'sawtooth', 0.08, now + 0.22, 329.63);
        this.tone(ctx, 311.13, 0.34, 'sawtooth', 0.09, now + 0.38, 277.18);
        break;
      }
      case 'headshake': {
        // Stern judicial double-tut + disappointed low chord
        this.tone(ctx, 210, 0.08, 'triangle', 0.15, now, 165);
        this.tone(ctx, 195, 0.09, 'triangle', 0.14, now + 0.14, 150);
        this.tone(ctx, 246.94, 0.28, 'sine', 0.11, now + 0.26, 220);
        this.tone(ctx, 185.0, 0.32, 'triangle', 0.1, now + 0.26, 164.81);
        break;
      }
      case 'page_turn': {
        this.playNoiseBurst(ctx, 0.085, 'highpass', 1900, 0.8, 0.09, now);
        break;
      }
      case 'bag_rummage': {
        // Handbag fabric rustle + jingling items inside
        this.playNoiseBurst(ctx, 0.11, 'bandpass', 1450, 1.2, 0.22, now);
        this.playNoiseBurst(ctx, 0.12, 'bandpass', 2350, 1.4, 0.18, now + 0.13);
        this.tone(ctx, 2950, 0.06, 'sine', 0.05, now + 0.18, 2600);
        this.playNoiseBurst(ctx, 0.14, 'bandpass', 1650, 1.1, 0.24, now + 0.27);
        this.tone(ctx, 3650, 0.07, 'triangle', 0.045, now + 0.33, 3300);
        this.playNoiseBurst(ctx, 0.1, 'bandpass', 2100, 1.3, 0.17, now + 0.43);
        break;
      }
      case 'door_lock': {
        this.tone(ctx, 987.77, 0.06, 'sine', 0.09, now);
        this.tone(ctx, 1318.51, 0.09, 'sine', 0.1, now + 0.07);
        this.playNoiseBurst(ctx, 0.04, 'bandpass', 820, 1.5, 0.12, now + 0.15);
        break;
      }
      case 'penalty':
      case 'damage': {
        this.playNoiseBurst(ctx, 0.08, 'lowpass', 700, 1.0, 0.3, now);
        this.tone(ctx, 220, 0.15, 'sawtooth', 0.13, now, 175);
        this.tone(ctx, 155.56, 0.32, 'sawtooth', 0.15, now + 0.12, 110);
        break;
      }
      case 'victory': {
        this.tone(ctx, 523.25, 0.14, 'triangle', 0.14, now);
        this.tone(ctx, 659.25, 0.14, 'triangle', 0.14, now + 0.12);
        this.tone(ctx, 783.99, 0.14, 'triangle', 0.14, now + 0.24);
        this.tone(ctx, 1046.5, 0.45, 'triangle', 0.18, now + 0.36);
        break;
      }
      case 'foghorn': {
        this.tone(ctx, 98, 0.9, 'sawtooth', 0.08, now, 92);
        this.tone(ctx, 146.83, 0.9, 'triangle', 0.06, now, 140);
        break;
      }
      case 'alarm': {
        this.tone(ctx, 880, 0.14, 'square', 0.06, now);
        this.tone(ctx, 660, 0.16, 'square', 0.06, now + 0.16);
        this.tone(ctx, 880, 0.14, 'square', 0.05, now + 0.34);
        break;
      }
      case 'tension': {
        this.tone(ctx, 73.42, 0.85, 'sawtooth', 0.12, now, 65);
        this.tone(ctx, 110, 0.75, 'triangle', 0.1, now + 0.04, 103.83);
        this.tone(ctx, 311.13, 0.55, 'sine', 0.09, now + 0.12);
        break;
      }
    }
  }

  public startPianoBallad(): void {
    if (this.muted || typeof window === 'undefined') return;
    if (this.pianoFadeTimer !== null) {
      window.clearTimeout(this.pianoFadeTimer);
      this.pianoFadeTimer = null;
    }

    const ctx = this.getContext();
    if (ctx) {
      if (!this.pianoMasterGain) {
        this.pianoMasterGain = ctx.createGain();
        this.pianoMasterGain.connect(ctx.destination);
      }
      this.pianoMasterGain.gain.cancelScheduledValues(ctx.currentTime);
      this.pianoMasterGain.gain.setValueAtTime(1.0, ctx.currentTime);
    }

    if (this.pianoTimer !== null) return;

    const sequence: Array<[number, number | null]> = [
      [130.81, 523.25],
      [196.0, null],
      [261.63, 659.25],
      [329.63, 783.99],
      [261.63, 659.25],
      [196.0, null],
      [110.0, 587.33],
      [164.81, null],
      [220.0, 523.25],
      [261.63, 659.25],
      [220.0, 523.25],
      [164.81, null],
      [87.31, 440.0],
      [130.81, null],
      [174.61, 523.25],
      [220.0, 659.25],
      [174.61, 587.33],
      [130.81, null],
      [98.0, 493.88],
      [146.83, null],
      [196.0, 587.33],
      [246.94, 523.25],
      [196.0, 493.88],
      [146.83, null],
    ];

    this.pianoStep = 0;

    const triggerNote = () => {
      const activeCtx = this.getContext();
      if (!activeCtx) return;
      const [bassFreq, melodyFreq] = sequence[this.pianoStep % sequence.length];
      this.pianoStep += 1;

      const now = activeCtx.currentTime;
      this.pianoKey(activeCtx, bassFreq, 0.95, 0.08, now);
      if (melodyFreq) {
        this.pianoKey(activeCtx, melodyFreq, 1.2, 0.095, now);
      }
    };

    triggerNote();
    this.pianoTimer = window.setInterval(triggerNote, 390);
  }

  public fadeOutPianoBallad(durationMs = 2600): void {
    if (this.pianoFadeTimer !== null) {
      window.clearTimeout(this.pianoFadeTimer);
      this.pianoFadeTimer = null;
    }
    const ctx = this.ctx;
    if (ctx && this.pianoMasterGain && !this.muted) {
      const now = ctx.currentTime;
      const currentVal = Math.max(0.001, this.pianoMasterGain.gain.value);
      this.pianoMasterGain.gain.cancelScheduledValues(now);
      this.pianoMasterGain.gain.setValueAtTime(currentVal, now);
      this.pianoMasterGain.gain.exponentialRampToValueAtTime(
        0.0005,
        now + durationMs / 1000
      );
    }
    this.pianoFadeTimer = window.setTimeout(() => {
      this.pianoFadeTimer = null;
      this.stopPianoBallad();
    }, durationMs);
  }

  public stopPianoBallad(): void {
    if (this.pianoFadeTimer !== null) {
      window.clearTimeout(this.pianoFadeTimer);
      this.pianoFadeTimer = null;
    }
    if (this.pianoTimer !== null) {
      window.clearInterval(this.pianoTimer);
      this.pianoTimer = null;
    }
  }

  private pianoKey(
    ctx: AudioContext,
    freq: number,
    duration: number,
    volume: number,
    startTime: number
  ): void {
    const oscFund = ctx.createOscillator();
    const oscHarm = ctx.createOscillator();
    const gain = ctx.createGain();

    oscFund.type = 'sine';
    oscFund.frequency.setValueAtTime(freq, startTime);

    oscHarm.type = 'triangle';
    oscHarm.frequency.setValueAtTime(freq * 2, startTime);

    const harmGain = ctx.createGain();
    harmGain.gain.setValueAtTime(0.18, startTime);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0008, startTime + duration);

    oscFund.connect(gain);
    oscHarm.connect(harmGain);
    harmGain.connect(gain);
    gain.connect(this.pianoMasterGain ?? ctx.destination);

    oscFund.start(startTime);
    oscHarm.start(startTime);
    oscFund.stop(startTime + duration + 0.03);
    oscHarm.stop(startTime + duration + 0.03);
  }

  public startGreekBouzouki(): void {
    if (this.muted || typeof window === 'undefined') return;
    if (this.greekFadeTimer !== null) {
      window.clearTimeout(this.greekFadeTimer);
      this.greekFadeTimer = null;
    }

    const ctx = this.getContext();
    if (ctx) {
      if (!this.greekMasterGain) {
        this.greekMasterGain = ctx.createGain();
        this.greekMasterGain.connect(ctx.destination);
      }
      this.greekMasterGain.gain.cancelScheduledValues(ctx.currentTime);
      this.greekMasterGain.gain.setValueAtTime(1.0, ctx.currentTime);
    }

    if (this.greekTimer !== null) return;

    // Warm Aegean Bouzouki / Sirtaki progression in D Harmonic Minor / Hijaz ([bassHz, melodyHz])
    const sequence: Array<[number | null, number | null]> = [
      [146.83, 587.33], // D3 + D5
      [null, 554.37], // C#5
      [220.0, 587.33], // A3 + D5
      [null, 440.0], // A4
      [146.83, 466.16], // D3 + Bb4
      [null, 440.0], // A4
      [220.0, 392.0], // A3 + G4
      [null, 349.23], // F4
      [146.83, 329.63], // D3 + E4
      [null, 349.23], // F4
      [220.0, 392.0], // A3 + G4
      [null, 440.0], // A4
      [146.83, 466.16], // D3 + Bb4
      [null, 440.0], // A4
      [220.0, 392.0], // A3 + G4
      [null, 349.23], // F4
      [196.0, 392.0], // G3 + G4
      [null, 466.16], // Bb4
      [146.83, 587.33], // D3 + D5
      [null, 523.25], // C5
      [196.0, 466.16], // G3 + Bb4
      [null, 440.0], // A4
      [220.0, 392.0], // A3 + G4
      [null, 349.23], // F4
      [220.0, 329.63], // A3 + E4
      [null, 349.23], // F4
      [164.81, 392.0], // E3 + G4
      [null, 349.23], // F4
      [146.83, 329.63], // D3 + E4
      [null, 277.18], // C#4
      [220.0, 293.66], // A3 + D4
      [null, null],
    ];

    this.greekStep = 0;

    const triggerPluck = () => {
      const activeCtx = this.getContext();
      if (!activeCtx) return;
      const [bassFreq, melodyFreq] = sequence[this.greekStep % sequence.length];
      this.greekStep += 1;
      const now = activeCtx.currentTime;

      if (bassFreq) {
        this.bouzoukiPluck(activeCtx, bassFreq, 0.55, 0.06, now, false);
      }
      if (melodyFreq) {
        this.bouzoukiPluck(activeCtx, melodyFreq, 0.42, 0.068, now, true);
      }
    };

    triggerPluck();
    this.greekTimer = window.setInterval(triggerPluck, 250);
  }

  public fadeOutGreekBouzouki(durationMs = 1800): void {
    if (this.greekFadeTimer !== null) {
      window.clearTimeout(this.greekFadeTimer);
      this.greekFadeTimer = null;
    }
    const ctx = this.ctx;
    if (ctx && this.greekMasterGain && !this.muted) {
      const now = ctx.currentTime;
      const currentVal = Math.max(0.001, this.greekMasterGain.gain.value);
      this.greekMasterGain.gain.cancelScheduledValues(now);
      this.greekMasterGain.gain.setValueAtTime(currentVal, now);
      this.greekMasterGain.gain.exponentialRampToValueAtTime(
        0.0005,
        now + durationMs / 1000
      );
    }
    this.greekFadeTimer = window.setTimeout(() => {
      this.greekFadeTimer = null;
      this.stopGreekBouzouki();
    }, durationMs);
  }

  public stopGreekBouzouki(): void {
    if (this.greekFadeTimer !== null) {
      window.clearTimeout(this.greekFadeTimer);
      this.greekFadeTimer = null;
    }
    if (this.greekTimer !== null) {
      window.clearInterval(this.greekTimer);
      this.greekTimer = null;
    }
  }

  private bouzoukiPluck(
    ctx: AudioContext,
    freq: number,
    duration: number,
    volume: number,
    startTime: number,
    doubled = true
  ): void {
    const oscA = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    oscA.type = 'triangle';
    oscA.frequency.setValueAtTime(freq, startTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(doubled ? 2600 : 1100, startTime);
    filter.frequency.exponentialRampToValueAtTime(doubled ? 950 : 480, startTime + duration);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0007, startTime + duration);

    oscA.connect(filter);

    if (doubled) {
      const oscB = ctx.createOscillator();
      const chorusGain = ctx.createGain();
      oscB.type = 'sine';
      oscB.frequency.setValueAtTime(freq * 1.004, startTime);
      chorusGain.gain.setValueAtTime(0.45, startTime);
      oscB.connect(chorusGain);
      chorusGain.connect(filter);
      oscB.start(startTime);
      oscB.stop(startTime + duration + 0.03);
    }

    filter.connect(gain);
    gain.connect(this.greekMasterGain ?? ctx.destination);

    oscA.start(startTime);
    oscA.stop(startTime + duration + 0.03);
  }

  private tone(
    ctx: AudioContext,
    freq: number,
    duration: number,
    type: OscillatorType,
    volume: number,
    startTime: number,
    endFreq?: number
  ): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    if (endFreq) {
      osc.frequency.exponentialRampToValueAtTime(endFreq, startTime + duration);
    }

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.02);
  }
}

export const soundFx = new SoundEngine();
