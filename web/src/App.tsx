import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Layout, useDocumentSettings } from './components/Layout';
import { I18nProvider } from './i18n';
import { About } from './pages/About';
import { Mission } from './pages/Mission';
import { Community, ThreadPage } from './pages/Community';
import { Detail } from './pages/Detail';
import { Explore } from './pages/Explore';
import { ForYou } from './pages/ForYou';
import { Host } from './pages/Host';
import { MapPage } from './pages/MapPage';
import { Saved, Settings } from './pages/SavedAndSettings';
import { Welcome } from './pages/Welcome';
import { useProfile } from './state/profile';

/** Moves focus to the page content on navigation so keyboard and screen-reader users start at the top. */
function FocusOnNavigate() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.getElementById('main')?.focus();
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Routed() {
  const { profile } = useProfile();
  const { pathname } = useLocation();
  useDocumentSettings();

  // First visit: Maple's questions come before anything else. "Skip" lands on all events.
  if (profile.gate === 'new' && pathname !== '/welcome') return <Navigate to="/welcome" replace />;

  return (
    <>
      <FocusOnNavigate />
      <Routes>
        <Route path="welcome" element={<Welcome />} />
        <Route element={<Layout />}>
          <Route index element={<Explore />} />
          <Route path="for-you" element={<ForYou />} />
          <Route path="events" element={<Navigate to="/" replace />} />
          <Route path="map" element={<MapPage />} />
          <Route path="event/:id" element={<Detail />} />
          <Route path="community" element={<Community />} />
          <Route path="community/:id" element={<ThreadPage />} />
          <Route path="host" element={<Host />} />
          <Route path="about" element={<About />} />
          <Route path="mission" element={<Mission />} />
          <Route path="saved" element={<Saved />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  );
}

export function App() {
  const { profile } = useProfile();
  return (
    <I18nProvider lang={profile.language}>
      <Routed />
    </I18nProvider>
  );
}
