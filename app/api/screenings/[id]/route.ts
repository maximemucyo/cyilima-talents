import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Screening from '@/lib/models/Screening';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const screening = await Screening.findById(id)
      .populate('jobId')
      .populate('results.candidateId');
    if (!screening) {
      return NextResponse.json({ error: 'Screening not found' }, { status: 404 });
    }
    
    console.log('Mapping screening results for:', screening._id);
    
    // Map to UI structure
    const mapped = {
      id: screening._id,
      jobTitle: (screening.jobId as any)?.title || 'Unknown Job',
      results: screening.results.map((r: any) => {
        const candidate = r.candidateId;
        console.log(`Processing result for candidateId: ${r.candidateId?._id || r.candidateId}, Has populated object: ${!!(candidate && candidate.firstName)}, Saved Name: ${r.candidateName}`);
        
        // Use populated name, or fallback to saved name, or finally 'Unknown Candidate'
        let name = 'Unknown Candidate';
        if (candidate && typeof candidate === 'object' && candidate.firstName) {
          name = `${candidate.firstName} ${candidate.lastName}`;
        } else if (r.candidateName) {
          name = r.candidateName;
        }
          
        return {
          id: candidate?._id || r.candidateId,
          candidateName: name,
          candidateEmail: (candidate && typeof candidate === 'object') ? candidate.email : '', 
          matchScore: r.matchScore,
          recommendation: r.recommendedAction,
          strengths: r.strengths || [],
          gaps: r.gaps || [],
          reasoning: r.reasoning,
          aiModel: 'Gemini 3.1 Flash Lite',
        };
    })
    };

    return NextResponse.json({ success: true, data: mapped });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    console.log('DELETE Screening Attempt:', id);
    
    const screening = await Screening.findByIdAndUpdate(id, {
        isDeleted: true,
        deletedAt: new Date()
    }, { new: true });
    
    if (!screening) {
      console.error('Screening not found for deletion:', id);
      return NextResponse.json({ error: 'Screening not found' }, { status: 404 });
    }

    console.log('Screening soft-deleted successfully:', screening._id);
    return NextResponse.json({ success: true, message: 'Screening moved to recycle bin' });
  } catch (error: any) {
    console.error('DELETE Screening Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
