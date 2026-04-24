import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Candidate from '@/lib/models/Candidate';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { urls } = await request.json();

    if (!urls || urls.length === 0) {
      return NextResponse.json({ success: false, error: 'URLs are required' }, { status: 400 });
    }

    // MVP dummy mapping for URL uploads - In production, this would fetch from URL, parse PDF, and send to Gemini.
    const newCandidates = await Promise.all(urls.map(async (url: string) => {
        return await Candidate.create({
            firstName: "Imported",
            lastName: "From URL",
            email: `imported-${Date.now()}@example.com`,
            cvUrl: url,
            skills: [],
        });
    }));

    return NextResponse.json({ success: true, data: { inserted: newCandidates.length, candidates: newCandidates } }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
