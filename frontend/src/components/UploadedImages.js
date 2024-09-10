import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UploadedImages.css';

function UploadedImages() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    async function fetchImages() {
      try {
        const response = await axios.get('https://image-upload-formik-jqk6.vercel.app/api/images');
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
              <div key={image._id} className="image-container">
                <img
                  src={`https://image-upload-formik-jqk6.vercel.app/uploads/${image.filename}`}
                  alt={image.originalname}
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
