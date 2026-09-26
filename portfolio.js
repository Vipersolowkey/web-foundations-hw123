const projectCopy = {
  'Local Form': 'A focused intake flow: plain-language prompts, durable validation, and generous keyboard targets.',
  'Quiet Signal': 'A dashboard composition that uses hierarchy and empty space to make service information approachable.',
  'Common Thread': 'An ecommerce concept with preference-aware browsing and a deliberately quiet visual system.'
};

export function initPortfolio(root) {
  const dialog = root.querySelector('#project-dialog');
  if (!dialog) return;
  const title = dialog.querySelector('#dialog-title');
  const copy = dialog.querySelector('#dialog-copy');
  let opener = null;
  const closeButtons = [...dialog.querySelectorAll('[data-close-dialog]')];

  function closeDialog() {
    dialog.close();
    opener?.focus();
  }

  dialog.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const focusable = [...dialog.querySelectorAll('button:not([disabled]), [href], input:not([disabled])')];
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && root.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && root.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  root.querySelectorAll('[data-project]').forEach((button) => {
    button.addEventListener('click', () => {
      opener = button;
      const project = button.dataset.project;
      title.textContent = project;
      copy.textContent = projectCopy[project] || 'Project details are coming soon.';
      dialog.showModal();
      closeButtons[0].focus();
    });
  });
  closeButtons.forEach((button) => button.addEventListener('click', closeDialog));
}
