import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';
import './ImageUpload.css';

function ImageUpload() {
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    formData.append('image', values.image);

    try {
      await axios.post('https://image-upload-formik.vercel.app/api/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Image uploaded successfully');
      resetForm();
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
    return null;
  };

  return (
    <div className="container">
      <h1>Upload Image</h1>
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
        {({ setFieldValue, isSubmitting }) => (
          <Form>
            <div
              className="drag-drop-area"
              onDrop={(event) => {
                event.preventDefault();
                event.stopPropagation();
                const files = event.dataTransfer.files;
                if (files.length > 0) {
                  const errorMessage = validateImageFile(files[0]);
                  if (!errorMessage) {
                    setFieldValue('image', files[0]);
                  } else {
                    alert(errorMessage);
                  }
                }
              }}
              onDragOver={(event) => event.preventDefault()}
            >
              <p>Drag and drop your image here</p>
            </div>

            <Field
              type="file"
              name="image"
              accept="image/*"
              onChange={(event) => {
                const files = event.currentTarget.files;
                if (files.length > 0) {
                  const errorMessage = validateImageFile(files[0]);
                  if (!errorMessage) {
                    setFieldValue('image', files[0]);
                  } else {
                    alert(errorMessage);
                    event.target.value = null;
                  }
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