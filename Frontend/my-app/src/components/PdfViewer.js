import React from 'react';
import { Document, Page } from 'react-pdf';
import { useLocation } from 'react-router-dom';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

const PdfViewer = () => {
  const location = useLocation();
  const { url } = location.state || {}; // Destructure `url` from `location.state` with a fallback to an empty object

  if (!url) {
    return <div>Error: No PDF URL provided</div>;
  }

  const pdfUrl = url.endsWith('.pdf') ? url : `${url}.pdf`; // Ensure the URL ends with .pdf

  return (
    <div>
      <Document
        file={pdfUrl}
        onLoadSuccess={({ numPages }) => console.log(`Loaded a file with ${numPages} pages.`)}
        onLoadError={(error) => console.error('Error while loading document:', error)}
      >
        <Page pageNumber={1} />
      </Document>
    </div>
  );
};

export default PdfViewer;
