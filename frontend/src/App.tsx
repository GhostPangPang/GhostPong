import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Suspense } from 'react';
import { MainLayout } from '@/layout/MainLayout';
import { LobbyPage } from '@/pages/LobbyPage';
import { PrePage } from '@/pages/PrePage';
import { MessagePage } from '@/pages/MessagePage';
import { ProfilePage } from './pages/ProfilePage';

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<h1>Loading</h1>}>
        <Routes>
          <Route path="/auth" element={<div>auth</div>} />
          <Route path="/pre" element={<PrePage />} />
          <Route element={<MainLayout />}>
            <Route path="/" element={<ProfilePage />} />
            <Route path="/message" element={<MessagePage />} />
            {/* <Route path="/profile/:userId" element={<ProfilePage />} /> */}
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
