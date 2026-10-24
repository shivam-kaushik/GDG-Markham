import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { App } from './App';
import { ForumProvider } from './state/forum';
import { ProfileProvider } from './state/profile';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProfileProvider>
      <ForumProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </ForumProvider>
    </ProfileProvider>
  </StrictMode>,
);
