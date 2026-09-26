import { AudioEngine, BeatRecorder, RepeatGate } from './audio-engine.js';

export function initDrumKit(root) {
  const pads = [...root.querySelectorAll('[data-sound][data-key]')];
  if (!pads.length) return;
  const engine = new AudioEngine();
  const recorder = new BeatRecorder();
  const gate = new RepeatGate();
  const status = root.querySelector('#recorder-status');
  const toggle = root.querySelector('#record-toggle');
  const playTake = root.querySelector('#play-take');
  const eventList = root.querySelector('#beat-events');
  const byKey = new Map(pads.map((pad) => [pad.dataset.key, pad]));

  function hit(pad) {
    const { sound } = pad.dataset;
    engine.play(sound); recorder.add(sound);
    pad.classList.add('is-playing');
    window.setTimeout(() => pad.classList.remove('is-playing'), 100);
  }
  function renderEvents(events) { eventList.replaceChildren(...events.map(({ sound, at }) => { const item = document.createElement('li'); item.textContent = `${String(at).padStart(4, '0')} ms - ${sound}`; return item; })); }
  pads.forEach((pad) => pad.addEventListener('click', () => hit(pad)));
  window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    const pad = byKey.get(key);
    // Browsers set repeat while a key is held; one physical press maps to one hit.
    if (!pad || event.repeat || !gate.press(key)) return;
    event.preventDefault();
    hit(pad);
  });
  window.addEventListener('keyup', (event) => gate.release(event.key.toLowerCase()));
  toggle.addEventListener('click', () => {
    if (!recorder.isRecording) { recorder.start(); toggle.textContent = 'Stop recording'; status.textContent = 'Recording pad timestamps…'; eventList.replaceChildren(); }
    else { const events = recorder.stop(); toggle.textContent = 'Start recording'; playTake.disabled = events.length === 0; status.textContent = events.length ? `${events.length} events captured.` : 'No events recorded.'; renderEvents(events); }
  });
  playTake.addEventListener('click', () => { recorder.events.forEach(({ sound, at }) => { const pad = pads.find((candidate) => candidate.dataset.sound === sound); window.setTimeout(() => hit(pad), at); }); status.textContent = 'Playing recorded take.'; });
}
