'use client';

import { useParams, useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/main-layout';
import { CandidateProfile } from '@/components/candidates/candidate-profile';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Mock candidate data - would be fetched from API
const mockCandidate = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  country: 'USA',
  summary:
    'Experienced full-stack software engineer with 7+ years of expertise in building scalable web applications using modern JavaScript frameworks. Strong background in cloud architecture, DevOps practices, and leading cross-functional teams.',
  currentRole: 'Senior Software Engineer',
  currentCompany: 'Tech Company Inc',
  yearsExperience: 7,
  skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Python', 'AWS', 'Docker', 'PostgreSQL'],
  languages: ['English', 'Spanish', 'Mandarin'],
  education: [
    {
      school: 'Stanford University',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startYear: 2015,
      endYear: 2019,
    },
    {
      school: 'Coursera',
      degree: 'Professional Certificate',
      field: 'Machine Learning',
      startYear: 2020,
      endYear: 2021,
    },
  ],
  experience: [
    {
      company: 'Tech Company Inc',
      position: 'Senior Software Engineer',
      description: 'Lead full-stack development of customer-facing applications',
      startDate: 'Jan 2021',
      endDate: 'Present',
      currentlyWorking: true,
    },
    {
      company: 'StartUp Co',
      position: 'Full Stack Developer',
      description: 'Built and maintained multiple SaaS applications',
      startDate: 'Jun 2019',
      endDate: 'Dec 2020',
    },
    {
      company: 'Digital Agency',
      position: 'Junior Developer',
      description: 'Developed web applications for various clients',
      startDate: 'May 2017',
      endDate: 'May 2019',
    },
  ],
  portfolioUrl: 'https://johndoe.dev',
  linkedinUrl: 'https://linkedin.com/in/johndoe',
  githubUrl: 'https://github.com/johndoe',
  createdAt: '2024-03-15',
};

import { useState, useEffect } from 'react';

export default function CandidateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const candidateId = params.id as string;
  const [candidate, setCandidate] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCandidate() {
      try {
        const res = await fetch(`/api/candidates/${candidateId}`);
        const data = await res.json();
        if (data.success) {
          setCandidate(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch candidate:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCandidate();
  }, [candidateId]);

  const handleEdit = () => {
    router.push(`/candidates/${candidateId}/edit`);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="p-6 flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  if (!candidate) {
    return (
      <MainLayout>
        <div className="p-6 text-center">
          <p className="text-muted-foreground">Candidate not found</p>
          <Link href="/candidates" className="text-primary hover:underline mt-4 block">
            Back to Candidates
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Back Button */}
        <Link href="/candidates">
          <Button
            variant="ghost"
            className="text-accent hover:text-accent/80 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Candidates
          </Button>
        </Link>

        {/* Profile */}
        <CandidateProfile {...candidate} id={candidate._id} onEdit={handleEdit} />
      </div>
    </MainLayout>
  );
}
