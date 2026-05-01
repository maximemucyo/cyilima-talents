import AdmZip from 'adm-zip';

async function processFile(file: { name: string, buffer: Buffer, type?: string }, preferredModel?: string): Promise<{ candidates: any[], errors: any[] }> {
  const insertedCandidates: any[] = [];
  const errors: any[] = [];
  const fileName = file.name.toLowerCase();

  try {
    if (fileName.endsWith('.csv')) {
      const text = file.buffer.toString('utf-8');
      const rows = text.split('\n').filter(r => r.trim());
      if (rows.length < 2) return { candidates: [], errors: [] };

      const headers = rows[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const dataRows = rows.slice(1);

      for (const row of dataRows) {
        try {
          const values = row.split(',').map(v => v.trim().replace(/"/g, ''));
          const profile: any = {};
          headers.forEach((h, i) => {
            if (values[i]) profile[h] = values[i];
          });

          if (profile.skills && typeof profile.skills === 'string') {
            profile.skills = profile.skills.split(',').map((s: string) => s.trim());
          }

          if (profile.firstName && profile.lastName && profile.email) {
            const candidate = await Candidate.create({
              ...profile,
              cvUrl: file.name
            });
            insertedCandidates.push(candidate);
          } else {
            errors.push({ fileName: file.name, error: 'Missing required fields in row', row: row });
          }
        } catch (err: any) {
          errors.push({ fileName: file.name, error: err.message, row: row });
        }
      }
    } else if (fileName.endsWith('.json')) {
      const text = file.buffer.toString('utf-8');
      const data = JSON.parse(text);
      const candidates = Array.isArray(data) ? data : [data];

      for (const item of candidates) {
        try {
          const candidate = await Candidate.create({
            ...item,
            cvUrl: file.name
          });
          insertedCandidates.push(candidate);
        } catch (err: any) {
          errors.push({ fileName: file.name, error: err.message });
        }
      }
    } else if (fileName.endsWith('.zip')) {
      const zip = new AdmZip(file.buffer);
      const zipEntries = zip.getEntries();

      for (const entry of zipEntries) {
        if (entry.isDirectory) continue;
        
        // Recursively process files inside ZIP
        const result = await processFile({
          name: entry.entryName,
          buffer: entry.getData(),
        }, preferredModel);
        
        insertedCandidates.push(...result.candidates);
        errors.push(...result.errors);
      }
    } else {
      // AI Path for PDF and other unstructured data
      let parsedText = '';
      if (fileName.endsWith('.pdf') || file.type === 'application/pdf') {
        parsedText = await extractTextFromPDF(file.buffer);
      } else {
        parsedText = file.buffer.toString('utf-8');
      }

      if (parsedText && parsedText.trim().length > 0) {
        const profile = await parseResumeToProfile(parsedText, preferredModel);
        const candidate = await Candidate.create({
          ...profile,
          cvText: parsedText,
          cvUrl: file.name
        });
        insertedCandidates.push(candidate);
      } else {
        errors.push({ fileName: file.name, error: 'No text content extracted' });
      }
    }
  } catch (err: any) {
    errors.push({ fileName: file.name, error: err.message });
  }

  return { candidates: insertedCandidates, errors };
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const formData = await request.formData();
    const files = formData.getAll('file') as File[];
    const preferredModel = formData.get('preferredModel') as string;
    
    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, error: 'No files uploaded' }, { status: 400 });
    }

    const allInsertedCandidates: any[] = [];
    const allErrors: any[] = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await processFile({
        name: file.name,
        buffer: buffer,
        type: file.type
      }, preferredModel);
      
      allInsertedCandidates.push(...result.candidates);
      allErrors.push(...result.errors);
    }

    return NextResponse.json({ 
        success: true, 
        data: { 
            inserted: allInsertedCandidates.length, 
            candidates: allInsertedCandidates,
            errors: allErrors 
        } 
    }, { status: 201 });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
