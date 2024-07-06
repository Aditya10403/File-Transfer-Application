// client/src/components/FileUploader.jsx

import React, { useState } from 'react';
import { io } from 'socket.io-client';

const FileUploader = ({ setDownloadUrl }) => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Initialize socket connection
  const socket = io('http://localhost:3000'); // Replace with your server URL

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  // Handle file upload
  const handleUpload = () => {
    if (!file) {
      alert('Please select a file.'); // Ensure file is selected
      return;
    }

    const formData = new FormData();
    formData.append('file', file); // Append the file
    formData.append('fileName', file.name); // Append the file name

    // Emit fileUpload event to server
    socket.emit('fileUpload', formData, (response) => {
      if (response.success) {
        console.log('File upload successful:', response.url);
        setDownloadUrl(response.url); // Set download URL for displaying download button
      } else {
        console.error('Error uploading file:', response.error);
      }
    });

    // Reset file state after upload
    setFile(null);
  };

  // Listen for upload progress (optional)
  socket.on('uploadProgress', (progress) => {
    console.log('Upload progress:', progress);
    setUploadProgress(progress);
  });

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload File</button>
      
      {uploadProgress > 0 && (
        <div>Upload Progress: {uploadProgress}%</div>
      )}
    </div>
  );
};

export default FileUploader;
