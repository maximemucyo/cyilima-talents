// Mock canvas for pdfjs-dist in Node.js environment
module.exports = {
  createCanvas: () => ({
    getContext: () => ({}),
    style: {}
  })
};
