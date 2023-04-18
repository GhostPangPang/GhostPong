import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { LobyPage } from '@/pages/LobyPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<LobyPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
