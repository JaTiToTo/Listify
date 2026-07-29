import { Navigate, Route, Routes } from "react-router-dom";
import { RootLayout } from "./layouts/SideNavBar";
import { AuthPage } from "./pages/AuthPage";
import { MainPage } from "./pages/MainPage";
import { CreatePage } from "./pages/CreatePage";
import DraftPage from "./pages/DraftPage";
import ResultPage from "./pages/ResultPage";

import { SpotifyCallbackPage } from "./pages/SpotifyCallbackPage";

export default function App() {
  return (
    <Routes>
      {/* Starting point: Auth */}
      <Route path="/" element={<AuthPage />} />
      <Route path="/callback" element={<SpotifyCallbackPage />} />

      {/* App routes wrapped with main layout */}
      <Route element={<RootLayout />}>
        <Route path="/main" element={<MainPage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/create/:id/draft" element={<DraftPage />} />
        <Route path="/create/:id/result" element={<ResultPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
