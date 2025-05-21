import './index.css';

import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';

import Providers from './providers';
import Router from './router';
import ProgressBar from './hooks/progress-bar';

createRoot(document.getElementById('root')!).render(
  <Providers>
    <BrowserRouter>
      <ProgressBar />
      <Router />
    </BrowserRouter>
  </Providers>,
);
