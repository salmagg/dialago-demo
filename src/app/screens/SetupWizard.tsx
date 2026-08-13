import React from 'react';
import { t } from '../../i18n';
import { useApp } from '../AppContext';
import { SelectableField } from '../components/SelectableField';
import { FOCUSES, GOALS, LOCATIONS, NATIVE_LANGS, PROFESSIONS } from '../profileConstants';
import { displayField, professionDisplay } from '../profileUtils';

export function SetupWizard() {
  const { lang, profile, setProfile, completeSetup } = useApp();

  const professionLabel = professionDisplay(lang, profile.profession);
  const canSubmit =
    professionLabel.length > 0 &&
    (profile.location.manual ? profile.location.customText.trim() : true) &&
    displayField(lang, NATIVE_LANGS, profile.nativeLanguage, 'profile.lang').length > 0 &&
    displayField(lang, FOCUSES, profile.focus, 'profile.focus').length > 0 &&
    displayField(lang, GOALS, profile.goal, 'profile.goal').length > 0 &&
    profile.hometown.trim().length > 0;

  return (
    <div className="dialago-setup dialago-setup--scroll">
      <header className="dialago-setup__header">
        <p className="dialago-eyebrow">{t(lang, 'profile.welcomeEyebrow')}</p>
        <h1 className="dialago-setup__title">{t(lang, 'profile.welcomeTitle')}</h1>
        <p className="dialago-setup__lead muted">{t(lang, 'profile.welcomeLead')}</p>
      </header>
      <div className="dialago-setup__fields">
        <SelectableField
          lang={lang}
          label={t(lang, 'profile.fieldProfession')}
          options={PROFESSIONS}
          manualPlaceholderKey="profile.placeholderProfession"
          value={profile.profession}
          onChange={(v) => setProfile((p) => ({ ...p, profession: v }))}
        />
        <SelectableField
          lang={lang}
          label={t(lang, 'profile.fieldLocation')}
          options={LOCATIONS}
          manualPlaceholderKey="profile.placeholderLocation"
          value={profile.location}
          onChange={(v) => setProfile((p) => ({ ...p, location: v }))}
        />
        <SelectableField
          lang={lang}
          label={t(lang, 'profile.fieldNativeLanguage')}
          options={NATIVE_LANGS}
          manualPlaceholderKey="profile.placeholderNativeLanguage"
          value={profile.nativeLanguage}
          onChange={(v) => setProfile((p) => ({ ...p, nativeLanguage: v }))}
        />
        <SelectableField
          lang={lang}
          label={t(lang, 'profile.fieldFocus')}
          options={FOCUSES}
          manualPlaceholderKey="profile.placeholderFocus"
          value={profile.focus}
          onChange={(v) => setProfile((p) => ({ ...p, focus: v }))}
        />
        <SelectableField
          lang={lang}
          label={t(lang, 'profile.fieldGoal')}
          options={GOALS}
          manualPlaceholderKey="profile.placeholderGoal"
          value={profile.goal}
          onChange={(v) => setProfile((p) => ({ ...p, goal: v }))}
        />
        <div className="dialago-field">
          <p className="dialago-field__label">{t(lang, 'profile.fieldHometown')}</p>
          <input
            type="text"
            className="dialago-input"
            value={profile.hometown}
            onChange={(e) => setProfile((p) => ({ ...p, hometown: e.target.value }))}
            placeholder={t(lang, 'profile.placeholderHometown')}
            aria-label={t(lang, 'profile.fieldHometown')}
          />
        </div>
      </div>
      <footer className="dialago-setup__footer">
        <button
          type="button"
          className="dialago-btn dialago-btn--primary"
          disabled={!canSubmit}
          onClick={() => void completeSetup()}
        >
          {t(lang, 'profile.submit')}
        </button>
      </footer>
    </div>
  );
}
