import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Job from '@/lib/models/Job';
import Candidate from '@/lib/models/Candidate';
import Screening from '@/lib/models/Screening';

export async function GET() {
  try {
    await dbConnect();
    
    const [jobs, candidates, screenings] = await Promise.all([
      Job.countDocuments({ isDeleted: { $ne: true } }),
      Candidate.countDocuments({ isDeleted: { $ne: true } }),
      Screening.countDocuments({ isDeleted: { $ne: true } }),
    ]);

    const shortlists = await Screening.countDocuments({ 
        status: 'completed',
        isDeleted: { $ne: true }
    });

    return NextResponse.json({
      success: true,
      data: {
        jobs,
        candidates,
        screenings,
        shortlists
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
