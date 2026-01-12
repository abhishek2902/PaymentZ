import ReactDOM from 'react-dom/client';
import { Suspense, StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import App from './app';
import ErrorBoundary from './components/error-boundary';
import { LoadingScreen } from './components/loading-screen';

// ----------------------------------------------------------------------

// Add global error handler for unhandled errors
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
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
