import React from 'react';
import ImageUpload from './ImageUpload';

interface ImagesSectionProps {
  images: Array<{ url: string; alt_text?: string; caption: string; type: string; order: number }>;
  imageTypes: string[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: string, value: any) => void;
  onCreateImageType: (type: string) => void;
  errors?: Record<string, string>;
  onToast?: (type: 'success' | 'error', message: string) => void;
}

const ImagesSection: React.FC<ImagesSectionProps> = ({
  images,
  imageTypes,
  onAdd,
  onRemove,
  onUpdate,
  onCreateImageType,
  errors,
  onToast
}) => {
  return (
    <section className="form-section">
      <h2>Images</h2>
      <button type="button" onClick={onAdd} className="btn-add">
        + Add Image
      </button>
      {images.map((img, index) => (
        <div key={index} className="array-item">
          <ImageUpload
            url={img.url}
            altText={img.alt_text || ''}
            caption={img.caption}
            type={img.type}
            order={img.order}
            imageTypes={imageTypes}
            onUrlChange={(url) => onUpdate(index, 'url', url)}
            onAltTextChange={(alt) => onUpdate(index, 'alt_text', alt)}
            onCaptionChange={(caption) => onUpdate(index, 'caption', caption)}
            onTypeChange={(type) => onUpdate(index, 'type', type)}
            onOrderChange={(order) => onUpdate(index, 'order', order)}
            onCreateType={onCreateImageType}
            onToast={onToast}
            errors={errors?.[`images_${index}_url`] ? {
              url: errors[`images_${index}_url`]
            } : undefined}
          />
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="btn-remove"
          >
            Remove
          </button>
        </div>
      ))}
    </section>
  );
};

export default ImagesSection;

