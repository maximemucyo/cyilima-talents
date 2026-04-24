// Talent Profile Schema - Based on specification
export interface TalentProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location?: string;
  country?: string;
  isRwandaBased?: boolean;
  summary?: string;
  yearsExperience?: number;
  currentRole?: string;
  currentCompany?: string;
  skills: string[];
  languages?: string[];
  education?: Education[];
  experience?: Experience[];
  certifications?: Certification[];
  portfolioUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  cvUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface Education {
  school: string;
  degree: string;
  field: string;
  startYear?: number;
  endYear?: number;
}

export interface Experience {
  company: string;
  position: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  currentlyWorking?: boolean;
}

export interface Certification {
  name: string;
  issuer: string;
  issueDate?: string;
  expiryDate?: string;
}

// Job Posting Schema
export interface JobPosting {
  id: string;
  title: string;
  description: string;
  department: string;
  location: string;
  isRwandaFocused: boolean;
  acceptInternational: boolean;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'temporary';
  seniority: 'entry' | 'mid' | 'senior' | 'lead';
  requiredSkills: string[];
  preferredSkills?: string[];
  minExperience?: number;
  maxExperience?: number;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  status: 'draft' | 'open' | 'closed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  postedBy: string;
  deadline?: string;
}

// Screening Request
export interface ScreeningRequest {
  id: string;
  jobId: string;
  jobTitle: string;
  applicantIds: string[];
  createdAt: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  createdBy: string;
}

// Screening Result
export interface ScreeningResult {
  id: string;
  screeningId: string;
  jobId: string;
  candidateId: string;
  matchScore: number; // 0-100
  reasoning: string;
  strengths: string[];
  gaps: string[];
  recommendedAction: 'shortlist' | 'review' | 'reject';
  aiModel: string;
  processedAt: string;
}

// Shortlist
export interface Shortlist {
  id: string;
  jobId: string;
  name: string;
  candidates: ShortlistCandidate[];
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'archived';
}

export interface ShortlistCandidate {
  candidateId: string;
  matchScore: number;
  status: 'pending' | 'interviewed' | 'offered' | 'rejected';
  notes?: string;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  error?: string;
}
