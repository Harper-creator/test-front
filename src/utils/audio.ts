export class CalmingAudioEngine {
  private ctx: AudioContext | null = null;
  private noiseNode: AudioWorkletNode | ScriptProcessorNode | null = null;
  private bowlInterval: any = null;
  private isMuted: boolean = true;
  private ambientVolume: GainNode | null = null;
  private bowlVolume: GainNode | null = null;

  constructor() {
    // Lazy initialized on first user interaction to bypass browser policies safely.
  }

  private init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    this.ctx = new AudioContextClass();

    // Create main volume controls
    this.ambientVolume = this.ctx.createGain();
    this.ambientVolume.gain.value = 0.15; // Soft rainfall noise
    this.ambientVolume.connect(this.ctx.destination);

    this.bowlVolume = this.ctx.createGain();
    this.bowlVolume.gain.value = 0.25; // Rich resonance
    this.bowlVolume.connect(this.ctx.destination);
  }

  public toggleAmbient(active: boolean) {
    this.init();
    if (!this.ctx) return;

    if (active) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.playBrownNoise();
      this.startSingingBowlInterval();
      this.isMuted = false;
    } else {
      this.stopAll();
      this.isMuted = true;
    }
  }

  private playBrownNoise() {
    if (!this.ctx || !this.ambientVolume) return;
    if (this.noiseNode) return;

    const bufferSize = 4096 * 4;
    let lastOut = 0.0;

    // Use ScriptProcessorNode for standard fallback browser compatibility
    const node = this.ctx.createScriptProcessor(bufferSize, 1, 1);
    node.onaudioprocess = (e) => {
      const output = e.outputBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Brown noise filter approximation (integrating white noise for 1/f^2 spectral density)
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 4.5; // Gain compensation
      }
    };

    node.connect(this.ambientVolume);
    this.noiseNode = node;
  }

  private startSingingBowlInterval() {
    this.playBowlStrike();
    // Strike the singing bowl gently every 16 seconds
    this.bowlInterval = setInterval(() => {
      this.playBowlStrike();
    }, 16000);
  }

  public playBowlStrike() {
    this.init();
    if (!this.ctx || !this.bowlVolume || this.isMuted) return;

    const now = this.ctx.currentTime;
    const rootFreq = 144; // Soothing, grounding low frequency
    const harmonics = [1, 2.01, 3.02, 4.43, 5.92]; // Quasi-harmonic structure of a Japanese singing bowl

    harmonics.forEach((multiple, i) => {
      if (!this.ctx || !this.bowlVolume) return;
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.value = rootFreq * multiple;

      // Amplitude envelop: sudden strike, extremely long decay
      gainNode.gain.setValueAtTime(0, now);
      // Main strike peak (higher frequency is quieter, resembling physics)
      const strikeVolume = (1 / (i + 1)) * 0.2;
      gainNode.gain.linearRampToValueAtTime(strikeVolume, now + 0.1);
      // Soft vibrato / beating rate by modulating slightly over time
      gainNode.gain.setTargetAtTime(0, now + 0.3, 3 + i * 1.5);

      osc.connect(gainNode);
      gainNode.connect(this.bowlVolume);

      osc.start(now);
      osc.stop(now + 12 + i * 2);
    });
  }

  private stopAll() {
    if (this.noiseNode) {
      try {
        this.noiseNode.disconnect();
      } catch (e) {}
      this.noiseNode = null;
    }
    if (this.bowlInterval) {
      clearInterval(this.bowlInterval);
      this.bowlInterval = null;
    }
  }

  public destroy() {
    this.stopAll();
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
}
export const globalAudio = new CalmingAudioEngine();
