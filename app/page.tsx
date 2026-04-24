'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { StatCard } from '@/components/dashboard/stat-card';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { QuickActions } from '@/components/dashboard/quick-actions';
import {
  BarChart3,
  Briefcase,
  Users,
  Zap,
} from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    jobs: 12, // fallback
    candidates: 248,
    screenings: 18,
    shortlists: 7
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here&apos;s your recruitment overview (April 2026).</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Jobs"
            value={stats.jobs.toString()}
            description="Active positions"
            icon={Briefcase}
          />
          <StatCard
            title="Total Candidates"
            value={stats.candidates.toString()}
            description="In your pipeline"
            icon={Users}
          />
          <StatCard
            title="Screenings"
            value={stats.screenings.toString()}
            description="AI evaluations"
            icon={Zap}
          />
          <StatCard
            title="Shortlists"
            value={stats.shortlists.toString()}
            description="Hiring progress"
            icon={BarChart3}
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>

          {/* Right Column */}
          <div>
            <QuickActions />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
