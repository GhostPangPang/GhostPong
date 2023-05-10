import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Suspense } from 'react';
import { MainLayout } from '@/layout/MainLayout';
import { ScollableLayout } from './layout/ScrollableLayout';
import { LobbyPage } from '@/pages/LobbyPage';
import { PrePage } from '@/pages/PrePage';
import { MessagePage } from '@/pages/MessagePage';
import { ProfilePage } from './pages/ProfilePage';
import { ErrorBoundary } from 'react-error-boundary';

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<h1>Loading</h1>}>
        <ErrorBoundary fallback={<h1>Error</h1>}>
          <Routes>
            <Route path="/auth" element={<div>auth</div>} />
            <Route path="/register" element={<div>register</div>} />
            <Route path="/pre" element={<PrePage />} />
            <Route element={<MainLayout />}>
              <Route path="/" element={<LobbyPage />} />
              <Route path="/message" element={<MessagePage />} />
            </Route>
            <Route element={<ScollableLayout />}>
              <Route path="/profile/edit" element={<ProfilePage />} />
              <Route path="/profile/:userId" element={<ProfilePage />} />
            </Route>
          </Routes>
        </ErrorBoundary>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
