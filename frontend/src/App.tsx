import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MainLayout } from '@/layout/MainLayout';
import { LobbyPage } from '@/pages/LobbyPage';
import { PrePage } from './pages/PrePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/pre" element={<PrePage />} />
        <Route element={<MainLayout />}>
          <Route path="/" element={<LobbyPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
