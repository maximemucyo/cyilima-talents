import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Candidate from '@/lib/models/Candidate';
import { parseResumeToProfile } from '@/lib/services/ai-service';
import { extractTextFromPDF } from '@/lib/utils/pdf-utils';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const formData = await request.formData();
    const files = formData.getAll('file') as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, error: 'No files uploaded' }, { status: 400 });
    }

    const results = await Promise.all(files.map(async (file) => {
      try {
        let parsedText = '';
        
        if (file.type === 'application/pdf') {
           const buffer = Buffer.from(await file.arrayBuffer());
           parsedText = await extractTextFromPDF(buffer);
        } else {
           parsedText = await file.text();
        }

        // 1) Process text through Gemini LLM to map to structured Schema
        const profile = await parseResumeToProfile(parsedText);
        
        // 2) Save to DB
        const candidateData = {
            ...profile,
            cvText: parsedText,
            cvUrl: file.name
        };
        
        return await Candidate.create(candidateData);
      } catch (err) {
        console.error(`Error processing file ${file.name}:`, err);
        return null;
      }
    }));

    const successfulCandidates = results.filter(c => c !== null);
    
    return NextResponse.json({ 
        success: true, 
        data: { 
            inserted: successfulCandidates.length, 
            candidates: successfulCandidates 
        } 
    }, { status: 201 });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
