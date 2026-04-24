'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { JobForm } from '@/components/jobs/job-form';
import { Card, CardContent } from '@/components/ui/card';

export default function NewJobPage() {
  return (
    <MainLayout>
      <div className="p-6 max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Create New Job</h1>
          <p className="text-muted-foreground">
            Fill in the details below to create a new job posting
          </p>
        </div>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <JobForm />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
