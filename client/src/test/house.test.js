import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { casa, pisos, fotos, CONTACTO } from '../data/house';

const ROOT = path.resolve(__dirname, '../../..');
const webDir = path.join(ROOT, 'Fotos360', 'web');
const thumbsDir = path.join(ROOT, 'Fotos360', 'thumbs');

describe('datos de la casa', () => {
  it('tiene los datos básicos', () => {
    expect(casa.area).toBeGreaterThan(0);
    expect(casa.pisos).toBe(pisos.length);
    expect(casa.precio).toMatch(/^\$[\d.]+$/);
  });

  it('el precio es el mismo en house.js y en index.html (SEO)', () => {
    const html = fs.readFileSync(path.join(ROOT, 'client', 'index.html'), 'utf8');
    const precioNumero = casa.precio.replace(/\D/g, '');
    const millones = String(Number(precioNumero) / 1_000_000);
    expect(html).toContain(`"price": "${precioNumero}"`);
    expect(html).toContain(`$${millones} millones`);
  });

  it('cada foto tiene id único y su archivo existe (web y miniatura)', () => {
    const ids = new Set();
    for (const f of fotos) {
      expect(ids.has(f.id), `id duplicado: ${f.id}`).toBe(false);
      ids.add(f.id);
      expect(fs.existsSync(path.join(webDir, f.archivo)), `falta web/${f.archivo}`).toBe(true);
      expect(fs.existsSync(path.join(thumbsDir, f.archivo)), `falta thumbs/${f.archivo}`).toBe(true);
    }
  });

  it('los WhatsApp son números colombianos válidos', () => {
    expect(CONTACTO.whatsapp1).toMatch(/^57\d{10}$/);
    expect(CONTACTO.whatsapp2).toMatch(/^57\d{10}$/);
  });
});
