import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { t, type Lang } from '../i18n';

type ProfileStep = 1 | 2 | 3 | 4;
type AssessStage = 'vocab' | 'writing' | 'speaking';
type Props = { lang: Lang };

type Option = { id: string; labelKey: string };

type FieldValue = {
  presetId: string;
  manual: boolean;
  customText: string;
};

type VocabQuestion = {
  promptKey: string;
  optionKeys: string[];
  correctIndex: number;
};

const MANUAL_ID = '__manual__';
const ANALYSIS_MS = 3400;
const ANALYSIS_CHECK_MS = 520;
const VOCAB_ADVANCE_MS = 850;
const WRITING_CHAR_MS = 38;
const SPEAKING_CAPTURE_MS = 2400;

const PROFESSIONS: Option[] = [
  { id: 'healthcare', labelKey: 'profile.prof.healthcare' },
  { id: 'business', labelKey: 'profile.prof.business' },
  { id: 'hospitality', labelKey: 'profile.prof.hospitality' },
  { id: 'education', labelKey: 'profile.prof.education' },
];

const LOCATIONS: Option[] = [
  { id: 'nyc', labelKey: 'profile.loc.nyc' },
  { id: 'la', labelKey: 'profile.loc.la' },
  { id: 'miami', labelKey: 'profile.loc.miami' },
  { id: 'madrid', labelKey: 'profile.loc.madrid' },
];

const NATIVE_LANGS: Option[] = [
  { id: 'spanish', labelKey: 'profile.lang.spanish' },
  { id: 'mandarin', labelKey: 'profile.lang.mandarin' },
  { id: 'arabic', labelKey: 'profile.lang.arabic' },
  { id: 'hindi', labelKey: 'profile.lang.hindi' },
  { id: 'portuguese', labelKey: 'profile.lang.portuguese' },
];

const FOCUSES: Option[] = [
  { id: 'communication', labelKey: 'profile.focus.communication' },
  { id: 'workplace', labelKey: 'profile.focus.workplace' },
  { id: 'interviews', labelKey: 'profile.focus.interviews' },
  { id: 'daily', labelKey: 'profile.focus.daily' },
];

const GOALS: Option[] = [
  { id: 'career', labelKey: 'profile.goal.career' },
  { id: 'fluency', labelKey: 'profile.goal.fluency' },
  { id: 'integration', labelKey: 'profile.goal.integration' },
  { id: 'client', labelKey: 'profile.goal.client' },
];

const VOCAB_QUESTIONS: VocabQuestion[] = [
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
];

const ANALYSIS_CHECK_KEYS = [
  'profile.analysis.check1',
  'profile.analysis.check2',
  'profile.analysis.check3',
  'profile.analysis.check4',
  'profile.analysis.check5',
] as const;

const SCENARIO_KEYS: Record<string, string[]> = {
  healthcare: ['profile.scenario.hc1', 'profile.scenario.hc2', 'profile.scenario.hc3', 'profile.scenario.hc4'],
  business: ['profile.scenario.biz1', 'profile.scenario.biz2', 'profile.scenario.biz3', 'profile.scenario.biz4'],
  hospitality: ['profile.scenario.hos1', 'profile.scenario.hos2', 'profile.scenario.hos3', 'profile.scenario.hos4'],
  education: ['profile.scenario.edu1', 'profile.scenario.edu2', 'profile.scenario.edu3', 'profile.scenario.edu4'],
  default: ['profile.scenario.def1', 'profile.scenario.def2', 'profile.scenario.def3', 'profile.scenario.def4'],
};

const LANG_PROGRESS_METRICS = [
  { key: 'profile.metric.speaking', pct: 78 },
  { key: 'profile.metric.listening', pct: 72 },
  { key: 'profile.metric.vocabulary', pct: 81 },
  { key: 'profile.metric.scenarios', pct: 68 },
] as const;

const DEFAULT_FIELD = (presetId: string): FieldValue => ({
  presetId,
  manual: false,
  customText: '',
});

function IconDots() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="5" cy="12" r="1.5" fill="currentColor" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="19" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

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
      <path d="M4 12h16M12 4c2.5 2.2 4 5.2 4 8s-1.5 5.8-4 8c-2.5-2.2-4-5.2-4-8s1.5-5.8 4-8z" stroke="currentColor" strokeWidth="1.3" />
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

function IconStreak() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3l2.2 6.8H21l-5.6 4.1 2.1 6.8L12 16.6 6.5 20.7l2.1-6.8L3 9.8h6.8L12 3z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconMic() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 14a3 3 0 003-3V7a3 3 0 10-6 0v4a3 3 0 003 3zM6 11v1a6 6 0 0012 0v-1M12 18v3"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
      />
    </svg>
  );
}

function NavIcon({ kind }: { kind: 'home' | 'learn' | 'practice' | 'progress' | 'profile' }) {
  const paths: Record<string, string> = {
    home: 'M4 10.5L12 4l8 6.5V19a1 1 0 01-1 1h-5v-6H10v6H5a1 1 0 01-1-1v-8.5z',
    learn: 'M5 5h14v14H5zM9 9h6v6H9z',
    practice: 'M12 14a3 3 0 003-3V8a3 3 0 10-6 0v3a3 3 0 003 3zM8 18h8',
    progress: 'M5 18V6M12 18V10M19 18v-8',
    profile: 'M12 12a4 4 0 100-8 4 4 0 000 8zM6 20v-1a6 6 0 0112 0v1',
  };
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={paths[kind]} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function displayField(lang: Lang, options: Option[], value: FieldValue, keyPrefix: string): string {
  if (value.manual && value.customText.trim()) return value.customText.trim();
  const opt = options.find((o) => o.id === value.presetId);
  if (opt) return t(lang, opt.labelKey);
  return t(lang, `${keyPrefix}.${value.presetId}`);
}

function formatLocation(lang: Lang, value: FieldValue): string {
  if (value.manual) return value.customText.trim() || t(lang, 'profile.locManualFallback');
  const city = t(lang, `profile.loc.${value.presetId}`);
  if (value.presetId === 'madrid') return `${city}, Spain`;
  return `${city}, USA`;
}

function cityShort(lang: Lang, value: FieldValue): string {
  if (value.manual) return value.customText.trim() || t(lang, 'profile.locManualFallback');
  return t(lang, `profile.loc.${value.presetId}`);
}

function scenarioCategory(profession: FieldValue): string {
  if (profession.manual) return 'default';
  return SCENARIO_KEYS[profession.presetId] ? profession.presetId : 'default';
}

function professionDisplay(lang: Lang, profession: FieldValue): string {
  const label = displayField(lang, PROFESSIONS, profession, 'profile.prof');
  if (profession.manual) return label;
  return `${label} ${t(lang, 'profile.professionalSuffix')}`;
}

function AssessStepRail({ stage }: { stage: AssessStage }) {
  const stages: AssessStage[] = ['vocab', 'writing', 'speaking'];
  const idx = stages.indexOf(stage);
  return (
    <div className="liveDemoAssessRail" aria-hidden="true">
      {stages.map((s, i) => (
        <span key={s} className={`liveDemoAssessRail__seg ${i <= idx ? 'is-done' : ''} ${s === stage ? 'is-active' : ''}`} />
      ))}
    </div>
  );
}

function SelectableField({
  lang,
  label,
  options,
  manualPlaceholderKey,
  value,
  onChange,
}: {
  lang: Lang;
  label: string;
  options: Option[];
  manualPlaceholderKey: string;
  value: FieldValue;
  onChange: (v: FieldValue) => void;
}) {
  const selectPreset = (id: string) => {
    if (id === MANUAL_ID) {
      onChange({ presetId: value.presetId, manual: true, customText: value.customText });
    } else {
      onChange({ presetId: id, manual: false, customText: '' });
    }
  };

  return (
    <div className="liveDemoOnboardField">
      <p className="liveDemoOnboardLabel">{label}</p>
      <div className="liveDemoChipGroup" role="listbox" aria-label={label}>
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            role="option"
            aria-selected={!value.manual && value.presetId === opt.id}
            className={`liveDemoChip ${!value.manual && value.presetId === opt.id ? 'is-selected' : ''}`}
            onClick={() => selectPreset(opt.id)}
          >
            {t(lang, opt.labelKey)}
          </button>
        ))}
        <button
          type="button"
          role="option"
          aria-selected={value.manual}
          className={`liveDemoChip liveDemoChip--manual ${value.manual ? 'is-selected' : ''}`}
          onClick={() => selectPreset(MANUAL_ID)}
        >
          {t(lang, 'profile.enterManually')}
        </button>
      </div>
      <div className={`liveDemoOnboardManual ${value.manual ? 'is-visible' : ''}`} aria-hidden={!value.manual}>
        <input
          type="text"
          className="liveDemoOnboardInput"
          value={value.customText}
          onChange={(e) => onChange({ ...value, customText: e.target.value })}
          placeholder={t(lang, manualPlaceholderKey)}
          aria-label={t(lang, manualPlaceholderKey)}
        />
      </div>
    </div>
  );
}

export function ProfileOnboardingDemo({ lang }: Props) {
  const [step, setStep] = useState<ProfileStep>(1);
  const [assessStage, setAssessStage] = useState<AssessStage>('vocab');
  const [vocabQIndex, setVocabQIndex] = useState(0);
  const [vocabPick, setVocabPick] = useState<number | null>(null);
  const [vocabConfirmed, setVocabConfirmed] = useState(false);
  const [writingText, setWritingText] = useState('');
  const [writingDone, setWritingDone] = useState(false);
  const [speakingPhase, setSpeakingPhase] = useState<'prompt' | 'recording' | 'transcript' | 'feedback'>('prompt');
  const [analysisChecks, setAnalysisChecks] = useState(0);
  const [progressVisible, setProgressVisible] = useState(false);

  const [profession, setProfession] = useState<FieldValue>(() => DEFAULT_FIELD('hospitality'));
  const [location, setLocation] = useState<FieldValue>(() => DEFAULT_FIELD('nyc'));
  const [nativeLanguage, setNativeLanguage] = useState<FieldValue>(() => DEFAULT_FIELD('spanish'));
  const [focus, setFocus] = useState<FieldValue>(() => DEFAULT_FIELD('communication'));
  const [goal, setGoal] = useState<FieldValue>(() => DEFAULT_FIELD('career'));

  const vocabTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const writingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const speakingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const professionLabel = professionDisplay(lang, profession);
  const focusLabel = displayField(lang, FOCUSES, focus, 'profile.focus');
  const nativeLabel = displayField(lang, NATIVE_LANGS, nativeLanguage, 'profile.lang');
  const locationFull = formatLocation(lang, location);
  const cityLabel = cityShort(lang, location);

  const personaLine = t(lang, 'profile.personaLine')
    .replace('{age}', '30')
    .replace('{profession}', professionLabel);

  const scenarioKeys = useMemo(
    () => SCENARIO_KEYS[scenarioCategory(profession)] ?? SCENARIO_KEYS.default,
    [profession],
  );

  const writingFull = t(lang, 'profile.writing.sampleReply');
  const vocabQ = VOCAB_QUESTIONS[vocabQIndex];

  const canContinueOnboard =
    professionLabel.length > 0 &&
    (location.manual ? location.customText.trim() : true) &&
    nativeLabel.length > 0 &&
    focusLabel.length > 0 &&
    displayField(lang, GOALS, goal, 'profile.goal').length > 0;

  const resetAssessment = useCallback(() => {
    setAssessStage('vocab');
    setVocabQIndex(0);
    setVocabPick(null);
    setVocabConfirmed(false);
    setWritingText('');
    setWritingDone(false);
    setSpeakingPhase('prompt');
    setAnalysisChecks(0);
    if (vocabTimer.current) clearTimeout(vocabTimer.current);
    if (writingTimer.current) clearTimeout(writingTimer.current);
    if (speakingTimer.current) clearTimeout(speakingTimer.current);
  }, []);

  const restart = useCallback(() => {
    setStep(1);
    setProfession(DEFAULT_FIELD('hospitality'));
    setLocation(DEFAULT_FIELD('nyc'));
    setNativeLanguage(DEFAULT_FIELD('spanish'));
    setFocus(DEFAULT_FIELD('communication'));
    setGoal(DEFAULT_FIELD('career'));
    setProgressVisible(false);
    resetAssessment();
  }, [resetAssessment]);

  const onContinueToAssessment = () => {
    if (!canContinueOnboard) return;
    resetAssessment();
    setStep(2);
  };

  useEffect(() => {
    if (step !== 2 || assessStage !== 'writing' || writingDone) return;
    setWritingText('');
    let i = 0;
    const tick = () => {
      i += 1;
      setWritingText(writingFull.slice(0, i));
      if (i < writingFull.length) {
        writingTimer.current = setTimeout(tick, WRITING_CHAR_MS);
      } else {
        writingTimer.current = setTimeout(() => setWritingDone(true), 500);
      }
    };
    writingTimer.current = setTimeout(tick, 400);
    return () => {
      if (writingTimer.current) clearTimeout(writingTimer.current);
    };
  }, [step, assessStage, writingDone, writingFull]);

  useEffect(() => {
    if (step !== 2 || assessStage !== 'speaking' || speakingPhase !== 'recording') return;
    speakingTimer.current = setTimeout(() => setSpeakingPhase('transcript'), SPEAKING_CAPTURE_MS);
    return () => {
      if (speakingTimer.current) clearTimeout(speakingTimer.current);
    };
  }, [step, assessStage, speakingPhase]);

  useEffect(() => {
    if (speakingPhase !== 'transcript') return;
    const tmr = setTimeout(() => setSpeakingPhase('feedback'), 900);
    return () => clearTimeout(tmr);
  }, [speakingPhase]);

  useEffect(() => {
    if (step !== 3) return;
    setAnalysisChecks(0);
    setProgressVisible(false);
    const timers: ReturnType<typeof setTimeout>[] = [];
    ANALYSIS_CHECK_KEYS.forEach((_, i) => {
      timers.push(setTimeout(() => setAnalysisChecks(i + 1), (i + 1) * ANALYSIS_CHECK_MS));
    });
    timers.push(setTimeout(() => setStep(4), ANALYSIS_MS));
    return () => timers.forEach(clearTimeout);
  }, [step]);

  useEffect(() => {
    if (step === 4) {
      const tmr = setTimeout(() => setProgressVisible(true), 180);
      return () => clearTimeout(tmr);
    }
    setProgressVisible(false);
  }, [step]);

  useEffect(
    () => () => {
      if (vocabTimer.current) clearTimeout(vocabTimer.current);
      if (writingTimer.current) clearTimeout(writingTimer.current);
      if (speakingTimer.current) clearTimeout(speakingTimer.current);
    },
    [],
  );

  const onVocabSelect = (index: number) => {
    if (vocabConfirmed) return;
    const q = VOCAB_QUESTIONS[vocabQIndex];
    setVocabPick(index);
    if (index === q.correctIndex) {
      setVocabConfirmed(true);
      vocabTimer.current = setTimeout(() => {
        setVocabConfirmed(false);
        setVocabPick(null);
        if (vocabQIndex < VOCAB_QUESTIONS.length - 1) {
          setVocabQIndex((v) => v + 1);
        } else {
          setAssessStage('writing');
        }
      }, VOCAB_ADVANCE_MS);
    }
  };

  const onWritingContinue = () => {
    if (!writingDone) return;
    setAssessStage('speaking');
  };

  const onSpeakingMic = () => {
    if (speakingPhase !== 'prompt') return;
    setSpeakingPhase('recording');
  };

  const onSpeakingContinue = () => {
    if (speakingPhase !== 'feedback') return;
    setStep(3);
  };

  const renderAssessment = () => {
    if (assessStage === 'vocab') {
      return (
        <div className="liveDemoAssessScroll">
          <AssessStepRail stage={assessStage} />
          <h3 className="liveDemoAssessTitle">{t(lang, 'profile.vocab.title')}</h3>
          <p className="liveDemoAssessSub muted">{t(lang, 'profile.vocab.sub')}</p>
          <p className="liveDemoAssessPrompt">{t(lang, vocabQ.promptKey)}</p>
          <div className="liveDemoAssessOptions" role="group">
            {vocabQ.optionKeys.map((key, i) => {
              const isPick = vocabPick === i;
              const isCorrect = i === vocabQ.correctIndex;
              const showOk = vocabConfirmed && isPick && isCorrect;
              const showErr = vocabPick !== null && isPick && !isCorrect;
              return (
                <button
                  key={key}
                  type="button"
                  className={`liveDemoAssessOption ${isPick ? 'is-picked' : ''} ${showOk ? 'is-correct' : ''} ${showErr ? 'is-wrong' : ''}`}
                  onClick={() => onVocabSelect(i)}
                  disabled={vocabConfirmed}
                >
                  {t(lang, key)}
                </button>
              );
            })}
          </div>
          {vocabConfirmed ? (
            <p className="liveDemoAssessMicro ok" role="status">
              {t(lang, 'profile.vocab.confirmed')}
            </p>
          ) : null}
          <p className="liveDemoAssessCounter muted">
            {vocabQIndex + 1} / {VOCAB_QUESTIONS.length}
          </p>
        </div>
      );
    }

    if (assessStage === 'writing') {
      return (
        <div className="liveDemoAssessScroll">
          <AssessStepRail stage={assessStage} />
          <h3 className="liveDemoAssessTitle">{t(lang, 'profile.writing.title')}</h3>
          <p className="liveDemoAssessSub muted">{t(lang, 'profile.writing.sub')}</p>
          <div className="liveDemoWritingChat">
            <div className="liveDemoBubble liveDemoBubble--patient">
              <p className="liveDemoBubble__meta muted">{t(lang, 'profile.writing.incoming')}</p>
              <p className="liveDemoBubble__text">{t(lang, 'profile.writing.prompt')}</p>
            </div>
            <div className="liveDemoBubble liveDemoBubble--user">
              <p className="liveDemoBubble__meta muted">{t(lang, 'profile.bubbleYou')}</p>
              <p className="liveDemoBubble__text">{writingText}</p>
            </div>
          </div>
          {writingDone ? (
            <p className="liveDemoAssessMicro ok" role="status">
              {t(lang, 'profile.writing.feedback')}
            </p>
          ) : (
            <p className="liveDemoAssessMicro muted">{t(lang, 'profile.writing.typing')}</p>
          )}
          <button
            type="button"
            className="btn btn--primary liveDemoAssessCta"
            onClick={onWritingContinue}
            disabled={!writingDone}
          >
            {t(lang, 'profile.assess.continue')}
          </button>
        </div>
      );
    }

    return (
      <div className="liveDemoAssessScroll liveDemoAssessScroll--speaking">
        <AssessStepRail stage={assessStage} />
        <h3 className="liveDemoAssessTitle">{t(lang, 'profile.speaking.title')}</h3>
        <p className="liveDemoAssessSub muted">{t(lang, 'profile.speaking.sub')}</p>
        <div className="liveDemoSpeakingChat">
          <div className="liveDemoBubble liveDemoBubble--coach">
            <p className="liveDemoBubble__meta muted">{t(lang, 'profile.bubbleCoach')}</p>
            <p className="liveDemoBubble__text">{t(lang, 'profile.speaking.aiPrompt')}</p>
          </div>
          {(speakingPhase === 'transcript' || speakingPhase === 'feedback') && (
            <div className="liveDemoBubble liveDemoBubble--user">
              <p className="liveDemoBubble__meta muted">{t(lang, 'profile.bubbleYou')}</p>
              <p className="liveDemoBubble__text">{t(lang, 'profile.speaking.transcript')}</p>
            </div>
          )}
          {speakingPhase === 'feedback' && (
            <p className="liveDemoAssessMicro ok">{t(lang, 'profile.speaking.feedback')}</p>
          )}
        </div>
        <div className="liveDemoSpeakingControls">
          <button
            type="button"
            className={`liveDemoSpeakingMic ${speakingPhase === 'recording' ? 'is-recording' : ''}`}
            onClick={onSpeakingMic}
            disabled={speakingPhase !== 'prompt'}
            aria-label={t(lang, 'profile.speaking.micAria')}
          >
            <IconMic />
          </button>
          <div
            className={`liveDemoSpeakingWave ${speakingPhase === 'recording' ? 'is-active' : ''}`}
            aria-hidden="true"
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} style={{ animationDelay: `${i * 0.06}s` }} />
            ))}
          </div>
        </div>
        <button
          type="button"
          className="btn btn--primary liveDemoAssessCta"
          onClick={onSpeakingContinue}
          disabled={speakingPhase !== 'feedback'}
        >
          {t(lang, 'profile.assess.finish')}
        </button>
      </div>
    );
  };

  return (
    <div className="liveDemoProfileWrap">
      {/* Step 1 — Onboarding */}
      <div className={`liveDemoPane liveDemoProfilePane ${step === 1 ? 'is-active' : ''}`} aria-hidden={step !== 1}>
        <div className="liveDemoStatus" aria-hidden="true">
          <span>9:41</span>
        </div>
        <div className="liveDemoOnboardScroll">
          <p className="liveDemoOnboardEyebrow">{t(lang, 'profile.welcomeEyebrow')}</p>
          <h3 className="liveDemoOnboardTitle">{t(lang, 'profile.welcomeTitle')}</h3>
          <p className="liveDemoOnboardLead muted">{t(lang, 'profile.welcomeLead')}</p>
          <SelectableField
            lang={lang}
            label={t(lang, 'profile.fieldProfession')}
            options={PROFESSIONS}
            manualPlaceholderKey="profile.placeholderProfession"
            value={profession}
            onChange={setProfession}
          />
          <SelectableField
            lang={lang}
            label={t(lang, 'profile.fieldLocation')}
            options={LOCATIONS}
            manualPlaceholderKey="profile.placeholderLocation"
            value={location}
            onChange={setLocation}
          />
          <SelectableField
            lang={lang}
            label={t(lang, 'profile.fieldNativeLanguage')}
            options={NATIVE_LANGS}
            manualPlaceholderKey="profile.placeholderNativeLanguage"
            value={nativeLanguage}
            onChange={setNativeLanguage}
          />
          <SelectableField
            lang={lang}
            label={t(lang, 'profile.fieldFocus')}
            options={FOCUSES}
            manualPlaceholderKey="profile.placeholderFocus"
            value={focus}
            onChange={setFocus}
          />
          <SelectableField
            lang={lang}
            label={t(lang, 'profile.fieldGoal')}
            options={GOALS}
            manualPlaceholderKey="profile.placeholderGoal"
            value={goal}
            onChange={setGoal}
          />
        </div>
        <button
          type="button"
          className="btn btn--primary liveDemoOnboardCta"
          onClick={onContinueToAssessment}
          disabled={!canContinueOnboard}
        >
          {t(lang, 'profile.continueAssessment')}
        </button>
      </div>

      {/* Step 2 — Assessment */}
      <div className={`liveDemoPane liveDemoProfilePane ${step === 2 ? 'is-active' : ''}`} aria-hidden={step !== 2}>
        <div className="liveDemoStatus" aria-hidden="true">
          <span>9:41</span>
        </div>
        {renderAssessment()}
      </div>

      {/* Step 3 — AI Analysis */}
      <div className={`liveDemoPane liveDemoProfilePane ${step === 3 ? 'is-active' : ''}`} aria-hidden={step !== 3}>
        <div className="liveDemoStatus" aria-hidden="true">
          <span>9:41</span>
        </div>
        <div className="liveDemoAnalysis" role="status" aria-live="polite">
          <div className="liveDemoProcessing__orb" aria-hidden="true">
            <span className="liveDemoProcessing__ring" />
            <span className="liveDemoProcessing__core" />
          </div>
          <h3 className="liveDemoAnalysis__title">{t(lang, 'profile.analysis.title')}</h3>
          <p className="liveDemoAnalysis__sub muted">{t(lang, 'profile.analysis.sub')}</p>
          <ul className="liveDemoAnalysis__list">
            {ANALYSIS_CHECK_KEYS.map((key, i) => (
              <li key={key} className={`liveDemoAnalysis__item ${analysisChecks > i ? 'is-done' : ''}`}>
                <span className="liveDemoAnalysis__check" aria-hidden="true">
                  {analysisChecks > i ? '✓' : ''}
                </span>
                <span>{t(lang, key)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Step 4 — Profile */}
      <div
        className={`liveDemoPane liveDemoProfilePane liveDemoProfilePane--result ${step === 4 ? 'is-active' : ''}`}
        aria-hidden={step !== 4}
      >
        <div className="liveDemoStatus" aria-hidden="true">
          <span>9:41</span>
        </div>
        <div className="liveDemoProfileScroll">
          <div className="liveDemoProfileTop">
            <h3 className="liveDemoProfileHeader">{t(lang, 'profile.screenTitle')}</h3>
            <button type="button" className="liveDemoProfileMenu" aria-label={t(lang, 'profile.menuAria')}>
              <IconDots />
            </button>
          </div>

          <div className="liveDemoProfileHero">
            <div className="liveDemoProfileAvatar" aria-hidden="true">
              <span className="liveDemoProfileAvatar__mesh liveDemoProfileAvatar__mesh--a" />
              <span className="liveDemoProfileAvatar__mesh liveDemoProfileAvatar__mesh--b" />
              <span className="liveDemoProfileAvatar__mesh liveDemoProfileAvatar__mesh--c" />
            </div>
            <p className="liveDemoProfilePersona">{personaLine}</p>
            <p className="liveDemoProfileCity muted">{cityLabel}</p>
            <p className="liveDemoProfileTagline muted">{t(lang, 'profile.generatedTagline')}</p>
          </div>

          <div className="liveDemoProfileMetrics">
            <div className="liveDemoProfileMetric">
              <span className="liveDemoProfileMetric__label muted">{t(lang, 'profile.rowEnglishLevel')}</span>
              <span className="liveDemoProfileMetric__value">{t(lang, 'profile.valEnglishLevel')}</span>
            </div>
            <div className="liveDemoProfileMetric">
              <span className="liveDemoProfileMetric__label muted">{t(lang, 'profile.rowSpeakingConf')}</span>
              <span className="liveDemoProfileMetric__value">{t(lang, 'profile.valSpeakingConf')}</span>
            </div>
            <div className="liveDemoProfileMetric">
              <span className="liveDemoProfileMetric__label muted">{t(lang, 'profile.rowWritingClarity')}</span>
              <span className="liveDemoProfileMetric__value">{t(lang, 'profile.valWritingClarity')}</span>
            </div>
            <div className="liveDemoProfileMetric">
              <span className="liveDemoProfileMetric__label muted">{t(lang, 'profile.rowVocabRange')}</span>
              <span className="liveDemoProfileMetric__value">{t(lang, 'profile.valVocabRange')}</span>
            </div>
          </div>

          <div className="liveDemoProfileDetails">
            <div className="liveDemoProfileRow">
              <span className="liveDemoProfileRow__icon">
                <IconBriefcase />
              </span>
              <span className="liveDemoProfileRow__label muted">{t(lang, 'profile.rowProfession')}</span>
              <span className="liveDemoProfileRow__value">{professionLabel}</span>
            </div>
            <div className="liveDemoProfileRow">
              <span className="liveDemoProfileRow__icon">
                <IconPin />
              </span>
              <span className="liveDemoProfileRow__label muted">{t(lang, 'profile.rowLocation')}</span>
              <span className="liveDemoProfileRow__value">{locationFull}</span>
            </div>
            <div className="liveDemoProfileRow">
              <span className="liveDemoProfileRow__icon">
                <IconGlobe />
              </span>
              <span className="liveDemoProfileRow__label muted">{t(lang, 'profile.rowNativeLanguage')}</span>
              <span className="liveDemoProfileRow__value">{nativeLabel}</span>
            </div>
            <div className="liveDemoProfileRow">
              <span className="liveDemoProfileRow__icon">
                <IconTarget />
              </span>
              <span className="liveDemoProfileRow__label muted">{t(lang, 'profile.rowFocus')}</span>
              <span className="liveDemoProfileRow__value">{focusLabel}</span>
            </div>
          </div>

          <div className="liveDemoLangProgress">
            <p className="liveDemoLangProgress__title">{t(lang, 'profile.langProgressTitle')}</p>
            <div className={`liveDemoLangProgress__track ${progressVisible ? 'is-animated' : ''}`}>
              <div className="liveDemoLangProgress__bars">
                {LANG_PROGRESS_METRICS.map((m) => (
                  <div key={m.key} className="liveDemoLangProgress__barItem">
                    <div className="liveDemoLangProgress__barHead">
                      <span>{t(lang, m.key)}</span>
                      <span>{m.pct}%</span>
                    </div>
                    <div className="liveDemoLangProgress__barTrack">
                      <span
                        className="liveDemoLangProgress__barFill"
                        style={{ width: progressVisible ? `${m.pct}%` : '0%' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="liveDemoLangProgress__labels">
                <span>{t(lang, 'profile.progressPast')}</span>
                <span>{t(lang, 'profile.progressToday')}</span>
              </div>
            </div>
          </div>

          <div className="liveDemoScenarioRecords">
            <div className="liveDemoScenarioRecords__head">
              <p className="liveDemoScenarioRecords__title">{t(lang, 'profile.scenarioRecordsTitle')}</p>
              <p className="liveDemoScenarioRecords__badge muted">{t(lang, 'profile.scenarioRecordsBadge')}</p>
            </div>
            <ul className="liveDemoScenarioRecords__list">
              {scenarioKeys.map((key) => (
                <li key={key} className="liveDemoScenarioRecords__item">
                  <span className="liveDemoScenarioRecords__check" aria-hidden="true">
                    ✓
                  </span>
                  <span>{t(lang, key)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="liveDemoProfileEncourage">
            <p className="liveDemoProfileEncourage__title">{t(lang, 'profile.encourageTitle')}</p>
            <p className="liveDemoProfileEncourage__body muted">{t(lang, 'profile.encourageBody')}</p>
          </div>

          <button type="button" className="liveDemoProfileRestart" onClick={restart}>
            {t(lang, 'profile.restart')}
          </button>
        </div>

        <nav className="liveDemoTabBar" aria-label={t(lang, 'profile.navAria')}>
          {(['home', 'learn', 'practice', 'progress', 'profile'] as const).map((tab) => (
            <span
              key={tab}
              className={`liveDemoTabBar__item ${tab === 'profile' ? 'is-active' : ''}`}
              aria-current={tab === 'profile' ? 'page' : undefined}
            >
              <NavIcon kind={tab} />
            </span>
          ))}
        </nav>
      </div>
    </div>
  );
}
