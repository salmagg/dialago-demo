import type { Lang } from '../i18n';

export type FieldValue = {
  presetId: string;
  manual: boolean;
  customText: string;
};

export type AppProfile = {
  profession: FieldValue;
  location: FieldValue;
  nativeLanguage: FieldValue;
  focus: FieldValue;
  goal: FieldValue;
  hometown: string;
};

export type AppTab = 'home' | 'learn' | 'practice' | 'progress' | 'profile';

export type AppPhase = 'welcome' | 'setup' | 'main' | 'loading';

export type { Lang };
