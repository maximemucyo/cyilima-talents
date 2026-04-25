/**
 * Extracts text from a PDF buffer using pdfjs-dist legacy build (Node compatible)
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
    try {
        console.log('Loading pdfjs-dist (legacy v3)...');
        const pdfjs = await import('pdfjs-dist/legacy/build/pdf.js');
        // Explicitly set the worker to avoid "Cannot find module './pdf.worker.js'"
        const pdfWorker = await import('pdfjs-dist/legacy/build/pdf.worker.js');
        pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;
        
        const data = new Uint8Array(buffer);
        console.log(`Buffer size: ${data.length} bytes`);
        
        const loadingTask = pdfjs.getDocument({
            data,
            useWorkerFetch: false,
            isEvalSupported: false,
            useSystemFonts: true,
            disableWorker: true // Force fake worker in Node environment
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
