import test from 'node:test';
import assert from 'node:assert/strict';
import { BeatRecorder, RepeatGate } from '../audio-engine.js';
import { FormState, canTransition, formatCountdown, millisecondsUntil, normalizeText } from '../event-hub.js';

test('repeat gate accepts one key hit until release', () => {
  const gate = new RepeatGate();
  assert.equal(gate.press('a'), true);
  assert.equal(gate.press('a'), false);
  gate.release('a');
  assert.equal(gate.press('a'), true);
});

test('recorder preserves timestamped FIFO order', () => {
  let now = 100;
  const recorder = new BeatRecorder(() => now);
  recorder.start();
  now = 125; recorder.add('kick');
  now = 180; recorder.add('hat');
  assert.deepEqual(recorder.stop(), [{ sound: 'kick', at: 25 }, { sound: 'hat', at: 80 }]);
  assert.deepEqual(recorder.dequeue(), { sound: 'kick', at: 25 });
  assert.deepEqual(recorder.dequeue(), { sound: 'hat', at: 80 });
  assert.equal(recorder.dequeue(), null);
});

test('UTC countdown and state transitions are deterministic', () => {
  assert.equal(millisecondsUntil('2026-12-14T12:00:00Z', Date.parse('2026-12-14T11:00:00Z')), 3_600_000);
  assert.equal(formatCountdown(3_600_000), '00d 01h 00m');
  assert.equal(canTransition(FormState.IDLE, FormState.SUBMITTING), true);
  assert.equal(canTransition(FormState.SUBMITTING, FormState.IDLE), false);
});

test('text normalization trims, compacts whitespace, and limits length', () => {
  assert.equal(normalizeText('  Linh\n  Nguyen  ', 80), 'Linh Nguyen');
  assert.equal(normalizeText('abcdef', 4), 'abcd');
});
