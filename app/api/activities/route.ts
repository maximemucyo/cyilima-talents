import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import dbConnect from '@/lib/db';
import Job from '@/lib/models/Job';
import Candidate from '@/lib/models/Candidate';
import Screening from '@/lib/models/Screening';

export async function GET() {
  try {
    await dbConnect();

    // Fetch latest 5 of each type
    const [jobs, candidates, screenings] = await Promise.all([
      Job.find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 }).limit(5),
      Candidate.find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 }).limit(5),
      Screening.find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 }).limit(5).populate('jobId')
    ]);

    const activities: any[] = [];

    // Map Jobs
    jobs.forEach(j => {
      activities.push({
        id: `job-${j._id}`,
        title: 'New Job Posted',
        description: `${j.title} - ${j.location || 'Remote'}`,
        timestamp: j.createdAt,
        type: 'job',
        date: new Date(j.createdAt)
      });
    });

    // Map Candidates
    candidates.forEach(c => {
      activities.push({
        id: `cand-${c._id}`,
        title: 'Candidate Added',
        description: `${c.firstName} ${c.lastName} added to candidate pool`,
        timestamp: c.createdAt,
        type: 'candidate',
        date: new Date(c.createdAt)
      });
    });

    // Map Screenings
    screenings.forEach(s => {
      activities.push({
        id: `screen-${s._id}`,
        title: 'Screening Completed',
        description: `AI screening completed for ${(s.jobId as any)?.title || 'Job'}`,
        timestamp: s.completedAt || s.createdAt,
        type: 'screening',
        date: new Date(s.completedAt || s.createdAt)
      });
    });

    // Sort all by date descending and take top 5
    const sorted = activities
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5);

    return NextResponse.json({ success: true, data: sorted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
