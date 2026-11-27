import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// jsdom no implementa matchMedia ni scrollIntoView
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}
Element.prototype.scrollIntoView = vi.fn();
