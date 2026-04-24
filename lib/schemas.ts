import { z } from 'zod';

// Job Posting Schemas
export const jobPostingSchema = z.object({
  title: z.string().min(3, 'Job title must be at least 3 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  department: z.string().min(1, 'Department is required'),
  location: z.string().min(1, 'Location is required'),
  isRwandaFocused: z.boolean().default(true),
  acceptInternational: z.boolean().default(true),
  employmentType: z.enum(['full-time', 'part-time', 'contract', 'temporary']),
  seniority: z.enum(['entry', 'mid', 'senior', 'lead']),
  requiredSkills: z.array(z.string().min(1)).min(1, 'At least one skill is required'),
  preferredSkills: z.array(z.string().min(1)).optional(),
  minExperience: z.number().min(0).optional(),
  maxExperience: z.number().min(0).optional(),
  salaryMin: z.number().min(0).optional(),
  salaryMax: z.number().min(0).optional(),
  currency: z.string().optional(),
  deadline: z.string().optional(),
});

export type JobPostingFormData = z.infer<typeof jobPostingSchema>;

// Talent Profile Schemas
export const educationSchema = z.object({
  school: z.string().min(1, 'School is required'),
  degree: z.string().min(1, 'Degree is required'),
  field: z.string().min(1, 'Field is required'),
  startYear: z.number().optional(),
  endYear: z.number().optional(),
});

export const experienceSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  position: z.string().min(1, 'Position is required'),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  currentlyWorking: z.boolean().optional(),
});

export const certificationSchema = z.object({
  name: z.string().min(1, 'Certification name is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  issueDate: z.string().optional(),
  expiryDate: z.string().optional(),
});

export const talentProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  location: z.string().optional(),
  country: z.string().optional(),
  isRwandaBased: z.boolean().optional(),
  summary: z.string().optional(),
  yearsExperience: z.number().min(0).optional(),
  currentRole: z.string().optional(),
  currentCompany: z.string().optional(),
  skills: z.array(z.string().min(1)).min(1, 'At least one skill is required'),
  languages: z.array(z.string()).optional(),
  education: z.array(educationSchema).optional(),
  experience: z.array(experienceSchema).optional(),
  certifications: z.array(certificationSchema).optional(),
  portfolioUrl: z.string().url().optional().or(z.literal('')),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  githubUrl: z.string().url().optional().or(z.literal('')),
  cvUrl: z.string().url().optional().or(z.literal('')),
});

export type TalentProfileFormData = z.infer<typeof talentProfileSchema>;

// Screening Request Schema
export const screeningRequestSchema = z.object({
  jobId: z.string().min(1, 'Job is required'),
  applicantIds: z.array(z.string()).min(1, 'At least one applicant is required'),
});

export type ScreeningRequestFormData = z.infer<typeof screeningRequestSchema>;

// Bulk Upload Schema
export const bulkUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 50 * 1024 * 1024, 'File size must be less than 50MB')
    .refine(
      (file) => [
        'text/csv',
        'application/json',
        'application/pdf',
        'application/zip',
        'application/x-zip-compressed',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ].includes(file.type),
      'Supported formats: CSV, JSON, PDF, ZIP, Excel (XLS/XLSX)'
    ),
});

export type BulkUploadFormData = z.infer<typeof bulkUploadSchema>;

// CSV Column Mapping Schema
export const csvColumnMappingSchema = z.object({
  firstName: z.string().min(1, 'First name column is required'),
  lastName: z.string().min(1, 'Last name column is required'),
  email: z.string().min(1, 'Email column is required'),
  phone: z.string().optional(),
  location: z.string().optional(),
  skills: z.string().optional(),
  experience: z.string().optional(),
  cvUrl: z.string().optional(),
  linkedinUrl: z.string().optional(),
  githubUrl: z.string().optional(),
});

export type CSVColumnMapping = z.infer<typeof csvColumnMappingSchema>;
