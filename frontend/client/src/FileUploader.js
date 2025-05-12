import React from 'react';
import './FileUploader.css';

const FileUploader = ({ onFileRead }) => {

  const handleFile = (file) => {
    if (!file || !file.name.endsWith('.py')) {
      alert('Please upload a .py file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      onFileRead(content); // set in textarea via prop
    };
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const handleFileChange = (e) => {
    handleFile(e.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div
      className="dropzone"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <p>Drag & Drop your .py file here or click below</p>
      <input
        type="file"
        accept=".py"
        onChange={handleFileChange}
        id="fileInput"
        style={{ display: 'none' }}
      />
      <label htmlFor="fileInput" className="upload-button">Choose File</label>
    </div>
  );
};

export default FileUploader;
