import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Candidate from '@/lib/models/Candidate';
import { parseResumeToProfile } from '@/lib/services/ai-service';
import { extractTextFromPDF } from '@/lib/utils/pdf-utils';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

function transformUrl(url: string): string {
    const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (driveMatch && driveMatch[1]) {
        return `https://drive.google.com/uc?export=download&id=${driveMatch[1]}`;
    }
    return url;
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const urls = body.urls || body.cvUrls || body.linkedinUrls;
    const preferredModel = body.preferredModel;

    if (!urls || urls.length === 0) {
      return NextResponse.json({ success: false, error: 'URLs are required' }, { status: 400 });
    }

    const results = await Promise.all(urls.map(async (url: string) => {
        try {
            const isLinkedIn = url.includes('linkedin.com');
            const downloadUrl = transformUrl(url);
            let parsedText = '';
            let profile: any = {
                firstName: "Imported",
                lastName: "From URL",
                email: `imported-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`,
                cvUrl: url,
                socialLinks: isLinkedIn ? { linkedin: url } : {}
            };

            if (!isLinkedIn) {
                console.log(`Fetching from: ${downloadUrl}`);
                const res = await fetch(downloadUrl, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                    }
                });
                
                if (res.ok) {
                    const contentType = res.headers.get('content-type');
                    const buffer = Buffer.from(await res.arrayBuffer());
                    
                    if (contentType?.includes('pdf') || url.toLowerCase().endsWith('.pdf')) {
                        parsedText = await extractTextFromPDF(buffer);
                    } else {
                        parsedText = buffer.toString('utf-8');
                    }
                } else {
                    throw new Error(`Failed to fetch URL: ${res.status} ${res.statusText}`);
                }
            } else {
                const parts = url.split('/').filter(Boolean);
                const lastPart = parts[parts.length - 1];
                if (lastPart) {
                    profile.firstName = lastPart.split('-')[0] || "LinkedIn";
                    profile.lastName = "User";
                }
            }

            if (parsedText) {
                const aiProfile = await parseResumeToProfile(parsedText, preferredModel);
                profile = { ...profile, ...aiProfile };
            }

            const candidate = await Candidate.create(profile);
            return { success: true, candidate };
        } catch (err: any) {
            console.error(`Error processing URL ${url}:`, err);
            return { success: false, url, error: err.message };
        }
    }));

    const successfulCandidates = results.filter(r => r.success).map(r => r.candidate);
    const failedUrls = results.filter(r => !r.success);

    return NextResponse.json({ 
        success: true, 
        data: { 
            inserted: successfulCandidates.length, 
            candidates: successfulCandidates,
            errors: failedUrls
        } 
    }, { status: 201 });
  } catch (error: any) {
    console.error('Bulk URL Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
