import { useEffect, useRef, useState, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { fotos, IMG } from '../data/house';

export default function Modal360({ foto, onCerrar }) {
  const viewerRef = useRef(null);
  const pannellumRef = useRef(null);
  const [cargando, setCargando] = useState(true);
  const [indiceActual, setIndiceActual] = useState(fotos.findIndex((f) => f.id === foto.id));

  const fotoActual = fotos[indiceActual];

  // Inicializar Pannellum con el panorama optimizado (4096x2048)
  const iniciarViewer = useCallback((archivo) => {
    if (!viewerRef.current || !window.pannellum) return;

    setCargando(true);

    if (pannellumRef.current) {
      try { pannellumRef.current.destroy(); } catch (_) {}
      pannellumRef.current = null;
    }

    const esMovil = window.matchMedia('(max-width: 640px)').matches;

    pannellumRef.current = window.pannellum.viewer(viewerRef.current, {
      type: 'equirectangular',
      panorama: IMG.web(archivo),
      preview: IMG.thumb(archivo),
      autoLoad: true,
      autoRotate: -1.5,
      autoRotateInactivityDelay: 4000,
      compass: false,
      showControls: true,
      showZoomCtrl: !esMovil, // en móvil se usa pellizcar para hacer zoom
      showFullscreenCtrl: true,
      mouseZoom: true,
      hfov: esMovil ? 100 : 110,
      minHfov: 50,
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

    const limpiar = () => setCargando(false);
    try {
      pannellumRef.current.on('load', limpiar);
      pannellumRef.current.on('error', limpiar);
    } catch (_) {}

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

  // Teclado
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onCerrar();
      if (e.key === 'ArrowLeft') setIndiceActual((i) => (i - 1 + fotos.length) % fotos.length);
      if (e.key === 'ArrowRight') setIndiceActual((i) => (i + 1) % fotos.length);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onCerrar]);

  // Bloquear scroll del fondo
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const anterior = () => setIndiceActual((i) => (i - 1 + fotos.length) % fotos.length);
  const siguiente = () => setIndiceActual((i) => (i + 1) % fotos.length);

  return (
    <div className="fixed inset-0 z-[60] bg-carbon flex flex-col modal-overlay h-screen-dvh">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-white/10 flex-shrink-0 bg-carbon/95 pt-safe">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <span className="text-lg sm:text-xl flex-shrink-0">{fotoActual.emoji}</span>
          <div className="min-w-0">
            <h3 className="text-white font-semibold text-[13px] sm:text-sm truncate">
              {fotoActual.titulo}
            </h3>
            <p className="text-white/40 text-[11px] sm:text-xs truncate">{fotoActual.categoria}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <span className="text-white/30 text-[11px] sm:text-xs tabular-nums">
            {indiceActual + 1} / {fotos.length}
          </span>
          <div className="hidden lg:flex items-center gap-1 text-white/25 text-xs">
            <RotateCcw size={11} />
            <span>Arrastra · Rueda para zoom · ← →</span>
          </div>
          <button
            onClick={onCerrar}
            className="text-white/60 hover:text-white p-2 -mr-1 hover:bg-white/10 rounded-sm transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Cerrar"
          >
            <X size={22} />
          </button>
        </div>
      </div>

      {/* Visor */}
      <div className="relative flex-1 overflow-hidden bg-carbon min-h-0">
        {cargando && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
            <img
              src={IMG.thumb(fotoActual.archivo)}
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

        <div ref={viewerRef} className="w-full h-full" />

        {/* Flechas de navegación */}
        <button
          onClick={anterior}
          className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 bg-carbon/70 hover:bg-dorado text-white p-2.5 sm:p-3 rounded-full transition-colors shadow-lg backdrop-blur-sm"
          aria-label="Foto anterior"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={siguiente}
          className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 bg-carbon/70 hover:bg-dorado text-white p-2.5 sm:p-3 rounded-full transition-colors shadow-lg backdrop-blur-sm"
          aria-label="Foto siguiente"
        >
          <ChevronRight size={20} />
        </button>

        {/* Pista táctil en móvil */}
        <p className="sm:hidden absolute top-2 left-1/2 -translate-x-1/2 z-20 text-white/50 text-[11px] bg-carbon/60 px-2.5 py-1 rounded-full whitespace-nowrap">
          Desliza para girar · Pellizca para zoom
        </p>
      </div>

      {/* Tira de miniaturas */}
      <div className="flex-shrink-0 bg-carbon/95 border-t border-white/10 py-2 px-3 overflow-x-auto pb-safe">
        <div className="flex gap-2 min-w-max">
          {fotos.map((f, i) => (
            <button
              key={f.id}
              onClick={() => setIndiceActual(i)}
              title={f.titulo}
              className={`flex-shrink-0 w-14 h-10 sm:w-16 sm:h-11 overflow-hidden rounded-sm transition-all duration-150 ${
                i === indiceActual ? 'ring-2 ring-dorado opacity-100' : 'opacity-35 hover:opacity-65'
              }`}
            >
              <img
                src={IMG.thumb(f.archivo)}
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
