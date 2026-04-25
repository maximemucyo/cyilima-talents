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
        
        if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
           const buffer = Buffer.from(await file.arrayBuffer());
           parsedText = await extractTextFromPDF(buffer);
        } else {
           parsedText = await file.text();
        }

        if (!parsedText || parsedText.trim().length === 0) {
            throw new Error('No text content extracted from file');
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
        return { success: true, candidate };
      } catch (err: any) {
        console.error(`Error processing file ${file.name}:`, err);
        return { success: false, fileName: file.name, error: err.message };
      }
    }));

    const successfulCandidates = results.filter(r => r.success).map(r => r.candidate);
    const failedFiles = results.filter(r => !r.success);
    
    return NextResponse.json({ 
        success: true, 
        data: { 
            inserted: successfulCandidates.length, 
            candidates: successfulCandidates,
            errors: failedFiles 
        } 
    }, { status: 201 });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
