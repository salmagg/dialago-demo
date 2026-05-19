import React from 'react';
import { BottomNav } from './BottomNav';

type Props = {
  children: React.ReactNode;
  showNav?: boolean;
};

export function AppShell({ children, showNav = true }: Props) {
  return (
    <div className="dialago-app">
      <div className="dialago-app__safe-top" aria-hidden="true" />
      <main className="dialago-app__main">{children}</main>
      {showNav ? <BottomNav /> : null}
      <div className="dialago-app__safe-bottom" aria-hidden="true" />
    </div>
  );
}
