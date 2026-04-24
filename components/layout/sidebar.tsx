'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Briefcase,
  Users,
  Zap,
  CheckSquare,
  Settings,
  Menu,
  X,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

const navItems = [
  {
    label: 'Dashboard',
    href: '/',
    icon: BarChart3,
  },
  {
    label: 'Jobs',
    href: '/jobs',
    icon: Briefcase,
  },
  {
    label: 'Candidates',
    href: '/candidates',
    icon: Users,
  },
  {
    label: 'Screening',
    href: '/screening',
    icon: Zap,
  },
  {
    label: 'Shortlists',
    href: '/shortlists',
    icon: CheckSquare,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

const adminItems = [
    {
      label: 'User Management',
      href: '/admin/users',
      icon: Users,
    },
    {
      label: 'Recycle Bin',
      href: '/recycle-bin',
      icon: Trash2,
    },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);
  const { data: session } = useSession();
  
  const isAdmin = (session?.user as any)?.role === 'admin';

  const allItems = isAdmin ? [...navItems, ...adminItems] : navItems;

  return (
    <>
      {/* Mobile Toggle */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen(!open)}
          className="text-foreground hover:bg-muted"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col ${
          open ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static z-40`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-sidebar-border">
          <Link href="/" className="flex items-center gap-2 px-4">
            <div className="w-8 h-8 flex items-center justify-center overflow-hidden rounded-lg">
              <img src="/brand-logo.png" alt="Cyilima Talents Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-lg text-sidebar-foreground">Cyilima Talents</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-2">
          {allItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start gap-3 px-4 py-2 ${
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="text-xs text-sidebar-foreground/60 text-center">
            Cyilima Talents v1.0
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
