'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { ResultCard } from '@/components/results/result-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Download,
  Share2,
  ArrowLeft,
  Users,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';

export default function ShortlistDetailPage() {
  const params = useParams();
  const shortlistId = params.id as string;

  const [results, setResults] = useState<any[]>([]);
  const [jobTitle, setJobTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      try {
        const res = await fetch(`/api/screenings/${shortlistId}`);
        const data = await res.json();
        if (data.success) {
          // Filter to only show shortlisted candidates
          setResults(data.data.results.filter((r: any) => r.recommendation === 'shortlist'));
          setJobTitle(data.data.jobTitle);
        }
      } catch (error) {
        console.error('Failed to fetch shortlist details:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchResults();
  }, [shortlistId]);

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link href="/shortlists">
              <Button
                variant="ghost"
                className="mb-4 text-accent hover:text-accent/80 gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Shortlists
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Shortlist Details
            </h1>
            <p className="text-muted-foreground">
              {jobTitle} - {results.length} shortlisted candidates
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="border-border text-foreground hover:bg-muted gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
              <Download className="h-4 w-4" />
              Export List
            </Button>
          </div>
        </div>

        {/* Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <p className="text-xl font-bold text-foreground">Active Recruitment</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Shortlisted</p>
                <p className="text-xl font-bold text-foreground">{results.length} Candidates</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Candidates List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Shortlisted Candidates</h2>
          {results.length > 0 ? (
            <div className="space-y-3">
              {results.map((result) => (
                <ResultCard key={result.id} {...result} />
              ))}
            </div>
          ) : (
            <Card className="bg-card border-border">
              <CardContent className="py-12 text-center text-muted-foreground">
                No candidates have been shortlisted for this position yet.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
