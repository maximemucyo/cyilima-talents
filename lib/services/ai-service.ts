import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MODELS = [
  "gemini-3.1-flash-lite-preview",
  "gemini-3-flash-preview",
  "gemini-2.5-flash-preview"
];

async function generateWithFallback(contents: string, preferredModel?: string) {
  const modelsToTry = preferredModel 
    ? [preferredModel, ...MODELS.filter(m => m !== preferredModel)]
    : MODELS;

  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      console.log(`Gemini: Attempting with model: ${model}`);
      const result = await ai.models.generateContent({
        model: model,
        contents: contents
      });
      return result;
    } catch (error: any) {
      lastError = error;
      // Check if it's a 503 error (Unavailable)
      const isUnavailable = error?.message?.includes('503') || error?.status === 'UNAVAILABLE' || error?.message?.includes('high demand');
      
      if (isUnavailable) {
        console.warn(`Gemini: Model ${model} is unavailable (high demand). Trying next fallback...`);
        continue;
      }
      
      // For other errors, rethrow immediately
      throw error;
    }
  }

  throw lastError;
}

/**
 * Intentional Prompt Engineering Strategy:
 * 1. Persona: HR Recruiter API (High precision)
 * 2. Format: Strict JSON Schema adherence
 * 3. Context: Limited text length to prevent LLM hallucination on very long PDFs
 */
export async function parseResumeToProfile(resumeText: string, preferredModel?: string) {
  const prompt = `You are an expert HR Recruiter specializing in data extraction.
TASK: Parse the following raw resume text into a structured JSON profile.
STRICTNESS: Follow the schema EXACTLY. If data is missing, use null or an empty array as appropriate.

SCHEMA SPECIFICATION:
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "headline": "Professional summary headline",
  "bio": "Brief professional bio",
  "location": "City, Country",
  "skills": [{"name": "string", "level": "Beginner|Intermediate|Advanced|Expert", "yearsOfExperience": number}],
  "languages": [{"name": "string", "proficiency": "Basic|Conversational|Fluent|Native"}],
  "experience": [{"company": "string", "position": "string", "startDate": "YYYY-MM", "endDate": "YYYY-MM|Present", "description": "string", "technologies": ["string"], "currentlyWorking": boolean}],
  "education": [{"school": "string", "degree": "string", "field": "string", "startYear": number, "endYear": number}],
  "certifications": [{"name": "string", "issuer": "string", "issueDate": "YYYY-MM"}],
  "projects": [{"name": "string", "description": "string", "technologies": ["string"], "link": "url"}],
  "availability": {"status": "Available|Open", "type": "Full-time|Part-time", "startDate": "YYYY-MM-DD"},
  "socialLinks": {"linkedin": "url", "github": "url", "portfolio": "url"}
}

INPUT DATA:
${resumeText.substring(0, 30000)}

Return ONLY valid JSON.
`;

  try {
    console.log(`Gemini: Parsing resume text (${resumeText.length} chars)`);
    const response = await generateWithFallback(prompt, preferredModel);
    let rawText = response.text || "{}";
    console.log(`Gemini: Received response (${rawText.length} chars)`);
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(rawText);
  } catch (error) {
    console.error("Gemini Parsing Error:", error);
    throw error;
  }
}

export async function screenCandidates(job: any, candidates: any[], preferredModel?: string) {
  const candidatesData = candidates.map(c => ({
    id: c._id ? c._id.toString() : c.id,
    name: `${c.firstName} ${c.lastName}`,
    skills: c.skills,
    experience: c.experience,
    education: c.education,
    cvText: c.cvText ? c.cvText.substring(0, 2000) : "No raw text",
  }));

  const prompt = `You are a high-level Technical Recruiter Assistant.
TASK: Evaluate multiple candidates against a specific job role and RANK them based on suitability.

SCORING CRITERIA (Weights):
1. Technical Skills (40%): How well do the candidate's skills match the Job's requiredSkills?
2. Experience (30%): Does the candidate have the necessary years and type of experience for the seniority level?
3. Education (15%): Is the education level and field relevant to the role?
4. Relevance & Potential (15%): Overall fit, potential, and career trajectory based on bio/cvText.

Job Context:
${JSON.stringify({ title: job.title, description: job.description, requiredSkills: job.requiredSkills, seniority: job.seniority })}

Candidates to Evaluate:
${JSON.stringify(candidatesData)}

REQUIRED OUTPUT FORMAT (JSON):
Return a JSON array of objects, sorted by 'matchScore' in descending order (Ranking).
Each object must have:
- candidateId: string (Exact ID provided)
- matchScore: integer (0-100 calculated using weights above)
- reasoning: string (Professional, concise recruiter-friendly explanation)
- strengths: string[] (Key highlights of the candidate)
- gaps: string[] (Missing skills or areas of concern)
- recommendedAction: enum ("shortlist" | "review" | "reject")

Rules:
- Be strict but fair.
- If a candidate is missing critical requiredSkills, their score should reflect that.
- Return ONLY the JSON array.
`;

  try {
    console.log(`Gemini: Screening ${candidates.length} candidates against job: ${job.title}`);
    const response = await generateWithFallback(prompt, preferredModel);
    let rawText = response.text || "[]";
    console.log(`Gemini: Received response (${rawText.length} chars)`);
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(rawText);
  } catch (error) {
    console.error("Gemini Screening Error:", error);
    throw error;
  }
}
