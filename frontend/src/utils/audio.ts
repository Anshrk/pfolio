// Web Audio API Synthesizer for Mechanical Keyboard and Terminal Audio Effects

class TerminalSoundEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private volume: number = 0.35;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
  }

  // Realistic mechanical keyboard click (Cherry MX Blue / tactile switch synthesis)
  public playKeyClick() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Slightly randomize frequency for realistic multi-key variance
      const baseFreq = 1600 + (Math.random() * 600 - 300);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, t);
      osc.frequency.exponentialRampToValueAtTime(120, t + 0.04);

      // Noise click transient
      const bufferSize = this.ctx.sampleRate * 0.015;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(this.volume * 0.5, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);

      filter.type = 'bandpass';
      filter.frequency.value = 3200;
      filter.Q.value = 2.5;

      gain.gain.setValueAtTime(this.volume * 0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.05);
      noise.start(t);
    } catch {
      // Ignore audio synthesis errors on strict autoplay policy
    }
  }

  // Deeper "Enter / Return" tactile bottom-out clack
  public playEnterClack() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.exponentialRampToValueAtTime(60, t + 0.08);

      gain.gain.setValueAtTime(this.volume * 0.5, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.1);
    } catch {
      // Audio context ignored
    }
  }

  // Terminal bell / execution success beep
  public playSuccessTone() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, t);
      osc.frequency.setValueAtTime(1320, t + 0.06);

      gain.gain.setValueAtTime(this.volume * 0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.16);
    } catch {
      // Audio error ignored
    }
  }

  // Command error tone
  public playErrorTone() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, t);
      osc.frequency.setValueAtTime(140, t + 0.08);

      gain.gain.setValueAtTime(this.volume * 0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.19);
    } catch {
      // Audio error ignored
    }
  }

  // macOS-style harmonious boot chord
  public playBootChime() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;
      const freqs = [220, 277.18, 329.63, 440]; // A Major triad
      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + idx * 0.02);
        gain.gain.setValueAtTime(this.volume * 0.18, t + idx * 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t + idx * 0.02);
        osc.stop(t + 1.0);
      });
    } catch {
      // Ignored
    }
  }
}

export const soundEngine = new TerminalSoundEngine();
