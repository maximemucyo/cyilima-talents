import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import dbConnect from '@/lib/db';
import Candidate from '@/lib/models/Candidate';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    
    const filter: any = { isDeleted: { $ne: true } };
    if (searchParams.get('location') === 'Rwanda' || searchParams.get('country') === 'RW') {
      filter.$or = [
          { isRwandaBased: true },
          { country: 'Rwanda' },
          { country: 'RW' },
          { location: { $regex: /rwanda|kigali/i } }
      ];
    }
    
    // For general text search in the dashboard
    if (searchParams.get('search')) {
        const srch = searchParams.get('search');
        filter.$or = [
            { firstName: { $regex: srch, $options: 'i' } },
            { lastName: { $regex: srch, $options: 'i' } },
            { email: { $regex: srch, $options: 'i' } },
        ]
    }
    
    const candidates = await Candidate.find(filter).sort({ createdAt: -1 });
    
    // Remap _id to id so standard frontend types match if necessary
    const mapped = candidates.map(c => ({
      ...c.toObject(),
      id: c._id.toString()
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
    const candidate = await Candidate.create(body);
    return NextResponse.json({ success: true, data: candidate }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
