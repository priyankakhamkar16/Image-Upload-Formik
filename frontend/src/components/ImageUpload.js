import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, ErrorMessage } from 'formik';
import axios from 'axios';
import './ImageUpload.css';  

import sampleImage1 from '../images/sample1.jpg';
import sampleImage2 from '../images/sample2.jpg';
import sampleImage3 from '../images/sample3.jpg';

function ImageUpload() {
  const [previewImage, setPreviewImage] = useState(null); // State for image preview
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    formData.append('image', values.image);

    try {
      await axios.post('http://localhost:5000/api/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Image uploaded successfully');
      resetForm();
      setPreviewImage(null); // Reset preview image after successful upload
    } catch (error) {
      console.error('Error uploading image', error);
      alert('Error uploading image');
    } finally {
      setSubmitting(false);
    }
  };

  const validateImageFile = (file) => {
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif'];
      const maxSizeMB = 5; 
      if (!validTypes.includes(file.type)) {
        return 'Please upload an image file only';
      }
      if (file.size > maxSizeMB * 1024 * 1024) { 
        return 'Image size should not exceed 5 MB';
      }
    }
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">ImageUpload</div>
        <div className="nav-links">
          <button onClick={() => navigate('/uploaded-images')} className="view-images-btn">View Uploaded Images</button>
        </div>
      </nav>

      <div className="container">
        <h1>Upload Your Images Here..</h1>
        <p>Here you can upload your images. You can also preview the image before uploading to ensure it's the correct one.</p>

        {/* Display some sample images */}
        <div className="sample-images-container">
          <h2>Sample Images</h2>
          <div className="sample-images">
            <img src={sampleImage1} alt="Sample 1" />
            <img src={sampleImage2} alt="Sample 2" />
            <img src={sampleImage3} alt="Sample 3" />
          </div>
        </div>

        <Formik
          initialValues={{ image: null }}
          validate={(values) => {
            const errors = {};
            const errorMessage = validateImageFile(values.image);
            if (errorMessage) {
              errors.image = errorMessage;
            }
            return errors;
          }}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, isSubmitting, errors, touched }) => (
            <Form>
              <div
                className={`drag-drop-area ${errors.image && touched.image ? 'error' : ''}`}
                onDrop={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  const files = event.dataTransfer.files;
                  if (files.length > 0) {
                    const errorMessage = validateImageFile(files[0]);
                    if (!errorMessage) {
                      setFieldValue('image', files[0]);
                      setPreviewImage(URL.createObjectURL(files[0])); // Set image preview
                    } else {
                      alert(errorMessage);
                    }
                  }
                }}
                onDragOver={(event) => event.preventDefault()}
              >
                <p>Drag and drop your image here</p>
              </div>

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={(event) => {
                  const files = event.currentTarget.files;
                  if (files.length > 0) {
                    const errorMessage = validateImageFile(files[0]);
                    if (!errorMessage) {
                      setFieldValue('image', files[0]);
                      setPreviewImage(URL.createObjectURL(files[0])); // Set image preview
                    } else {
                      alert(errorMessage);
                      event.target.value = null;  
                      setPreviewImage(null); // Reset preview if there's an error
                    }
                  }
                }}
              />

              {/* Display the image preview */}
              {previewImage && (
                <div className="image-preview">
                  <p>Image Preview:</p>
                  <img src={previewImage} alt="Selected" style={{ width: '300px', height: 'auto' }} />
                </div>
              )}

              <ErrorMessage name="image" component="div" className="error-message" />
              <button type="submit" disabled={isSubmitting}>Upload Image</button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default ImageUpload;
