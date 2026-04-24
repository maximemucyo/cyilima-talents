'use client';

import Link from 'next/link';
import { MainLayout } from '@/components/layout/main-layout';
import { ScreeningList } from '@/components/screening/screening-list';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

import { useState, useEffect } from 'react';

export default function ScreeningPage() {
  const [screenings, setScreenings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchScreenings() {
      try {
        const res = await fetch('/api/screenings');
        const data = await res.json();
        if (data.success) {
          setScreenings(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch screenings:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchScreenings();
  }, []);
  const handleDelete = async (id: string) => {
    if (!confirm('Move this screening to the recycle bin?')) return;
    try {
        const res = await fetch(`/api/screenings/${id}`, { method: 'DELETE' });
        if (res.ok) {
            setScreenings(screenings.filter(s => s.id !== id));
        }
    } catch (error) {
        console.error('Delete failed:', error);
    }
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Screening</h1>
            <p className="text-muted-foreground">
              AI-powered candidate screening and matching
            </p>
          </div>
          <Link href="/screening/new">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
              <Plus className="h-4 w-4" />
              New Screening
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Total Screenings</p>
            <p className="text-2xl font-bold text-foreground">{screenings.length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Completed</p>
            <p className="text-2xl font-bold text-green-500">
              {screenings.filter((s) => s.status === 'completed').length}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">In Progress</p>
            <p className="text-2xl font-bold text-blue-500">
              {screenings.filter((s) => s.status === 'in-progress').length}
            </p>
          </div>
        </div>

        {/* Screening List */}
        <ScreeningList screenings={screenings} onDelete={handleDelete} />
      </div>
    </MainLayout>
  );
}
