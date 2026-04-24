'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { ScreeningForm } from '@/components/screening/screening-form';
import { Card, CardContent } from '@/components/ui/card';

import { useState, useEffect } from 'react';

export default function NewScreeningPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [jobsRes, candidatesRes] = await Promise.all([
          fetch('/api/jobs'),
          fetch('/api/candidates')
        ]);
        const jobsData = await jobsRes.json();
        const candidatesData = await candidatesRes.json();
        
        if (jobsData.success) setJobs(jobsData.data);
        if (candidatesData.success) setCandidates(candidatesData.data);
      } catch (error) {
        console.error('Failed to fetch data for screening:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="p-6 flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }
  return (
    <MainLayout>
      <div className="p-6 max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Start New Screening</h1>
          <p className="text-muted-foreground">
            Select a job position and candidates to screen
          </p>
        </div>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <ScreeningForm jobs={jobs} candidates={candidates} />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
