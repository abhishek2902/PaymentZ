// import ReactDOM from 'react-dom/client';
// import { Suspense, StrictMode } from 'react';
// import { HashRouter, BrowserRouter } from 'react-router-dom';
// import { HelmetProvider } from 'react-helmet-async';
 
// import App from './app';
 
// // Temporary: add an on-screen error overlay (enabled for iOS or when ?debugErrors=1)
// function isIOS() {
//   try {
//     return /iP(ad|hone|od)/.test(navigator.userAgent);
//   } catch (e) {
//     return false;
//   }
// }
 
// function shouldEnableOverlay() {
//   try {
//     const params = new URL(window.location.href).searchParams;
//     return params.has('debugErrors') || isIOS();
//   } catch (e) {
//     return isIOS();
//   }
// }
 
// function installErrorOverlay() {
//   if (window.__ERROR_OVERLAY_INSTALLED__) return;
//   window.__ERROR_OVERLAY_INSTALLED__ = true;
 
//   function createOverlay() {
//     const existing = document.getElementById('__error_overlay__');
//     if (existing) return existing;
//     const el = document.createElement('div');
//     el.id = '__error_overlay__';
//     el.style.position = 'fixed';
//     el.style.zIndex = '999999';
//     el.style.left = '0';
//     el.style.top = '0';
//     el.style.right = '0';
//     el.style.bottom = '0';
//     el.style.overflow = 'auto';
//     el.style.background = '#fff';
//     el.style.color = '#000';
//     el.style.fontFamily = 'Menlo, monospace';
//     el.style.padding = '18px';
//     el.style.whiteSpace = 'pre-wrap';
//     el.style.fontSize = '12px';
//     el.style.lineHeight = '1.4';
//     el.style.boxSizing = 'border-box';
 
//     const hint = document.createElement('div');
//     hint.style.position = 'absolute';
//     hint.style.right = '12px';
//     hint.style.top = '12px';
//     hint.style.fontSize = '11px';
//     hint.style.opacity = '0.6';
//     hint.textContent = 'Error overlay (dismiss with double-tap)';
//     el.appendChild(hint);
 
//     el.addEventListener('dblclick', () => el.remove());
 
//     document.body.appendChild(el);
//     return el;
//   }
 
//   function showError(message) {
//     try {
//       const el = createOverlay();
//       const pre = document.createElement('pre');
//       pre.textContent = message;
//       // clear previous but keep hint
//       while (el.childNodes.length > 1) el.removeChild(el.lastChild);
//       el.appendChild(pre);
//       console.error('[iOS error overlay]', message);
//     } catch (e) {
//       // ignore
//     }
//   }
 
//   window.addEventListener('error', (ev) => {
//     const msg = ev && ev.error ? (ev.error.stack || ev.error.message) : `${ev.message} (${ev.filename}:${ev.lineno}:${ev.colno})`;
//     showError(`Error: ${msg}`);
//   });
 
//   window.addEventListener('unhandledrejection', (ev) => {
//     const reason = ev && ev.reason;
//     const msg = reason && reason.stack ? reason.stack : String(reason);
//     showError(`Unhandled Rejection: ${msg}`);
//   });
 
//   // minimal synchronous try-catch on mount
//   const origConsoleError = console.error;
//   console.error = function (...args) {
//     try {
//       showError(args.map(String).join(' '));
//     } catch (e) {
//       console.log(e)
//     }
//     origConsoleError.apply(console, args);
//   };
// }
 
// if (shouldEnableOverlay()) {
//   // Delay installing overlay until DOM ready to ensure body exists
//   if (document.readyState === 'complete' || document.readyState === 'interactive') {
//     installErrorOverlay();
//   } else {
//     window.addEventListener('DOMContentLoaded', installErrorOverlay);
//   }
// }
 
// // ----------------------------------------------------------------------
 
// const root = ReactDOM.createRoot(document.getElementById('root'));
 
// root.render(
//   <StrictMode>
//     <HelmetProvider>
//       <HashRouter>
//         <Suspense>
//           <App />
//         </Suspense>
//       </HashRouter>
//     </HelmetProvider>
//   </StrictMode>
// );


import React from 'react';
import ReactDOM from 'react-dom/client';

ReactDOM.createRoot(document.getElementById('root')).render(
  <h1>HELLO IOS</h1>
);
