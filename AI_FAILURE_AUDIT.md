# HW3 - AI Failure Mode Audit

## Scope

The assistant was used for implementation suggestions, not as an authority for correctness. Each defect below was found while reviewing generated code against the requirements and then fixed in the source.

## 1. Time-zone-dependent countdown

- **Defect:** A draft used `new Date('2026-12-14 19:00')`.
- **Diagnosis:** In browser dev tools, formatting the no-zone string under different simulated locales produced different instants. It violates the UTC requirement.
- **Fix:** The event section owns `data-target-utc="2026-12-14T12:00:00Z"`. `millisecondsUntil()` compares that ISO instant with `Date.now()` on every update, so it cannot accumulate timer drift.
- **Verification:** `node --test` asserts a known UTC difference.

## 2. Unsafe HTML message pattern

- **Defect:** An AI draft proposed rendering a confirmation with a template string assigned to `innerHTML`.
- **Diagnosis:** If a submitted name was ever included, markup such as `<img onerror=...>` would turn a display path into an XSS sink.
- **Fix:** All user-visible status updates use `textContent`. `normalizeText()` only normalizes input; it is not relied on as HTML sanitization.
- **Verification:** `rg "innerHTML"` returns no application matches.

## 3. Keyboard auto-repeat voice flood

- **Defect:** Every `keydown` could create a new audio voice while a key was held.
- **Diagnosis:** Holding `A` produces `KeyboardEvent.repeat === true`; the prototype created a voice for every repeat event.
- **Fix:** `RepeatGate` requires a release before the next press and the controller rejects `event.repeat` early.
- **Verification:** `node --test` asserts that a held key is accepted once, rejected until release, then accepted again.

## Reviewer notes

No external network call, analytics script, or persistent storage is used. That keeps the demo deterministic and makes it possible to explain every line in a live defense.
