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

// 📚 Custom vocabulary list with speech audio properties built-in
const PAST_LESSONS = [
  { word: "Anesthesia", definition: "Medicine that blocks the awareness of pain during surgery or medical procedures." },
  { word: "Diagnosis", definition: "The process of identifying a disease or injury from its signs and symptoms." },
  { word: "Hypertension", definition: "A medical condition where the long-term force of blood against artery walls is too high." },
  { word: "Prescription", definition: "A formal instruction written by a doctor authorizing a patient to receive medicine." }
];

function IconBriefcase() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M5 9h14v10a2 2 0 01-2 2H7a2 2 0 01-2-2V9z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function IconPin() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21s6-5.2 6-10a6 6 0 10-12 0c0 4.8 6 10 6 10z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="12" cy="11" r="2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function IconGlobe() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.4" />
      <path d="M4 12h16M12 4c2.5 2.2 4 5.2 4 8s-1.5 5.8-4 8c-2.5-2.2-4-5.2-4-8s1.5-5.8 4-8z" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function IconVolume() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
    </svg>
  );
}

export function ProfileDashboard({ animate = true }: { animate?: boolean }) {
  const { lang, profile, tab } = useApp();
  const [progressVisible, setProgressVisible] = useState(!animate);
  
  // 🏠 Forces the state to start completely blank and ignores old browser cached text strings
  const [hometown, setHometown] = useState('');
  const [isEditingHometown, setIsEditingHometown] = useState(true);

  const professionLabel = professionDisplay(lang, profile.profession);
  const nativeLabel = displayField(lang, NATIVE_LANGS, profile.nativeLanguage, 'profile.lang');
  const locationFull = formatLocation(lang, profile.location);
  const personaLine = t(lang, 'profile.personaLine').replace('{age}', '30').replace('{profession}', professionLabel);

  useEffect(() => {
    if (!animate) return;
    const tmr = setTimeout(() => setProgressVisible(true), 200);
    return () => clearTimeout(tmr);
  }, [animate]);

  // 🗣️ Built-in Speech synthesis setup
  const handleSpeak = (textToSpeak: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); 
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = lang === 'es' ? 'es-US' : 'en-US';
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Speech module not configured for this device browser.");
    }
  };

  // LEARN TAB DETECTOR VIEW PORTAL
  if (tab === 'learn') {
    return (
      <div className="dialago-profile" style={{ padding: '24px 16px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px' }}>Practice Past In-Person Lessons</h2>
        <p className="muted" style={{ fontSize: '14px', marginBottom: '24px', lineHeight: '1.4' }}>Click the speaker icon next to any vocabulary word to hear its definition read aloud.</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {PAST_LESSONS.map((lesson, idx) => (
            <div key={idx} style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-card)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: '17px', display: 'block', marginBottom: '4px' }}>{lesson.word}</strong>
                <span className="muted" style={{ fontSize: '14px', lineHeight: '1.4', display: 'block' }}>{lesson.definition}</span>
              </div>
              <button 
                type="button" 
                onClick={() => handleSpeak(`${lesson.word}. Definition: ${lesson.definition}`)}
                style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(var(--primary-rgb), 0.08)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}
              >
                <IconVolume />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // MAIN LAYOUT DASHBOARD WINDOW PANEL VIEW
  return (
    <div className="dialago-profile">
      <div className="dialago-profile__hero">
        <div className="dialago-profile__avatar" aria-hidden="true">
          <span className="dialago-profile__mesh dialago-profile__mesh--a" />
          <span className="dialago-profile__mesh dialago-profile__mesh--b" />
          <span className="dialago-profile__mesh dialago-profile__mesh--c" />
        </div>
        <p className="dialago-profile__persona">{personaLine}</p>
        <p className="dialago-profile__city muted">
          {hometown ? `Hometown: ${hometown} | Base: ${locationFull}` : locationFull}
        </p>
      </div>

      {/* INPUT FORM FIELD FOR HOMETOWN REGISTRATION ENTRY DATA */}
      {isEditingHometown ? (
        <div style={{ padding: '18px 16px', background: 'rgba(var(--primary-rgb), 0.05)', borderRadius: '12px', margin: '0 16px 20px', border: '1px dashed var(--border)' }}>
          <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '600', color: 'var(--text)' }}>
            Hometown
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              value={hometown} 
              onChange={(e) => setHometown(e.target.value)}
              placeholder=""
              style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text)', fontSize: '14px' }}
            />
            <button 
              type="button"
              onClick={() => {
                if (hometown.trim()) {
                  localStorage.setItem('dialago-user-hometown', hometown.trim());
                  setIsEditingHometown(false);
                }
              }}
              style={{ padding: '10px 16px', background: 'var(--text)', color: 'var(--bg)', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}
            >
              Save
            </button>
          </div>
        </div>
      ) : null}

      <div className="dialago-profile__details">
        <div className="dialago-row">
          <span className="dialago-row__icon"><IconBriefcase /></span>
          <span className="dialago-row__label muted">{t(lang, 'profile.rowProfession')}</span>
          <span className="dialago-row__value">{professionLabel}</span>
        </div>
        <div className="dialago-row">
          <span className="dialago-row__icon"><IconPin /></span>
          <span className="dialago-row__label muted">Hometown</span>
          <span className="dialago-row__value" style={{ fontWeight: '500' }}>{hometown || 'Not Specified'}</span>
        </div>
        <div className="dialago-row">
          <span className="dialago-row__icon"><IconGlobe /></span>
          <span className="dialago-row__label muted">{t(lang, 'profile.rowNativeLanguage')}</span>
          <span className="dialago-row__value">{nativeLabel}</span>
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
      </div>
    </div>
  );
}