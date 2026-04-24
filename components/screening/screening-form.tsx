'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { screeningRequestSchema, ScreeningRequestFormData } from '@/lib/schemas';
import { screeningApi } from '@/lib/api-client';
import { Loader2, AlertCircle } from 'lucide-react';

interface ScreeningFormProps {
  jobs: Array<{ id: string; title: string }>;
  candidates: Array<{ id: string; firstName: string; lastName: string; email: string }>;
}

export function ScreeningForm({ jobs, candidates }: ScreeningFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ScreeningRequestFormData>({
    resolver: zodResolver(screeningRequestSchema),
    defaultValues: {
      applicantIds: [],
    },
  });

  const applicantIds = watch('applicantIds') || [];
  const selectedJobId = watch('jobId');

  const toggleCandidate = (candidateId: string) => {
    const currentIds = [...applicantIds];
    const index = currentIds.indexOf(candidateId);
    
    if (index > -1) {
      currentIds.splice(index, 1);
    } else {
      currentIds.push(candidateId);
    }
    
    setValue('applicantIds', currentIds, { shouldValidate: true });
  };

  const toggleAllCandidates = () => {
    if (applicantIds.length === candidates.length) {
      setValue('applicantIds', [], { shouldValidate: true });
    } else {
      setValue('applicantIds', candidates.map((c) => c.id), { shouldValidate: true });
    }
  };

  const onSubmit = async (data: ScreeningRequestFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await screeningApi.create({
        jobId: data.jobId,
        applicantIds: data.applicantIds,
      });

      if (!response.success) {
        setError(response.error || 'Failed to start screening');
        return;
      }

      router.push('/screening');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm flex items-start gap-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* Job Selection */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Select Job Position</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="jobId" className="text-foreground mb-2 block">
              Job Position *
            </Label>
            <Controller
              control={control}
              name="jobId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id="jobId"
                    className="bg-muted border-border text-foreground"
                  >
                    <SelectValue placeholder="Select a job position" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {jobs.map((job) => (
                      <SelectItem key={job.id} value={job.id}>
                        {job.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.jobId && (
              <span className="text-xs text-destructive mt-1">{errors.jobId.message}</span>
            )}
          </div>

          {selectedJobId && (
            <div className="p-4 bg-accent/10 border border-accent/30 rounded-lg">
              <p className="text-sm text-foreground">
                <span className="font-medium">Selected Job:</span> {jobs.find((j) => j.id === selectedJobId)?.title}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Candidate Selection */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-foreground">Select Candidates</CardTitle>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={toggleAllCandidates}
            className="text-accent hover:bg-accent/10"
          >
            {applicantIds.length === candidates.length ? 'Deselect All' : 'Select All'}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {candidates.map((candidate) => (
              <div
                key={candidate.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Checkbox
                  id={candidate.id}
                  checked={applicantIds.includes(candidate.id)}
                  onCheckedChange={() => toggleCandidate(candidate.id)}
                  className="mt-1"
                />
                <label
                  htmlFor={candidate.id}
                  className="flex-1 cursor-pointer"
                >
                  <div className="font-medium text-foreground">
                    {candidate.firstName} {candidate.lastName}
                  </div>
                  <div className="text-sm text-muted-foreground">{candidate.email}</div>
                </label>
              </div>
            ))}
          </div>

          {errors.applicantIds && (
            <span className="text-xs text-destructive mt-2">{errors.applicantIds.message}</span>
          )}

          <div className="mt-4 p-3 bg-muted/30 rounded-lg text-sm text-muted-foreground">
            Selected: <span className="font-medium text-foreground">{applicantIds.length}</span> candidate{applicantIds.length !== 1 ? 's' : ''}
          </div>
        </CardContent>
      </Card>

      {/* Screening Info */}
      <Card className="bg-accent/5 border border-accent/30">
        <CardContent className="pt-6">
          <div className="space-y-2 text-sm">
            <p className="text-foreground">
              <span className="font-medium">Screening Process:</span>
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>AI will analyze selected candidates against job requirements</li>
              <li>Match scores will be calculated based on skills and experience</li>
              <li>Strengths and gaps will be identified for each candidate</li>
              <li>Results will be available within minutes</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={isSubmitting || !selectedJobId || applicantIds.length === 0}
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground gap-2 disabled:opacity-50"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSubmitting ? 'Starting Screening...' : 'Start Screening'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="border-border text-foreground hover:bg-muted"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
