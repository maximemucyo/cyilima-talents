import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Candidate from '@/lib/models/Candidate';
import { parseResumeToProfile } from '@/lib/services/ai-service';


export async function POST(request: Request) {
  try {
    await dbConnect();
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    let parsedText = '';
    
    if (file.type === 'application/pdf') {
       const buffer = Buffer.from(await file.arrayBuffer());
       const pdf = (await import('pdf-parse')).default;
       const pdfData = await pdf(buffer);
       parsedText = pdfData.text;
    } else {
       parsedText = await file.text();
       // If CSV/JSON and too large, we might just bypass Gemini, but for hackathon MVP we let AI extract it.
    }

    // 1) Process text through Gemini LLM to map to structured Schema
    const profile = await parseResumeToProfile(parsedText);
    
    // 2) Save to DB
    const candidateData = {
        ...profile,
        cvText: parsedText,
        cvUrl: file.name
    };
    
    const candidate = await Candidate.create(candidateData);
    
    return NextResponse.json({ success: true, data: { inserted: 1, candidates: [candidate] } }, { status: 201 });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
