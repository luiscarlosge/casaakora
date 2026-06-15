const express = require('express');
const path = require('path');
const fs = require('fs');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000;

// Gzip compression para mejor performance
app.use(compression());

// Servir fotos 360 con cache de 7 días
app.use('/fotos360', express.static(path.join(__dirname, 'Fotos360'), {
  maxAge: '7d',
  immutable: true,
}));

// API: listar fotos disponibles
app.get('/api/fotos', (req, res) => {
  const dir = path.join(__dirname, 'Fotos360');
  try {
    const files = fs.readdirSync(dir)
      .filter(f => /\.(jpg|jpeg|png)$/i.test(f))
      .map(f => ({ nombre: f, url: `/fotos360/${f}` }));
    res.json(files);
  } catch (e) {
    res.status(500).json({ error: 'No se pudieron cargar las fotos' });
  }
});

// Servir la app React compilada
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
