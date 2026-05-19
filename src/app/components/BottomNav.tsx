import React from 'react';
import { t } from '../../i18n';
import { useApp } from '../AppContext';
import type { AppTab } from '../types';

const TABS: { id: AppTab; labelKey: string; icon: AppTab }[] = [
  { id: 'home', labelKey: 'app.nav.home', icon: 'home' },
  { id: 'learn', labelKey: 'app.nav.learn', icon: 'learn' },
  { id: 'practice', labelKey: 'app.nav.practice', icon: 'practice' },
  { id: 'progress', labelKey: 'app.nav.progress', icon: 'progress' },
  { id: 'profile', labelKey: 'app.nav.profile', icon: 'profile' },
];

function NavIcon({ kind }: { kind: AppTab }) {
  const paths: Record<AppTab, string> = {
    home: 'M4 10.5L12 4l8 6.5V19a1 1 0 01-1 1h-5v-6H10v6H5a1 1 0 01-1-1v-8.5z',
    learn: 'M5 5h14v14H5zM9 9h6v6H9z',
    practice: 'M12 14a3 3 0 003-3V8a3 3 0 10-6 0v3a3 3 0 003 3zM8 18h8',
    progress: 'M5 18V6M12 18V10M19 18v-8',
    profile: 'M12 12a4 4 0 100-8 4 4 0 000 8zM6 20v-1a6 6 0 0112 0v1',
  };
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={paths[kind]} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BottomNav() {
  const { lang, tab, setTab } = useApp();

  return (
    <nav className="dialago-tabbar" aria-label={t(lang, 'app.navAria')}>
      {TABS.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`dialago-tabbar__item ${tab === item.id ? 'is-active' : ''}`}
          onClick={() => setTab(item.id)}
          aria-current={tab === item.id ? 'page' : undefined}
        >
          <NavIcon kind={item.icon} />
          <span>{t(lang, item.labelKey)}</span>
        </button>
      ))}
    </nav>
  );
}
