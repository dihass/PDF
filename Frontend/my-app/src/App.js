import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import PdfViewer from './components/PdfViewer';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  console.log('App component rendered');
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<ProtectedRoute component={Home} />} />
          <Route path="/pdf/:id" element={<ProtectedRoute component={PdfViewer} />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
