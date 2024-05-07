/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';

import React from 'react';
import { render, screen } from '@testing-library/react'; 
//import '@testing-library/jest-dom/extend-expect';
import App from './App';

describe('App Component', () => {
  test('renders the main page title "News Collector"', () => {
    render(<App />);
    const pageTitle = screen.getByText(/news collector/i); 
    expect(pageTitle).toBeInTheDocument();
  });

  test('renders the "Imparcializar" button', () => {
    render(<App />);
    const button = screen.getByRole('button', { name: /imparcializar/i });
    expect(button).toBeInTheDocument();
  });

  test('renders subtitle', () => {
    render(<App />);
    console.log(screen)
    const pageSubtitle = screen.getByText(/Noticias por Medio de Comunicación/i); 
    expect(pageSubtitle).toBeInTheDocument();
  });
  test('renders NewsCardSkeleton during loading', () => {
    render(<App />);
    const skeletons = screen.getAllByTestId('news-card-skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
  });
});