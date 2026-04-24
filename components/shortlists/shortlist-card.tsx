'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  CheckSquare,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Users,
} from 'lucide-react';

interface ShortlistCardProps {
  id: string;
  jobTitle: string;
  candidateCount: number;
  status: 'active' | 'archived';
  createdAt: string;
  interviewedCount?: number;
  onDelete?: (id: string) => void;
}

export function ShortlistCard({
  id,
  jobTitle,
  candidateCount,
  status,
  createdAt,
  interviewedCount = 0,
  onDelete,
}: ShortlistCardProps) {
  const statusConfig = {
    active: { bg: 'bg-green-500/10', text: 'text-green-500', label: 'Active' },
    archived: { bg: 'bg-gray-500/10', text: 'text-gray-500', label: 'Archived' },
  };

  const config = statusConfig[status];

  return (
    <Card className="bg-card border-border hover:border-primary/50 transition-colors">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-foreground">{jobTitle}</h3>
              <Badge className={`${config.bg} ${config.text} border-0`}>
                {config.label}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{candidateCount} candidates</span>
              </div>
              {interviewedCount > 0 && (
                <div className="flex items-center gap-1">
                  <CheckSquare className="h-4 w-4" />
                  <span>{interviewedCount} interviewed</span>
                </div>
              )}
              <div className="text-xs">Created {createdAt}</div>
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
                <Link href={`/shortlists/${id}`} className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>View</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-foreground cursor-pointer">
                <Link href={`/shortlists/${id}/edit`} className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive cursor-pointer"
                onClick={() => onDelete?.(id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Interview Progress</span>
            <span className="font-medium text-foreground">
              {interviewedCount} of {candidateCount}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="bg-accent h-full transition-all"
              style={{
                width: `${(interviewedCount / candidateCount) * 100}%`,
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
