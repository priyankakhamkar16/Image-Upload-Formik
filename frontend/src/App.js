import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ImageUpload from './components/ImageUpload';
import UploadedImages from './components/UploadedImages'; // Ensure this path is correct

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ImageUpload />} />
        <Route path="/uploaded-images" element={<UploadedImages />} />
      </Routes>
    </Router>
  );
}

export default App;
