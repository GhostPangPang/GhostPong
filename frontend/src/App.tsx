import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Suspense, useEffect } from 'react';
import { MainLayout, FooterLayout, GameLayout } from '@/layout';
import {
  LobbyPage,
  MessagePage,
  ProfilePage,
  PrePage,
  EditProfilePage,
  RegisterPage,
  GameReadyPage,
  GameListPage,
  FallbackComponent,
  logError,
  PingPongGame,
} from '@/pages';
import { Loading } from '@/common';
import { ErrorBoundary } from 'react-error-boundary';
import { AuthHandler } from './AuthHandler';
import { SocketHandler } from './SocketHandler';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { useRecoilSnapshot } from 'recoil';
import { GameLoadingPage } from './pages/GameLoadingPage';

// function DebugObserver() {
//   const snapshot = useRecoilSnapshot();
//   useEffect(() => {
//     console.debug('The following atoms were modified:');
//     for (const node of snapshot.getNodes_UNSTABLE({ isModified: true })) {
//       console.debug(node.key, snapshot.getLoadable(node));
//     }
//   }, [snapshot]);

//   return null;
// }

function App() {
  return (
    <BrowserRouter>
      {/* <DebugObserver /> */}
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
                  <Route path="/game/:gameId" element={<PingPongGame />} />
                  <Route path="/game/loading" element={<GameLoadingPage />} />
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
