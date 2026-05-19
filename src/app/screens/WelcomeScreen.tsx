import React from 'react';
import { t } from '../../i18n';
import { useApp } from '../AppContext';

export function WelcomeScreen() {
  const { lang, setLang, setPhase } = useApp();

  return (
    <div className="dialago-welcome">
      <div className="dialago-welcome__lang">
        <button
          type="button"
          className={lang === 'en' ? 'is-active' : ''}
          onClick={() => setLang('en')}
          aria-pressed={lang === 'en'}
        >
          EN
        </button>
        <button
          type="button"
          className={lang === 'es' ? 'is-active' : ''}
          onClick={() => setLang('es')}
          aria-pressed={lang === 'es'}
        >
          ES
        </button>
      </div>

      <div className="dialago-welcome__center">
        <p className="dialago-welcome__logo">DialaGO</p>
        <h1 className="dialago-welcome__headline">{t(lang, 'app.welcome.headline')}</h1>
        <p className="dialago-welcome__sub muted">{t(lang, 'app.welcome.sub')}</p>
      </div>

      <button type="button" className="dialago-btn dialago-btn--primary" onClick={() => setPhase('setup')}>
        {t(lang, 'app.welcome.cta')}
      </button>
    </div>
  );
}
