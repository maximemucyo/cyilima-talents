import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Screening from '@/lib/models/Screening';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const screening = await Screening.findById(params.id).populate('jobId');
    if (!screening) {
      return NextResponse.json({ error: 'Screening not found' }, { status: 404 });
    }
    
    // Map to UI structure
    const mapped = {
      id: screening._id,
      jobTitle: (screening.jobId as any)?.title || 'Unknown Job',
      results: screening.results.map((r: any) => ({
        id: r.candidateId,
        candidateName: r.candidateName,
        candidateEmail: '', // Usually hidden or fetched separately
        matchScore: r.score,
        recommendation: r.recommendation,
        strengths: r.strengths,
        gaps: r.gaps,
        reasoning: r.reasoning,
        aiModel: 'Gemini 1.5 Pro',
      }))
    };

    return NextResponse.json({ success: true, data: mapped });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
