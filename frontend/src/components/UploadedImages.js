import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UploadedImages.css'; // Import the updated CSS file

function UploadedImages() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    async function fetchImages() {
      try {
        const response = await axios.get('http://localhost:5000/api/images');
        setImages(response.data);
      } catch (error) {
        console.error('Error fetching images', error);
      }
    }

    fetchImages();
  }, []);

  return (
    <div className="container">
      <h1>Uploaded Images</h1>
      <div>
        {images.length === 0 ? (
          <p className="no-images">No images found</p>
        ) : (
          <div className="images-grid">
            {images.map((image) => (
              <img
                key={image._id}
                src={`http://localhost:5000/uploads/${image.filename}`}
                alt={image.originalname}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadedImages;
