'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Upload,
  Zap,
  FileText,
} from 'lucide-react';

export function QuickActions() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/jobs/new">
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              size="sm"
            >
              <Plus className="h-4 w-4" />
              <span>New Job</span>
            </Button>
          </Link>

          <Link href="/candidates">
            <Button
              variant="outline"
              className="w-full border-border text-foreground hover:bg-muted gap-2"
              size="sm"
            >
              <Upload className="h-4 w-4" />
              <span>Add Candidates</span>
            </Button>
          </Link>

          <Link href="/screening">
            <Button
              variant="outline"
              className="w-full border-border text-foreground hover:bg-muted gap-2"
              size="sm"
            >
              <Zap className="h-4 w-4" />
              <span>Start Screening</span>
            </Button>
          </Link>

          <Link href="/shortlists">
            <Button
              variant="outline"
              className="w-full border-border text-foreground hover:bg-muted gap-2"
              size="sm"
            >
              <FileText className="h-4 w-4" />
              <span>View Shortlists</span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
