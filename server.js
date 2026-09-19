const express = require('express');
const path = require('path');
const fs = require('fs');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000;

// Gzip compression para mejor performance
app.use(compression());

// Confía en el proxy de Azure App Service (IP real, https)
app.set('trust proxy', true);

// Fotos 360: /fotos360/thumbs (miniaturas) y /fotos360/web (panoramas 4K)
app.use('/fotos360', express.static(path.join(__dirname, 'Fotos360'), {
  maxAge: '30d',
  immutable: true,
}));

// API: listar los panoramas disponibles
app.get('/api/fotos', (req, res) => {
  const dir = path.join(__dirname, 'Fotos360', 'web');
  try {
    const files = fs.readdirSync(dir)
      .filter(f => /\.(jpg|jpeg|png)$/i.test(f))
      .map(f => ({
        nombre: f,
        url: `/fotos360/web/${f}`,
        thumb: `/fotos360/thumbs/${f}`,
      }));
    res.json(files);
  } catch (e) {
    res.status(500).json({ error: 'No se pudieron cargar las fotos' });
  }
});

// Health check para Azure
app.get('/health', (req, res) => res.json({ ok: true, uptime: process.uptime() }));

// Assets con hash en el nombre: cache agresivo
app.use('/assets', express.static(path.join(__dirname, 'client/dist/assets'), {
  maxAge: '1y',
  immutable: true,
}));

// Resto de la app React compilada
app.use(express.static(path.join(__dirname, 'client/dist'), {
  maxAge: '1h',
}));

// SPA fallback — todas las rutas van a index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
});
