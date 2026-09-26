export const FormState = Object.freeze({ IDLE: 'idle', SUBMITTING: 'submitting', SUCCESS: 'success', ERROR: 'error' });
const ALLOWED_TRANSITIONS = Object.freeze({
  [FormState.IDLE]: [FormState.SUBMITTING, FormState.ERROR],
  [FormState.SUBMITTING]: [FormState.SUCCESS, FormState.ERROR],
  [FormState.SUCCESS]: [FormState.SUBMITTING],
  [FormState.ERROR]: [FormState.SUBMITTING, FormState.ERROR]
});
export function canTransition(from, to) { return ALLOWED_TRANSITIONS[from]?.includes(to) || false; }

export function millisecondsUntil(targetUtc, now = Date.now()) { return Math.max(0, new Date(targetUtc).getTime() - now); }
export function formatCountdown(milliseconds) { const seconds = Math.floor(milliseconds / 1000); const days = Math.floor(seconds / 86400); const hours = Math.floor((seconds % 86400) / 3600); const minutes = Math.floor((seconds % 3600) / 60); return `${String(days).padStart(2, '0')}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`; }

export function initEventHub(root, { targetUtc }) {
  const countdown = root.querySelector('#countdown');
  const form = root.querySelector('#rsvp-form');
  if (!countdown || !form) return;
  const status = root.querySelector('#form-status');
  let state = FormState.IDLE;
  function setState(next) {
    if (!canTransition(state, next)) return false;
    state = next;
    form.dataset.state = state;
    return true;
  }
  function tick() { countdown.textContent = `Starts in ${formatCountdown(millisecondsUntil(targetUtc))}`; }
  tick(); window.setInterval(tick, 60000);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (state === FormState.SUBMITTING) return;
    if (!form.checkValidity()) { setState(FormState.ERROR); status.textContent = 'Please enter a valid name and email address.'; form.reportValidity(); return; }
    setState(FormState.SUBMITTING);
    const submit = form.querySelector('[type="submit"]'); submit.disabled = true; status.textContent = 'Reserving your seat…';
    window.setTimeout(() => { setState(FormState.SUCCESS); status.textContent = 'You are on the list. Check your inbox for the event details.'; submit.disabled = false; form.reset(); }, 500);
  });
}
