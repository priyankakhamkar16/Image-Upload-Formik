import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';
import './ImageUpload.css';  // Import the CSS file

function ImageUpload() {
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();
    formData.append('image', values.image);

    try {
      await axios.post('https://image-upload-formik-jqk6.vercel.app/api/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Image uploaded successfully');
      setSubmitting(false);
    } catch (error) {
      console.error('Error uploading image', error);
      alert('Error uploading image');
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <h1>Upload Image</h1>
      <Formik
        initialValues={{ image: null }}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, isSubmitting }) => (
          <Form>
            <div
              className="drag-drop-area"
              onDrop={(event) => {
                event.preventDefault();
                event.stopPropagation();
                const files = event.dataTransfer.files;
                if (files.length > 0) {
                  setFieldValue('image', files[0]);
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
                  setFieldValue('image', files[0]);
                }
              }}
            />
            <ErrorMessage name="image" component="div" className="error-message" />
            <button type="submit" disabled={isSubmitting}>Upload Image</button>
          </Form>
        )}
      </Formik>
      <button onClick={() => navigate('/uploaded-images')}>View Uploaded Images</button>
    </div>
  );
}

export default ImageUpload;
