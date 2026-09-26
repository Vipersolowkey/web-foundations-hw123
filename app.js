// Application entrypoint. Feature modules are loaded once the semantic DOM is available.
import { initPortfolio } from './portfolio.js';
import { initDrumKit } from './drum-kit.js';
import { initEventHub } from './event-hub.js';

initPortfolio(document);
initDrumKit(document);
initEventHub(document, { targetUtc: '2026-12-14T12:00:00Z' });
