import React from 'react';

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen">
    {children}
  </div>
);

export default PageWrapper;


