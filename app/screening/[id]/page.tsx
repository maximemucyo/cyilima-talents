'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { ResultCard } from '@/components/results/result-card';
import { ResultsFilter } from '@/components/results/results-filter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  BarChart3,
  Download,
  Share2,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

export default function ScreeningResultsPage() {
  const params = useParams();
  const screeningId = params.id as string;

  const [results, setResults] = useState<any[]>([]);
  const [jobTitle, setJobTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [minScore, setMinScore] = useState(0);
  const [maxScore, setMaxScore] = useState(100);
  const [selectedRecommendation, setSelectedRecommendation] = useState('all');

  useEffect(() => {
    async function fetchResults() {
      try {
        const res = await fetch(`/api/screenings/${screeningId}`);
        const data = await res.json();
        if (data.success) {
          setResults(data.data.results);
          setJobTitle(data.data.jobTitle);
        }
      } catch (error) {
        console.error('Failed to fetch results:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchResults();
  }, [screeningId]);

  const filteredResults = results.filter((result) => {
    const scoreMatch =
      result.matchScore >= minScore && result.matchScore <= maxScore;
    const recommendationMatch =
      selectedRecommendation === 'all' || result.recommendation === selectedRecommendation;
    return scoreMatch && recommendationMatch;
  });

  const recommendationCounts = {
    shortlist: results.filter((r) => r.recommendation === 'shortlist' || r.recommendation === 'highly_recommended').length,
    review: results.filter((r) => r.recommendation === 'review' || r.recommendation === 'recommended').length,
    reject: results.filter((r) => r.recommendation === 'reject' || r.recommendation === 'not_recommended').length,
  };

  const avgScore = results.length > 0
    ? results.reduce((sum, r) => sum + r.matchScore, 0) / results.length
    : 0;

  const handleReset = () => {
    setMinScore(0);
    setMaxScore(100);
    setSelectedRecommendation('all');
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link href="/screening">
              <Button
                variant="ghost"
                className="mb-4 text-accent hover:text-accent/80 gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Screenings
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Screening Results
            </h1>
            <p className="text-muted-foreground">
              {jobTitle} - {results.length} candidates screened
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
              Export
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">Total Screened</p>
              <p className="text-2xl font-bold text-foreground">{results.length}</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">Recommended</p>
              <p className="text-2xl font-bold text-green-500">
                {recommendationCounts.shortlist}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">Needs Review</p>
              <p className="text-2xl font-bold text-yellow-500">
                {recommendationCounts.review}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">Avg Match Score</p>
              <p className="text-2xl font-bold text-foreground">
                {Math.round(avgScore)}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filter Sidebar */}
          <div>
            <ResultsFilter
              minScore={minScore}
              maxScore={maxScore}
              selectedRecommendation={selectedRecommendation}
              onScoreChange={(min, max) => {
                setMinScore(min);
                setMaxScore(max);
              }}
              onRecommendationChange={setSelectedRecommendation}
              onReset={handleReset}
            />
          </div>

          {/* Results List */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {filteredResults.length} of {results.length} candidates
              </p>
            </div>

            {filteredResults.length > 0 ? (
              <div className="space-y-3">
                {filteredResults.map((result, index) => (
                  <ResultCard 
                    key={result.id} 
                    {...result} 
                    rank={index + 1} 
                  />
                ))}
              </div>
            ) : (
              <Card className="bg-card border-border">
                <CardContent className="py-12 text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">
                    No results match your filter criteria
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
