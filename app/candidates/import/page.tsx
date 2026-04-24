'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { BulkUploadComponent } from '@/components/candidates/bulk-upload';
import { CVUploadGuide } from '@/components/candidates/cv-upload-guide';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function ImportCandidatesPage() {
  const router = useRouter();

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Import Candidates</h1>
            <p className="text-muted-foreground mt-1">Upload and manage multiple candidate CVs</p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Section - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <BulkUploadComponent />
          </div>

          {/* Quick Actions - Sidebar */}
          <div className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={() => router.push('/candidates/new')}
                  variant="outline"
                  className="w-full border-border text-foreground hover:bg-muted justify-start"
                >
                  Add Single Candidate
                </Button>
                <Button
                  onClick={() => router.push('/candidates')}
                  variant="outline"
                  className="w-full border-border text-foreground hover:bg-muted justify-start"
                >
                  View All Candidates
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-accent/5 border-accent/30">
              <CardHeader>
                <CardTitle className="text-foreground text-base">Import Formats</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>✓ CSV Files</p>
                <p>✓ Excel (XLS/XLSX)</p>
                <p>✓ JSON</p>
                <p>✓ PDF CVs</p>
                <p>✓ ZIP Archives</p>
                <p>✓ Direct URLs</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Guide Section */}
        <CVUploadGuide />
      </div>
    </MainLayout>
  );
}
