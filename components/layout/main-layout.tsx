'use client';

import { Sidebar } from './sidebar';
import { Header } from './header';

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="md:ml-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
