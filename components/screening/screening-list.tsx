'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Zap,
  MoreVertical,
  Eye,
  Trash2,
  Clock,
  CheckCircle2,
} from 'lucide-react';

interface ScreeningRequest {
  id: string;
  jobTitle: string;
  candidateCount: number;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  progress: number;
  createdAt: string;
  completedAt?: string;
}

interface ScreeningListProps {
  screenings: ScreeningRequest[];
  onDelete?: (id: string) => void;
}

const statusConfig = {
  pending: { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: 'Pending' },
  'in-progress': { icon: Zap, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'In Progress' },
  completed: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10', label: 'Completed' },
  failed: { icon: Zap, color: 'text-red-500', bg: 'bg-red-500/10', label: 'Failed' },
};

export function ScreeningList({ screenings, onDelete }: ScreeningListProps) {
  if (screenings.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="py-12 text-center">
          <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground mb-4">No screenings yet</p>
          <Link href="/screening/new">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Start First Screening
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {screenings.map((screening) => {
        const config = statusConfig[screening.status];
        const StatusIcon = config.icon;

        return (
          <Card
            key={screening.id}
            className="bg-card border-border hover:border-primary/50 transition-colors"
          >
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      {screening.jobTitle}
                    </h3>
                    <Badge className={`${config.bg} ${config.color} border-0`}>
                      {config.label}
                    </Badge>
                  </div>

                  <div className="text-sm text-muted-foreground mb-3">
                    {screening.candidateCount} candidate{screening.candidateCount !== 1 ? 's' : ''} • Created {new Date(screening.createdAt).toLocaleString()}
                    {screening.completedAt && ` • Completed ${new Date(screening.completedAt).toLocaleString()}`}
                  </div>

                  {/* Progress Bar */}
                  {screening.status !== 'completed' && screening.status !== 'failed' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium text-foreground">{screening.progress}%</span>
                      </div>
                      <Progress value={screening.progress} className="h-2" />
                    </div>
                  )}
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
                      <Link
                        href={`/screening/${screening.id}`}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Results</span>
                      </Link>
                    </DropdownMenuItem>
                    {screening.status === 'failed' && (
                      <DropdownMenuItem className="text-foreground cursor-pointer">
                        <button className="flex items-center gap-2 w-full">
                          <Zap className="h-4 w-4" />
                          <span>Retry</span>
                        </button>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      className="text-destructive cursor-pointer"
                      onClick={() => onDelete?.(screening.id)}
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
