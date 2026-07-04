import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigApp, type ConfigVariant } from './ConfigApp';

const container = document.getElementById('root');
if (!container) throw new Error('Root container #root not found');

// config.html and live_config.html share this entry; the filename Twitch loaded picks the copy.
const variant: ConfigVariant = window.location.pathname.includes('live_config') ? 'live' : 'config';

createRoot(container).render(
  <StrictMode>
    <ConfigApp variant={variant} />
  </StrictMode>,
);
