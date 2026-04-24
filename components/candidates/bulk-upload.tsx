'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { candidatesApi } from '@/lib/api-client';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Link as LinkIcon,
  File as FileIcon,
  Grid3x3,
} from 'lucide-react';

interface UploadResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    uploadedCount: number;
    failedCount: number;
    errors?: Array<{ row: number; error: string }>;
  };
}

interface BulkUploadProps {
  onSuccess?: () => void;
}

export function BulkUploadComponent({ onSuccess }: BulkUploadProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState('csv');
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // URL input states
  const [cvUrls, setCvUrls] = useState<string>('');
  const [isProcessingUrls, setIsProcessingUrls] = useState(false);

  const supportedFormats = ['CSV', 'JSON', 'Excel (XLS/XLSX)', 'PDF', 'ZIP'];

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const selectedFile = files[0];
      const validTypes = [
        'text/csv',
        'application/json',
        'application/pdf',
        'application/zip',
        'application/x-zip-compressed',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ];

      if (validTypes.includes(selectedFile.type) || selectedFile.name.match(/\.(csv|json|pdf|zip|xls|xlsx)$/i)) {
        setFile(selectedFile);
        setError(null);
      } else {
        setError(`Unsupported format: ${selectedFile.type}. Supported: ${supportedFormats.join(', ')}`);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files?.length) {
      const selectedFile = files[0];
      const validTypes = [
        'text/csv',
        'application/json',
        'application/pdf',
        'application/zip',
        'application/x-zip-compressed',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ];

      if (validTypes.includes(selectedFile.type) || selectedFile.name.match(/\.(csv|json|pdf|zip|xls|xlsx)$/i)) {
        setFile(selectedFile);
        setError(null);
      } else {
        setError(`Unsupported format. Supported: ${supportedFormats.join(', ')}`);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setUploadResult(null);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => (prev < 90 ? prev + 10 : 90));
      }, 200);

      const response = await candidatesApi.bulkUpload(file);

      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadResult(response);

      if (response.success && response.data?.uploadedCount) {
        onSuccess?.();
        setTimeout(() => {
          router.refresh();
        }, 1500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handleProcessUrls = async () => {
    if (!cvUrls.trim()) {
      setError('Please enter at least one CV URL');
      return;
    }

    setIsProcessingUrls(true);
    setError(null);
    setUploadResult(null);

    try {
      const urlList = cvUrls
        .split('\n')
        .map((url) => url.trim())
        .filter((url) => url.length > 0);

      // Simulate processing progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => (prev < 90 ? prev + 10 : 90));
      }, 200);

      // This would call an API endpoint to process URLs
      const response = await fetch('/api/candidates/bulk-upload-urls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvUrls: urlList }),
      }).then((res) => res.json());

      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadResult(response);

      if (response.success) {
        setCvUrls('');
        onSuccess?.();
        setTimeout(() => {
          router.refresh();
        }, 1500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process URLs');
      setUploadProgress(0);
    } finally {
      setIsProcessingUrls(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setUploadProgress(0);
    setUploadResult(null);
    setError(null);
    setCvUrls('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (uploadResult?.success) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">Upload Successful</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {uploadResult.data?.uploadedCount} candidates uploaded successfully
                  {uploadResult.data?.failedCount ? ` (${uploadResult.data.failedCount} failed)` : ''}
                </p>
                {uploadResult.data?.errors && uploadResult.data.errors.length > 0 && (
                  <div className="bg-muted/50 rounded p-3 mb-3">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Errors:</p>
                    <ul className="text-xs text-destructive space-y-1">
                      {uploadResult.data.errors.slice(0, 5).map((err, i) => (
                        <li key={i}>
                          Row {err.row}: {err.error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <Button
              onClick={handleReset}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Upload Another File
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Bulk Upload Candidates</CardTitle>
        <CardDescription className="text-muted-foreground">
          Import multiple candidates using files, URLs, or manual entry
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="csv" className="gap-2">
              <FileIcon className="h-4 w-4" />
              <span className="hidden sm:inline">File Upload</span>
            </TabsTrigger>
            <TabsTrigger value="urls" className="gap-2">
              <LinkIcon className="h-4 w-4" />
              <span className="hidden sm:inline">CV URLs</span>
            </TabsTrigger>
            <TabsTrigger value="info" className="gap-2">
              <Grid3x3 className="h-4 w-4" />
              <span className="hidden sm:inline">Column Map</span>
            </TabsTrigger>
          </TabsList>

          {/* File Upload Tab */}
          <TabsContent value="csv" className="space-y-4">
            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm flex items-start gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <div
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                isDragging
                  ? 'border-accent bg-accent/10'
                  : file
                  ? 'border-green-500/30 bg-green-500/10'
                  : 'border-border hover:border-accent/50'
              }`}
              onClick={() => !isUploading && fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.json,.pdf,.zip,.xls,.xlsx"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isUploading}
              />

              {file ? (
                <div className="space-y-3">
                  <FileText className="h-8 w-8 text-accent mx-auto" />
                  <div>
                    <p className="font-medium text-foreground">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-8 w-8 text-accent mx-auto" />
                  <div>
                    <p className="font-medium text-foreground">Drop your file here or click</p>
                    <p className="text-sm text-muted-foreground">
                      CSV, JSON, Excel, PDF, or ZIP (max 50MB)
                    </p>
                  </div>
                </div>
              )}
            </div>

            {!file && (
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm font-medium text-foreground mb-3">Expected CSV Format:</p>
                <code className="text-xs text-muted-foreground block whitespace-pre-wrap bg-background p-3 rounded border border-border overflow-x-auto">
{`firstName,lastName,email,phone,location,skills,yearsExperience,currentRole,cvUrl
John,Doe,john@example.com,+1234567890,Kigali,"JavaScript,React,Node.js",5,Senior Engineer,https://example.com/john-cv.pdf
Jane,Smith,jane@example.com,+9876543210,Kampala,"Python,Django,PostgreSQL",7,Tech Lead,https://example.com/jane-cv.pdf`}
                </code>
              </div>
            )}

            {isUploading && uploadProgress > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Uploading...</span>
                  <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={handleUpload}
                disabled={!file || isUploading}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground gap-2 disabled:opacity-50"
              >
                {isUploading && <Loader2 className="h-4 w-4 animate-spin" />}
                {isUploading ? 'Uploading...' : 'Upload File'}
              </Button>

              {file && !isUploading && (
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="border-border text-foreground hover:bg-muted"
                >
                  Clear
                </Button>
              )}
            </div>
          </TabsContent>

          {/* URL Input Tab */}
          <TabsContent value="urls" className="space-y-4">
            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm flex items-start gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <div>
              <Label htmlFor="cvUrls" className="text-foreground font-medium mb-2 block">
                CV URLs (One per line)
              </Label>
              <Textarea
                id="cvUrls"
                placeholder={`https://example.com/cv1.pdf\nhttps://drive.google.com/file/d/...\nhttps://dropbox.com/s/...`}
                value={cvUrls}
                onChange={(e) => setCvUrls(e.target.value)}
                disabled={isProcessingUrls}
                className="min-h-48 bg-muted border-border text-foreground placeholder-muted-foreground"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Supports: Google Drive, Dropbox, Direct PDF links
              </p>
            </div>

            {isProcessingUrls && uploadProgress > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Processing...</span>
                  <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            <Button
              onClick={handleProcessUrls}
              disabled={!cvUrls.trim() || isProcessingUrls}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            >
              {isProcessingUrls && <Loader2 className="h-4 w-4 animate-spin" />}
              {isProcessingUrls ? 'Processing URLs...' : 'Process CV URLs'}
            </Button>
          </TabsContent>

          {/* Column Mapping Info Tab */}
          <TabsContent value="info" className="space-y-4">
            <div className="space-y-4">
              <div className="bg-muted/30 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-3">CSV Column Reference</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-foreground">Required Columns:</p>
                    <ul className="text-muted-foreground mt-1 space-y-1 list-disc list-inside">
                      <li>firstName - Candidate&apos;s first name</li>
                      <li>lastName - Candidate&apos;s last name</li>
                      <li>email - Email address</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Optional Columns:</p>
                    <ul className="text-muted-foreground mt-1 space-y-1 list-disc list-inside">
                      <li>phone - Phone number</li>
                      <li>location - City/Location (e.g., Kigali, Kampala)</li>
                      <li>skills - Comma-separated skills</li>
                      <li>yearsExperience - Number of years</li>
                      <li>currentRole - Job title</li>
                      <li>currentCompany - Company name</li>
                      <li>cvUrl - Direct link to CV/PDF</li>
                      <li>linkedinUrl - LinkedIn profile URL</li>
                      <li>githubUrl - GitHub profile URL</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-3">Excel/ZIP Upload</h3>
                <p className="text-sm text-muted-foreground">
                  <strong>Excel Files:</strong> Upload .xls or .xlsx files with candidate data in columns matching the CSV format.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  <strong>ZIP Files:</strong> Upload a ZIP containing individual PDF CVs. The system will extract and process each PDF separately.
                </p>
              </div>

              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-3">Rwanda Focus</h3>
                <p className="text-sm text-muted-foreground">
                  The system defaults to Rwanda-based candidates. You can add location information to identify candidates from Rwanda, Uganda, Kenya, and other regions.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
