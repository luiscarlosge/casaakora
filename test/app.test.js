const { test, before } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const request = require('supertest');

// Usa un dist falso para no depender de que el cliente esté compilado
let app;
before(() => {
  const dist = fs.mkdtempSync(path.join(os.tmpdir(), 'dist-'));
  fs.mkdirSync(path.join(dist, 'assets'));
  fs.writeFileSync(path.join(dist, 'index.html'), '<!doctype html><title>Casa</title><div id="root"></div>');
  fs.writeFileSync(path.join(dist, 'assets', 'app-abc123.js'), 'console.log(1)');
  process.env.DIST_DIR = dist;
  delete require.cache[require.resolve('../app')];
  app = require('../app').createApp();
});

test('GET /health responde ok', async () => {
  const res = await request(app).get('/health');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.ok, true);
});

test('GET /api/fotos lista los panoramas con url y miniatura', async () => {
  const res = await request(app).get('/api/fotos');
  assert.strictEqual(res.status, 200);
  assert.ok(Array.isArray(res.body));
  assert.ok(res.body.length >= 20, `se esperaban >=20 fotos, hay ${res.body.length}`);
  for (const f of res.body) {
    assert.match(f.url, /^\/fotos360\/web\/.+\.(jpg|jpeg|png)$/i);
    assert.match(f.thumb, /^\/fotos360\/thumbs\//);
  }
});

test('cada panorama web tiene su miniatura', () => {
  const dir = path.join(__dirname, '..', 'Fotos360');
  const web = fs.readdirSync(path.join(dir, 'web')).filter((f) => /\.jpe?g$/i.test(f) && f !== 'hero.jpg');
  const thumbs = new Set(fs.readdirSync(path.join(dir, 'thumbs')));
  const faltantes = web.filter((f) => !thumbs.has(f));
  assert.deepStrictEqual(faltantes, []);
});

test('sirve una foto 360 con cache largo', async () => {
  const res = await request(app).get('/fotos360/thumbs/SalaPiso1.jpg');
  assert.strictEqual(res.status, 200);
  assert.match(res.headers['content-type'], /image\/jpeg/);
  assert.match(res.headers['cache-control'], /max-age=2592000/);
});

test('assets con hash tienen cache de 1 año', async () => {
  const res = await request(app).get('/assets/app-abc123.js');
  assert.strictEqual(res.status, 200);
  assert.match(res.headers['cache-control'], /max-age=31536000/);
});

test('rutas desconocidas caen al index.html (SPA)', async () => {
  const res = await request(app).get('/cualquier/ruta');
  assert.strictEqual(res.status, 200);
  assert.match(res.text, /<div id="root">/);
});

test('incluye cabeceras de seguridad y oculta x-powered-by', async () => {
  const res = await request(app).get('/health');
  assert.strictEqual(res.headers['x-content-type-options'], 'nosniff');
  assert.strictEqual(res.headers['x-powered-by'], undefined);
});
