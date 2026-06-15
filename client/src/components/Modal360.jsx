import { useEffect, useRef, useState, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, RotateCcw, Maximize2 } from 'lucide-react';
import { fotos } from '../data/house';

export default function Modal360({ foto, onCerrar }) {
  const viewerRef = useRef(null);
  const pannellumRef = useRef(null);
  const [cargando, setCargando] = useState(true);
  const [indiceActual, setIndiceActual] = useState(fotos.findIndex(f => f.id === foto.id));

  const fotoActual = fotos[indiceActual];

  // Inicializar Pannellum
  const iniciarViewer = useCallback((archivo) => {
    if (!viewerRef.current || !window.pannellum) return;

    setCargando(true);

    if (pannellumRef.current) {
      try { pannellumRef.current.destroy(); } catch (_) {}
      pannellumRef.current = null;
    }

    pannellumRef.current = window.pannellum.viewer(viewerRef.current, {
      type: 'equirectangular',
      panorama: `/fotos360/${archivo}`,
      preview: `/fotos360/${archivo}`,
      autoLoad: true,
      autoRotate: -1.5,
      autoRotateInactivityDelay: 4000,
      compass: false,
      showControls: true,
      showZoomCtrl: true,
      showFullscreenCtrl: true,
      mouseZoom: true,
      hfov: 110,
      minHfov: 60,
      maxHfov: 130,
      strings: {
        loadButtonLabel: 'Cargar 360°',
        loadingLabel: 'Cargando...',
        noPanoramaError: 'No se encontró la imagen.',
        fileAccessError: 'Error cargando la foto.',
        genericWebGLError: 'WebGL no disponible en este navegador.',
        unknownError: 'Error desconocido.',
      },
    });

    // Pannellum usa viewer.on() para eventos — NO onLoad en el config
    const limpiar = () => setCargando(false);
    try {
      pannellumRef.current.on('load', limpiar);
      pannellumRef.current.on('error', limpiar);
    } catch (_) {}

    // Timeout de seguridad: si los eventos no disparan, ocultar después de 12 s
    const fallback = setTimeout(limpiar, 12000);
    pannellumRef.current._fallbackTimer = fallback;
  }, []);

  useEffect(() => {
    iniciarViewer(fotoActual.archivo);
    return () => {
      if (pannellumRef.current) {
        clearTimeout(pannellumRef.current._fallbackTimer);
        try { pannellumRef.current.destroy(); } catch (_) {}
      }
    };
  }, [indiceActual]);

  // Cerrar con Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onCerrar();
      if (e.key === 'ArrowLeft') setIndiceActual(i => (i - 1 + fotos.length) % fotos.length);
      if (e.key === 'ArrowRight') setIndiceActual(i => (i + 1) % fotos.length);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onCerrar]);

  // Bloquear scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const anterior = () => setIndiceActual(i => (i - 1 + fotos.length) % fotos.length);
  const siguiente = () => setIndiceActual(i => (i + 1) % fotos.length);

  return (
    <div
      className="fixed inset-0 z-50 bg-carbon flex flex-col modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onCerrar(); }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 flex-shrink-0 bg-carbon/95">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xl flex-shrink-0">{fotoActual.emoji}</span>
          <div className="min-w-0">
            <h3 className="text-white font-semibold text-sm truncate">{fotoActual.titulo}</h3>
            <p className="text-white/40 text-xs">{fotoActual.categoria}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-white/30 text-xs hidden sm:block">
            {indiceActual + 1} / {fotos.length}
          </span>
          <div className="hidden sm:flex items-center gap-1 text-white/25 text-xs">
            <RotateCcw size={11} />
            <span>Arrastra · Rueda para zoom · ← →</span>
          </div>
          <button
            onClick={onCerrar}
            className="text-white/50 hover:text-white p-2 hover:bg-white/10 rounded-sm transition-colors"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Viewer area */}
      <div className="relative flex-1 overflow-hidden bg-carbon">
        {/* Placeholder con thumbnail mientras carga — desaparece al terminar */}
        {cargando && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
            {/* Thumbnail borroso como preview inmediato */}
            <img
              src={`/fotos360/${fotoActual.archivo}`}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-30 blur-sm scale-105"
              aria-hidden
            />
            <div className="relative z-10 flex flex-col items-center gap-3 text-white/70">
              <div className="w-10 h-10 border-2 border-dorado/40 border-t-dorado rounded-full animate-spin" />
              <span className="text-sm bg-carbon/60 px-3 py-1 rounded-sm">Cargando panorama 360°…</span>
            </div>
          </div>
        )}

        {/* Pannellum */}
        <div ref={viewerRef} className="w-full h-full" />

        {/* Flechas navegación */}
        <button
          onClick={anterior}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-carbon/70 hover:bg-dorado text-white p-3 rounded-full transition-colors shadow-lg backdrop-blur-sm"
          aria-label="Foto anterior"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={siguiente}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-carbon/70 hover:bg-dorado text-white p-3 rounded-full transition-colors shadow-lg backdrop-blur-sm"
          aria-label="Foto siguiente"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Tira de thumbnails */}
      <div className="flex-shrink-0 bg-carbon/95 border-t border-white/10 py-2 px-3 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {fotos.map((f, i) => (
            <button
              key={f.id}
              onClick={() => setIndiceActual(i)}
              title={f.titulo}
              className={`flex-shrink-0 w-14 h-10 sm:w-16 sm:h-11 overflow-hidden rounded-sm transition-all duration-150 ${
                i === indiceActual
                  ? 'ring-2 ring-dorado opacity-100'
                  : 'opacity-35 hover:opacity-65'
              }`}
            >
              <img
                src={`/fotos360/${f.archivo}`}
                alt={f.titulo}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
