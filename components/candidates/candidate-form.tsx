'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { talentProfileSchema, TalentProfileFormData } from '@/lib/schemas';
import { candidatesApi } from '@/lib/api-client';
import { X, Plus, Loader2 } from 'lucide-react';

interface CandidateFormProps {
  initialData?: Partial<TalentProfileFormData>;
  isEditing?: boolean;
}

export function CandidateForm({ initialData, isEditing }: CandidateFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TalentProfileFormData>({
    resolver: zodResolver(talentProfileSchema),
    defaultValues: initialData || {
      skills: [],
      languages: [],
    },
  });

  const { fields: skills, append: appendSkill, remove: removeSkill } = useFieldArray({
    control,
    name: 'skills',
  });

  const { fields: languages, append: appendLanguage, remove: removeLanguage } = useFieldArray({
    control,
    name: 'languages',
  });

  const onSubmit = async (data: TalentProfileFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = isEditing
        ? await candidatesApi.update(initialData?.['id'] as string, data)
        : await candidatesApi.create(data);

      if (!response.success) {
        setError(response.error || 'Failed to save candidate');
        return;
      }

      router.push('/candidates');
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

      {/* Personal Info */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="text-foreground">
                First Name *
              </Label>
              <Input
                id="firstName"
                placeholder="John"
                className="mt-2 bg-muted border-border text-foreground placeholder-muted-foreground"
                {...register('firstName')}
              />
              {errors.firstName && (
                <span className="text-xs text-destructive mt-1">{errors.firstName.message}</span>
              )}
            </div>

            <div>
              <Label htmlFor="lastName" className="text-foreground">
                Last Name *
              </Label>
              <Input
                id="lastName"
                placeholder="Doe"
                className="mt-2 bg-muted border-border text-foreground placeholder-muted-foreground"
                {...register('lastName')}
              />
              {errors.lastName && (
                <span className="text-xs text-destructive mt-1">{errors.lastName.message}</span>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="text-foreground">
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              className="mt-2 bg-muted border-border text-foreground placeholder-muted-foreground"
              {...register('email')}
            />
            {errors.email && (
              <span className="text-xs text-destructive mt-1">{errors.email.message}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone" className="text-foreground">
                Phone
              </Label>
              <Input
                id="phone"
                placeholder="+1 (555) 123-4567"
                className="mt-2 bg-muted border-border text-foreground placeholder-muted-foreground"
                {...register('phone')}
              />
            </div>

            <div>
              <Label htmlFor="location" className="text-foreground">
                Location
              </Label>
              <Input
                id="location"
                placeholder="Kigali, Rwanda"
                className="mt-2 bg-muted border-border text-foreground placeholder-muted-foreground"
                {...register('location')}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="summary" className="text-foreground">
              Professional Summary
            </Label>
            <Textarea
              id="summary"
              placeholder="Brief overview of your professional background..."
              rows={4}
              className="mt-2 bg-muted border-border text-foreground placeholder-muted-foreground resize-none"
              {...register('summary')}
            />
          </div>

          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border">
            <Checkbox
              id="isRwandaBased"
              {...register('isRwandaBased')}
              className="border-border"
            />
            <Label htmlFor="isRwandaBased" className="text-foreground cursor-pointer font-normal">
              Based in Rwanda
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Experience */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Experience</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="currentRole" className="text-foreground">
                Current Role
              </Label>
              <Input
                id="currentRole"
                placeholder="Senior Software Engineer"
                className="mt-2 bg-muted border-border text-foreground placeholder-muted-foreground"
                {...register('currentRole')}
              />
            </div>

            <div>
              <Label htmlFor="currentCompany" className="text-foreground">
                Current Company
              </Label>
              <Input
                id="currentCompany"
                placeholder="Tech Company Inc"
                className="mt-2 bg-muted border-border text-foreground placeholder-muted-foreground"
                {...register('currentCompany')}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="yearsExperience" className="text-foreground">
              Years of Experience
            </Label>
            <Input
              id="yearsExperience"
              type="number"
              placeholder="5"
              className="mt-2 bg-muted border-border text-foreground placeholder-muted-foreground"
              {...register('yearsExperience', { valueAsNumber: true })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Skills *</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {skills.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input
                placeholder="e.g. JavaScript, React, Node.js"
                className="bg-muted border-border text-foreground placeholder-muted-foreground flex-1"
                {...register(`skills.${index}`)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeSkill(index)}
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
            onClick={() => appendSkill('')}
            className="border-border text-foreground hover:bg-muted gap-2 w-full"
          >
            <Plus className="h-4 w-4" />
            Add Skill
          </Button>
        </CardContent>
      </Card>

      {/* Languages */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Languages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {languages.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input
                placeholder="e.g. English, Spanish, French"
                className="bg-muted border-border text-foreground placeholder-muted-foreground flex-1"
                {...register(`languages.${index}`)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeLanguage(index)}
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
            onClick={() => appendLanguage('')}
            className="border-border text-foreground hover:bg-muted gap-2 w-full"
          >
            <Plus className="h-4 w-4" />
            Add Language
          </Button>
        </CardContent>
      </Card>

      {/* CV & Links */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">CV & Online Profiles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="cvUrl" className="text-foreground">
              CV / Resume URL
            </Label>
            <Input
              id="cvUrl"
              type="url"
              placeholder="https://drive.google.com/file/d/... or https://example.com/cv.pdf"
              className="mt-2 bg-muted border-border text-foreground placeholder-muted-foreground"
              {...register('cvUrl')}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Direct link to CV (PDF, Google Drive, Dropbox, etc.)
            </p>
          </div>

          <div>
            <Label htmlFor="portfolioUrl" className="text-foreground">
              Portfolio URL
            </Label>
            <Input
              id="portfolioUrl"
              type="url"
              placeholder="https://portfolio.example.com"
              className="mt-2 bg-muted border-border text-foreground placeholder-muted-foreground"
              {...register('portfolioUrl')}
            />
          </div>

          <div>
            <Label htmlFor="linkedinUrl" className="text-foreground">
              LinkedIn URL
            </Label>
            <Input
              id="linkedinUrl"
              type="url"
              placeholder="https://linkedin.com/in/johndoe"
              className="mt-2 bg-muted border-border text-foreground placeholder-muted-foreground"
              {...register('linkedinUrl')}
            />
          </div>

          <div>
            <Label htmlFor="githubUrl" className="text-foreground">
              GitHub URL
            </Label>
            <Input
              id="githubUrl"
              type="url"
              placeholder="https://github.com/johndoe"
              className="mt-2 bg-muted border-border text-foreground placeholder-muted-foreground"
              {...register('githubUrl')}
            />
          </div>
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
          {isEditing ? 'Update Candidate' : 'Add Candidate'}
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
