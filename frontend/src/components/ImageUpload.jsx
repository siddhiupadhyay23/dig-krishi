import React, { useState, useRef } from 'react';
import './ImageUpload.scss';

const ImageUpload = ({ onImageSelect, onRemoveImage, selectedImages = [] }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileSelect = (files) => {
    const validFiles = Array.from(files).filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      
      if (!isValidType) {
        alert(`${file.name} is not a valid image file.`);
        return false;
      }
      
      if (!isValidSize) {
        alert(`${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }
      
      return true;
    });

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = {
          id: Date.now() + Math.random(),
          file: file,
          name: file.name,
          size: file.size,
          type: file.type,
          dataUrl: e.target.result,
          base64: e.target.result.split(',')[1] // Remove data:image/...;base64, prefix
        };
        onImageSelect(imageData);
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle drag and drop
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  // Handle input file selection
  const handleInputChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  // Open file picker
  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="image-upload">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleInputChange}
        style={{ display: 'none' }}
      />

      {/* Drop zone */}
      <div
        className={`image-upload__drop-zone ${isDragOver ? 'image-upload__drop-zone--active' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFilePicker}
      >
        <div className="image-upload__drop-content">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="10" cy="13" r="2" stroke="currentColor" strokeWidth="2"/>
            <path d="m20 17-1.09-1.09a2 2 0 0 0-2.83 0L10 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h3>Drop images here</h3>
          <p>or click to browse</p>
          <small>Supports JPG, PNG, GIF, WebP up to 10MB</small>
        </div>
      </div>

      {/* Selected images preview */}
      {selectedImages.length > 0 && (
        <div className="image-upload__preview">
          <h4>Selected Images ({selectedImages.length})</h4>
          <div className="image-upload__preview-grid">
            {selectedImages.map((image) => (
              <div key={image.id} className="image-upload__preview-item">
                <div className="image-upload__preview-image">
                  <img src={image.dataUrl} alt={image.name} />
                  <button
                    className="image-upload__remove-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveImage(image.id);
                    }}
                    title="Remove image"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
                <div className="image-upload__preview-info">
                  <span className="image-upload__preview-name" title={image.name}>
                    {image.name}
                  </span>
                  <span className="image-upload__preview-size">
                    {formatFileSize(image.size)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
