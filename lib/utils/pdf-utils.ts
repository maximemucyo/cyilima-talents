/**
 * Extracts text from a PDF buffer using pdfjs-dist legacy build (Node compatible)
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
    try {
        console.log('Loading pdfjs-dist...');
        const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
        
        const data = new Uint8Array(buffer);
        console.log(`Buffer size: ${data.length} bytes`);
        
        const loadingTask = pdfjs.getDocument({
            data,
            useWorkerFetch: false,
            isEvalSupported: false,
            useSystemFonts: true
        });

        const pdf = await loadingTask.promise;
        console.log(`PDF loaded. Pages: ${pdf.numPages}`);
        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
                .map((item: any) => item.str)
                .join(' ');
            fullText += pageText + '\n\n';
        }

        console.log(`Extraction complete. Length: ${fullText.length} chars`);
        return fullText;
    } catch (err) {
        console.error('PDF Extraction Error:', err);
        throw err;
    }
}
