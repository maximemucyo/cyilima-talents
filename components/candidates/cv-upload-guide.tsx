import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, FileText, Link as LinkIcon, Upload } from 'lucide-react';

export function CVUploadGuide() {
  return (
    <div className="space-y-4">
      {/* File Upload Methods */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground text-lg flex items-center gap-2">
            <Upload className="h-5 w-5 text-accent" />
            Supported CV Upload Methods
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Method 1: CSV/Excel */}
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              CSV / Excel Files
            </h4>
            <p className="text-sm text-muted-foreground">
              Upload a spreadsheet with candidate details. Include a <code className="bg-muted px-1 rounded text-xs">cvUrl</code> column with links to PDFs.
            </p>
            <div className="bg-muted/30 rounded p-3 text-xs text-muted-foreground overflow-x-auto">
              <code>{`firstName,lastName,email,location,cvUrl
Joseph,Kagame,joseph@example.rw,Kigali,https://drive.google.com/file/d/1...
Marie,Habimana,marie@example.rw,Kigali,https://example.com/marie-cv.pdf`}</code>
            </div>
          </div>

          {/* Method 2: ZIP Files */}
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-accent" />
              ZIP Files
            </h4>
            <p className="text-sm text-muted-foreground">
              Bundle multiple CVs in a ZIP file. The system will extract and process each PDF separately.
            </p>
          </div>

          {/* Method 3: Direct URLs */}
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <LinkIcon className="h-4 w-4 text-secondary" />
              Direct CV URLs
            </h4>
            <p className="text-sm text-muted-foreground">
              Paste CV URLs one per line. Supports Google Drive, Dropbox, and direct PDF links.
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Google Drive: <code className="bg-muted px-1 rounded text-xs">https://drive.google.com/file/d/1ABC.../view</code></li>
              <li>Dropbox: <code className="bg-muted px-1 rounded text-xs">https://www.dropbox.com/s/abc123/cv.pdf</code></li>
              <li>Direct: <code className="bg-muted px-1 rounded text-xs">https://example.com/cv.pdf</code></li>
            </ul>
          </div>

          {/* Method 4: Individual PDF Upload */}
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-green-500" />
              Individual CVs
            </h4>
            <p className="text-sm text-muted-foreground">
              Upload single PDF files or add candidate details manually with CV URL links.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Rwanda-Focused Guidance */}
      <Card className="bg-card border-border border-accent/30 bg-accent/5">
        <CardHeader>
          <CardTitle className="text-foreground text-lg flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-accent" />
            Rwanda Recruitment Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            <span className="font-semibold text-foreground">Default Focus:</span> The system defaults to Rwanda-based candidates. You can mark candidates as Rwanda-based for better prioritization.
          </p>
          <p>
            <span className="font-semibold text-foreground">Location Fields:</span> Include common Rwanda cities in your data: Kigali, Gisenyi, Butare, Muhanga, Musanze, etc.
          </p>
          <p>
            <span className="font-semibold text-foreground">International Candidates:</span> The system also accepts applications from Uganda, Kenya, Tanzania, and other countries.
          </p>
          <p>
            <span className="font-semibold text-foreground">Contact Information:</span> Include country codes for phone numbers (e.g., +250 for Rwanda, +256 for Uganda).
          </p>
        </CardContent>
      </Card>

      {/* Column Reference */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground text-lg">CSV Column Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="font-semibold text-foreground text-sm mb-2 flex items-center gap-2">
                <span className="text-destructive">*</span> Required Columns
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li><code className="bg-muted px-1 rounded text-xs">firstName</code> - Candidate&apos;s first name</li>
                <li><code className="bg-muted px-1 rounded text-xs">lastName</code> - Candidate&apos;s last name</li>
                <li><code className="bg-muted px-1 rounded text-xs">email</code> - Email address</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-foreground text-sm mb-2">Optional Columns</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li><code className="bg-muted px-1 rounded text-xs">phone</code> - Phone number (with country code)</li>
                <li><code className="bg-muted px-1 rounded text-xs">location</code> - City/Region (e.g., Kigali, Gisenyi)</li>
                <li><code className="bg-muted px-1 rounded text-xs">skills</code> - Comma-separated skills (e.g., &quot;Python,Django,React&quot;)</li>
                <li><code className="bg-muted px-1 rounded text-xs">yearsExperience</code> - Years of work experience (number)</li>
                <li><code className="bg-muted px-1 rounded text-xs">currentRole</code> - Current job title</li>
                <li><code className="bg-muted px-1 rounded text-xs">currentCompany</code> - Current employer</li>
                <li><code className="bg-muted px-1 rounded text-xs">cvUrl</code> - Direct link to CV/PDF</li>
                <li><code className="bg-muted px-1 rounded text-xs">linkedinUrl</code> - LinkedIn profile URL</li>
                <li><code className="bg-muted px-1 rounded text-xs">githubUrl</code> - GitHub profile URL</li>
              </ul>
            </div>

            <div className="bg-muted/30 rounded p-3 border border-border">
              <p className="font-semibold text-foreground text-xs mb-2">Example CSV Row:</p>
              <code className="text-xs text-muted-foreground block whitespace-pre-wrap">{`Yves,Semahago,yves@example.rw,+250788123456,Kigali,"JavaScript,React,Node.js",5,Senior Developer,Tech Solutions,https://drive.google.com/file/d/1ABC.../view,https://linkedin.com/in/yves,https://github.com/yves`}</code>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground text-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Tips for Best Results
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <ul className="list-disc list-inside space-y-1">
            <li>Keep CSV file sizes under 50MB</li>
            <li>Ensure email addresses are valid and unique</li>
            <li>Use consistent location naming (standardize city names)</li>
            <li>Provide at least 3 skills per candidate for better matching</li>
            <li>Include CVUrl for AI-powered resume screening</li>
            <li>Verify URLs are publicly accessible and direct download links</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
