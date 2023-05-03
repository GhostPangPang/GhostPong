import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import { MainLayout } from '@/layout/MainLayout';
import { LobbyPage } from '@/pages/LobbyPage';
import { PrePage } from './pages/PrePage';
import { Suspense } from 'react';

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<h1>Loading</h1>}>
        <Routes>
          <Route path="/auth" element={<div>auth</div>} />
          <Route path="/pre" element={<PrePage />} />
          <Route element={<MainLayout />}>
            <Route path="/" element={<LobbyPage />} />
            {/* <Route path="/profile/:userId" element={<ProfilePage />} /> */}
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
