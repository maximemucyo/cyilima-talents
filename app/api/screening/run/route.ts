import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Screening from '@/lib/models/Screening';
import Job from '@/lib/models/Job';
import Candidate from '@/lib/models/Candidate';
import { screenCandidates } from '@/lib/services/ai-service';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { jobId, applicantIds, preferredModel } = await request.json();

    if (!jobId || !applicantIds || !applicantIds.length) {
      return NextResponse.json({ success: false, error: 'jobId and applicantIds are required' }, { status: 400 });
    }

    // Initialize screening record
    const screening = await Screening.create({
      jobId,
      applicantIds,
      status: 'in-progress'
    });

    const job = await Job.findById(jobId);
    const candidates = await Candidate.find({ _id: { $in: applicantIds } });

    if (!job) {
        throw new Error("Job not found");
    }

    // Call Gemini API
    const evaluations = await screenCandidates(job, candidates, preferredModel);

    // Save Results
    screening.results = evaluations;
    screening.status = 'completed';
    await screening.save();

    return NextResponse.json({ success: true, data: screening }, { status: 201 });
  } catch (error: any) {
    console.error('Screening Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
