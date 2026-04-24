'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { JobsList } from '@/components/jobs/jobs-list';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search } from 'lucide-react';

// Mock data - replace with API call
const mockJobs = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    department: 'Engineering',
    location: 'San Francisco, CA',
    employmentType: 'full-time',
    status: 'open',
    createdAt: '2024-03-15',
    applicantCount: 24,
  },
  {
    id: '2',
    title: 'Product Manager',
    department: 'Product',
    location: 'New York, NY',
    employmentType: 'full-time',
    status: 'open',
    createdAt: '2024-03-10',
    applicantCount: 18,
  },
  {
    id: '3',
    title: 'UX Designer',
    department: 'Design',
    location: 'Remote',
    employmentType: 'full-time',
    status: 'draft',
    createdAt: '2024-03-01',
    applicantCount: 0,
  },
  {
    id: '4',
    title: 'Data Scientist',
    department: 'Analytics',
    location: 'Boston, MA',
    employmentType: 'full-time',
    status: 'closed',
    createdAt: '2024-02-15',
    applicantCount: 42,
  },
  {
    id: '5',
    title: 'Marketing Specialist',
    department: 'Marketing',
    location: 'Los Angeles, CA',
    employmentType: 'part-time',
    status: 'open',
    createdAt: '2024-02-28',
    applicantCount: 12,
  },
];

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch('/api/jobs');
        const data = await res.json();
        if (data.success) {
          setJobs(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.department || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.location || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Move this job to the recycle bin?')) return;
    try {
        const res = await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
        if (res.ok) {
            setJobs(jobs.filter(j => j.id !== id));
        }
    } catch (error) {
        console.error('Delete failed:', error);
    }
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Jobs</h1>
            <p className="text-muted-foreground">Manage and track all job postings</p>
          </div>
          <Link href="/jobs/new">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
              <Plus className="h-4 w-4" />
              New Job
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-col sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, department, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border text-foreground placeholder-muted-foreground"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40 bg-card border-border text-foreground">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Jobs List */}
        <div>
          <p className="text-sm text-muted-foreground mb-4">
            Showing {filteredJobs.length} of {jobs.length} jobs
          </p>
          <JobsList jobs={filteredJobs} onDelete={handleDelete} />
        </div>
      </div>
    </MainLayout>
  );
}
