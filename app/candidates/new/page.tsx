'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { CandidateForm } from '@/components/candidates/candidate-form';
import { Card, CardContent } from '@/components/ui/card';

export default function NewCandidatePage() {
  return (
    <MainLayout>
      <div className="p-6 max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Add New Candidate</h1>
          <p className="text-muted-foreground">
            Fill in the candidate&apos;s information below
          </p>
        </div>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <CandidateForm />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
