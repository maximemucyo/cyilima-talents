import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import dbConnect from '@/lib/db';
import Screening from '@/lib/models/Screening';
import Job from '@/lib/models/Job';
import Candidate from '@/lib/models/Candidate';
import { screenCandidates } from '@/lib/services/ai-service';

export async function GET() {
  try {
    await dbConnect();
    const screenings = await Screening.find({ isDeleted: { $ne: true } })
      .populate('jobId')
      .sort({ createdAt: -1 });
    
    // Map to the expected UI structure
    const mapped = screenings.map(s => ({
      id: s._id.toString(),
      jobTitle: (s.jobId as any)?.title || 'Unknown Job',
      candidateCount: s.results?.length || 0,
      status: s.status,
      progress: s.status === 'completed' ? 100 : 50,
      createdAt: s.createdAt,
      completedAt: s.completedAt,
    }));

    return NextResponse.json({ success: true, data: mapped });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { jobId, applicantIds } = body;

    if (!jobId || !applicantIds || applicantIds.length === 0) {
        return NextResponse.json({ success: false, error: 'Missing jobId or applicantIds' }, { status: 400 });
    }

    // 1) Fetch Job and Candidates
    const job = await Job.findById(jobId);
    if (!job) return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 });

    const candidates = await Candidate.find({ _id: { $in: applicantIds } });
    if (candidates.length === 0) return NextResponse.json({ success: false, error: 'No candidates found' }, { status: 404 });

    // 2) Run Gemini Screening
    const rawResults = await screenCandidates(job, candidates);

    // 3) Map Results to Schema
    const processedResults = rawResults.map((res: any) => {
        const candidate = candidates.find(c => c._id.toString() === res.candidateId);
        return {
            candidateId: res.candidateId,
            candidateName: candidate ? `${candidate.firstName} ${candidate.lastName}` : 'Candidate',
            matchScore: res.matchScore || 0,
            reasoning: res.reasoning || 'No reasoning provided',
            strengths: res.strengths || [],
            gaps: res.gaps || [],
            recommendedAction: res.recommendedAction || 'review'
        };
    });

    // 4) Save Screening
    const screening = await Screening.create({
        jobId,
        status: 'completed',
        results: processedResults,
        completedAt: new Date()
    });

    return NextResponse.json({ success: true, data: screening }, { status: 201 });
  } catch (error: any) {
    console.error('Screening API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
