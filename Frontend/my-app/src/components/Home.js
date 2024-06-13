import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosInstance';
import { Link } from 'react-router-dom';

const Home = ({ history }) => {
  const [pdfs, setPdfs] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
        console.log("No token found");
        return;
      }
  
      const response = await axios.post('/api/pdfs/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}` // Include the token in the Authorization header
        }
      });
      console.log(response.data); // Log successful response if needed
      fetchPdfs(); // Refresh PDF list after successful upload
    } catch (err) {
      setError('Failed to upload PDF');
      console.error(err);
    }
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
            <li key={pdf._id}>
              <Link to={`/pdf/${pdf._id}`}>{pdf.filename}</Link>
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => {
        localStorage.removeItem('token');
        history.push('/login');
      }}>Logout</button>
    </div>
  );
};

export default Home;