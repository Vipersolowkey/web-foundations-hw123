# AI Usage Record

## Tool used

- OpenAI Codex / ChatGPT, assisted implementation and review.

## Share link

> Add the account-owned shared conversation URL here before submitting:
> `https://chatgpt.com/share/REPLACE-WITH-YOUR-SHARED-CHAT-ID`

The workspace can produce the source code and this audit record, but cannot create a share link for a user's private chat account.

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
