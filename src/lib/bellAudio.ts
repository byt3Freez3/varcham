/**
 * Web Audio API Manager for Varcham Temple Bell Chimes
 *
 * Requirements:
 * - Singleton AudioContext, initialized ONLY after first user interaction (pointerdown / keydown)
 * - Decodes buffer once from /sounds/temple-bell.mp3 (with pure Web Audio synthesis fallback)
 * - GainNode set to 0.35, overlapping rings layer naturally
 * - PlaybackRate slightly randomized between 0.96 and 1.04
 * - Max concurrent sounds capped at 4
 * - Persists sound toggle in localStorage ("varcham:bellSound")
 * - Never autoplays on page load or on scroll
 */

// TODO: Replace /public/sounds/temple-bell.mp3 with the store's own physical brass ghanta recording.

type SoundListener = (enabled: boolean) => void;

class BellAudioManager {
  private ctx: AudioContext | null = null;
  private buffer: AudioBuffer | null = null;
  private activeSources: AudioBufferSourceNode[] = [];
  private soundEnabled: boolean = true;
  private userInteracted: boolean = false;
  private loading: boolean = false;
  private listeners: Set<SoundListener> = new Set();
  private lastRingTime: number = 0;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('varcham:bellSound');
        this.soundEnabled = stored !== 'false';
      } catch {
        this.soundEnabled = true;
      }
      this.attachInteractionListener();
    }
  }

  private attachInteractionListener() {
    const unlock = () => {
      this.userInteracted = true;
      this.ensureContext();
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
    window.addEventListener('pointerdown', unlock, { passive: true, once: true });
    window.addEventListener('keydown', unlock, { passive: true, once: true });
  }

  public ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx && this.userInteracted) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.loadAudioBuffer();
      }
    } else if (this.ctx && this.ctx.state === 'suspended' && this.userInteracted) {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private async loadAudioBuffer() {
    if (this.buffer || this.loading || !this.ctx) return;
    this.loading = true;

    try {
      const res = await fetch('/sounds/temple-bell.mp3');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const arrayBuffer = await res.arrayBuffer();
      this.buffer = await this.ctx.decodeAudioData(arrayBuffer);
    } catch {
      // Fallback: Synthesize an authentic Indian temple ghanta buffer in Web Audio directly
      if (this.ctx) {
        this.buffer = this.synthesizeTempleBellBuffer(this.ctx);
      }
    } finally {
      this.loading = false;
    }
  }

  /**
   * Generates a high-fidelity synthetic temple ghanta strike if the audio file fails or is delayed.
   */
  private synthesizeTempleBellBuffer(ctx: AudioContext): AudioBuffer {
    const sampleRate = ctx.sampleRate || 44100;
    const duration = 1.4;
    const numSamples = Math.floor(sampleRate * duration);
    const audioBuffer = ctx.createBuffer(1, numSamples, sampleRate);
    const channelData = audioBuffer.getChannelData(0);

    const f0 = 1046.5; // C6 bright bell prime
    const partials = [
      { ratio: 0.5, amp: 0.22, decay: 1.3 },
      { ratio: 1.0, amp: 0.50, decay: 1.2 },
      { ratio: 1.002, amp: 0.25, decay: 1.1 },
      { ratio: 1.19, amp: 0.30, decay: 0.9 },
      { ratio: 1.50, amp: 0.25, decay: 0.8 },
      { ratio: 2.00, amp: 0.35, decay: 0.7 },
      { ratio: 2.74, amp: 0.20, decay: 0.45 },
      { ratio: 3.40, amp: 0.15, decay: 0.35 },
      { ratio: 4.15, amp: 0.12, decay: 0.25 },
    ];

    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      const attack = Math.min(1.0, t / 0.0015);
      let sample = 0;
      for (const p of partials) {
        sample += p.amp * Math.exp(-t / p.decay) * Math.sin(2 * Math.PI * (f0 * p.ratio) * t);
      }
      if (t > 1.2) {
        sample *= Math.max(0, (duration - t) / 0.2);
      }
      channelData[i] = sample * attack * 0.4;
    }

    return audioBuffer;
  }

  public playRing() {
    if (!this.soundEnabled || !this.userInteracted) return;

    const now = Date.now();
    // Debounce rapid triggers within 120ms for audio clarity
    if (now - this.lastRingTime < 120) return;
    this.lastRingTime = now;

    const ctx = this.ensureContext();
    if (!ctx) return;

    if (!this.buffer) {
      this.loadAudioBuffer();
      return;
    }

    // Clean up finished sources
    // Cap concurrent active sounds at 4
    if (this.activeSources.length >= 4) {
      const oldest = this.activeSources.shift();
      try {
        oldest?.stop();
      } catch {}
    }

    try {
      const source = ctx.createBufferSource();
      source.buffer = this.buffer;

      // Randomize playbackRate between 0.96 and 1.04
      source.playbackRate.value = 0.96 + Math.random() * 0.08;

      const gain = ctx.createGain();
      gain.gain.value = 0.35;

      source.connect(gain);
      gain.connect(ctx.destination);

      source.onended = () => {
        const idx = this.activeSources.indexOf(source);
        if (idx !== -1) {
          this.activeSources.splice(idx, 1);
        }
      };

      this.activeSources.push(source);
      source.start(0);
    } catch {
      // Audio play failed or context interrupted
    }
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  public setSoundEnabled(val: boolean) {
    this.soundEnabled = val;
    try {
      localStorage.setItem('varcham:bellSound', String(val));
    } catch {}
    this.listeners.forEach((fn) => fn(val));
  }

  public toggleSound(): boolean {
    const next = !this.soundEnabled;
    this.setSoundEnabled(next);
    return next;
  }

  public subscribe(fn: SoundListener): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
}

export const bellAudio = new BellAudioManager();
