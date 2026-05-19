import React, { useEffect } from 'react';
import { AppProvider, useApp } from './AppContext';
import { AppShell } from './components/AppShell';
import { ProfileDashboard } from './components/ProfileDashboard';
import { HomeScreen } from './screens/HomeScreen';
import { PhraseScreen } from './screens/PhraseScreen';
import { PracticeScreen } from './screens/PracticeScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { SetupWizard } from './screens/SetupWizard';
import { WelcomeScreen } from './screens/WelcomeScreen';
import './app.css';

function MobileAppRoutes() {
  const { phase, tab } = useApp();

  useEffect(() => {
    document.documentElement.classList.add('dialago-app-root');
    document.body.classList.add('dialago-app-body');
    return () => {
      document.documentElement.classList.remove('dialago-app-root');
      document.body.classList.remove('dialago-app-body');
    };
  }, []);

  if (phase === 'welcome') {
    return (
      <AppShell showNav={false}>
        <WelcomeScreen />
      </AppShell>
    );
  }

  if (phase === 'setup') {
    return (
      <AppShell showNav={false}>
        <SetupWizard />
      </AppShell>
    );
  }

  let content: React.ReactNode;
  switch (tab) {
    case 'home':
      content = <HomeScreen />;
      break;
    case 'learn':
      content = <PhraseScreen />;
      break;
    case 'practice':
      content = <PracticeScreen />;
      break;
    case 'progress':
      content = (
        <div className="dialago-screen dialago-screen--scroll dialago-screen--pad-h">
          <ProfileDashboard />
        </div>
      );
      break;
    case 'profile':
      content = <SettingsScreen />;
      break;
    default:
      content = <HomeScreen />;
  }

  return <AppShell>{content}</AppShell>;
}

export function MobileApp() {
  return (
    <AppProvider>
      <MobileAppRoutes />
    </AppProvider>
  );
}
