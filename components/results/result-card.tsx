'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useState } from 'react';

interface ResultCardProps {
  rank?: number;
  candidateName: string;
  candidateEmail?: string;
  matchScore: number;
  recommendation: 'shortlist' | 'review' | 'reject';
  strengths: string[];
  gaps: string[];
  reasoning: string;
  aiModel: string;
}

const recommendationConfig = {
  shortlist: {
    icon: CheckCircle2,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    label: 'Recommended',
  },
  review: {
    icon: AlertCircle,
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10',
    label: 'Review',
  },
  reject: {
    icon: TrendingDown,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    label: 'Not Recommended',
  },
};

export function ResultCard({
  rank,
  candidateName,
  candidateEmail,
  matchScore,
  recommendation,
  strengths,
  gaps,
  reasoning,
  aiModel,
}: ResultCardProps) {
  const [expanded, setExpanded] = useState(false);
  const config = recommendationConfig[recommendation];
  const RecommendIcon = config.icon;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <Card className="bg-card border-border hover:border-primary/50 transition-colors">
      <CardContent className="pt-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4 gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {rank !== undefined && (
                <Badge variant="outline" className="text-muted-foreground border-border bg-muted/20">
                  #{rank}
                </Badge>
              )}
              <h3 className="text-lg font-semibold text-foreground">{candidateName}</h3>
              <Badge className={`${config.bg} ${config.color} border-0`}>
                {config.label}
              </Badge>
            </div>
            {candidateEmail && (
              <p className="text-sm text-muted-foreground">{candidateEmail}</p>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setExpanded(!expanded)}
            className="text-muted-foreground hover:text-foreground"
          >
            {expanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Match Score */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Match Score</span>
            <span className={`text-2xl font-bold ${getScoreColor(matchScore)}`}>
              {matchScore}%
            </span>
          </div>
          <Progress value={matchScore} className="h-2" />
        </div>

        {/* Expanded Content */}
        {expanded && (
          <div className="space-y-4 pt-4 border-t border-border">
            {/* Strengths */}
            {strengths && strengths.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <h4 className="font-medium text-foreground">Strengths</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {strengths.map((strength, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="bg-green-500/10 text-green-500 border-0"
                    >
                      {strength}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Gaps */}
            {gaps && gaps.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <h4 className="font-medium text-foreground">Gaps / Risks</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {gaps.map((gap, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="bg-red-500/10 text-red-500 border-0"
                    >
                      {gap}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Reasoning */}
            <div>
              <h4 className="font-medium text-foreground mb-2">AI Analysis</h4>
              <p className="text-sm text-muted-foreground bg-muted/30 rounded p-3">
                {reasoning}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Analysis by: <span className="font-medium">{aiModel}</span>
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
