import React, { useCallback, useEffect, useRef, useState } from 'react';
import { t } from '../../i18n';
import { useApp } from '../AppContext';
import { PRACTICE_SCENARIOS } from '../profileConstants';

type View = 'list' | 'session';
type Mode = 'choose' | 'guided' | 'ai' | 'typed';

type AiMsg = { id: string; role: 'patient' | 'user' | 'coach'; text: string };

const OPTION_KEYS = ['liveDemo.opt1', 'liveDemo.opt2', 'liveDemo.opt3'] as const;

function pickCoachKey(text: string): 'liveDemo.aiCoachGreat' | 'liveDemo.aiCoachEmpathy' | 'liveDemo.aiCoachDefault' {
  const lower = text.toLowerCase();
  if (lower.includes('anesthesia') || lower.includes('pressure') || lower.includes('numb')) {
    return 'liveDemo.aiCoachGreat';
  }
  if (lower.includes('worried') || lower.includes('comfort') || lower.includes('understand')) {
    return 'liveDemo.aiCoachEmpathy';
  }
  return 'liveDemo.aiCoachDefault';
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

export function PracticeScreen() {
  const { lang } = useApp();
  const [view, setView] = useState<View>('list');
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>('choose');
  const [selected, setSelected] = useState<number | null>(null);
  const [aiMessages, setAiMessages] = useState<AiMsg[]>([]);
  const [aiInput, setAiInput] = useState('');
  const [aiListening, setAiListening] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  const [typedReply, setTypedReply] = useState('');
  const aiListenTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const aiCoachTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetSession = useCallback(() => {
    setMode('choose');
    setSelected(null);
    setAiMessages([]);
    setAiInput('');
    setTypedReply('');
    setAiListening(false);
    setAiThinking(false);
  }, []);

  const startScenario = (id: string) => {
    setScenarioId(id);
    setView('session');
    resetSession();
  };

  const startAi = () => {
    setMode('ai');
    setAiMessages([{ id: 'p0', role: 'patient', text: t(lang, 'liveDemo.aiPatientOpen') }]);
  };

  const sendAi = () => {
    const text = aiInput.trim();
    if (!text || aiThinking) return;
    setAiMessages((m) => [...m, { id: `u-${Date.now()}`, role: 'user', text }]);
    setAiInput('');
    setAiThinking(true);
    aiCoachTimer.current = setTimeout(() => {
      setAiMessages((m) => [
        ...m,
        { id: `c-${Date.now()}`, role: 'coach', text: t(lang, pickCoachKey(text)) },
      ]);
      setAiThinking(false);
    }, 900);
  };

  const onMic = () => {
    if (aiThinking || aiListening) return;
    setAiListening(true);
    aiListenTimer.current = setTimeout(() => {
      setAiInput(t(lang, 'liveDemo.aiSuggestedReply'));
      setAiListening(false);
    }, 1100);
  };

  useEffect(
    () => () => {
      if (aiListenTimer.current) clearTimeout(aiListenTimer.current);
      if (aiCoachTimer.current) clearTimeout(aiCoachTimer.current);
    },
    [],
  );

  if (view === 'list') {
    return (
      <div className="dialago-screen dialago-screen--pad">
        <header className="dialago-screen__header">
          <h1 className="dialago-screen__title">{t(lang, 'app.practice.title')}</h1>
          <p className="dialago-screen__lead muted">{t(lang, 'app.practice.pick')}</p>
        </header>
        <ul className="dialago-scenario-pick">
          {PRACTICE_SCENARIOS.map((s) => (
            <li key={s.id}>
              <button type="button" className="dialago-scenario-pick__btn" onClick={() => startScenario(s.id)}>
                <span className="dialago-scenario-pick__title">{t(lang, s.titleKey)}</span>
                <span className="dialago-scenario-pick__desc muted">{t(lang, s.descKey)}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="dialago-screen dialago-practice-session">
      <header className="dialago-practice-session__head dialago-screen--pad-h">
        <button
          type="button"
          className="dialago-back"
          onClick={() => {
            setView('list');
            resetSession();
          }}
        >
          ← {t(lang, 'app.practice.back')}
        </button>
        <h1 className="dialago-screen__title">{t(lang, 'liveDemo.screen2Title')}</h1>
      </header>

      <div className="dialago-practice-session__body">
        {mode === 'choose' && (
          <>
            <div className="dialago-chat">
              <div className="dialago-bubble dialago-bubble--in">
                <p className="dialago-bubble__meta muted">{t(lang, 'liveDemo.bubblePatient')}</p>
                <p>{t(lang, 'liveDemo.patientMsg')}</p>
              </div>
            </div>
            <p className="dialago-screen--pad-h dialago-practice-prompt">{t(lang, 'liveDemo.chooseMode')}</p>
            <div className="dialago-mode-pick dialago-screen--pad-h">
              <button type="button" className="dialago-mode-btn" onClick={() => setMode('guided')}>
                {t(lang, 'liveDemo.guidedPath')}
              </button>
              <button type="button" className="dialago-mode-btn dialago-mode-btn--ai" onClick={startAi}>
                {t(lang, 'liveDemo.aiPath')}
              </button>
              <button type="button" className="dialago-mode-btn" onClick={() => setMode('typed')}>
                {t(lang, 'liveDemo.aiPlaceholder')}
              </button>
            </div>
          </>
        )}

        {mode === 'guided' && (
          <>
            <div className="dialago-chat dialago-screen--pad-h">
              <div className="dialago-bubble dialago-bubble--in">
                <p className="dialago-bubble__meta muted">{t(lang, 'liveDemo.bubblePatient')}</p>
                <p>{t(lang, 'liveDemo.patientMsg')}</p>
              </div>
            </div>
            <p className="dialago-screen--pad-h">{t(lang, 'liveDemo.question')}</p>
            <div className="dialago-assess-options dialago-screen--pad-h">
              {OPTION_KEYS.map((key, i) => (
                <button
                  key={key}
                  type="button"
                  className={`dialago-assess-opt ${selected === i ? 'is-picked' : ''}`}
                  onClick={() => setSelected(i)}
                >
                  {t(lang, key)}
                </button>
              ))}
            </div>
            {selected !== null && (
              <p className="dialago-assess-ok dialago-screen--pad-h">{t(lang, 'liveDemo.feedback')}</p>
            )}
          </>
        )}

        {mode === 'typed' && (
          <>
            <div className="dialago-chat dialago-screen--pad-h">
              <div className="dialago-bubble dialago-bubble--in">
                <p className="dialago-bubble__meta muted">{t(lang, 'liveDemo.bubblePatient')}</p>
                <p>{t(lang, 'liveDemo.patientMsg')}</p>
              </div>
            </div>
            <div className="dialago-typed-bar dialago-screen--pad-h">
              <input
                type="text"
                className="dialago-input"
                value={typedReply}
                onChange={(e) => setTypedReply(e.target.value)}
                placeholder={t(lang, 'liveDemo.aiPlaceholder')}
              />
              <button
                type="button"
                className="dialago-btn dialago-btn--primary"
                disabled={!typedReply.trim()}
                onClick={() => setSelected(0)}
              >
                {t(lang, 'liveDemo.aiSend')}
              </button>
            </div>
            {typedReply.trim() ? (
              <p className="dialago-assess-ok dialago-screen--pad-h">{t(lang, 'liveDemo.feedback')}</p>
            ) : null}
          </>
        )}

        {mode === 'ai' && (
          <>
            <div className="dialago-ai-thread">
              {aiMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`dialago-bubble ${msg.role === 'user' ? 'dialago-bubble--out' : 'dialago-bubble--in'}`}
                >
                  <p className="dialago-bubble__meta muted">
                    {msg.role === 'user'
                      ? t(lang, 'liveDemo.bubbleYou')
                      : msg.role === 'coach'
                        ? t(lang, 'liveDemo.bubbleCoach')
                        : t(lang, 'liveDemo.bubblePatient')}
                  </p>
                  <p>{msg.text}</p>
                </div>
              ))}
              {aiThinking ? <p className="muted dialago-ai-thinking">{t(lang, 'liveDemo.aiThinking')}</p> : null}
            </div>
            <div className="dialago-ai-bar">
              <button
                type="button"
                className={`dialago-mic ${aiListening ? 'is-recording' : ''}`}
                onClick={onMic}
                disabled={aiThinking}
                aria-label={t(lang, 'a11y.liveDemoMic')}
              >
                <IconMic />
              </button>
              <input
                type="text"
                className="dialago-input"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), sendAi())}
                placeholder={aiListening ? t(lang, 'liveDemo.aiListening') : t(lang, 'liveDemo.aiPlaceholder')}
                disabled={aiThinking}
              />
              <button type="button" className="dialago-btn dialago-btn--primary" onClick={sendAi} disabled={!aiInput.trim() || aiThinking}>
                {t(lang, 'liveDemo.aiSend')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
