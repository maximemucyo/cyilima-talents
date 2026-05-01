'use client';

import {
  Bell,
  Search,
  User,
  LogOut,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { ModeToggle } from '@/components/layout/mode-toggle';

export function Header() {
  const { data: session } = useSession();
  
  return (
    <header className="sticky top-0 h-16 bg-card border-b border-border flex items-center justify-between px-6 z-30">
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs, candidates..."
            className="pl-10 bg-muted border-muted-foreground/20 text-foreground placeholder-muted-foreground"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 ml-6">
        <ModeToggle />
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-foreground hover:bg-muted">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-card border-border">
            <div className="px-4 py-2 border-b border-border">
              <h3 className="font-semibold text-foreground">Notifications</h3>
            </div>
            <div className="max-h-64 overflow-y-auto">
              <div className="p-4 text-sm text-muted-foreground text-center">
                No new notifications
              </div>
            </div>
            <DropdownMenuSeparator className="bg-border" />
            <div className="p-2 text-center">
              <Button variant="ghost" size="sm" className="text-xs text-primary w-full">
                View all notifications
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-foreground hover:bg-muted"
            >
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="hidden sm:inline text-sm font-medium capitalize">
                {session?.user?.name || (session?.user as any)?.role || 'User'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-card border-border">
            <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-medium text-foreground">{session?.user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{session?.user?.email}</p>
            </div>
            <Link href="/settings">
              <DropdownMenuItem className="text-foreground cursor-pointer">
                <User className="h-4 w-4 mr-2" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
            </Link>
            <Link href="/settings">
              <DropdownMenuItem className="text-foreground cursor-pointer">
                <Settings className="h-4 w-4 mr-2" />
                <span>Account Settings</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem 
              className="text-destructive cursor-pointer"
              onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
