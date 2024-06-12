import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import { Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { useParams } from 'react-router-dom';

const PdfViewer = () => {
  const { id } = useParams();
  const [pdfUrl, setPdfUrl] = useState(null);

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const res = await axios.get(`/api/pdfs/${id}`);
        setPdfUrl(res.data.url);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPdf();
  }, [id]);

  return (
    <div>
      <h1>PDF Viewer</h1>
      {pdfUrl ? (
        <div style={{ height: '750px' }}>
          <Viewer fileUrl={pdfUrl} plugins={[defaultLayoutPluginInstance]} />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PdfViewer;
