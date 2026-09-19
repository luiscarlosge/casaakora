import { useState } from 'react';
import { Camera, RotateCcw } from 'lucide-react';
import { fotos, IMG } from '../data/house';

const categorias = ['Todos', 'Exterior', 'Primer Piso', 'Segundo Piso', 'Tercer Piso'];

export default function VirtualTour({ onAbrirFoto }) {
  const [filtro, setFiltro] = useState('Todos');

  const fotosFiltradas =
    filtro === 'Todos' ? fotos : fotos.filter((f) => f.categoria === filtro);

  return (
    <section id="tour" className="section-pad bg-carbon text-white">
      <div className="container-page">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <p className="text-dorado font-medium text-xs sm:text-sm tracking-widest uppercase mb-3">
            Recorrido inmersivo
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white mb-2">
            Tour Virtual 360°
          </h2>
          <div className="w-14 sm:w-16 h-0.5 bg-dorado mx-auto mt-4 mb-5 sm:mb-6" />
          <p className="text-white/60 text-sm sm:text-base max-w-xl mx-auto">
            <span className="sm:hidden">Toca cualquier habitación para explorarla en 360°. Desliza con el dedo para girar.</span>
            <span className="hidden sm:inline">
              Haz clic en cualquier habitación para explorarla en 360°.
              Arrastra para girar, usa la rueda para acercar o alejar.
            </span>
          </p>
        </div>

        {/* Filtros — deslizables en móvil */}
        <div className="scroll-row mb-8 sm:mb-10">
          {categorias.map((c) => (
            <button
              key={c}
              onClick={() => setFiltro(c)}
              className={`px-4 py-2.5 text-sm font-medium rounded-sm transition-all duration-200 whitespace-nowrap min-h-[44px] ${
                filtro === c
                  ? 'bg-dorado text-white'
                  : 'border border-white/20 text-white/60 hover:border-dorado hover:text-dorado'
              }`}
              aria-pressed={filtro === c}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Grid de fotos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
          {fotosFiltradas.map((foto) => (
            <button
              key={foto.id}
              onClick={() => onAbrirFoto(foto)}
              className="group relative aspect-[4/3] sm:aspect-square overflow-hidden rounded-sm bg-white/5 hover:ring-2 hover:ring-dorado transition-all duration-200"
            >
              <img
                src={IMG.thumb(foto.archivo)}
                alt={foto.titulo}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/40 to-transparent" />

              {/* Icono 360 — siempre visible en móvil (no hay hover) */}
              <div className="absolute top-2 right-2 bg-dorado/90 text-white rounded-full p-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <RotateCcw size={14} />
              </div>

              {/* Info */}
              <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-3 text-left">
                <div className="flex items-center gap-1.5 mb-0.5 sm:mb-1">
                  <span className="text-sm sm:text-base">{foto.emoji}</span>
                  <span className="text-dorado text-[10px] sm:text-xs font-medium truncate">
                    {foto.categoria}
                  </span>
                </div>
                <p className="text-white text-[11px] sm:text-xs font-semibold leading-tight">
                  {foto.titulo}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Nota */}
        <div className="text-center mt-8 sm:mt-12">
          <p className="text-white/40 text-xs sm:text-sm flex items-center justify-center gap-2">
            <Camera size={16} />
            {fotos.length} fotos 360° disponibles — tomadas con Insta 360
          </p>
        </div>
      </div>
    </section>
  );
}
