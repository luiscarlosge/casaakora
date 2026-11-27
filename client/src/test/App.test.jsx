import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { casa } from '../data/house';

describe('App', () => {
  it('renderiza la página sin errores y muestra el precio', () => {
    render(<App />);
    expect(screen.getAllByText(new RegExp(casa.precioCorto.replace('$', '\\$'))).length).toBeGreaterThan(0);
  });

  it('tiene enlaces de WhatsApp para contacto', () => {
    const { container } = render(<App />);
    const links = container.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]');
    expect(links.length).toBeGreaterThan(0);
  });
});
