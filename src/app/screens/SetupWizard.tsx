import React, { useCallback, useEffect, useRef, useState } from 'react';
import { t } from '../../i18n';
import { useApp } from '../AppContext';
import { ProfileDashboard } from '../components/ProfileDashboard';
import { SelectableField } from '../components/SelectableField';
import {
  ANALYSIS_CHECK_KEYS,
  FOCUSES,
  GOALS,
  LOCATIONS,
  NATIVE_LANGS,
  PROFESSIONS,
  VOCAB_QUESTIONS,
} from '../profileConstants';
import { displayField, professionDisplay } from '../profileUtils';
import type { AssessStage, SetupPhase } from '../types';

const ANALYSIS_MS = 3400;
const ANALYSIS_CHECK_MS = 520;
const VOCAB_ADVANCE_MS = 850;
const WRITING_CHAR_MS = 38;
const SPEAKING_CAPTURE_MS = 2400;

function AssessRail({ stage }: { stage: AssessStage }) {
  const stages: AssessStage[] = ['vocab', 'writing', 'speaking'];
  const idx = stages.indexOf(stage);
  return (
    <div className="dialago-assess-rail" aria-hidden="true">
      {stages.map((s, i) => (
        <span key={s} className={`dialago-assess-rail__seg ${i <= idx ? 'is-done' : ''} ${s === stage ? 'is-active' : ''}`} />
      ))}
    </div>
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

export function SetupWizard() {
  const { lang, profile, setProfile, completeSetup } = useApp();
  const [phase, setPhase] = useState<SetupPhase>('onboarding');
  const [assessStage, setAssessStage] = useState<AssessStage>('vocab');
  const [vocabQIndex, setVocabQIndex] = useState(0);
  const [vocabPick, setVocabPick] = useState<number | null>(null);
  const [vocabConfirmed, setVocabConfirmed] = useState(false);
  const [writingText, setWritingText] = useState('');
  const [writingDone, setWritingDone] = useState(false);
  const [speakingPhase, setSpeakingPhase] = useState<'prompt' | 'recording' | 'transcript' | 'feedback'>('prompt');
  const [analysisChecks, setAnalysisChecks] = useState(0);

  const vocabTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const writingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const speakingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const writingFull = t(lang, 'profile.writing.sampleReply');
  const vocabQ = VOCAB_QUESTIONS[vocabQIndex];

  const professionLabel = professionDisplay(lang, profile.profession);
  const canContinueOnboard =
    professionLabel.length > 0 &&
    (profile.location.manual ? profile.location.customText.trim() : true) &&
    displayField(lang, NATIVE_LANGS, profile.nativeLanguage, 'profile.lang').length > 0 &&
    displayField(lang, FOCUSES, profile.focus, 'profile.focus').length > 0 &&
    displayField(lang, GOALS, profile.goal, 'profile.goal').length > 0;

  const resetAssessment = useCallback(() => {
    setAssessStage('vocab');
    setVocabQIndex(0);
    setVocabPick(null);
    setVocabConfirmed(false);
    setWritingText('');
    setWritingDone(false);
    setSpeakingPhase('prompt');
    setAnalysisChecks(0);
  }, []);

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

  useEffect(() => {
    if (phase !== 'assessment' || assessStage !== 'writing' || writingDone) return;
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
  }, [phase, assessStage, writingDone, writingFull]);

  useEffect(() => {
    if (phase !== 'assessment' || assessStage !== 'speaking' || speakingPhase !== 'recording') return;
    speakingTimer.current = setTimeout(() => setSpeakingPhase('transcript'), SPEAKING_CAPTURE_MS);
    return () => {
      if (speakingTimer.current) clearTimeout(speakingTimer.current);
    };
  }, [phase, assessStage, speakingPhase]);

  useEffect(() => {
    if (speakingPhase !== 'transcript') return;
    const tmr = setTimeout(() => setSpeakingPhase('feedback'), 900);
    return () => clearTimeout(tmr);
  }, [speakingPhase]);

  useEffect(() => {
    if (phase !== 'analysis') return;
    setAnalysisChecks(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    ANALYSIS_CHECK_KEYS.forEach((_, i) => {
      timers.push(setTimeout(() => setAnalysisChecks(i + 1), (i + 1) * ANALYSIS_CHECK_MS));
    });
    timers.push(setTimeout(() => setPhase('profile'), ANALYSIS_MS));
    return () => timers.forEach(clearTimeout);
  }, [phase]);

  useEffect(
    () => () => {
      if (vocabTimer.current) clearTimeout(vocabTimer.current);
      if (writingTimer.current) clearTimeout(writingTimer.current);
      if (speakingTimer.current) clearTimeout(speakingTimer.current);
    },
    [],
  );

  if (phase === 'onboarding') {
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
        </div>
        <footer className="dialago-setup__footer">
          <button
            type="button"
            className="dialago-btn dialago-btn--primary"
            disabled={!canContinueOnboard}
            onClick={() => {
              resetAssessment();
              setPhase('assessment');
            }}
          >
            {t(lang, 'profile.continueAssessment')}
          </button>
        </footer>
      </div>
    );
  }

  if (phase === 'analysis') {
    return (
      <div className="dialago-setup dialago-setup--center">
        <div className="dialago-analysis-orb" aria-hidden="true">
          <span className="dialago-analysis-orb__ring" />
          <span className="dialago-analysis-orb__core" />
        </div>
        <h2 className="dialago-setup__title">{t(lang, 'profile.analysis.title')}</h2>
        <p className="dialago-setup__lead muted">{t(lang, 'profile.analysis.sub')}</p>
        <ul className="dialago-analysis-list">
          {ANALYSIS_CHECK_KEYS.map((key, i) => (
            <li key={key} className={`dialago-analysis-list__item ${analysisChecks > i ? 'is-done' : ''}`}>
              <span className="dialago-analysis-list__check">{analysisChecks > i ? '✓' : ''}</span>
              <span>{t(lang, key)}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (phase === 'profile') {
    return (
      <div className="dialago-setup dialago-setup--scroll">
        <header className="dialago-setup__header">
          <h1 className="dialago-setup__title">{t(lang, 'profile.screenTitle')}</h1>
        </header>
        <ProfileDashboard />
        <footer className="dialago-setup__footer">
          <button type="button" className="dialago-btn dialago-btn--primary" onClick={completeSetup}>
            {t(lang, 'app.profile.enterApp')}
          </button>
        </footer>
      </div>
    );
  }

  return (
    <div className="dialago-setup dialago-setup--scroll">
      <AssessRail stage={assessStage} />
      {assessStage === 'vocab' && (
        <>
          <h2 className="dialago-setup__title">{t(lang, 'profile.vocab.title')}</h2>
          <p className="dialago-setup__lead muted">{t(lang, 'profile.vocab.sub')}</p>
          <p className="dialago-assess-prompt">{t(lang, vocabQ.promptKey)}</p>
          <div className="dialago-assess-options">
            {vocabQ.optionKeys.map((key, i) => (
              <button
                key={key}
                type="button"
                className={`dialago-assess-opt ${vocabPick === i ? 'is-picked' : ''} ${vocabConfirmed && vocabPick === i && i === vocabQ.correctIndex ? 'is-correct' : ''}`}
                onClick={() => onVocabSelect(i)}
                disabled={vocabConfirmed}
              >
                {t(lang, key)}
              </button>
            ))}
          </div>
          {vocabConfirmed ? <p className="dialago-assess-ok">{t(lang, 'profile.vocab.confirmed')}</p> : null}
          <p className="dialago-assess-count muted">
            {vocabQIndex + 1} / {VOCAB_QUESTIONS.length}
          </p>
        </>
      )}

      {assessStage === 'writing' && (
        <>
          <h2 className="dialago-setup__title">{t(lang, 'profile.writing.title')}</h2>
          <p className="dialago-setup__lead muted">{t(lang, 'profile.writing.sub')}</p>
          <div className="dialago-chat">
            <div className="dialago-bubble dialago-bubble--in">
              <p className="dialago-bubble__meta muted">{t(lang, 'profile.writing.incoming')}</p>
              <p>{t(lang, 'profile.writing.prompt')}</p>
            </div>
            <div className="dialago-bubble dialago-bubble--out">
              <p className="dialago-bubble__meta muted">{t(lang, 'profile.bubbleYou')}</p>
              <p>{writingText}</p>
            </div>
          </div>
          {writingDone ? (
            <p className="dialago-assess-ok">{t(lang, 'profile.writing.feedback')}</p>
          ) : (
            <p className="muted dialago-assess-typing">{t(lang, 'profile.writing.typing')}</p>
          )}
          <footer className="dialago-setup__footer">
            <button
              type="button"
              className="dialago-btn dialago-btn--primary"
              disabled={!writingDone}
              onClick={() => setAssessStage('speaking')}
            >
              {t(lang, 'app.setup.continue')}
            </button>
          </footer>
        </>
      )}

      {assessStage === 'speaking' && (
        <>
          <h2 className="dialago-setup__title">{t(lang, 'profile.speaking.title')}</h2>
          <p className="dialago-setup__lead muted">{t(lang, 'profile.speaking.sub')}</p>
          <div className="dialago-chat">
            <div className="dialago-bubble dialago-bubble--in">
              <p className="dialago-bubble__meta muted">{t(lang, 'profile.bubbleCoach')}</p>
              <p>{t(lang, 'profile.speaking.aiPrompt')}</p>
            </div>
            {(speakingPhase === 'transcript' || speakingPhase === 'feedback') && (
              <div className="dialago-bubble dialago-bubble--out">
                <p className="dialago-bubble__meta muted">{t(lang, 'profile.bubbleYou')}</p>
                <p>{t(lang, 'profile.speaking.transcript')}</p>
              </div>
            )}
            {speakingPhase === 'feedback' && <p className="dialago-assess-ok">{t(lang, 'profile.speaking.feedback')}</p>}
          </div>
          <div className="dialago-speaking-controls">
            <button
              type="button"
              className={`dialago-mic ${speakingPhase === 'recording' ? 'is-recording' : ''}`}
              onClick={() => speakingPhase === 'prompt' && setSpeakingPhase('recording')}
              disabled={speakingPhase !== 'prompt'}
              aria-label={t(lang, 'profile.speaking.micAria')}
            >
              <IconMic />
            </button>
            <div className={`dialago-wave ${speakingPhase === 'recording' ? 'is-active' : ''}`} aria-hidden="true">
              {Array.from({ length: 12 }).map((_, i) => (
                <span key={i} style={{ animationDelay: `${i * 0.06}s` }} />
              ))}
            </div>
          </div>
          <footer className="dialago-setup__footer">
            <button
              type="button"
              className="dialago-btn dialago-btn--primary"
              disabled={speakingPhase !== 'feedback'}
              onClick={() => setPhase('analysis')}
            >
              {t(lang, 'profile.assess.finish')}
            </button>
          </footer>
        </>
      )}
    </div>
  );
}
