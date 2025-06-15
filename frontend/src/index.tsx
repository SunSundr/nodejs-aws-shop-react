import React from 'react';
import { AuthProvider } from 'react-oidc-context';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRoot } from 'react-dom/client';
import App from '~/components/App/App';
import AuthSyncManager from './components/utils/AuthSyncManager';
import { COGNITO_AUTH_CONFIG } from './constants/apiPaths';
// import { fixRedirect } from './utils/fixRedirect';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: false, staleTime: Infinity },
  },
});

// if (import.meta.env.DEV) {
//   const { worker } = await import('./mocks/browser');
//   await worker.start({ onUnhandledRequest: 'bypass' });
// }

const container = document.getElementById('app');
if (container) {
  // fixRedirect();
  const root = createRoot(container);
  // disable double click text selection:
  document.addEventListener(
    'mousedown',
    (event) => {
      if (event.detail > 1) {
        const tagName = (event.target as HTMLElement)?.tagName?.toLowerCase();
        if (tagName === 'input' || tagName === 'textarea') {
          return;
        }
        event.preventDefault();
      }
    },
    false,
  );
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider {...COGNITO_AUTH_CONFIG}>
            <AuthSyncManager />
            <App />
          </AuthProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </BrowserRouter>
    </React.StrictMode>,
  );
} else {
  console.error('index.html is invalid');
}
