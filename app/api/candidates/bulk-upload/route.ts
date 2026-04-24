import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Candidate from '@/lib/models/Candidate';
import { parseResumeToProfile } from '@/lib/services/ai-service';
import * as pdfParse from 'pdf-parse';
import path from 'path';
import { pathToFileURL } from 'url';

const { PDFParse } = pdfParse;

// Set the worker for pdfjs-dist using a local file URL
const workerPath = path.resolve('node_modules/pdfjs-dist/build/pdf.worker.mjs');
PDFParse.setWorker(pathToFileURL(workerPath).toString());

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
       const parser = new PDFParse({ data: buffer });
       const pdfData = await parser.getText();
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
