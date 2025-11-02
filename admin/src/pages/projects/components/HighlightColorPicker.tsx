import React, { useState } from 'react';

interface HighlightColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

const HighlightColorPicker: React.FC<HighlightColorPickerProps> = ({ value, onChange }) => {
  const [method, setMethod] = useState<'picker' | 'hex'>('picker');

  const isValidHex = (hex: string): boolean => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let hex = e.target.value.trim();
    if (!hex.startsWith('#')) {
      hex = '#' + hex;
    }
    if (isValidHex(hex) || hex === '#' || hex === '') {
      onChange(hex);
    }
  };

  const handlePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  // Ensure we have a valid color for the picker
  const pickerValue = value && isValidHex(value) ? value : '#FF5733';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Method Selector */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <button
          type="button"
          onClick={() => setMethod('picker')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: method === 'picker' ? 'rgba(240, 216, 152, 0.3)' : 'transparent',
            border: '1px solid rgba(240, 216, 152, 0.5)',
            borderRadius: '4px',
            color: '#f5f1eb',
            cursor: 'pointer',
            fontSize: '0.875rem'
          }}
        >
          Color Picker
        </button>
        <button
          type="button"
          onClick={() => setMethod('hex')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: method === 'hex' ? 'rgba(240, 216, 152, 0.3)' : 'transparent',
            border: '1px solid rgba(240, 216, 152, 0.5)',
            borderRadius: '4px',
            color: '#f5f1eb',
            cursor: 'pointer',
            fontSize: '0.875rem'
          }}
        >
          Hex Code
        </button>
      </div>

      {/* Color Input Based on Method */}
      {method === 'picker' ? (
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input
            type="color"
            value={pickerValue}
            onChange={handlePickerChange}
            style={{
              width: '60px',
              height: '40px',
              border: '1px solid rgba(240, 216, 152, 0.5)',
              borderRadius: '4px',
              cursor: 'pointer',
              backgroundColor: 'transparent'
            }}
          />
          <input
            type="text"
            value={value || ''}
            onChange={handleHexChange}
            placeholder="#FF5733"
            maxLength={7}
            style={{
              flex: 1,
              padding: '0.5rem',
              backgroundColor: 'rgba(10, 7, 4, 0.8)',
              border: '1px solid rgba(240, 216, 152, 0.5)',
              borderRadius: '4px',
              color: '#f5f1eb',
              fontSize: '0.875rem'
            }}
          />
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input
            type="text"
            value={value || ''}
            onChange={handleHexChange}
            placeholder="#FF5733"
            maxLength={7}
            style={{
              flex: 1,
              padding: '0.5rem',
              backgroundColor: 'rgba(10, 7, 4, 0.8)',
              border: '1px solid rgba(240, 216, 152, 0.5)',
              borderRadius: '4px',
              color: '#f5f1eb',
              fontSize: '0.875rem'
            }}
          />
          <input
            type="color"
            value={pickerValue}
            onChange={handlePickerChange}
            style={{
              width: '60px',
              height: '40px',
              border: '1px solid rgba(240, 216, 152, 0.5)',
              borderRadius: '4px',
              cursor: 'pointer',
              backgroundColor: 'transparent'
            }}
          />
        </div>
      )}

      {/* Color Preview */}
      {value && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: isValidHex(value) ? value : 'transparent',
              border: '2px solid rgba(240, 216, 152, 0.5)',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {!isValidHex(value) && value && (
              <span style={{ color: '#dc2626', fontSize: '0.75rem' }}>!</span>
            )}
          </div>
          <span style={{ color: '#d4c7b0', fontSize: '0.875rem' }}>
            {isValidHex(value) ? value : 'Invalid hex color'}
          </span>
        </div>
      )}
    </div>
  );
};

export default HighlightColorPicker;

