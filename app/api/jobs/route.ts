import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import dbConnect from '@/lib/db';
import Job from '@/lib/models/Job';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const filter: any = { isDeleted: { $ne: true } };
    if (searchParams.get('rwandaFocused') === 'true') {
        filter.isRwandaFocused = true;
    }

    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    const mappedJobs = jobs.map(j => ({
        ...j.toObject(),
        id: j._id.toString()
    }));
    return NextResponse.json({ success: true, data: mappedJobs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const job = await Job.create(body);
    return NextResponse.json({ success: true, data: job }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
