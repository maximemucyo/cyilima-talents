'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';

interface ResultsFilterProps {
  minScore: number;
  maxScore: number;
  selectedRecommendation: string;
  onScoreChange: (min: number, max: number) => void;
  onRecommendationChange: (value: string) => void;
  onReset: () => void;
}

export function ResultsFilter({
  minScore,
  maxScore,
  selectedRecommendation,
  onScoreChange,
  onRecommendationChange,
  onReset,
}: ResultsFilterProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground text-base">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-foreground">Match Score Range</label>
            <span className="text-sm text-accent font-medium">
              {minScore}% - {maxScore}%
            </span>
          </div>
          <Slider
            min={0}
            max={100}
            step={5}
            value={[minScore, maxScore]}
            onValueChange={(value) => onScoreChange(value[0], value[1])}
            className="w-full"
          />
        </div>

        {/* Recommendation Filter */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">
            Recommendation
          </label>
          <Select value={selectedRecommendation} onValueChange={onRecommendationChange}>
            <SelectTrigger className="bg-muted border-border text-foreground">
              <SelectValue placeholder="All Recommendations" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="all">All Recommendations</SelectItem>
              <SelectItem value="shortlist">Recommended</SelectItem>
              <SelectItem value="review">Needs Review</SelectItem>
              <SelectItem value="reject">Not Recommended</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reset Button */}
        <Button
          onClick={onReset}
          variant="outline"
          className="w-full border-border text-foreground hover:bg-muted gap-2"
        >
          <X className="h-4 w-4" />
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  );
}
