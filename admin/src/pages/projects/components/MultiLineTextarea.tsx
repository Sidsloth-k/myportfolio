import React, { useRef } from 'react';

interface MultiLineTextareaProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  rows?: number;
  label?: string;
}

const MultiLineTextarea: React.FC<MultiLineTextareaProps> = ({
  value,
  onChange,
  placeholder = "Enter each item on a new line",
  rows = 3,
  label
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const lines = e.target.value.split('\n').filter(l => l.trim() || l === '');
    onChange(lines);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const newText = text.substring(0, start) + '\n' + text.substring(end);
        const lines = newText.split('\n').filter(l => l.trim() || l === '');
        onChange(lines);
        
        // Move cursor to next line
        setTimeout(() => {
          const linesBefore = text.substring(0, start).split('\n').length;
          const newCursorPos = lines.slice(0, linesBefore + 1).join('\n').length;
          textarea.setSelectionRange(newCursorPos, newCursorPos);
          textarea.focus();
        }, 0);
      }
    }
  };

  return (
    <div className="form-group">
      {label && <label>{label}</label>}
      <textarea
        ref={textareaRef}
        value={value.join('\n')}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={rows}
      />
    </div>
  );
};

export default MultiLineTextarea;



