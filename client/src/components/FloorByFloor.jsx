import { useState } from 'react';
import { Camera, ChevronRight } from 'lucide-react';
import { pisos, fotos, IMG } from '../data/house';

export default function FloorByFloor({ onAbrirFoto }) {
  const [pisoActivo, setPisoActivo] = useState(1);

  const piso = pisos.find((p) => p.numero === pisoActivo);
  const fotosPiso = fotos.filter((f) => f.piso === pisoActivo);

  return (
    <section id="pisos" className="section-pad bg-white">
      <div className="container-page">
        <div className="text-center mb-8 sm:mb-12">
          <p className="section-subtitle">Distribución</p>
          <h2 className="section-title">Recorre cada piso</h2>
          <div className="divider-gold mx-auto" />
          <p className="text-carbon/60 text-sm sm:text-base max-w-xl mx-auto">
            Explora los espacios de cada nivel de la vivienda y conoce cada detalle.
          </p>
        </div>

        {/* Selector de pisos — deslizable en móvil */}
        <div className="scroll-row mb-8 sm:mb-10">
          {pisos.map((p) => (
            <button
              key={p.numero}
              onClick={() => setPisoActivo(p.numero)}
              className={`flex items-center gap-2 px-4 sm:px-6 py-3 font-medium text-sm transition-all duration-200 rounded-sm min-h-[46px] ${
                pisoActivo === p.numero
                  ? 'bg-carbon text-dorado shadow-lg'
                  : 'bg-white border border-carbon/20 text-carbon/70 hover:border-dorado hover:text-dorado'
              }`}
              aria-pressed={pisoActivo === p.numero}
            >
              <span>{p.icono}</span>
              <span className="whitespace-nowrap">{p.titulo}</span>
            </button>
          ))}
        </div>

        {/* Contenido del piso */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-10 items-start">
          {/* Espacios */}
          <div>
            <div className="flex items-start gap-3 mb-5 sm:mb-6">
              <span className="text-2xl sm:text-3xl leading-none">{piso.icono}</span>
              <div>
                <h3 className="font-serif text-xl sm:text-2xl text-carbon">{piso.titulo}</h3>
                <p className="text-carbon/60 text-sm mt-1 leading-snug">{piso.descripcion}</p>
              </div>
            </div>

            <div className="space-y-2.5 sm:space-y-3">
              {piso.espacios.map((e, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 sm:gap-4 p-3.5 sm:p-4 bg-crema rounded-sm hover:bg-dorado/5 transition-colors"
                >
                  <ChevronRight size={16} className="text-dorado flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-carbon text-sm">{e.nombre}</p>
                    <p className="text-carbon/60 text-xs mt-0.5 leading-relaxed">{e.detalle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fotos del piso */}
          <div>
            <p className="text-[11px] sm:text-xs text-carbon/40 uppercase tracking-widest mb-3 sm:mb-4 flex items-center gap-2">
              <Camera size={14} />
              Fotos 360° — {piso.titulo}
            </p>
            {fotosPiso.length > 0 ? (
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {fotosPiso.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => onAbrirFoto(f)}
                    className="group relative aspect-[4/3] sm:aspect-square overflow-hidden rounded-sm shadow-md hover:shadow-xl transition-shadow"
                  >
                    <img
                      src={IMG.thumb(f.archivo)}
                      alt={f.titulo}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-carbon/0 group-hover:bg-carbon/40 transition-colors duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center gap-1 text-white">
                        <Camera size={24} />
                        <span className="text-xs font-medium">Ver 360°</span>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-carbon/85 to-transparent p-2">
                      <p className="text-white text-[11px] sm:text-xs font-medium leading-tight text-left">
                        {f.titulo}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="aspect-video sm:aspect-square bg-crema rounded-sm flex items-center justify-center text-carbon/30">
                <Camera size={48} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
