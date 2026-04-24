import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import Job from '@/lib/models/Job';
import Candidate from '@/lib/models/Candidate';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    await dbConnect();

    // 1. Clear existing data (Optional, but good for clean seed)
    await User.deleteMany({ email: { $ne: 'admin@umurava.rw' } });
    await Job.deleteMany({});
    await Candidate.deleteMany({});

    // 2. Create Admin if not exists
    const hashedPassword = await bcrypt.hash('Admin@2026', 10);
    const admin = await User.findOneAndUpdate(
      { email: 'admin@umurava.rw' },
      { 
        name: 'Umurava Admin',
        password: hashedPassword,
        role: 'admin'
      },
      { upsert: true, new: true }
    );

    // 3. Realistic Rwandan Jobs (April 2026)
    const jobs = await Job.insertMany([
      {
        title: "Senior Full Stack Developer",
        description: "Join Kigali's fastest growing fintech. Responsible for building scalable microservices and mentoring junior devs.",
        department: "Engineering",
        location: "Kigali, Rwanda",
        isRwandaFocused: true,
        acceptInternational: false,
        employmentType: 'full-time',
        seniority: 'senior',
        requiredSkills: ["Next.js", "TypeScript", "Node.js", "MongoDB"],
        salaryMin: 2500000,
        salaryMax: 4000000,
        currency: "RWF",
        deadline: "2026-05-15"
      },
      {
        title: "Agricultural Data Analyst",
        description: "Analyze crop yields and weather data to support Rwandan farmers in the Eastern Province.",
        department: "Data",
        location: "Muhanga, Rwanda",
        isRwandaFocused: true,
        acceptInternational: true,
        employmentType: 'contract',
        seniority: 'mid',
        requiredSkills: ["Python", "SQL", "Pandas", "Tableau"],
        salaryMin: 1500000,
        salaryMax: 2200000,
        currency: "RWF",
        deadline: "2026-04-30"
      },
      {
          title: "AI Specialist",
          description: "Help integrate Kinyarwanda LLMs into government service portals.",
          department: "AI Research",
          location: "Kigali (Innovation City)",
          isRwandaFocused: true,
          acceptInternational: true,
          employmentType: 'full-time',
          seniority: 'lead',
          requiredSkills: ["NLP", "PyTorch", "HuggingFace", "Python"],
          salaryMin: 5000,
          salaryMax: 8000,
          currency: "USD",
          deadline: "2026-06-01"
      }
    ]);

    // 4. Realistic Rwandan Candidates
    const candidates = await Candidate.insertMany([
      {
        firstName: "Jean Bosco",
        lastName: "Mutabazi",
        email: "bosco.mutabazi@gmail.com",
        headline: "Software Engineer | Backend Specialist",
        bio: "Passionate developer with 5 years experience in building high-performance systems in Kigali.",
        location: "Kigali, Rwanda",
        country: "Rwanda",
        isRwandaBased: true,
        skills: ["Node.js", "Express", "PostgreSQL", "React"],
        yearsExperience: 5,
        currentRole: "Backend Engineer",
        currentCompany: "Irembo",
      },
      {
        firstName: "Marie Claire",
        lastName: "Umuhoza",
        email: "marie.umuhoza@outlook.com",
        headline: "Frontend Architect | UI/UX Enthusiast",
        bio: "Designing the future of Rwandan digital services. Expert in React and Tailwind CSS.",
        location: "Gisenyi, Rwanda",
        country: "Rwanda",
        isRwandaBased: true,
        skills: ["React", "TypeScript", "Figma", "Tailwind CSS"],
        yearsExperience: 4,
        currentRole: "Senior Frontend Dev",
        currentCompany: "Kigali Tech Hub",
      },
      {
        firstName: "Eric",
        lastName: "Nshimiyimana",
        email: "eric.n@tech.com",
        headline: "Data Scientist in Training",
        bio: "Recent graduate from CMU-Africa. Exploring AI/ML applications for local agriculture.",
        location: "Kigali, Rwanda",
        country: "Rwanda",
        isRwandaBased: true,
        skills: ["Python", "Scikit-Learn", "FastAPI"],
        yearsExperience: 1,
        currentRole: "Intern",
        currentCompany: "CMU Africa",
      }
    ]);

    return NextResponse.json({ 
      success: true, 
      message: "Database seeded successfully with Rwandan data for April 2026",
      data: {
        adminEmail: 'admin@umurava.rw',
        jobsCount: jobs.length,
        candidatesCount: candidates.length
      } 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
