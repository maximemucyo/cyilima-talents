const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (!process.env.MONGODB_URI) {
    process.env.MONGODB_URI = "mongodb://localhost:27017/umurava-hackathon";
}

const dbConnect = require('../lib/db').default;
const Job = require('../lib/models/Job').default;
const Candidate = require('../lib/models/Candidate').default;
const User = require('../lib/models/User').default;
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    console.log('Connecting to database...');
    await dbConnect();

    console.log('Clearing existing data...');
    await Job.deleteMany({});
    await Candidate.deleteMany({});
    await User.deleteMany({ email: { $ne: 'admin@umurava.rw' } });

    console.log('Seeding jobs...');
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
        deadline: "2026-05-15",
        status: 'open',
        postedBy: 'Admin'
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
        deadline: "2026-04-30",
        status: 'open',
        postedBy: 'Admin'
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
          deadline: "2026-06-01",
          status: 'open',
          postedBy: 'Admin'
      }
    ]);

    console.log('Seeding candidates...');
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

    console.log('Ensuring admin user...');
    const hashedPassword = await bcrypt.hash('Admin@2026', 10);
    await User.findOneAndUpdate(
      { email: 'admin@umurava.rw' },
      { 
        name: 'Umurava Admin',
        password: hashedPassword,
        role: 'admin'
      },
      { upsert: true }
    );

    console.log('Seed completed successfully!');
    console.log(`- Jobs: ${jobs.length}`);
    console.log(`- Candidates: ${candidates.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seed();
