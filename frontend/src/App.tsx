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
import { FallbackComponent, logError } from '@/pages/ErrorFallback';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { GamePage } from './pages/GamePage';

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary FallbackComponent={FallbackComponent} onError={logError} onReset={reset}>
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
                  <Route path="/game" element={<GamePage type={'leftPlayer'} channelId={''} />} />
                </Route>
                <Route path="/pre" element={<PrePage />} />
                <Route path="/auth?/" element={<AuthHandler />} />
                <Route path="/auth/register" element={<RegisterPage />} />
                <Route path="/auth/2fa" element={<h1>2fa</h1>} />
              </Routes>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
