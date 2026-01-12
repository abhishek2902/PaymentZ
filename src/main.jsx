import ReactDOM from 'react-dom/client';
import { Suspense, StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import App from './app';
import ErrorBoundary from './components/error-boundary';
import { LoadingScreen } from './components/loading-screen';

// ----------------------------------------------------------------------
// Simple fatal error overlay for debugging on real devices (iOS, etc.)
const showFatalErrorOverlay = (message) => {
  // Avoid duplicating the overlay
  const existing = document.getElementById('fatal-error-overlay');
  if (existing) {
    existing.querySelector('.fatal-error-message').textContent = message;
    existing.style.display = 'flex';
    return;
  }

  const container = document.createElement('div');
  container.id = 'fatal-error-overlay';
  container.style.position = 'fixed';
  container.style.inset = '0';
  container.style.background = 'rgba(0,0,0,0.8)';
  container.style.color = '#fff';
  container.style.zIndex = '2147483647';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';
  container.style.padding = '24px';
  container.style.fontFamily = 'Inter, Arial, sans-serif';
  container.style.textAlign = 'center';

  const title = document.createElement('div');
  title.textContent = 'App error';
  title.style.fontSize = '20px';
  title.style.fontWeight = '700';
  title.style.marginBottom = '12px';

  const text = document.createElement('div');
  text.className = 'fatal-error-message';
  text.textContent = message;
  text.style.whiteSpace = 'pre-wrap';
  text.style.wordBreak = 'break-word';
  text.style.fontSize = '14px';
  text.style.lineHeight = '1.4';
  text.style.maxWidth = '640px';

  const hint = document.createElement('div');
  hint.textContent = 'Screenshot this and share it so we can fix it.';
  hint.style.opacity = '0.8';
  hint.style.fontSize = '12px';
  hint.style.marginTop = '16px';

  container.appendChild(title);
  container.appendChild(text);
  container.appendChild(hint);
  document.body.appendChild(container);
};

// ----------------------------------------------------------------------

// Add global error handler for unhandled errors
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  if (event.error) {
    showFatalErrorOverlay(`${event.error?.message ?? 'Unknown error'}\n${event.error?.stack ?? ''}`);
  } else if (event.message) {
    showFatalErrorOverlay(event.message);
  }
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  if (event.reason) {
    showFatalErrorOverlay(
      `${event.reason?.message ?? 'Unhandled rejection'}\n${event.reason?.stack ?? ''}`
    );
  }
});


window.onerror = function (msg, url, line, col, error) {
  document.body.innerHTML = `
<pre style="
  white-space: pre-wrap;
  padding: 16px;
  color: red;
  font-size: 14px;
  background: #fff;
">
JS ERROR:
${msg}

FILE:
${url}

LINE:
${line}:${col}

STACK:
${error && error.stack}
</pre>
  `;
};





// ----------------------------------------------------------------------

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <ErrorBoundary>
    <HelmetProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingScreen />}>
          <App />
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  </ErrorBoundary>
);
