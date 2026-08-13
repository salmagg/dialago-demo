import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getInitialLang, type Lang } from '../i18n';
import { clearSessionId, createSession, fetchSession, readSessionId, writeSessionId } from './api/sessions';
import { DEFAULT_PROFILE } from './profileConstants';
import type { AppPhase, AppProfile, AppTab } from './types';

type AppContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  phase: AppPhase;
  setPhase: (phase: AppPhase) => void;
  tab: AppTab;
  setTab: (tab: AppTab) => void;
  profile: AppProfile;
  setProfile: React.Dispatch<React.SetStateAction<AppProfile>>;
  sessionId: string | null;
  savedPhraseIds: Record<string, boolean>;
  toggleSavedPhrase: (id: string) => void;
  completeSetup: () => Promise<void>;
  resetApp: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getInitialLang);
  const [phase, setPhase] = useState<AppPhase>('loading');
  const [tab, setTab] = useState<AppTab>('home');
  const [profile, setProfile] = useState<AppProfile>(DEFAULT_PROFILE);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [savedPhraseIds, setSavedPhraseIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      const storedId = readSessionId();
      if (!storedId) {
        if (!cancelled) setPhase('welcome');
        return;
      }

      try {
        const session = await fetchSession(storedId);
        if (cancelled) return;

        if (session) {
          setSessionId(session.id);
          setProfile(session.demographics);
          setPhase('main');
        } else {
          clearSessionId();
          setPhase('welcome');
        }
      } catch {
        if (!cancelled) setPhase('welcome');
      }
    }

    void restoreSession();
    return () => {
      cancelled = true;
    };
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    localStorage.setItem('dialago-lang', next);
  }, []);

  const completeSetup = useCallback(async () => {
    try {
      const session = await createSession(profile);
      writeSessionId(session.id);
      setSessionId(session.id);
      setPhase('main');
      setTab('home');
    } catch (err) {
      console.error('Failed to save session:', err);
      setPhase('main');
      setTab('home');
    }
  }, [profile]);

  const resetApp = useCallback(() => {
    clearSessionId();
    setSessionId(null);
    setProfile(DEFAULT_PROFILE);
    setSavedPhraseIds({});
    setPhase('welcome');
    setTab('home');
  }, []);

  const toggleSavedPhrase = useCallback((id: string) => {
    setSavedPhraseIds((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      phase,
      setPhase,
      tab,
      setTab,
      profile,
      setProfile,
      sessionId,
      savedPhraseIds,
      toggleSavedPhrase,
      completeSetup,
      resetApp,
    }),
    [lang, setLang, phase, tab, profile, sessionId, savedPhraseIds, toggleSavedPhrase, completeSetup, resetApp],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
