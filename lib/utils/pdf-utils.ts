/**
 * Extracts text from a PDF buffer using pdfjs-dist legacy build (Node compatible)
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
    // Dynamic import to avoid build errors with pdfjs-dist in Turbopack/Next.js
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    
    const data = new Uint8Array(buffer);
    const loadingTask = pdfjs.getDocument({
        data,
        useWorkerFetch: false,
        isEvalSupported: false,
        useSystemFonts: true
    });

    const pdf = await loadingTask.promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
            .map((item: any) => item.str)
            .join(' ');
        fullText += pageText + '\n\n';
    }

    return fullText;
}
