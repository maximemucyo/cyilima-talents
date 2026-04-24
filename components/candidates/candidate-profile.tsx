'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Link as LinkIcon,
  Download,
  Share2,
  Edit,
} from 'lucide-react';
import Link from 'next/link';

interface CandidateProfileProps {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location?: string;
  summary?: string;
  currentRole?: string;
  currentCompany?: string;
  yearsExperience?: number;
  skills: string[];
  languages?: string[];
  education?: Array<{ school: string; degree: string; field: string }>;
  experience?: Array<{ company: string; position: string; startDate?: string; endDate?: string }>;
  portfolioUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  createdAt?: string;
  onEdit?: () => void;
}

export function CandidateProfile({
  id,
  firstName,
  lastName,
  email,
  phone,
  location,
  summary,
  currentRole,
  currentCompany,
  yearsExperience,
  skills,
  languages,
  education,
  experience,
  portfolioUrl,
  linkedinUrl,
  githubUrl,
  onEdit,
}: CandidateProfileProps) {
  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-baseline gap-3 mb-2">
                <h1 className="text-4xl font-bold text-foreground">
                  {firstName} {lastName}
                </h1>
                {currentRole && (
                  <Badge className="bg-accent/10 text-accent border-0">
                    {currentRole}
                  </Badge>
                )}
              </div>
              {currentCompany && (
                <p className="text-lg text-muted-foreground">{currentCompany}</p>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-border text-foreground hover:bg-muted gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button
                variant="outline"
                className="border-border text-foreground hover:bg-muted gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
              {onEdit && (
                <Button
                  onClick={onEdit}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              )}
            </div>
          </div>

          {summary && (
            <p className="text-muted-foreground mb-4">{summary}</p>
          )}

          {/* Contact Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-accent" />
              <a href={`mailto:${email}`} className="text-accent hover:underline">
                {email}
              </a>
            </div>
            {phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-accent" />
                <a href={`tel:${phone}`} className="text-accent hover:underline">
                  {phone}
                </a>
              </div>
            )}
            {location && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {location}
              </div>
            )}
            {yearsExperience && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Briefcase className="h-4 w-4" />
                {yearsExperience} years exp.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary Section */}
      {summary && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Professional Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{summary}</p>
          </CardContent>
        </Card>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Experience */}
          {experience && experience.length > 0 && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-accent" />
                  Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {experience.map((exp, i) => (
                  <div
                    key={i}
                    className={i !== experience.length - 1 ? 'pb-6 border-b border-border' : ''}
                  >
                    <h4 className="font-semibold text-foreground mb-1">
                      {exp.position}
                    </h4>
                    <p className="text-sm text-accent mb-2">{exp.company}</p>
                    {(exp.startDate || exp.endDate) && (
                      <p className="text-xs text-muted-foreground">
                        {exp.startDate} {exp.endDate ? `- ${exp.endDate}` : '- Present'}
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-accent" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {education.map((edu, i) => (
                  <div
                    key={i}
                    className={i !== education.length - 1 ? 'pb-4 border-b border-border' : ''}
                  >
                    <h4 className="font-semibold text-foreground">{edu.degree}</h4>
                    <p className="text-sm text-muted-foreground">{edu.field}</p>
                    <p className="text-xs text-muted-foreground">{edu.school}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Skills */}
          {skills && skills.length > 0 && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground text-base">Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skills?.map((skill: any, i) => (
                    <Badge key={i} className="bg-accent/10 text-accent border-0">
                      {typeof skill === 'string' ? skill : skill.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground text-base">Languages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {languages?.map((lang: any, i) => (
                    <div key={i} className="text-sm text-muted-foreground">
                      {typeof lang === 'string' ? lang : `${lang.name} - ${lang.proficiency}`}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Links */}
          {(portfolioUrl || linkedinUrl || githubUrl) && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground text-base">Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {portfolioUrl && (
                  <a
                    href={portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-accent hover:underline text-sm"
                  >
                    <LinkIcon className="h-4 w-4" />
                    Portfolio
                  </a>
                )}
                {linkedinUrl && (
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-accent hover:underline text-sm"
                  >
                    <LinkIcon className="h-4 w-4" />
                    LinkedIn
                  </a>
                )}
                {githubUrl && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-accent hover:underline text-sm"
                  >
                    <LinkIcon className="h-4 w-4" />
                    GitHub
                  </a>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
