import React, { useState } from 'react';
import { t } from '../../i18n';
import { useApp } from '../AppContext';

const FLASHCARDS = [
  { id: 'fc1', term: 'liveDemo.fc1Term', def: 'liveDemo.fc1Def', ex: 'liveDemo.fc1Ex' },
  { id: 'fc2', term: 'liveDemo.fc2Term', def: 'liveDemo.fc2Def', ex: 'liveDemo.fc2Ex' },
  { id: 'fc3', term: 'liveDemo.fc3Term', def: 'liveDemo.fc3Def', ex: 'liveDemo.fc3Ex' },
] as const;

export function PhraseScreen() {
  const { lang, savedPhraseIds, toggleSavedPhrase } = useApp();
  const [index, setIndex] = useState(0);
  const card = FLASHCARDS[index];
  const saved = !!savedPhraseIds[card.id];

  return (
    <div className="dialago-screen dialago-screen--pad dialago-phrase">
      <header className="dialago-screen__header">
        <p className="dialago-eyebrow">{t(lang, 'liveDemo.fcLabel')}</p>
        <h1 className="dialago-screen__title">{t(lang, 'liveDemo.screen3Title')}</h1>
      </header>

      <article className="dialago-flashcard">
        <p className="dialago-flashcard__term">{t(lang, card.term)}</p>
        <p className="dialago-flashcard__def muted">{t(lang, card.def)}</p>
        <p className="dialago-flashcard__ex">{t(lang, card.ex)}</p>
        <button type="button" className="dialago-flashcard__listen muted" aria-label="Listen (demo)">
          ▶ {t(lang, 'liveDemo.fcLabel')}
        </button>
      </article>

      <div className="dialago-phrase__actions">
        <button
          type="button"
          className={`dialago-btn dialago-btn--ghost ${saved ? 'is-saved' : ''}`}
          onClick={() => toggleSavedPhrase(card.id)}
        >
          {t(lang, 'liveDemo.savePhrase')}
        </button>
        <button
          type="button"
          className="dialago-btn dialago-btn--primary"
          onClick={() => setIndex((i) => (i + 1) % FLASHCARDS.length)}
        >
          {t(lang, 'liveDemo.nextPhrase')}
        </button>
      </div>
    </div>
  );
}
