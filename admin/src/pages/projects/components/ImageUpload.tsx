import React, { useState, useRef } from 'react';
import { isValidUrl } from '../../../utils/validators';
import apiService, { resolveUploadsUrl } from '../../../services/api';

interface ImageUploadProps {
  url: string;
  altText: string;
  caption: string;
  type: string;
  order: number;
  imageTypes: string[];
  onUrlChange: (url: string) => void;
  onAltTextChange: (alt: string) => void;
  onCaptionChange: (caption: string) => void;
  onTypeChange: (type: string) => void;
  onOrderChange: (order: number) => void;
  onCreateType: (type: string) => void;
  errors?: Record<string, string>;
  onToast?: (type: 'success' | 'error', message: string) => void;
}

type UploadMethod = 'url' | 'upload';

const ImageUpload: React.FC<ImageUploadProps> = ({
  url,
  altText,
  caption,
  type,
  order,
  imageTypes,
  onUrlChange,
  onAltTextChange,
  onCaptionChange,
  onTypeChange,
  onOrderChange,
  onCreateType,
  errors,
  onToast
}) => {
  const [newImageType, setNewImageType] = useState('');
  const [uploadMethod, setUploadMethod] = useState<UploadMethod>('url');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddImageType = () => {
    if (newImageType.trim()) {
      onCreateType(newImageType.trim());
      onTypeChange(newImageType.trim());
      setNewImageType('');
    }
  };

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
    setUploadSuccess(null);

    // Simulate progress (since we don't have real progress tracking)
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
      // Use caption as alt_text and caption in the upload
      const response = await apiService.uploadImage(
        file,
        altText || undefined,
        caption || undefined,
        type ? [type] : undefined
      );

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.success && response.data) {
        // Try multiple possible URL fields (broad compatibility)
        const d = response.data;
        const imageUrl = d.url || d.cloudUrl || d.r2Url || d.supabaseUrl || d.location || d.path ||
                         (d.result && (d.result.url || d.result.location)) ||
                         (d.file && (d.file.url || d.file.location)) ||
                         (d.localPath ? resolveUploadsUrl(d.filename || d.localPath) : null);

        if (imageUrl) {
          onUrlChange(imageUrl);
          // Auto-switch to URL mode after successful upload
          setUploadMethod('url');
          setUploadProgress(100);
          setUploadSuccess('Image uploaded successfully');
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
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleMethodChange = (method: UploadMethod) => {
    setUploadMethod(method);
    setUploadError(null);
    if (method === 'upload' && url) {
      // Optionally clear URL when switching to upload
      // onUrlChange('');
    }
  };

  return (
    <>
      <div className="form-group">
        <label>Image Source *</label>
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
          <>
            <input
              type="url"
              value={url}
              onChange={(e) => onUrlChange(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className={errors?.url ? 'error' : ''}
              required
            />
            {errors?.url && <span className="error-text">{errors.url}</span>}
          </>
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
              {uploadSuccess && <span className="info-badge">{uploadSuccess}</span>}
              {uploading && (
                <div className="upload-progress">
                  <div className="upload-progress-bar" style={{ width: `${uploadProgress}%` }}></div>
                </div>
              )}
            </div>
          </>
        )}

        {url && isValidUrl(url) && (
          <div className="image-preview">
            <img src={url} alt="Preview" onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }} />
          </div>
        )}
      </div>
      <div className="form-group">
        <label>Alt Text *</label>
        <input
          type="text"
          value={altText}
          onChange={(e) => onAltTextChange(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Caption *</label>
        <input
          type="text"
          value={caption}
          onChange={(e) => onCaptionChange(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Type *</label>
        <div className="inline-input-group">
          <select
            value={type}
            onChange={(e) => onTypeChange(e.target.value)}
            required
          >
            <option value="">Select type</option>
            {imageTypes.map(imgType => (
              <option key={imgType} value={imgType}>{imgType}</option>
            ))}
          </select>
          <div className="add-new-input">
            <input
              type="text"
              placeholder="New type"
              value={newImageType}
              onChange={(e) => setNewImageType(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImageType())}
            />
            <button type="button" onClick={handleAddImageType} className="btn-add-small">
              Add
            </button>
          </div>
        </div>
      </div>
      <div className="form-group">
        <label>Order</label>
        <input
          type="number"
          value={order}
          onChange={(e) => onOrderChange(parseInt(e.target.value) || 0)}
          min="0"
        />
      </div>
    </>
  );
};

export default ImageUpload;

