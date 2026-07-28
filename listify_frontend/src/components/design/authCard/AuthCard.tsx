import { useNavigate } from "react-router-dom";
import spotifyIcon from "../../../assets/svgs/spotifyLogo.svg";
import "./AuthCard.css";

async function handleSpotifyLogin() {
  const response = await fetch("http://localhost:8081/auth/login/spotify");

  const text = await response.text();

  if (!response.ok) {
    throw new Error(text);
  }

  window.location.href = text;
}

export default function AuthCard() {
  const navigate = useNavigate();

  {
    /* TODO: - Add form validation and error handling */
  }
  return (
    <div className="auth-card">
      <div className="auth-card__input">
        <input
          className="auth-card__inputText"
          type="email"
          placeholder="email@domain.com"
        />
      </div>
      <button onClick={() => navigate("/main")} className="auth-card__primary">
        <p>Login with email</p>
      </button>

      <div className="auth-card__or">
        <div className="auth-card__divider" />
        <p>or continue with</p>
        <div className="auth-card__divider" />
      </div>
      <button
        onClick={async () => {
          await handleSpotifyLogin();
        }}
        className="auth-card__spotify"
      >
        <div className="auth-card__spotifyText">Spotify</div>
        <div className="auth-card__spotifyIcon">
          <img alt="" src={spotifyIcon} />
        </div>
      </button>

      <p className="auth-card__footer">
        <span className="muted">{`By clicking continue, you agree to our `}</span>
        <span className="font-quub font-medium text-black italic leading-[1.5]">
          Terms of Service
        </span>
        <span className="muted">{` and `}</span>
        <span className="font-quub font-medium text-black italic leading-[1.5]">
          Privacy Policy
        </span>
      </p>
    </div>
  );
}
