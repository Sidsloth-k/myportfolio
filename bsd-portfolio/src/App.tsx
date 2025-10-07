import React from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import { ContactProvider } from './contexts/ContactContext';
import Router from './components/Router';

export default function App() {
  return (
    <ThemeProvider>
      <ContactProvider>
        <Router />
      </ContactProvider>
    </ThemeProvider>
  );
}