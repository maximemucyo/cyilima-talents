import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Candidate from '@/lib/models/Candidate';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { mappedData } = await request.json();

    if (!mappedData || !mappedData.length) {
      return NextResponse.json({ success: false, error: 'Data is required' }, { status: 400 });
    }

    // Direct insertion bypassing Gemini since the frontend CSV mapper structured it
    const candidates = await Candidate.insertMany(mappedData);

    return NextResponse.json({ success: true, data: { inserted: candidates.length, candidates } }, { status: 201 });
  } catch (error: any) {
    console.error('CSV Mapping Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
