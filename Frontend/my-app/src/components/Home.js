import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosInstance';
import { PDFViewer, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { useNavigate } from 'react-router-dom';

// Create styles for the PDF document
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

// Create a PDF Document Component
const MyDocument = ({ selectedPdf }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>Selected PDF URL: {selectedPdf}</Text>
      </View>
    </Page>
  </Document>
);

const Home = () => {
  const [pdfs, setPdfs] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPdf, setSelectedPdf] = useState(null); // State to hold the selected PDF URL
  const navigate = useNavigate();

  const fetchPdfs = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/pdfs/user/me');
      setPdfs(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch PDFs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPdfs();
  }, []);

  const onFileChange = (e) => setFile(e.target.files[0]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('PDF', file);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found');
        console.log('No token found');
        return;
      }

      const response = await axios.post('/api/pdfs/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
        },
      });
      console.log(response.data); // Log successful response if needed
      fetchPdfs(); // Refresh PDF list after successful upload
    } catch (err) {
      setError('Failed to upload PDF');
      console.error(err);
    }
  };

  const handlePdfClick = (pdfUrl) => {
    setSelectedPdf(pdfUrl); // Set the selected PDF URL to state
  };

  return (
    <div>
      <h1>Home</h1>
      {error && <p>{error}</p>}
      <form onSubmit={onSubmit}>
        <input type="file" accept="application/pdf" onChange={onFileChange} />
        <button type="submit">Upload</button>
      </form>
      <h2>Uploaded PDFs</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {pdfs.map((pdf) => (
            <li key={pdf._id} onClick={() => handlePdfClick(pdf.url)}>
              {pdf.filename}
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={() => {
          localStorage.removeItem('token');
          navigate('/login');
        }}
      >
        Logout
      </button>
      {selectedPdf && (
        <div>
          <PDFViewer>
            <MyDocument selectedPdf={selectedPdf} />
          </PDFViewer>
        </div>
      )}
    </div>
  );
};

export default Home;
