import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function SpotifyCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const error = searchParams.get('error');
    const authorized = searchParams.get('authorized');

    if (error) {
      window.alert(`Spotify login failed: ${error}`);
      navigate('/');
      return;
    }

    if (authorized === 'true') {
      navigate('/main');
      return;
    }

    navigate('/');
  }, [navigate, searchParams]);

  return null;
}
