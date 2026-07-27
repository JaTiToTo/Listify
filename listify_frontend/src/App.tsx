import { Navigate, Route, Routes } from 'react-router-dom';
import { RootLayout } from './layouts/SideNavBar';
import { AuthPage } from './pages/AuthPage';
import { MainPage } from './pages/MainPage';
import { ListPage } from './pages/ListPage';
import { SpotifyCallbackPage } from './pages/SpotifyCallbackPage';
import DraftPage from './pages/DraftPage';

export default function App() {
  return (
    <Routes>
      {/* Starting point: Auth */}
      <Route path="/" element={<AuthPage />} />
      <Route path="/callback" element={<SpotifyCallbackPage />} />

      {/* App routes wrapped with main layout */}
      <Route element={<RootLayout />}>
        <Route path="/main" element={<MainPage />} />
        <Route path="/list" element={<ListPage />} />
        <Route path="/list/:id/draft" element={<DraftPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}