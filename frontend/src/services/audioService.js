// Procedural Web Audio API Sound Synthesizer for AAA Gaming HUD
class AudioService {
  constructor() {
    this.audioCtx = null;
    this.heartbeatInterval = null;
    this.heartbeatOsc = null;
  }

  init() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Reload sound effect: Two quick mechanical pitch sweeps ("clack-clack")
  playReload() {
    this.init();
    try {
      const t = this.audioCtx.currentTime;

      // First click
      const osc1 = this.audioCtx.createOscillator();
      const gain1 = this.audioCtx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(350, t);
      osc1.frequency.exponentialRampToValueAtTime(80, t + 0.08);
      gain1.gain.setValueAtTime(0.06, t);
      gain1.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
      osc1.connect(gain1);
      gain1.connect(this.audioCtx.destination);
      osc1.start(t);
      osc1.stop(t + 0.08);

      // Second click (offset by 120ms)
      const t2 = t + 0.12;
      const osc2 = this.audioCtx.createOscillator();
      const gain2 = this.audioCtx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(450, t2);
      osc2.frequency.exponentialRampToValueAtTime(100, t2 + 0.08);
      gain2.gain.setValueAtTime(0.08, t2);
      gain2.gain.exponentialRampToValueAtTime(0.0001, t2 + 0.08);
      osc2.connect(gain2);
      gain2.connect(this.audioCtx.destination);
      osc2.start(t2);
      osc2.stop(t2 + 0.08);
    } catch (e) {
      console.warn("Audio play failed:", e);
    }
  }

  // Sniper Headshot sound: A massive blast (noise + base boom) with reverb-like decay
  playSniper() {
    this.init();
    try {
      const t = this.audioCtx.currentTime;

      // 1. Bass Boom
      const baseOsc = this.audioCtx.createOscillator();
      const baseGain = this.audioCtx.createGain();
      baseOsc.type = 'sine';
      baseOsc.frequency.setValueAtTime(140, t);
      baseOsc.frequency.exponentialRampToValueAtTime(35, t + 0.55);
      baseGain.gain.setValueAtTime(0.25, t);
      baseGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
      baseOsc.connect(baseGain);
      baseGain.connect(this.audioCtx.destination);
      baseOsc.start(t);
      baseOsc.stop(t + 0.6);

      // 2. High-Frequency Noise Blast
      const bufferSize = this.audioCtx.sampleRate * 0.4; // 0.4 seconds of noise
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noiseNode = this.audioCtx.createBufferSource();
      noiseNode.buffer = buffer;

      const noiseFilter = this.audioCtx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.value = 1000;
      noiseFilter.Q.value = 1.0;

      const noiseGain = this.audioCtx.createGain();
      noiseGain.gain.setValueAtTime(0.18, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.38);

      noiseNode.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.audioCtx.destination);
      noiseNode.start(t);
      noiseNode.stop(t + 0.4);
    } catch (e) {
      console.warn("Audio play failed:", e);
    }
  }

  // Flashbang tinnitus: Extremely high-pitched sine wave that decays slowly
  playFlashbang() {
    this.init();
    try {
      const t = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(3200, t); // High pitched tinnitus ring
      gain.gain.setValueAtTime(0.05, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 4.5); // 4.5 seconds ring decay

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(t);
      osc.stop(t + 4.5);
    } catch (e) {
      console.warn("Audio play failed:", e);
    }
  }

  // Start low HP thumping heartbeat
  startHeartbeat() {
    this.init();
    if (this.heartbeatInterval) return;

    try {
      const playPulse = () => {
        const t = this.audioCtx.currentTime;

        // First thump
        const osc1 = this.audioCtx.createOscillator();
        const gain1 = this.audioCtx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(55, t);
        osc1.frequency.exponentialRampToValueAtTime(20, t + 0.15);
        gain1.gain.setValueAtTime(0.3, t);
        gain1.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);
        osc1.connect(gain1);
        gain1.connect(this.audioCtx.destination);
        osc1.start(t);
        osc1.stop(t + 0.15);

        // Second thump (200ms delay)
        const t2 = t + 0.22;
        const osc2 = this.audioCtx.createOscillator();
        const gain2 = this.audioCtx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(50, t2);
        osc2.frequency.exponentialRampToValueAtTime(15, t2 + 0.15);
        gain2.gain.setValueAtTime(0.25, t2);
        gain2.gain.exponentialRampToValueAtTime(0.0001, t2 + 0.15);
        osc2.connect(gain2);
        gain2.connect(this.audioCtx.destination);
        osc2.start(t2);
        osc2.stop(t2 + 0.15);
      };

      // Loop thumps every 950ms
      playPulse();
      this.heartbeatInterval = setInterval(playPulse, 950);
    } catch (e) {
      console.warn("Heartbeat start failed:", e);
    }
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }
}

export const audioService = new AudioService();
