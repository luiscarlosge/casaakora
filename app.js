const express = require('express');
const path = require('path');
const fs = require('fs');
const compression = require('compression');

const ROOT = __dirname;
const FOTOS_DIR = process.env.FOTOS_DIR || path.join(ROOT, 'Fotos360');
const DIST_DIR = process.env.DIST_DIR || path.join(ROOT, 'client', 'dist');

// build-info.json lo genera el pipeline (commit, fecha, run) para saber qué versión está desplegada
function leerBuildInfo() {
  try {
    return JSON.parse(fs.readFileSync(path.join(ROOT, 'build-info.json'), 'utf8'));
  } catch {
    return { version: 'local' };
  }
}

function createApp() {
  const app = express();

  app.disable('x-powered-by');
  // Confía en el proxy de Azure App Service (IP real, https)
  app.set('trust proxy', true);
  app.use(compression());

  // Cabeceras de seguridad básicas
  app.use((req, res, next) => {
    res.set({
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    });
    next();
  });

  // Fotos 360: /fotos360/thumbs (miniaturas) y /fotos360/web (panoramas 4K)
  app.use('/fotos360', express.static(FOTOS_DIR, { maxAge: '30d', immutable: true }));

  // API: listar los panoramas disponibles
  app.get('/api/fotos', (req, res) => {
    try {
      const files = fs.readdirSync(path.join(FOTOS_DIR, 'web'))
        .filter((f) => /\.(jpg|jpeg|png)$/i.test(f))
        .map((f) => ({
          nombre: f,
          url: `/fotos360/web/${f}`,
          thumb: `/fotos360/thumbs/${f}`,
        }));
      res.json(files);
    } catch (e) {
      res.status(500).json({ error: 'No se pudieron cargar las fotos' });
    }
  });

  // Health check para Azure (health_check_path) y smoke tests del pipeline
  const buildInfo = leerBuildInfo();
  app.get('/health', (req, res) => {
    res.json({
      ok: true,
      uptime: process.uptime(),
      env: process.env.APP_ENV || process.env.NODE_ENV || 'development',
      ...buildInfo,
    });
  });

  // Assets con hash en el nombre: cache agresivo
  app.use('/assets', express.static(path.join(DIST_DIR, 'assets'), { maxAge: '1y', immutable: true }));

  // Resto de la app React compilada
  app.use(express.static(DIST_DIR, { maxAge: '1h' }));

  // SPA fallback — todas las rutas van a index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(DIST_DIR, 'index.html'), (err) => {
      if (err) res.status(404).send('Sitio no compilado. Ejecuta: npm run build');
    });
  });

  return app;
}

module.exports = { createApp };
