import React, { useState, useRef } from 'react';
import { isValidUrl } from '../../../utils/validators';
import apiService, { resolveUploadsUrl } from '../../../services/api';

interface UrlOrUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  onToast?: (type: 'success' | 'error', message: string) => void;
}

type UploadMethod = 'url' | 'upload';

const UrlOrUploadField: React.FC<UrlOrUploadFieldProps> = ({
  value,
  onChange,
  label,
  placeholder = 'https://example.com/image.jpg',
  error,
  required = false,
  onToast
}) => {
  const [uploadMethod, setUploadMethod] = useState<UploadMethod>('url');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const response = await apiService.uploadImage(file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.success && response.data) {
        // Try multiple possible URL fields
        const imageUrl = response.data.url || 
                         response.data.cloudUrl || 
                         response.data.r2Url || 
                         response.data.supabaseUrl ||
                         (response.data.localPath ? resolveUploadsUrl(response.data.filename || response.data.localPath) : null);
        
        if (imageUrl) {
          onChange(imageUrl);
          setUploadMethod('url');
          onToast?.('success', 'Image uploaded successfully');
        } else {
          throw new Error('Upload succeeded but no URL was returned');
        }
      } else {
        throw new Error(response.error || response.message || 'Upload failed');
      }
    } catch (error: any) {
      clearInterval(progressInterval);
      console.error('Upload error:', error);
      setUploadError(error.message || 'Failed to upload image');
      setUploadProgress(0);
      onToast?.('error', error.message || 'Failed to upload image');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleMethodChange = (method: UploadMethod) => {
    setUploadMethod(method);
    setUploadError(null);
  };

  return (
    <div className="form-group">
      <label>{label} {required && '*'}</label>
      <div className="upload-method-selector">
        <button
          type="button"
          className={`method-toggle ${uploadMethod === 'url' ? 'active' : ''}`}
          onClick={() => handleMethodChange('url')}
        >
          URL
        </button>
        <button
          type="button"
          className={`method-toggle ${uploadMethod === 'upload' ? 'active' : ''}`}
          onClick={() => handleMethodChange('upload')}
        >
          Upload File
        </button>
      </div>

      {uploadMethod === 'url' ? (
        <div className="url-input-wrapper">
          <input
            type="text"
            value={value}
            onChange={(e) => {
              const newValue = e.target.value;
              onChange(newValue);
              // Validate on change
              if (newValue && !isValidUrl(newValue)) {
                setUploadError('Please enter a valid URL (must start with http:// or https://)');
              } else {
                setUploadError(null);
              }
            }}
            onBlur={(e) => {
              const newValue = e.target.value;
              if (newValue && !isValidUrl(newValue)) {
                setUploadError('Please enter a valid URL (must start with http:// or https://)');
              } else {
                setUploadError(null);
              }
            }}
            placeholder={placeholder}
            className={error || uploadError ? 'error' : ''}
            required={required}
          />
          {(error || uploadError) && <span className="error-text">{error || uploadError}</span>}
          {value && isValidUrl(value) && (
            <div className="image-preview">
              <img src={value} alt="Preview" onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }} />
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="file-upload-wrapper">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={uploading}
              className="file-input"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="btn-upload"
            >
              {uploading ? `Uploading... ${uploadProgress}%` : 'Choose Image File'}
            </button>
            {uploadError && <span className="error-text">{uploadError}</span>}
            {uploading && (
              <div className="upload-progress">
                <div className="upload-progress-bar" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            )}
          </div>
        </>
      )}

    </div>
  );
};

export default UrlOrUploadField;

