import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UploadedImages.css';

function UploadedImages() {
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchImages() {
      try {
        const response = await axios.get('https://image-upload-formik.vercel.app/api/images');
        setImages(response.data);
      } catch (error) {
        console.error('Error fetching images', error);
        setError('Failed to fetch images');
      }
    }

    fetchImages();
  }, []);

  const imageBaseURL = 'https://image-upload-formik.vercel.app/uploads/'; // Ensure this URL is correct

  return (
    <div className="container">
      <h1>Uploaded Images</h1>
      {error && <p className="error-message">{error}</p>}
      <div>
        {images.length === 0 ? (
          <p className="no-images">No images found</p>
        ) : (
          <div className="images-grid">
            {images.map((image) => (
              <div key={image._id} className="image-container">
                <img
                  src={`${imageBaseURL}${image.filename}`}
                  alt={image.originalname}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150'; // Placeholder image on error
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadedImages;
