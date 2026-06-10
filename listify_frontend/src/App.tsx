import { Navigate, Route, Routes } from 'react-router-dom';
import { RootLayout } from './layouts/SideNavBar';
import { AuthPage } from './pages/AuthPage';
import { MainPage } from './pages/MainPage';
import { ListPage } from './pages/ListPage';

export default function App() {
  return (
    <Routes>
      {/* Starting point: Auth */}
      <Route path="/" element={<AuthPage />} />

      {/* App routes wrapped with main layout */}
      <Route element={<RootLayout />}>
        <Route path="/main" element={<MainPage />} />
        <Route path="/list" element={<ListPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}