import React from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import Router from './components/Router';

export default function App() {
  return (
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  );
}