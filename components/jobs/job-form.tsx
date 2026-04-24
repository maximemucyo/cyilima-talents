'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { jobPostingSchema, JobPostingFormData } from '@/lib/schemas';
import { jobsApi } from '@/lib/api-client';
import { X, Plus, Loader2 } from 'lucide-react';

interface JobFormProps {
  initialData?: Partial<JobPostingFormData>;
  isEditing?: boolean;
}

export function JobForm({ initialData, isEditing }: JobFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<JobPostingFormData>({
    resolver: zodResolver(jobPostingSchema),
    defaultValues: initialData || {
      requiredSkills: [],
      preferredSkills: [],
    },
  });

  const { fields: requiredSkills, append: appendRequired, remove: removeRequired } = useFieldArray({
    control,
    name: 'requiredSkills',
  });

  const { fields: preferredSkills, append: appendPreferred, remove: removePreferred } = useFieldArray({
    control,
    name: 'preferredSkills',
  });

  const watchedRequired = watch('requiredSkills');

  const onSubmit = async (data: JobPostingFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = isEditing
        ? await jobsApi.update(initialData?.['id'] as string, data)
        : await jobsApi.create(data);

      if (!response.success) {
        setError(response.error || 'Failed to save job');
        return;
      }

      router.push('/jobs');
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
        <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-foreground">
              Job Title *
            </Label>
            <Input
              id="title"
              placeholder="e.g. Senior Software Engineer"
              className="mt-2 bg-muted border-border text-foreground placeholder-muted-foreground"
              {...register('title')}
            />
            {errors.title && (
              <span className="text-xs text-destructive mt-1">{errors.title.message}</span>
            )}
          </div>

          <div>
            <Label htmlFor="description" className="text-foreground">
              Description *
            </Label>
            <Textarea
              id="description"
              placeholder="Job description, responsibilities, and requirements..."
              rows={6}
              className="mt-2 bg-muted border-border text-foreground placeholder-muted-foreground resize-none"
              {...register('description')}
            />
            {errors.description && (
              <span className="text-xs text-destructive mt-1">{errors.description.message}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="department" className="text-foreground">
                Department *
              </Label>
              <Input
                id="department"
                placeholder="e.g. Engineering"
                className="mt-2 bg-muted border-border text-foreground placeholder-muted-foreground"
                {...register('department')}
              />
              {errors.department && (
                <span className="text-xs text-destructive mt-1">{errors.department.message}</span>
              )}
            </div>

          <div>
            <Label htmlFor="location" className="text-foreground">
              Location *
            </Label>
            <Input
              id="location"
              placeholder="Kigali, Rwanda"
              className="mt-2 bg-muted border-border text-foreground placeholder-muted-foreground"
              {...register('location')}
            />
            {errors.location && (
              <span className="text-xs text-destructive mt-1">{errors.location.message}</span>
            )}
          </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Details */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Job Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="employmentType" className="text-foreground">
                Employment Type *
              </Label>
              <Select {...register('employmentType')}>
                <SelectTrigger id="employmentType" className="mt-2 bg-muted border-border">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="full-time">Full Time</SelectItem>
                  <SelectItem value="part-time">Part Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="temporary">Temporary</SelectItem>
                </SelectContent>
              </Select>
              {errors.employmentType && (
                <span className="text-xs text-destructive mt-1">{errors.employmentType.message}</span>
              )}
            </div>

            <div>
              <Label htmlFor="seniority" className="text-foreground">
                Seniority Level *
              </Label>
              <Select {...register('seniority')}>
                <SelectTrigger id="seniority" className="mt-2 bg-muted border-border">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="entry">Entry Level</SelectItem>
                  <SelectItem value="mid">Mid Level</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                  <SelectItem value="lead">Lead</SelectItem>
                </SelectContent>
              </Select>
              {errors.seniority && (
                <span className="text-xs text-destructive mt-1">{errors.seniority.message}</span>
              )}
            </div>
          </div>

          {/* Rwanda Focus & International */}
          <div className="space-y-3 p-4 bg-muted/30 rounded-lg border border-border">
            <p className="text-sm font-medium text-foreground mb-3">Recruitment Scope</p>
            <div className="flex items-center gap-3">
              <Checkbox
                id="isRwandaFocused"
                defaultChecked={true}
                {...register('isRwandaFocused')}
                className="border-border"
              />
              <Label htmlFor="isRwandaFocused" className="text-foreground cursor-pointer font-normal">
                Focus on Rwanda-based candidates (recommended)
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                id="acceptInternational"
                defaultChecked={true}
                {...register('acceptInternational')}
                className="border-border"
              />
              <Label htmlFor="acceptInternational" className="text-foreground cursor-pointer font-normal">
                Accept international applications
              </Label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minExperience" className="text-foreground">
                Min Years Experience
              </Label>
              <Input
                id="minExperience"
                type="number"
                placeholder="0"
                className="mt-2 bg-muted border-border text-foreground placeholder-muted-foreground"
                {...register('minExperience', { valueAsNumber: true })}
              />
            </div>

            <div>
              <Label htmlFor="maxExperience" className="text-foreground">
                Max Years Experience
              </Label>
              <Input
                id="maxExperience"
                type="number"
                placeholder="10"
                className="mt-2 bg-muted border-border text-foreground placeholder-muted-foreground"
                {...register('maxExperience', { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="salaryMin" className="text-foreground">
                Salary Range Min
              </Label>
              <Input
                id="salaryMin"
                type="number"
                placeholder="50000"
                className="mt-2 bg-muted border-border text-foreground placeholder-muted-foreground"
                {...register('salaryMin', { valueAsNumber: true })}
              />
            </div>

            <div>
              <Label htmlFor="salaryMax" className="text-foreground">
                Salary Range Max
              </Label>
              <Input
                id="salaryMax"
                type="number"
                placeholder="150000"
                className="mt-2 bg-muted border-border text-foreground placeholder-muted-foreground"
                {...register('salaryMax', { valueAsNumber: true })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Required Skills *</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {requiredSkills.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input
                placeholder="e.g. JavaScript"
                className="bg-muted border-border text-foreground placeholder-muted-foreground flex-1"
                {...register(`requiredSkills.${index}`)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeRequired(index)}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendRequired('')}
            className="border-border text-foreground hover:bg-muted gap-2 w-full"
          >
            <Plus className="h-4 w-4" />
            Add Skill
          </Button>
        </CardContent>
      </Card>

      {/* Preferred Skills */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Preferred Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {preferredSkills.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input
                placeholder="e.g. TypeScript"
                className="bg-muted border-border text-foreground placeholder-muted-foreground flex-1"
                {...register(`preferredSkills.${index}`)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removePreferred(index)}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendPreferred('')}
            className="border-border text-foreground hover:bg-muted gap-2 w-full"
          >
            <Plus className="h-4 w-4" />
            Add Skill
          </Button>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isEditing ? 'Update Job' : 'Create Job'}
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
