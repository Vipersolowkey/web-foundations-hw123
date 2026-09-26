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
  root.querySelectorAll('[data-project]').forEach((button) => {
    button.addEventListener('click', () => {
      const project = button.dataset.project;
      title.textContent = project;
      copy.textContent = projectCopy[project] || 'Project details are coming soon.';
      dialog.showModal();
    });
  });
  dialog.querySelectorAll('[data-close-dialog]').forEach((button) => button.addEventListener('click', () => dialog.close()));
}
