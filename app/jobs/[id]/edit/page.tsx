'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { JobForm } from '@/components/jobs/job-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditJobPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [job, setJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchJob() {
      try {
        const res = await fetch(`/api/jobs/${jobId}`);
        const data = await res.json();
        if (data.success) {
          setJob(data.data);
        } else {
          router.push('/jobs');
        }
      } catch (error) {
        console.error('Failed to fetch job:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchJob();
  }, [jobId, router]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="p-6 flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div>
          <Link href={`/jobs/${jobId}`}>
            <Button variant="ghost" className="text-accent hover:text-accent/80 gap-2 mb-4 pl-0">
              <ArrowLeft className="h-4 w-4" />
              Back to Job Details
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Edit Job Posting</h1>
          <p className="text-muted-foreground">Update the requirements and details for this position</p>
        </div>

        {job && (
          <JobForm 
            initialData={{
                ...job,
                id: job._id // Ensure ID is passed for update
            }} 
            isEditing={true} 
          />
        )}
      </div>
    </MainLayout>
  );
}
