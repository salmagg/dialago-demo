import { t, type Lang } from '../i18n';
import type { FieldValue } from './types';
import type { Option } from './profileConstants';
import { PROFESSIONS, SCENARIO_KEYS } from './profileConstants';

export function displayField(lang: Lang, options: Option[], value: FieldValue, keyPrefix: string): string {
  if (value.manual && value.customText.trim()) return value.customText.trim();
  const opt = options.find((o) => o.id === value.presetId);
  if (opt) return t(lang, opt.labelKey);
  return t(lang, `${keyPrefix}.${value.presetId}`);
}

export function formatLocation(lang: Lang, value: FieldValue): string {
  if (value.manual) return value.customText.trim() || t(lang, 'profile.locManualFallback');
  const city = t(lang, `profile.loc.${value.presetId}`);
  if (value.presetId === 'madrid') return `${city}, Spain`;
  return `${city}, USA`;
}

export function cityShort(lang: Lang, value: FieldValue): string {
  if (value.manual) return value.customText.trim() || t(lang, 'profile.locManualFallback');
  return t(lang, `profile.loc.${value.presetId}`);
}

export function scenarioCategory(profession: FieldValue): string {
  if (profession.manual) return 'default';
  return SCENARIO_KEYS[profession.presetId] ? profession.presetId : 'default';
}

export function professionDisplay(lang: Lang, profession: FieldValue): string {
  const label = displayField(lang, PROFESSIONS, profession, 'profile.prof');
  if (profession.manual) return label;
  return `${label} ${t(lang, 'profile.professionalSuffix')}`;
}
