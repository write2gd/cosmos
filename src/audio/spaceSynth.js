class SpaceSynth {
  constructor() {
    this.audioCtx = null;
    this.osc1 = null;
    this.osc2 = null;
    this.gainNode = null;
    this.filterNode = null;
    this.isPlaying = false;
    this.isMuted = false;
  }

  init() {
    if (this.audioCtx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    this.audioCtx = new AudioContext();

    // Master Gain
    this.gainNode = this.audioCtx.createGain();
    this.gainNode.gain.value = 0.08; // Gentle background level

    // Low-pass Filter for deep space rumble
    this.filterNode = this.audioCtx.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.value = 220;

    // Deep Drone Oscillators
    this.osc1 = this.audioCtx.createOscillator();
    this.osc1.type = 'sine';
    this.osc1.frequency.value = 55; // A1 low frequency

    this.osc2 = this.audioCtx.createOscillator();
    this.osc2.type = 'triangle';
    this.osc2.frequency.value = 82.4; // E2 fifth interval harmonic

    // Sub-lfo for breathing modulation
    const lfo = this.audioCtx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.1; // Slow 10-second breath

    const lfoGain = this.audioCtx.createGain();
    lfoGain.gain.value = 80;

    lfo.connect(lfoGain);
    lfoGain.connect(this.filterNode.frequency);

    this.osc1.connect(this.filterNode);
    this.osc2.connect(this.filterNode);
    this.filterNode.connect(this.gainNode);
    this.gainNode.connect(this.audioCtx.destination);

    this.osc1.start();
    this.osc2.start();
    lfo.start();
    this.isPlaying = true;
  }

  toggle() {
    if (!this.audioCtx) {
      this.init();
      return true;
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
      this.isMuted = false;
      return true;
    }
    if (this.isMuted) {
      this.gainNode.gain.setTargetAtTime(0.08, this.audioCtx.currentTime, 0.1);
      this.isMuted = false;
      return true;
    } else {
      this.gainNode.gain.setTargetAtTime(0, this.audioCtx.currentTime, 0.1);
      this.isMuted = true;
      return false;
    }
  }

  playChime(frequency = 440) {
    if (!this.audioCtx || this.isMuted) return;
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

    const chimeOsc = this.audioCtx.createOscillator();
    const chimeGain = this.audioCtx.createGain();

    chimeOsc.type = 'sine';
    chimeOsc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);
    chimeOsc.frequency.exponentialRampToValueAtTime(frequency * 1.5, this.audioCtx.currentTime + 0.3);

    chimeGain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
    chimeGain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 1.2);

    chimeOsc.connect(chimeGain);
    chimeGain.connect(this.audioCtx.destination);

    chimeOsc.start();
    chimeOsc.stop(this.audioCtx.currentTime + 1.2);
  }
}

export const spaceAudio = new SpaceSynth();
