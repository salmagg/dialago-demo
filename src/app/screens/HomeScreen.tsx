import React from 'react';
import { t } from '../../i18n';
import { useApp } from '../AppContext';

export function HomeScreen() {
  const { lang, setTab } = useApp();

  return (
    <div className="dialago-screen dialago-screen--pad">
      <header className="dialago-screen__header">
        <p className="dialago-eyebrow">DialaGO</p>
        <h1 className="dialago-screen__title">{t(lang, 'app.home.greeting')}</h1>
        <p className="dialago-screen__lead muted">{t(lang, 'app.home.sub')}</p>
      </header>

      <div className="dialago-actions">
        <button type="button" className="dialago-action-card" onClick={() => setTab('practice')}>
          <span className="dialago-action-card__title">{t(lang, 'app.home.startPractice')}</span>
          <span className="dialago-action-card__arrow" aria-hidden="true">
            →
          </span>
        </button>
        <button type="button" className="dialago-action-card" onClick={() => setTab('learn')}>
          <span className="dialago-action-card__title">{t(lang, 'app.home.reviewPhrases')}</span>
          <span className="dialago-action-card__arrow" aria-hidden="true">
            →
          </span>
        </button>
        <button type="button" className="dialago-action-card" onClick={() => setTab('progress')}>
          <span className="dialago-action-card__title">{t(lang, 'app.home.viewProgress')}</span>
          <span className="dialago-action-card__arrow" aria-hidden="true">
            →
          </span>
        </button>
      </div>
    </div>
  );
}
