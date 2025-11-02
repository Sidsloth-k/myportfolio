import React from 'react';

interface LinksSectionProps {
  links: {
    live?: string;
    github?: string;
    documentation?: string;
    case_study?: string;
    demo?: string;
  };
  onLinksChange: (field: string, value: string) => void;
  errors?: Record<string, string>;
}

const LinksSection: React.FC<LinksSectionProps> = ({ links, onLinksChange, errors }) => {
  return (
    <section className="form-section">
      <h2>Links</h2>
      <div className="form-grid">
        <div className="form-group">
          <label>Live URL</label>
          <input
            type="url"
            value={links.live || ''}
            onChange={(e) => onLinksChange('live', e.target.value)}
            className={errors?.links_live ? 'error' : ''}
          />
          {errors?.links_live && <span className="error-text">{errors.links_live}</span>}
        </div>

        <div className="form-group">
          <label>GitHub URL</label>
          <input
            type="url"
            value={links.github || ''}
            onChange={(e) => onLinksChange('github', e.target.value)}
            className={errors?.links_github ? 'error' : ''}
          />
          {errors?.links_github && <span className="error-text">{errors.links_github}</span>}
        </div>

        <div className="form-group">
          <label>Documentation URL</label>
          <input
            type="url"
            value={links.documentation || ''}
            onChange={(e) => onLinksChange('documentation', e.target.value)}
            className={errors?.links_documentation ? 'error' : ''}
          />
          {errors?.links_documentation && <span className="error-text">{errors.links_documentation}</span>}
        </div>

        <div className="form-group">
          <label>Case Study URL</label>
          <input
            type="url"
            value={links.case_study || ''}
            onChange={(e) => onLinksChange('case_study', e.target.value)}
            className={errors?.links_case_study ? 'error' : ''}
          />
          {errors?.links_case_study && <span className="error-text">{errors.links_case_study}</span>}
        </div>

        <div className="form-group">
          <label>Demo URL</label>
          <input
            type="url"
            value={links.demo || ''}
            onChange={(e) => onLinksChange('demo', e.target.value)}
            className={errors?.links_demo ? 'error' : ''}
          />
          {errors?.links_demo && <span className="error-text">{errors.links_demo}</span>}
        </div>
      </div>
    </section>
  );
};

export default LinksSection;


