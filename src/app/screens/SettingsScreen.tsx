import React from 'react';
import { t } from '../../i18n';
import { useApp } from '../AppContext';
import { ProfileDashboard } from '../components/ProfileDashboard';

export function SettingsScreen() {
  const { lang, setLang, savedPhraseIds, resetApp } = useApp();
  const savedCount = Object.values(savedPhraseIds).filter(Boolean).length;

  return (
    <div className="dialago-screen dialago-screen--scroll">
      <header className="dialago-screen__header dialago-screen--pad-h">
        <h1 className="dialago-screen__title">{t(lang, 'app.settings.title')}</h1>
      </header>

      <div className="dialago-settings dialago-screen--pad-h">
        <div className="dialago-settings__row">
          <span>{t(lang, 'app.settings.language')}</span>
          <div className="dialago-settings__toggle">
            <button type="button" className={lang === 'en' ? 'is-active' : ''} onClick={() => setLang('en')}>
              EN
            </button>
            <button type="button" className={lang === 'es' ? 'is-active' : ''} onClick={() => setLang('es')}>
              ES
            </button>
          </div>
        </div>
        <div className="dialago-settings__row">
          <span>{t(lang, 'app.settings.notifications')}</span>
          <span className="muted">{t(lang, 'app.settings.notificationsVal')}</span>
        </div>
        <div className="dialago-settings__row">
          <span>{t(lang, 'app.settings.savedPhrases')}</span>
          <span className="muted">{t(lang, 'app.settings.savedCount').replace('{count}', String(savedCount))}</span>
        </div>
        <button type="button" className="dialago-btn dialago-btn--ghost dialago-settings__reset" onClick={resetApp}>
          {t(lang, 'app.settings.reset')}
        </button>
      </div>

      <section className="dialago-settings__summary">
        <h2 className="dialago-screen--pad-h dialago-settings__summaryTitle">{t(lang, 'app.settings.progressSummary')}</h2>
        <ProfileDashboard animate={false} />
      </section>
    </div>
  );
}
