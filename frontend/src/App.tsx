import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Suspense } from 'react';
import { MainLayout } from '@/layout/MainLayout';
import { FooterLayout } from './layout/FooterLayout';
import { GameLayout } from './layout/GameLayout';
import { LobbyPage } from '@/pages/LobbyPage';
import { PrePage } from '@/pages/PrePage';
import { MessagePage } from '@/pages/MessagePage';
import { ProfilePage } from '@/pages/ProfilePage';
import { EditProfilePage } from '@/pages/EditProfilePage';
import { RegisterPage } from '@/pages/RegisterPage';
import { GameReadyPage } from './pages/GameReadyPage/GameReadyPage';
import { ErrorBoundary } from 'react-error-boundary';
import { GameListPage } from './pages/GameListPage';
import { AuthHandler } from './AuthHandler';
import { Loading } from './common/Loading/Loading';
import { SocketHandler } from './SocketHandler';

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <ErrorBoundary fallback={<h1>Error</h1>}>
          <SocketHandler />
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<LobbyPage />} />
              <Route path="/message" element={<MessagePage />} />
              <Route path="/channel/list" element={<GameListPage />} />
              <Route element={<FooterLayout />}>
                <Route path="/profile/:userId" element={<ProfilePage />} />
                <Route path="/profile/edit" element={<EditProfilePage />} />
              </Route>
            </Route>
            <Route element={<GameLayout />}>
              <Route path="/channel/:gameId" element={<GameReadyPage />} />
            </Route>
            <Route path="/pre" element={<PrePage />} />
            <Route path="/auth?/" element={<AuthHandler />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route path="/auth/2fa" element={<h1>2fa</h1>} />
          </Routes>
        </ErrorBoundary>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
