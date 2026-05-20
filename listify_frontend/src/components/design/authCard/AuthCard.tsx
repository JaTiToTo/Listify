import React from 'react'
import { useNavigate } from 'react-router-dom'
import imgImage16 from '../../../assets/svgs/spotifyLogo.svg'
import './AuthCard.css'

export default function AuthCard() {
  const navigate = useNavigate()

  return (
    <div className="auth-card">
      <div className="auth-card__title">
        <p>Enter your Spotify email</p>
      </div>

      <div className="auth-card__input">
        <p className="auth-card__inputText">email@domain.com</p>
      </div>

      <button onClick={() => navigate('/main')} className="auth-card__primary">
        <p>Login with email</p>
      </button>

      <div className="auth-card__or">
        <div className="auth-card__divider" />
        <p>or continue with</p>
        <div className="auth-card__divider" />
      </div>

      <button onClick={() => navigate('/main')} className="auth-card__spotify">
        <div className="auth-card__spotifyText">Spotify</div>
        <div className="auth-card__spotifyIcon">
          <img alt="" src={imgImage16} />
        </div>
      </button>

      <p className="auth-card__footer">
        <span className="muted">{`By clicking continue, you agree to our `}</span>
        <span className="font-quub italic font-medium leading-[1.5] text-black">Terms of Service</span>
        <span className="muted">{` and `}</span>
        <span className="font-quub italic font-medium leading-[1.5] text-black">Privacy Policy</span>
      </p>
    </div>
  )
}
