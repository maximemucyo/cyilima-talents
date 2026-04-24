'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  MapPin, 
  Briefcase, 
  Calendar,
  Clock,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function JobDetailPage() {
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
          toast.error('Job not found');
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

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    
    try {
      const res = await fetch(`/api/jobs/${jobId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Job deleted successfully');
        router.push('/jobs');
      } else {
        toast.error(data.error || 'Failed to delete job');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="p-6 flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  if (!job) return null;

  return (
    <MainLayout>
      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-4">
            <Link href="/jobs">
              <Button variant="ghost" className="text-accent hover:text-accent/80 gap-2 pl-0">
                <ArrowLeft className="h-4 w-4" />
                Back to Jobs
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{job.title}</h1>
              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                  {job.department || 'General'}
                </Badge>
                <Badge variant="secondary" className="bg-accent/10 text-accent border-0">
                  {job.type || 'Full-time'}
                </Badge>
                <div className="flex items-center text-sm text-muted-foreground gap-1 ml-2">
                  <MapPin className="h-4 w-4" />
                  {job.location || 'Remote'}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Link href={`/jobs/${jobId}/edit`}>
              <Button variant="outline" className="border-border text-foreground hover:bg-muted gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="border-destructive text-destructive hover:bg-destructive/10 gap-2"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Job Description</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {job.description}
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Requirements & Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {job.requirements?.map((req: string, i: number) => (
                    <Badge key={i} variant="outline" className="border-border text-foreground py-1 px-3">
                      {req}
                    </Badge>
                  ))}
                  {job.requiredSkills?.map((skill: string, i: number) => (
                    <Badge key={i} variant="outline" className="border-primary/30 text-primary py-1 px-3">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground text-lg">Job Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Experience Level</p>
                    <p className="text-sm font-medium text-foreground">{job.seniority || 'Mid-Level'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Date Posted</p>
                    <p className="text-sm font-medium text-foreground">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Application Deadline</p>
                    <p className="text-sm font-medium text-foreground">
                      {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
                
                <hr className="border-border" />
                
                <Link href="/screening/new" className="block w-full">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                    <Zap className="h-4 w-4" />
                    Start Screening
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
