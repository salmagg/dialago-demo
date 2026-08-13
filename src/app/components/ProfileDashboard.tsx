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

const PAST_LESSONS = [
  { word: "Anesthesia", definition: "Medicine that blocks the awareness of pain during surgery or medical procedures." },
  { word: "Diagnosis", definition: "The process of identifying a disease or injury from its signs and symptoms." },
  { word: "Hypertension", definition: "A medical condition where the long-term force of blood against artery walls is too high." },
  { word: "Prescription", definition: "A formal instruction written by a doctor authorizing a patient to receive medicine." }
];

export function ProfileDashboard({ animate = true }: { animate?: boolean }) {
  const { lang, profile, setProfile, tab, completeSetup } = useApp();
  const [progressVisible, setProgressVisible] = useState(!animate);
  
  const [isOnboardingDone, setIsOnboardingDone] = useState(() => !!localStorage.getItem('dialago-onboarding-complete'));
  const [localHometown, setLocalHometown] = useState(() => localStorage.getItem('dialago-user-hometown') || '');

  const [selectedProfession, setSelectedProfession] = useState(profile.profession || 'medical');
  const [selectedLocation, setSelectedLocation] = useState(profile.location || 'us');
  const [selectedNativeLang, setSelectedNativeLang] = useState(profile.nativeLanguage || 'es');
  const [selectedFocus, setSelectedFocus] = useState(profile.focus || 'speaking');

  const professionLabel = professionDisplay(lang, profile.profession);
  const nativeLabel = displayField(lang, NATIVE_LANGS, profile.nativeLanguage, 'profile.lang');
  const locationFull = formatLocation(lang, profile.location);
  const personaLine = t(lang, 'profile.personaLine').replace('{age}', '30').replace('{profession}', professionLabel);

  useEffect(() => {
    if (!animate) return;
    const tmr = setTimeout(() => setProgressVisible(true), 200);
    return () => clearTimeout(tmr);
  }, [animate]);

  const handleSpeak = (textToSpeak: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); 
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = lang === 'es' ? 'es-US' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSaveOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!localHometown.trim()) {
      alert("Please fill in your Hometown before proceeding.");
      return;
    }
    
    localStorage.setItem('dialago-user-hometown', localHometown.trim());
    localStorage.setItem('dialago-onboarding-complete', 'true');
    
    setProfile(prev => ({
      ...prev,
      profession: selectedProfession,
      location: selectedLocation,
      nativeLanguage: selectedNativeLang,
      focus: selectedFocus
    }));

    if (completeSetup) {
      await completeSetup();
    }
    
    setIsOnboardingDone(true);
  };

  if (!isOnboardingDone) {
    return (
      <div className="dialago-profile" style={{ padding: '24px 20px', maxWidth: '480px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '6px' }}>Setup Your Profile</h2>
        <p className="muted" style={{ fontSize: '14px', marginBottom: '24px' }}>Please complete your profile details to configure your study workspace.</p>
        
        <form onSubmit={handleSaveOnboarding} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Profession / Focus Area</label>
            <select value={selectedProfession} onChange={(e) => setSelectedProfession(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-input)' }}>
              <option value="medical">Healthcare / Medical Professional</option>
              <option value="business">Business / Corporate</option>
              <option value="engineering">Engineering / Tech</option>
              <option value="general">General Communication</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Native Language</label>
            <select value={selectedNativeLang} onChange={(e) => setSelectedNativeLang(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-input)' }}>
              <option value="es">Español (Spanish)</option>
              <option value="fr">Français (French)</option>
              <option value="zh">中文 (Chinese)</option>
              <option value="ar">العربية (Arabic)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Target Focus Track</label>
            <select value={selectedFocus} onChange={(e) => setSelectedFocus(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-input)' }}>
              <option value="speaking">Speaking Confidence & Pronunciation</option>
              <option value="writing">Professional Writing & Grammar</option>
              <option value="vocabulary">Medical & Technical Vocabulary</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Hometown</label>
            <input 
              type="text" 
              required
              value={localHometown} 
              onChange={(e) => setLocalHometown(e.target.value)}
              placeholder="Enter your hometown..." 
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text)' }}
            />
          </div>

          <button type="submit" style={{ marginTop: '12px', padding: '12px', background: 'var(--text)', color: 'var(--bg)', borderRadius: '8px', border: 'none', fontWeight: '700', cursor: 'pointer', fontSize: '15px' }}>
            Complete Setup & Start Learning
          </button>
        </form>
      </div>
    );
  }

  if (tab === 'learn') {
    return (
      <div className="dialago-profile" style={{ padding: '24px 16px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px' }}>Practice Past In-Person Lessons</h2>
        <p className="muted" style={{ fontSize: '14px', marginBottom: '24px' }}>Click the speaker icon next to any vocabulary word to hear its definition read aloud.</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {PAST_LESSONS.map((lesson, idx) => (
            <div key={idx} style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-card)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: '17px', display: 'block', marginBottom: '4px' }}>{lesson.word}</strong>
                <span className="muted" style={{ fontSize: '14px', display: 'block' }}>{lesson.definition}</span>
              </div>
              <button 
                type="button" 
                onClick={() => handleSpeak(`${lesson.word}. Definition: ${lesson.definition}`)}
                style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(var(--primary-rgb), 0.08)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}
              >
                🔊
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
          Hometown: {localHometown} | Location: {locationFull}
        </p>
      </div>

      <div className="dialago-profile__details">
        <div className="dialago-row">
          <span className="dialago-row__label muted">Profession</span>
          <span className="dialago-row__value">{professionLabel}</span>
        </div>
        <div className="dialago-row">
          <span className="dialago-row__label muted">Hometown</span>
          <span className="dialago-row__value" style={{ fontWeight: '500' }}>{localHometown}</span>
        </div>
        <div className="dialago-row">
          <span className="dialago-row__label muted">Native Language</span>
          <span className="dialago-row__value">{nativeLabel}</span>
        </div>
      </div>

      <button 
        type="button" 
        onClick={() => {
          localStorage.removeItem('dialago-onboarding-complete');
          setIsOnboardingDone(false);
        }}
        style={{ margin: '20px 16px', padding: '10px', background: 'none', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', cursor: 'pointer', fontSize: '13px' }}
      >
        🔄 Reset Demographic Form
      </button>
    </div>
  );
}