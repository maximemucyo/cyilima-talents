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
  candidates: Array<{ 
    id: string; 
    firstName: string; 
    lastName: string; 
    email: string;
    location?: string;
    isRwandaBased?: boolean;
    country?: string;
    skills: any[];
    yearsExperience?: number;
  }>;
}

export function ScreeningForm({ jobs, candidates }: ScreeningFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [expFilter, setExpFilter] = useState('all');
  const [skillsFilter, setSkillsFilter] = useState<string[]>([]);

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

  // Filtering Logic
  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch = [c.firstName, c.lastName, c.email]
      .join(' ')
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    
    const isRwanda = c.isRwandaBased || 
                    c.country?.toLowerCase() === 'rwanda' || 
                    c.location?.toLowerCase().includes('rwanda') ||
                    c.location?.toLowerCase().includes('kigali');
    
    const matchesLocation = locationFilter === 'all' || 
                           (locationFilter === 'rwanda' && isRwanda) ||
                           (locationFilter === 'intl' && !isRwanda);

    const candidateSkills = (c.skills || []).map((s: any) => 
      (typeof s === 'string' ? s : s.name).toLowerCase()
    );
    const matchesSkills = skillsFilter.length === 0 || 
                         skillsFilter.some(s => candidateSkills.some(cs => cs.includes(s.toLowerCase())));

    const years = c.yearsExperience || 0;
    const matchesExp = expFilter === 'all' ||
                      (expFilter === 'junior' && years <= 2) ||
                      (expFilter === 'mid' && years > 2 && years <= 5) ||
                      (expFilter === 'senior' && years > 5);

    return matchesSearch && matchesLocation && matchesSkills && matchesExp;
  });

  const availableSkills = Array.from(new Set(
    candidates.flatMap(c => (c.skills || []).map((s: any) => typeof s === 'string' ? s : s.name))
  )).sort();

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

  const toggleAllFiltered = () => {
    const filteredIds = filteredCandidates.map(c => c.id);
    const allFilteredSelected = filteredIds.every(id => applicantIds.includes(id));

    if (allFilteredSelected) {
      // Remove all filtered ones
      setValue('applicantIds', applicantIds.filter(id => !filteredIds.includes(id)), { shouldValidate: true });
    } else {
      // Add all filtered ones (avoid duplicates)
      const newSelection = Array.from(new Set([...applicantIds, ...filteredIds]));
      setValue('applicantIds', newSelection, { shouldValidate: true });
    }
  };

  const onSubmit = async (data: ScreeningRequestFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const preferredModel = typeof window !== 'undefined' ? localStorage.getItem('preferredModel') : null;
      const response = await screeningApi.create({
        jobId: data.jobId,
        applicantIds: data.applicantIds,
        preferredModel: preferredModel || undefined,
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
        <CardHeader className="space-y-4">
          <div className="flex flex-row items-center justify-between">
            <CardTitle className="text-foreground">Select Candidates</CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={toggleAllFiltered}
              className="text-accent hover:bg-accent/10"
            >
              {filteredCandidates.length > 0 && filteredCandidates.every(c => applicantIds.includes(c.id)) 
                ? 'Deselect All Filtered' 
                : `Select All Filtered (${filteredCandidates.length})`}
            </Button>
          </div>

          <div className="flex flex-col gap-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">🔍</span>
              <input 
                className="w-full bg-muted border-border text-foreground rounded-md pl-9 pr-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                placeholder="Search candidates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <select 
                className="bg-muted border-border text-foreground rounded-md px-3 py-1 text-xs focus:ring-1 focus:ring-primary outline-none"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              >
                <option value="all">All Locations</option>
                <option value="rwanda">Rwanda</option>
                <option value="intl">International</option>
              </select>

              <select 
                className="bg-muted border-border text-foreground rounded-md px-3 py-1 text-xs focus:ring-1 focus:ring-primary outline-none"
                value={expFilter}
                onChange={(e) => setExpFilter(e.target.value)}
              >
                <option value="all">All Experience</option>
                <option value="junior">Junior (0-2y)</option>
                <option value="mid">Mid (3-5y)</option>
                <option value="senior">Senior (5y+)</option>
              </select>

              <select 
                className="bg-muted border-border text-foreground rounded-md px-3 py-1 text-xs focus:ring-1 focus:ring-primary outline-none max-w-[120px]"
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
            </div>

            {skillsFilter.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {skillsFilter.map(s => (
                  <span key={s} className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/30 rounded text-[10px] flex items-center gap-1">
                    {s}
                    <span className="cursor-pointer font-bold" onClick={() => setSkillsFilter(prev => prev.filter(sk => sk !== s))}>×</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
            {filteredCandidates.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground text-sm">
                No candidates match your filters
              </div>
            ) : (
              filteredCandidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className={`flex items-start gap-3 p-2 rounded-lg transition-colors border ${
                    applicantIds.includes(candidate.id) 
                      ? 'bg-primary/5 border-primary/20' 
                      : 'hover:bg-muted/50 border-transparent'
                  }`}
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
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-foreground text-sm">
                        {candidate.firstName} {candidate.lastName}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {candidate.yearsExperience || 0}y | {candidate.location || 'Unknown'}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">{candidate.email}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {candidate.skills?.slice(0, 3).map((s: any, i: number) => (
                        <span key={i} className="px-1.5 py-0.5 bg-primary/10 text-[9px] rounded text-primary font-medium">
                          {typeof s === 'string' ? s : s.name}
                        </span>
                      ))}
                    </div>
                  </label>
                </div>
              ))
            )}
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
