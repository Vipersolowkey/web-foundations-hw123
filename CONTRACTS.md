# Browser Feature Contracts

## HW2 - Drum Kit DOM contract

Each playable pad is a native `button` with both attributes below. JavaScript must query this contract; it must not depend on a visual class name or text label.

```html
<button type="button" data-sound="kick" data-key="a">...</button>
```

| Attribute | Meaning | Constraint |
| --- | --- | --- |
| `data-sound` | Stable voice name passed to `AudioEngine.play()` | `kick`, `snare`, `hat`, or `clap` |
| `data-key` | Lowercase physical keyboard binding | Unique, one character |

The controller supports pointer activation and one `keydown` per physical key press. It releases the key on `keyup`, and it never uses inline event handlers.

## HW3 - RSVP state contract

`idle -> submitting -> success` for a valid request. Invalid values transition to `error`; a later valid submission may continue to `submitting`. While submitting, the submit control is disabled and the handler ignores further submission events.
