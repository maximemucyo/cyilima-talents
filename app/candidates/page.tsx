'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { CandidatesTable } from '@/components/candidates/candidates-table';
import { BulkUploadComponent } from '@/components/candidates/bulk-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Upload, Zap, X } from 'lucide-react';

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [skillsFilter, setSkillsFilter] = useState<string[]>([]);
  const [expFilter, setExpFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isScreening, setIsScreening] = useState(false);

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

  const filteredCandidates = candidates.filter((candidate) => {
    // Search query
    const matchesSearch = [candidate.firstName, candidate.lastName, candidate.email, candidate.currentRole]
      .join(' ')
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    
    // Location filter
    const isRwanda = candidate.isRwandaBased || 
                    candidate.country?.toLowerCase() === 'rwanda' || 
                    candidate.location?.toLowerCase().includes('rwanda') ||
                    candidate.location?.toLowerCase().includes('kigali');
    
    const matchesLocation = locationFilter === 'all' || 
                           (locationFilter === 'rwanda' && isRwanda) ||
                           (locationFilter === 'intl' && !isRwanda);

    // Skills filter
    const candidateSkills = (candidate.skills || []).map((s: any) => 
      (typeof s === 'string' ? s : s.name).toLowerCase()
    );
    const matchesSkills = skillsFilter.length === 0 || 
                         skillsFilter.some(s => candidateSkills.some(cs => cs.includes(s.toLowerCase())));

    // Experience filter
    const years = candidate.yearsExperience || 0;
    const matchesExp = expFilter === 'all' ||
                      (expFilter === 'junior' && years <= 2) ||
                      (expFilter === 'mid' && years > 2 && years <= 5) ||
                      (expFilter === 'senior' && years > 5);

    return matchesSearch && matchesLocation && matchesSkills && matchesExp;
  });

  const availableSkills = Array.from(new Set(
    candidates.flatMap(c => (c.skills || []).map((s: any) => typeof s === 'string' ? s : s.name))
  )).sort();

  const handleDelete = async (id: string) => {
    if (!confirm('Move this candidate to the recycle bin?')) return;
    try {
        const res = await fetch(`/api/candidates/${id}`, { method: 'DELETE' });
        if (res.ok) {
            setCandidates(candidates.filter(c => c.id !== id));
            setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
        }
    } catch (error) {
        console.error('Delete failed:', error);
    }
  };

  const handleScreenSelected = async () => {
    if (selectedIds.length === 0) return;
    setIsScreening(true);
    try {
      // We need a job to screen against. For demo, we'll ask for one or pick the first active job.
      const jobsRes = await fetch('/api/jobs');
      const jobsData = await jobsRes.json();
      const activeJob = jobsData.data?.find((j: any) => j.status === 'open');

      if (!activeJob) {
        alert('Please create an open job first to screen candidates against.');
        return;
      }

      const res = await fetch('/api/screenings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: activeJob.id || activeJob._id,
          applicantIds: selectedIds
        })
      });
      
      const result = await res.json();
      if (result.success) {
        window.location.href = `/screenings/${result.data.id || result.data._id}`;
      } else {
        alert('Screening failed: ' + result.error);
      }
    } catch (error) {
      console.error('Screening failed:', error);
    } finally {
      setIsScreening(false);
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
            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-card border-border text-foreground placeholder-muted-foreground"
                />
              </div>
              
              <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0">
                <select 
                  className="bg-card border-border text-foreground rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                >
                  <option value="all">All Locations</option>
                  <option value="rwanda">Rwanda Based</option>
                  <option value="intl">International</option>
                </select>

                <select 
                  className="bg-card border-border text-foreground rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                  value={expFilter}
                  onChange={(e) => setExpFilter(e.target.value)}
                >
                  <option value="all">Any Experience</option>
                  <option value="junior">Junior (0-2y)</option>
                  <option value="mid">Mid-Level (3-5y)</option>
                  <option value="senior">Senior (5y+)</option>
                </select>

                <select 
                  className="bg-card border-border text-foreground rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none max-w-[150px]"
                  value=""
                  onChange={(e) => {
                    if (e.target.value && !skillsFilter.includes(e.target.value)) {
                      setSkillsFilter(prev => [...prev, e.target.value]);
                    }
                  }}
                >
                  <option value="" disabled>Add Skill...</option>
                  {availableSkills.filter(s => !skillsFilter.includes(s)).map(skill => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>

                {selectedIds.length > 0 && (
                  <Button 
                    onClick={handleScreenSelected}
                    disabled={isScreening}
                    className="bg-accent hover:bg-accent/90 text-white gap-2 animate-in zoom-in-95 duration-200"
                  >
                    {isScreening ? <span className="animate-spin mr-1">⌛</span> : <Zap className="h-4 w-4" />}
                    Screen {selectedIds.length} Selected
                  </Button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {skillsFilter.map(skill => (
                <Badge key={skill} variant="secondary" className="bg-primary/20 text-primary border-primary/30 gap-1 pr-1">
                  {skill}
                  <X className="h-3 w-3 cursor-pointer hover:text-foreground" onClick={() => setSkillsFilter(prev => prev.filter(s => s !== skill))} />
                </Badge>
              ))}
              {skillsFilter.length > 0 && (
                <button onClick={() => setSkillsFilter([])} className="text-xs text-muted-foreground hover:text-foreground ml-2">Clear all</button>
              )}
            </div>

            <div className="text-sm text-muted-foreground">
              Showing {filteredCandidates.length} of {candidates.length} candidates
            </div>

            {/* Table */}
            <CandidatesTable
              candidates={filteredCandidates}
              onDelete={handleDelete}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
              onSkillClick={(skill) => {
                if (!skillsFilter.includes(skill)) {
                  setSkillsFilter(prev => [...prev, skill]);
                }
              }}
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
