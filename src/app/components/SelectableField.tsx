import React from 'react';
import { t, type Lang } from '../../i18n';
import type { FieldValue } from '../types';
import type { Option } from '../profileConstants';
import { MANUAL_ID } from '../profileConstants';

type Props = {
  lang: Lang;
  label: string;
  options: Option[];
  manualPlaceholderKey: string;
  value: FieldValue;
  onChange: (v: FieldValue) => void;
};

export function SelectableField({ lang, label, options, manualPlaceholderKey, value, onChange }: Props) {
  const selectPreset = (id: string) => {
    if (id === MANUAL_ID) {
      onChange({ presetId: value.presetId, manual: true, customText: value.customText });
    } else {
      onChange({ presetId: id, manual: false, customText: '' });
    }
  };

  return (
    <div className="dialago-field">
      <p className="dialago-field__label">{label}</p>
      <div className="dialago-chips" role="listbox" aria-label={label}>
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            role="option"
            aria-selected={!value.manual && value.presetId === opt.id}
            className={`dialago-chip ${!value.manual && value.presetId === opt.id ? 'is-selected' : ''}`}
            onClick={() => selectPreset(opt.id)}
          >
            {t(lang, opt.labelKey)}
          </button>
        ))}
        <button
          type="button"
          role="option"
          aria-selected={value.manual}
          className={`dialago-chip dialago-chip--manual ${value.manual ? 'is-selected' : ''}`}
          onClick={() => selectPreset(MANUAL_ID)}
        >
          {t(lang, 'profile.enterManually')}
        </button>
      </div>
      <div className={`dialago-field__manual ${value.manual ? 'is-visible' : ''}`} aria-hidden={!value.manual}>
        <input
          type="text"
          className="dialago-input"
          value={value.customText}
          onChange={(e) => onChange({ ...value, customText: e.target.value })}
          placeholder={t(lang, manualPlaceholderKey)}
          aria-label={t(lang, manualPlaceholderKey)}
        />
      </div>
    </div>
  );
}
