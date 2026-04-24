'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { CandidatesTable } from '@/components/candidates/candidates-table';
import { BulkUploadComponent } from '@/components/candidates/bulk-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Upload } from 'lucide-react';

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchCandidates = async () => {
    try {
      const res = await fetch('/api/candidates');
      const data = await res.json();
      if (data.success) {
        setCandidates(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch candidates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleUploadSuccess = () => {
    fetchCandidates();
  };

  const filteredCandidates = candidates.filter((candidate) =>
    [candidate.firstName, candidate.lastName, candidate.email, candidate.currentRole]
      .join(' ')
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Move this candidate to the recycle bin?')) return;
    try {
        const res = await fetch(`/api/candidates/${id}`, { method: 'DELETE' });
        if (res.ok) {
            setCandidates(candidates.filter(c => c.id !== id));
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Candidates</h1>
            <p className="text-muted-foreground">Manage and track all candidates in your pipeline</p>
          </div>
          <div className="flex gap-3">
            <Link href="/candidates/import">
              <Button variant="outline" className="border-border text-foreground hover:bg-muted gap-2">
                <Upload className="h-4 w-4" />
                Import CVs
              </Button>
            </Link>
            <Link href="/candidates/new">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                <Plus className="h-4 w-4" />
                Add Candidate
              </Button>
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-card border-border">
            <TabsTrigger value="list" className="text-foreground data-[state=active]:bg-primary">
              All Candidates
            </TabsTrigger>
            <TabsTrigger value="upload" className="text-foreground data-[state=active]:bg-primary">
              Bulk Upload
            </TabsTrigger>
          </TabsList>

          {/* List Tab */}
          <TabsContent value="list" className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border text-foreground placeholder-muted-foreground"
              />
            </div>

            <div className="text-sm text-muted-foreground">
              Showing {filteredCandidates.length} of {candidates.length} candidates
            </div>

            {/* Table */}
            <CandidatesTable
              candidates={filteredCandidates}
              onDelete={handleDelete}
            />
          </TabsContent>

          {/* Upload Tab */}
          <TabsContent value="upload" className="mt-4">
            <BulkUploadComponent onSuccess={handleUploadSuccess} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
