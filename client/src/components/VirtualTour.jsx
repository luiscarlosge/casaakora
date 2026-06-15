import { useState } from 'react';
import { Camera, RotateCcw } from 'lucide-react';
import { fotos } from '../data/house';

const categorias = ['Todos', 'Exterior', 'Primer Piso', 'Segundo Piso', 'Tercer Piso'];

export default function VirtualTour({ onAbrirFoto }) {
  const [filtro, setFiltro] = useState('Todos');

  const fotosFiltradas = filtro === 'Todos'
    ? fotos
    : fotos.filter(f => f.categoria === filtro);

  return (
    <section id="tour" className="py-20 bg-carbon text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-dorado font-medium text-sm tracking-widest uppercase mb-3">
            Recorrido inmersivo
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-white mb-2">
            Tour Virtual 360°
          </h2>
          <div className="w-16 h-0.5 bg-dorado mx-auto mt-4 mb-6" />
          <p className="text-white/60 max-w-xl mx-auto">
            Haz clic en cualquier habitación para explorarla en 360°.
            Arrastra para girar, usa la rueda para acercar o alejar.
          </p>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categorias.map(c => (
            <button
              key={c}
              onClick={() => setFiltro(c)}
              className={`px-4 py-2 text-sm font-medium rounded-sm transition-all duration-200 ${
                filtro === c
                  ? 'bg-dorado text-white'
                  : 'border border-white/20 text-white/60 hover:border-dorado hover:text-dorado'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Grid de fotos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {fotosFiltradas.map(foto => (
            <button
              key={foto.id}
              onClick={() => onAbrirFoto(foto)}
              className="group relative aspect-square overflow-hidden rounded-sm bg-white/5 hover:ring-2 hover:ring-dorado transition-all duration-200"
            >
              <img
                src={`/fotos360/${foto.archivo}`}
                alt={foto.titulo}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-carbon/90 via-carbon/20 to-transparent" />

              {/* Icono 360 */}
              <div className="absolute top-2 right-2 bg-dorado/90 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <RotateCcw size={14} />
              </div>

              {/* Info */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-base">{foto.emoji}</span>
                  <span className="text-dorado text-xs font-medium">{foto.categoria}</span>
                </div>
                <p className="text-white text-xs font-semibold leading-tight">{foto.titulo}</p>
              </div>
            </button>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-white/40 text-sm mb-4 flex items-center justify-center gap-2">
            <Camera size={16} />
            {fotos.length} fotos 360° disponibles — tomadas con Insta 360
          </p>
        </div>
      </div>
    </section>
  );
}
