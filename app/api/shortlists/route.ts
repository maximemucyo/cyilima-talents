import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Screening from '@/lib/models/Screening';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    // In our simplified model, we can treat "completed" screenings as shortlists
    const shortlists = await Screening.find({ 
        status: 'completed',
        isDeleted: { $ne: true }
    })
      .populate('jobId')
      .sort({ createdAt: -1 });
    
    const mapped = shortlists.map(s => ({
      id: s._id,
      jobTitle: (s.jobId as any)?.title || 'Unknown Job',
      candidateCount: s.results?.filter(r => r.recommendedAction === 'shortlist')?.length || 0,
      status: 'active', // Default to active for now
      createdAt: s.createdAt,
      interviewedCount: 0,
    }));

    return NextResponse.json({ success: true, data: mapped });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
