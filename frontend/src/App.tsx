import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Suspense } from 'react';
import { MainLayout } from '@/layout/MainLayout';
import { ScollableLayout } from './layout/ScrollableLayout';
import { LobbyPage } from '@/pages/LobbyPage';
import { PrePage } from '@/pages/PrePage';
import { MessagePage } from '@/pages/MessagePage';
import { ProfilePage } from '@/pages/ProfilePage';
import { EditProfilePage } from '@/pages/EditProfilePage';
import { RegisterPage } from '@/pages/RegisterPage';
import { ErrorBoundary } from 'react-error-boundary';
import { AuthHandler } from './AuthHandler';

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<h1>Loading</h1>}>
        <ErrorBoundary fallback={<h1>Error</h1>}>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<LobbyPage />} />
              <Route path="/message" element={<MessagePage />} />
              <Route path="/profile/:userId" element={<ProfilePage />} />
            </Route>
            <Route element={<ScollableLayout />}>
              <Route path="/profile/edit" element={<EditProfilePage />} />
              <Route path="/profile/:userId" element={<ProfilePage />} />
            </Route>
            <Route path="/auth?/" element={<AuthHandler />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route path="/auth/2fa" element={<h1>2fa</h1>} />
            <Route path="/pre" element={<PrePage />} />
          </Routes>
        </ErrorBoundary>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
