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
    if (context.state === 'suspended') context.resume();
    const gain = context.createGain();
    gain.connect(context.destination);
    const now = context.currentTime;
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (sound === 'kick' ? 0.38 : 0.12));
    const oscillator = context.createOscillator();
    oscillator.connect(gain);
    oscillator.type = sound === 'hat' ? 'square' : 'sine';
    oscillator.frequency.setValueAtTime(sound === 'kick' ? 110 : sound === 'snare' ? 210 : sound === 'hat' ? 760 : 310, now);
    if (sound === 'kick') oscillator.frequency.exponentialRampToValueAtTime(42, now + 0.15);
    oscillator.start(now);
    oscillator.stop(now + (sound === 'kick' ? 0.39 : 0.13));
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
