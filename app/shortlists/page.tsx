'use client';

import Link from 'next/link';
import { MainLayout } from '@/components/layout/main-layout';
import { ShortlistCard } from '@/components/shortlists/shortlist-card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, CheckSquare } from 'lucide-react';

// Mock data
import { useState, useEffect } from 'react';

export default function ShortlistsPage() {
  const [shortlists, setShortlists] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchShortlists() {
      try {
        const res = await fetch('/api/shortlists');
        const data = await res.json();
        if (data.success) {
          setShortlists(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch shortlists:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchShortlists();
  }, []);

  const activeShortlists = shortlists.filter((s) => s.status === 'active');
  const archivedShortlists = shortlists.filter((s) => s.status === 'archived');

  const handleDelete = (id: string) => {
    console.log('Delete shortlist:', id);
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Shortlists</h1>
            <p className="text-muted-foreground">Manage candidate shortlists and track interviews</p>
          </div>
          <Link href="/shortlists/new">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
              <Plus className="h-4 w-4" />
              New Shortlist
            </Button>
          </Link>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Active Shortlists</p>
            <p className="text-2xl font-bold text-foreground">{activeShortlists.length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Total Candidates</p>
            <p className="text-2xl font-bold text-foreground">
              {shortlists.reduce((sum, s) => sum + s.candidateCount, 0)}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Interviewed</p>
            <p className="text-2xl font-bold text-accent">
              {shortlists.reduce((sum, s) => sum + (s.interviewedCount || 0), 0)}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-card border-border">
            <TabsTrigger value="active" className="text-foreground data-[state=active]:bg-primary">
              Active ({activeShortlists.length})
            </TabsTrigger>
            <TabsTrigger
              value="archived"
              className="text-foreground data-[state=active]:bg-primary"
            >
              Archived ({archivedShortlists.length})
            </TabsTrigger>
          </TabsList>

          {/* Active Tab */}
          <TabsContent value="active" className="space-y-3 mt-4">
            {activeShortlists.length > 0 ? (
              <div className="space-y-3">
                {activeShortlists.map((shortlist) => (
                  <ShortlistCard
                    key={shortlist.id}
                    {...shortlist}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground mb-4">No active shortlists</p>
                <Link href="/shortlists/new">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Create Shortlist
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>

          {/* Archived Tab */}
          <TabsContent value="archived" className="space-y-3 mt-4">
            {archivedShortlists.length > 0 ? (
              <div className="space-y-3">
                {archivedShortlists.map((shortlist) => (
                  <ShortlistCard
                    key={shortlist.id}
                    {...shortlist}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No archived shortlists</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
