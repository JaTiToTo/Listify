import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { RootLayout } from "./layouts/SideNavBar";
import { AuthPage } from "./pages/AuthPage";
import { MainPage } from "./pages/MainPage";
import { CreatePage } from "./pages/CreatePage";
import DraftPage from "./pages/DraftPage";
import ResultPage from "./pages/ResultPage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { TermsOfServicePage } from "./pages/TermsOfServicePage";

import { SpotifyCallbackPage } from "./pages/SpotifyCallbackPage";
import { hasActiveSession } from "./lib/api";

function AuthRoute() {
  const [sessionChecked, setSessionChecked] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);

  useEffect(() => {
    let isMounted = true;

    hasActiveSession()
      .then((active) => {
        if (isMounted) {
          setSessionActive(active);
          setSessionChecked(true);
        }
      })
      .catch(() => {
        if (isMounted) {
          setSessionActive(false);
          setSessionChecked(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!sessionChecked) {
    return null;
  }

  return sessionActive ? <Navigate to="/main" replace /> : <AuthPage />;
}

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const [sessionChecked, setSessionChecked] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);

  useEffect(() => {
    let isMounted = true;

    hasActiveSession()
      .then((active) => {
        if (isMounted) {
          setSessionActive(active);
          setSessionChecked(true);
        }
      })
      .catch(() => {
        if (isMounted) {
          setSessionActive(false);
          setSessionChecked(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!sessionChecked) {
    return null;
  }

  return sessionActive ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Starting point: Auth */}
      <Route path="/" element={<AuthRoute />} />
      <Route path="/terms" element={<TermsOfServicePage />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/callback" element={<SpotifyCallbackPage />} />

      {/* App routes wrapped with main layout */}
      <Route element={<RootLayout />}>
        <Route
          path="/main"
          element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create/:id/draft"
          element={
            <ProtectedRoute>
              <DraftPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create/:id/result"
          element={
            <ProtectedRoute>
              <ResultPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
