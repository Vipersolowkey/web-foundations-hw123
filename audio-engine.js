const SOUND_PROFILE = Object.freeze({
  kick: { frequency: 110, endFrequency: 42, duration: 0.39, wave: 'sine' },
  snare: { frequency: 210, duration: 0.13, wave: 'triangle' },
  hat: { frequency: 760, duration: 0.08, wave: 'square' },
  clap: { frequency: 310, duration: 0.13, wave: 'sawtooth' }
});

export class AudioEngine {
  constructor(audioContextFactory = () => new AudioContext()) {
    this.audioContextFactory = audioContextFactory;
    this.context = null;
  }

  getContext() {
    if (!this.context) this.context = this.audioContextFactory();
    return this.context;
  }

  play(sound) {
    const context = this.getContext();
    const profile = SOUND_PROFILE[sound];
    if (!profile) return false;
    if (context.state === 'suspended') context.resume();
    const gain = context.createGain();
    gain.connect(context.destination);
    const now = context.currentTime;
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + profile.duration);
    const oscillator = context.createOscillator();
    oscillator.connect(gain);
    oscillator.type = profile.wave;
    oscillator.frequency.setValueAtTime(profile.frequency, now);
    if (profile.endFrequency) oscillator.frequency.exponentialRampToValueAtTime(profile.endFrequency, now + 0.15);
    oscillator.start(now);
    oscillator.stop(now + profile.duration);
    return true;
  }
}

export class BeatRecorder {
  constructor(clock = () => performance.now()) { this.clock = clock; this.events = []; this.startedAt = 0; this.isRecording = false; }
  start() { this.events = []; this.startedAt = this.clock(); this.isRecording = true; }
  stop() { this.isRecording = false; return [...this.events]; }
  add(sound) { if (!this.isRecording) return; this.events.push({ sound, at: Math.round(this.clock() - this.startedAt) }); }
}

export class RepeatGate {
  constructor() { this.pressed = new Set(); }
  press(key) { if (this.pressed.has(key)) return false; this.pressed.add(key); return true; }
  release(key) { this.pressed.delete(key); }
}
