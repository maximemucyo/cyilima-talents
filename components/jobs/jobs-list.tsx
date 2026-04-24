'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Briefcase,
  MapPin,
  Clock,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
} from 'lucide-react';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  status: string;
  createdAt: string;
  applicantCount?: number;
  postedBy?: string;
}

interface JobsListProps {
  jobs: Job[];
  onDelete?: (id: string) => void;
}

const statusStyles = {
  open: { bg: 'bg-green-500/10', text: 'text-green-500', label: 'Open' },
  draft: { bg: 'bg-gray-500/10', text: 'text-gray-500', label: 'Draft' },
  closed: { bg: 'bg-red-500/10', text: 'text-red-500', label: 'Closed' },
  cancelled: { bg: 'bg-gray-500/10', text: 'text-gray-500', label: 'Cancelled' },
};

const getStatusStyle = (status: string) => {
  return statusStyles[status as keyof typeof statusStyles] || statusStyles.draft;
};

export function JobsList({ jobs, onDelete }: JobsListProps) {
  if (jobs.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="py-12 text-center">
          <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground mb-4">No jobs found</p>
          <Link href="/jobs/new">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Create First Job
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {jobs.map((job) => {
        const statusStyle = getStatusStyle(job.status);
        return (
          <Card
            key={job.id}
            className="bg-card border-border hover:border-primary/50 transition-colors"
          >
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">{job.title}</h3>
                    <Badge
                      className={`${statusStyle.bg} ${statusStyle.text} border-0 capitalize`}
                    >
                      {statusStyle.label}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">{job.department}</p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      <span className="capitalize">{job.employmentType}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(job.createdAt).toLocaleString()}</span>
                    </div>
                    {job.applicantCount !== undefined && (
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-accent">{job.applicantCount}</span>
                        <span>applicants</span>
                      </div>
                    )}
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-card border-border">
                    <DropdownMenuItem className="text-foreground cursor-pointer">
                      <Link href={`/jobs/${job.id}`} className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-foreground cursor-pointer">
                      <Link href={`/jobs/${job.id}/edit`} className="flex items-center gap-2">
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive cursor-pointer"
                      onClick={() => onDelete?.(job.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
