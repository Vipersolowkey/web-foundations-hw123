// Application entrypoint. Feature modules are loaded once the semantic DOM is available.
import { initPortfolio } from './portfolio.js';
import { initDrumKit } from './drum-kit.js';
import { initEventHub } from './event-hub.js';

initPortfolio(document);
initDrumKit(document);
const eventSection = document.querySelector('#events');
initEventHub(document, { targetUtc: eventSection?.dataset.targetUtc });
