import React, { useEffect, useMemo, useState } from 'react';
import { t } from '../../i18n';
import { useApp } from '../AppContext';
import {
  FOCUSES,
  GOALS,
  LANG_PROGRESS_METRICS,
  LOCATIONS,
  NATIVE_LANGS,
  PROFESSIONS,
  SCENARIO_KEYS,
} from '../profileConstants';
import {
  cityShort,
  displayField,
  formatLocation,
  professionDisplay,
  scenarioCategory,
} from '../profileUtils';

function IconBriefcase() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M5 9h14v10a2 2 0 01-2 2H7a2 2 0 01-2-2V9z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconPin() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21s6-5.2 6-10a6 6 0 10-12 0c0 4.8 6 10 6 10z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="11" r="2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function IconGlobe() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M4 12h16M12 4c2.5 2.2 4 5.2 4 8s-1.5 5.8-4 8c-2.5-2.2-4-5.2-4-8s1.5-5.8 4-8z"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  );
}

function IconTarget() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

type Props = { animate?: boolean };

export function ProfileDashboard({ animate = true }: Props) {
  const { lang, profile } = useApp();
  const [progressVisible, setProgressVisible] = useState(!animate);

  const professionLabel = professionDisplay(lang, profile.profession);
  const focusLabel = displayField(lang, FOCUSES, profile.focus, 'profile.focus');
  const nativeLabel = displayField(lang, NATIVE_LANGS, profile.nativeLanguage, 'profile.lang');
  const locationFull = formatLocation(lang, profile.location);
  const cityLabel = cityShort(lang, profile.location);

  const personaLine = t(lang, 'profile.personaLine')
    .replace('{age}', '30')
    .replace('{profession}', professionLabel);

  const scenarioKeys = useMemo(
    () => SCENARIO_KEYS[scenarioCategory(profile.profession)] ?? SCENARIO_KEYS.default,
    [profile.profession],
  );

  useEffect(() => {
    if (!animate) return;
    const tmr = setTimeout(() => setProgressVisible(true), 200);
    return () => clearTimeout(tmr);
  }, [animate]);

  return (
    <div className="dialago-profile">
      <div className="dialago-profile__hero">
        <div className="dialago-profile__avatar" aria-hidden="true">
          <span className="dialago-profile__mesh dialago-profile__mesh--a" />
          <span className="dialago-profile__mesh dialago-profile__mesh--b" />
          <span className="dialago-profile__mesh dialago-profile__mesh--c" />
        </div>
        <p className="dialago-profile__persona">{personaLine}</p>
        <p className="dialago-profile__city muted">{cityLabel}</p>
        <p className="dialago-profile__tagline muted">{t(lang, 'profile.generatedTagline')}</p>
      </div>

      <div className="dialago-profile__metrics">
        <div className="dialago-metric">
          <span className="dialago-metric__label muted">{t(lang, 'profile.rowEnglishLevel')}</span>
          <span className="dialago-metric__value">{t(lang, 'profile.valEnglishLevel')}</span>
        </div>
        <div className="dialago-metric">
          <span className="dialago-metric__label muted">{t(lang, 'profile.rowSpeakingConf')}</span>
          <span className="dialago-metric__value">{t(lang, 'profile.valSpeakingConf')}</span>
        </div>
        <div className="dialago-metric">
          <span className="dialago-metric__label muted">{t(lang, 'profile.rowWritingClarity')}</span>
          <span className="dialago-metric__value">{t(lang, 'profile.valWritingClarity')}</span>
        </div>
        <div className="dialago-metric">
          <span className="dialago-metric__label muted">{t(lang, 'profile.rowVocabRange')}</span>
          <span className="dialago-metric__value">{t(lang, 'profile.valVocabRange')}</span>
        </div>
      </div>

      <div className="dialago-profile__details">
        <div className="dialago-row">
          <span className="dialago-row__icon">
            <IconBriefcase />
          </span>
          <span className="dialago-row__label muted">{t(lang, 'profile.rowProfession')}</span>
          <span className="dialago-row__value">{professionLabel}</span>
        </div>
        <div className="dialago-row">
          <span className="dialago-row__icon">
            <IconPin />
          </span>
          <span className="dialago-row__label muted">{t(lang, 'profile.rowLocation')}</span>
          <span className="dialago-row__value">{locationFull}</span>
        </div>
        <div className="dialago-row">
          <span className="dialago-row__icon">
            <IconGlobe />
          </span>
          <span className="dialago-row__label muted">{t(lang, 'profile.rowNativeLanguage')}</span>
          <span className="dialago-row__value">{nativeLabel}</span>
        </div>
        <div className="dialago-row">
          <span className="dialago-row__icon">
            <IconTarget />
          </span>
          <span className="dialago-row__label muted">{t(lang, 'profile.rowFocus')}</span>
          <span className="dialago-row__value">{focusLabel}</span>
        </div>
      </div>

      <div className="dialago-progress-block">
        <p className="dialago-progress-block__title">{t(lang, 'profile.langProgressTitle')}</p>
        <div className={`dialago-progress-block__bars ${progressVisible ? 'is-animated' : ''}`}>
          {LANG_PROGRESS_METRICS.map((m) => (
            <div key={m.key} className="dialago-progress-bar">
              <div className="dialago-progress-bar__head">
                <span>{t(lang, m.key)}</span>
                <span>{m.pct}%</span>
              </div>
              <div className="dialago-progress-bar__track">
                <span className="dialago-progress-bar__fill" style={{ width: progressVisible ? `${m.pct}%` : '0%' }} />
              </div>
            </div>
          ))}
        </div>
        <div className="dialago-progress-block__labels">
          <span>{t(lang, 'profile.progressPast')}</span>
          <span>{t(lang, 'profile.progressToday')}</span>
        </div>
      </div>

      <div className="dialago-scenarios">
        <div className="dialago-scenarios__head">
          <p className="dialago-scenarios__title">{t(lang, 'profile.scenarioRecordsTitle')}</p>
          <p className="dialago-scenarios__badge muted">{t(lang, 'profile.scenarioRecordsBadge')}</p>
        </div>
        <ul className="dialago-scenarios__list">
          {scenarioKeys.map((key) => (
            <li key={key} className="dialago-scenarios__item">
              <span className="dialago-scenarios__check" aria-hidden="true">
                ✓
              </span>
              <span>{t(lang, key)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
