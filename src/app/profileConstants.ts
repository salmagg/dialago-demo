export type Option = { id: string; labelKey: string };

export const MANUAL_ID = '__manual__';

export const PROFESSIONS: Option[] = [
  { id: 'healthcare', labelKey: 'profile.prof.healthcare' },
  { id: 'business', labelKey: 'profile.prof.business' },
  { id: 'hospitality', labelKey: 'profile.prof.hospitality' },
  { id: 'education', labelKey: 'profile.prof.education' },
];

export const LOCATIONS: Option[] = [
  { id: 'nyc', labelKey: 'profile.loc.nyc' },
  { id: 'la', labelKey: 'profile.loc.la' },
  { id: 'miami', labelKey: 'profile.loc.miami' },
  { id: 'madrid', labelKey: 'profile.loc.madrid' },
];

export const NATIVE_LANGS: Option[] = [
  { id: 'spanish', labelKey: 'profile.lang.spanish' },
  { id: 'mandarin', labelKey: 'profile.lang.mandarin' },
  { id: 'arabic', labelKey: 'profile.lang.arabic' },
  { id: 'hindi', labelKey: 'profile.lang.hindi' },
  { id: 'portuguese', labelKey: 'profile.lang.portuguese' },
];

export const FOCUSES: Option[] = [
  { id: 'communication', labelKey: 'profile.focus.communication' },
  { id: 'workplace', labelKey: 'profile.focus.workplace' },
  { id: 'interviews', labelKey: 'profile.focus.interviews' },
  { id: 'daily', labelKey: 'profile.focus.daily' },
];

export const GOALS: Option[] = [
  { id: 'career', labelKey: 'profile.goal.career' },
  { id: 'fluency', labelKey: 'profile.goal.fluency' },
  { id: 'integration', labelKey: 'profile.goal.integration' },
  { id: 'client', labelKey: 'profile.goal.client' },
];

export const VOCAB_QUESTIONS = [
  {
    promptKey: 'profile.vocab.q1',
    optionKeys: ['profile.vocab.q1a', 'profile.vocab.q1b', 'profile.vocab.q1c', 'profile.vocab.q1d'],
    correctIndex: 1,
  },
  {
    promptKey: 'profile.vocab.q2',
    optionKeys: ['profile.vocab.q2a', 'profile.vocab.q2b', 'profile.vocab.q2c', 'profile.vocab.q2d'],
    correctIndex: 0,
  },
  {
    promptKey: 'profile.vocab.q3',
    optionKeys: ['profile.vocab.q3a', 'profile.vocab.q3b', 'profile.vocab.q3c', 'profile.vocab.q3d'],
    correctIndex: 2,
  },
] as const;

export const ANALYSIS_CHECK_KEYS = [
  'profile.analysis.check1',
  'profile.analysis.check2',
  'profile.analysis.check3',
  'profile.analysis.check4',
  'profile.analysis.check5',
] as const;

export const SCENARIO_KEYS: Record<string, string[]> = {
  healthcare: ['profile.scenario.hc1', 'profile.scenario.hc2', 'profile.scenario.hc3', 'profile.scenario.hc4'],
  business: ['profile.scenario.biz1', 'profile.scenario.biz2', 'profile.scenario.biz3', 'profile.scenario.biz4'],
  hospitality: ['profile.scenario.hos1', 'profile.scenario.hos2', 'profile.scenario.hos3', 'profile.scenario.hos4'],
  education: ['profile.scenario.edu1', 'profile.scenario.edu2', 'profile.scenario.edu3', 'profile.scenario.edu4'],
  default: ['profile.scenario.def1', 'profile.scenario.def2', 'profile.scenario.def3', 'profile.scenario.def4'],
};

export const LANG_PROGRESS_METRICS = [
  { key: 'profile.metric.speaking', pct: 78 },
  { key: 'profile.metric.listening', pct: 72 },
  { key: 'profile.metric.vocabulary', pct: 81 },
  { key: 'profile.metric.scenarios', pct: 68 },
] as const;

export const DEFAULT_PROFILE = {
  profession: { presetId: 'hospitality', manual: false, customText: '' },
  location: { presetId: 'nyc', manual: false, customText: '' },
  nativeLanguage: { presetId: 'spanish', manual: false, customText: '' },
  focus: { presetId: 'communication', manual: false, customText: '' },
  goal: { presetId: 'career', manual: false, customText: '' },
};

export const PRACTICE_SCENARIOS = [
  { id: 'doctor', titleKey: 'app.scenario.doctor', descKey: 'app.scenario.doctorDesc' },
  { id: 'workplace', titleKey: 'app.scenario.workplace', descKey: 'app.scenario.workplaceDesc' },
  { id: 'customer', titleKey: 'app.scenario.customer', descKey: 'app.scenario.customerDesc' },
  { id: 'errands', titleKey: 'app.scenario.errands', descKey: 'app.scenario.errandsDesc' },
] as const;
