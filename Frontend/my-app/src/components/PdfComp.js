import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';

const PdfComp = ({ pdfFile }) => {
  const [numPages, setNumPages] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div className="pdf-div">
      {numPages && (
        <p>
          Page 1 of {numPages}
        </p>
      )}
      <Document
        file={pdfFile}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        {Array.from(new Array(numPages), (el, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        ))}
      </Document>
    </div>
  );
};

export default PdfComp;
