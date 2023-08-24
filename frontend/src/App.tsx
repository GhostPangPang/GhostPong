import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Suspense } from 'react';
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
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { GameLoadingPage } from './pages/GameLoadingPage';
import { TwoFactorLoginPage } from './pages/TwoFactorLoginPage';
import { ProtectedRoute } from './ProtectedRoute';
import { DebugObserver } from './DebugObserver';
import { RouteErrorPage } from './pages/RouteErrorPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        {/* <DebugObserver /> */}
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary FallbackComponent={FallbackComponent} onError={logError} onReset={reset}>
              <Routes>
                <Route element={<ProtectedRoute />}>
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
                </Route>

                <Route path="/pre" element={<PrePage />} />
                <Route path="/auth?/" element={<AuthHandler />} />
                <Route path="/auth/signin" element={<SignInPage />} />
                <Route path="/auth/signup" element={<SignUpPage />} />
                <Route path="/auth/register" element={<RegisterPage />} />
                <Route path="/auth/2fa" element={<TwoFactorLoginPage />} />
                <Route path="/error" element={<RouteErrorPage code={404} />} />
                <Route path="*" element={<RouteErrorPage code={404} />} />
              </Routes>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
