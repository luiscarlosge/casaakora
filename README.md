# Casa en Venta — Reserva de Akora, Tocancipá

Sitio web para la venta de vivienda multinivel (3 pisos, 104 m²) en el **Conjunto Residencial Reserva de Akora**, Tocancipá, Cundinamarca. Incluye tour virtual 360° con fotos tomadas con Insta 360.

**Stack:** Node.js · Express · React · Vite · Tailwind CSS · Pannellum 360

---

## Estructura del Proyecto

```
casa/
├── server.js           # Arranca el servidor Express
├── app.js              # App Express (rutas, cache, health)
├── test/               # Pruebas del servidor
├── infra/              # Terraform (dev / prod)
├── scripts/            # bootstrap-azure.sh
├── docs/DESPLIEGUE.md  # Guía de CI/CD
├── package.json        # Dependencias del servidor
├── Fotos360/           # Fotos panorámicas 360° (.jpg)
└── client/
    ├── package.json    # Dependencias del cliente React
    ├── vite.config.js
    ├── index.html      # Incluye Pannellum CDN
    ├── tailwind.config.js
    └── src/
        ├── App.jsx
        ├── data/house.js     # Datos de la casa y fotos
        └── components/       # Navbar, Hero, Tour360, etc.
```

---

## Desarrollo Local

### Requisitos
- Node.js 20+ (Azure usa 22 LTS)
- npm 9+

### Pasos

```bash
# 1. Instalar dependencias del servidor
npm install

# 2. Instalar dependencias y compilar el cliente
npm run build

# 3. Iniciar el servidor
npm start
```

El sitio estará disponible en `http://localhost:3000`.

Para desarrollo con hot-reload del cliente:

```bash
# Terminal 1 — Servidor Express (se reinicia al guardar)
npm run dev

# Terminal 2 — Cliente React (dev server en puerto 5173)
cd client && npm run dev
```

---

## Personalización Antes de Publicar

Edita estos valores en los archivos correspondientes:

| Campo | Archivo |
|---|---|
| Teléfono de contacto | `client/src/components/Contact.jsx` |
| Email de contacto | `client/src/components/Contact.jsx` |
| Número WhatsApp | `client/src/components/Contact.jsx` |
| Precio / descripción | `client/src/data/house.js` |
| Link Google Maps real | `client/src/components/Location.jsx` |

---

## Pruebas

```bash
npm run install:all
npm run test:all     # servidor (node:test + supertest) y cliente (Vitest)
```

---

## Despliegue (Terraform + GitHub Actions)

La infraestructura está en `infra/` (Terraform) y se despliega con GitHub Actions usando OIDC:

| Ambiente | URL | Cuándo |
|---|---|---|
| dev | https://casa-reserva-akora-dev.azurewebsites.net | Automático al hacer merge a `main` |
| prod | https://casa-reserva-akora.azurewebsites.net | Después de dev, con aprobación manual |

Configuración inicial, día a día, costos y solución de problemas:
**[docs/DESPLIEGUE.md](docs/DESPLIEGUE.md)**.

### Regenerar las fotos optimizadas (solo si agregas fotos nuevas a `Fotos360/`)

```bash
cd Fotos360
for f in *.jpg; do
  convert "$f" -resize 4096x2048! -quality 82 -strip -interlace Plane "web/$f"
  convert "$f" -resize 800x400!   -quality 78 -strip -interlace Plane "thumbs/$f"
done
```

El sitio sirve solo `Fotos360/web` y `Fotos360/thumbs`; las originales (8–14 MB) no se despliegan.

---

## Licencia

Uso privado — Venta de propiedad residencial. No distribuir.
