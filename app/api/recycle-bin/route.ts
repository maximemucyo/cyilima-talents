import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import dbConnect from '@/lib/db';
import Job from '@/lib/models/Job';
import Candidate from '@/lib/models/Candidate';
import Screening from '@/lib/models/Screening';
import User from '@/lib/models/User';

export async function GET() {
  try {
    await dbConnect();

    const [jobs, candidates, screenings, users] = await Promise.all([
      Job.find({ isDeleted: true }).sort({ deletedAt: -1 }),
      Candidate.find({ isDeleted: true }).sort({ deletedAt: -1 }),
      Screening.find({ isDeleted: true }).populate('jobId').sort({ deletedAt: -1 }),
      User.find({ isDeleted: true }).sort({ deletedAt: -1 }),
    ]);

    const results = [
      ...jobs.map(j => ({ id: j._id.toString(), type: 'job', name: j.title, deletedAt: j.deletedAt })),
      ...candidates.map(c => ({ id: c._id.toString(), type: 'candidate', name: `${c.firstName} ${c.lastName}`, deletedAt: c.deletedAt })),
      ...screenings.map(s => ({ id: s._id.toString(), type: 'screening', name: `Screening for ${(s.jobId as any)?.title || 'Unknown Job'}`, deletedAt: s.deletedAt })),
      ...users.map(u => ({ id: u._id.toString(), type: 'user', name: u.name, deletedAt: u.deletedAt })),
    ].sort((a, b) => new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime());

    return NextResponse.json({ success: true, data: results });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
    // Restore logic
    try {
        await dbConnect();
        const { id, type } = await request.json();
        
        let model;
        switch (type) {
            case 'job': model = Job; break;
            case 'candidate': model = Candidate; break;
            case 'screening': model = Screening; break;
            case 'user': model = User; break;
            default: return NextResponse.json({ success: false, error: 'Invalid type' }, { status: 400 });
        }

        const item = await model.findByIdAndUpdate(id, { isDeleted: false, deletedAt: null }, { new: true });
        if (!item) return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });

        return NextResponse.json({ success: true, message: 'Item restored successfully' });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    // Permanent delete logic
    try {
        await dbConnect();
        const { id, type } = await request.json();
        
        let model;
        switch (type) {
            case 'job': model = Job; break;
            case 'candidate': model = Candidate; break;
            case 'screening': model = Screening; break;
            case 'user': model = User; break;
            default: return NextResponse.json({ success: false, error: 'Invalid type' }, { status: 400 });
        }

        const item = await model.findByIdAndDelete(id);
        if (!item) return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });

        return NextResponse.json({ success: true, message: 'Item permanently deleted' });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
