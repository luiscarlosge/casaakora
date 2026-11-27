import { ChevronDown, Camera, Phone } from 'lucide-react';
import { casa } from '../data/house';

export default function Hero({ onVerTour }) {
  return (
    <section
      id="inicio"
      className="relative min-h-screen-dvh flex items-center justify-center overflow-hidden"
    >
      {/* Fondo: recorte vertical en móvil, panorámico en escritorio */}
      <picture>
        <source media="(min-width: 768px)" srcSet="/hero-wide.jpg" />
        <img
          src="/hero-tall.jpg"
          alt="Fachada de la casa en Reserva de Akora, Tocancipá"
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </picture>
      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-gradient-to-b from-carbon/75 via-carbon/55 to-carbon/85" />

      {/* Contenido */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 max-w-4xl mx-auto animate-fade-in-up pt-24 pb-24 sm:py-28">
        <p className="text-dorado font-medium text-[11px] sm:text-sm tracking-[0.15em] sm:tracking-widest uppercase mb-3 sm:mb-4">
          Casa en Venta · Reserva de Akora · Tocancipá
        </p>
        <h1 className="font-serif text-[2rem] xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-4 sm:mb-6">
          Tu Próximo Hogar
          <br />
          <span className="text-dorado">en la Sabana</span>
        </h1>
        <p className="text-white/85 text-sm sm:text-lg md:text-xl max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed">
          Vivienda multinivel de 3 pisos · 104 m²
          <span className="hidden xs:inline"> · Chimenea · Balcón</span>
          <span className="hidden sm:inline"> · Club House exclusivo</span>
        </p>

        {/* Precio destacado */}
        <div className="inline-flex flex-col items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-sm px-5 sm:px-8 py-3.5 sm:py-4 mb-6 sm:mb-8 max-w-full">
          <span className="text-white/70 text-[10px] sm:text-xs tracking-widest uppercase mb-1">
            Precio de venta
          </span>
          <span className="font-serif text-2xl xs:text-3xl md:text-4xl font-bold text-dorado whitespace-nowrap">
            {casa.precio}
          </span>
          <span className="text-white/60 text-xs sm:text-sm mt-1">
            Negociables · Admón. {casa.administracion}
          </span>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <button
            onClick={onVerTour}
            className="bg-dorado hover:bg-dorado-dark text-white font-semibold px-6 sm:px-8 py-3.5 sm:py-4 rounded-sm transition-colors duration-200 flex items-center justify-center gap-2 text-base sm:text-lg min-h-[52px]"
          >
            <Camera size={20} />
            Tour Virtual 360°
          </button>
          <a
            href="#contacto"
            className="border-2 border-white/60 hover:border-dorado hover:text-dorado text-white font-semibold px-6 sm:px-8 py-3.5 sm:py-4 rounded-sm transition-colors duration-200 flex items-center justify-center gap-2 text-base sm:text-lg min-h-[52px]"
          >
            <Phone size={20} />
            Contactar
          </a>
        </div>
      </div>

      {/* Indicador de scroll — oculto en pantallas bajas para no chocar con los CTAs */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 text-white/50 animate-bounce">
        <span className="text-xs tracking-widest uppercase">Explorar</span>
        <ChevronDown size={20} />
      </div>
    </section>
  );
}
