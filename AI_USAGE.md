# AI Usage Record

## Tool used

- OpenAI Codex / ChatGPT, assisted implementation and review.

## Share link

> Add the account-owned shared conversation URL here before submitting:
> `https://chatgpt.com/share/REPLACE-WITH-YOUR-SHARED-CHAT-ID`

The workspace can produce the source code and this audit record, but cannot create a share link for a user's private chat account.

## Reconstructed AI prompt log

The following five prompts are a reconstructed record for submission documentation. They describe the assistance requested during this project; they are not presented as a verbatim export of a private chat.

### Prompt 1 - HW1 portfolio foundation

> Build a one-page production portfolio for a web-application-development assignment using semantic HTML, external CSS, and modular JavaScript only. Use landmarks, an H1 followed by logical heading levels, native buttons for actions, an obvious skip link, and visible keyboard focus. Include three project cards and a modal case study view, but do not use inline handlers or dependencies. Explain the files you would create and keep the visual design responsive from 375px upward.

### Prompt 2 - Accessibility and security review

> Review the portfolio interaction as if you were doing a WCAG 2.2 AA audit. Make the dialog announce its title and description, move focus into it, trap Tab and Shift+Tab inside it, and return focus to the button that opened it. Recommend a strict Content Security Policy that allows the static app to run without inline JavaScript, and point out any responsiveness or reduced-motion issues to check manually.

### Prompt 3 - HW2 contract-first drum kit

> Design a browser drum kit where the HTML data contract is decided before JavaScript: each native button must have a stable data-sound value and a unique lowercase data-key binding. Implement a Web Audio engine that can play overlapping voices, supports pointer and keyboard activation, avoids one long-lived audio loop, and has clear module boundaries. Add keyboard repeat protection so holding a key does not create many unintended hits, then describe a small testable API for it.

### Prompt 4 - HW3 resilient event form

> Implement an event landing page with a countdown based on an explicit ISO 8601 UTC timestamp, not a browser-local date string. Build an RSVP form as a visible state machine with idle, submitting, success, and error states; validate name and email fields, prevent double submits while a request is pending, and write all user-facing messages using textContent rather than innerHTML. Keep the code small, deterministic, keyboard accessible, and explain how to test the pure date and transition functions.

### Prompt 5 - AI failure-mode audit

> Act as a critical reviewer of the generated implementation rather than assuming it is correct. Identify three plausible AI-induced defects involving time-zone parsing, unsafe DOM rendering, and key auto-repeat behavior; for each one write a concise defect description, the diagnosis method, the refactored solution, and a concrete verification step. Do not invent features or external API calls, and make the report suitable for explaining in a live code defense.

## Engineering checks performed after AI assistance

- The UI uses native controls, labels, an accessible dialog, visible focus, and a reduced-motion fallback.
- User form text is only rendered with `textContent`; it is never interpolated into `innerHTML`.
- Countdown timestamps originate from a UTC ISO value.
- The recorder stores timestamped events; no unbounded interval or timeout loop is created.
- Core state transitions and keyboard repeat gating have automated tests.

## Mandatory failure audit - three defects found and refactored

| AI-induced defect | Diagnosis | Refactored solution |
| --- | --- | --- |
| Countdown used local `new Date('2026-12-14 19:00')`, so users in different time zones saw different targets. | The no-timezone date string is interpreted in the client locale. | `event-hub.js` receives a `2026-12-14T12:00:00Z` ISO UTC timestamp and computes all differences from it. |
| Initial success message template used a string intended for HTML insertion. | Any future user-provided value passed through that template could become an XSS sink. | Messages are inserted through `textContent` only; no project code writes user input with `innerHTML`. |
| Keydown playback fired for every OS auto-repeat event, producing excessive voices. | Repeated `keydown` events arrive while a key is held. | `RepeatGate` tracks pressed keys and permits one trigger until `keyup`; pointer interaction remains polyphonic. |

## Review trail

The commits are intentionally small so each feature and refactor can be explained during the live defense. See `git log --oneline --reverse`.
