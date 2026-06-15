import { ChevronDown, Camera, Phone } from 'lucide-react';

export default function Hero({ onVerTour }) {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Fondo con imagen 360 estática (fallback a gradiente) */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/fotos360/Fachada.jpg)' }}
      />
      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-gradient-to-b from-carbon/70 via-carbon/50 to-carbon/80" />

      {/* Contenido */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto animate-fade-in-up">
        <p className="text-dorado font-medium text-sm tracking-widest uppercase mb-4">
          Casa en Venta · Reserva de Akora · Tocancipá
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
          Tu Próximo Hogar<br />
          <span className="text-dorado">en la Sabana</span>
        </h1>
        <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
          Vivienda multinivel de 3 pisos · 104 m² · Chimenea · Balcón · Club House exclusivo
        </p>

        {/* Precio destacado */}
        <div className="inline-flex flex-col items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-sm px-8 py-4 mb-8">
          <span className="text-white/70 text-xs tracking-widest uppercase mb-1">Precio de venta</span>
          <span className="font-serif text-3xl md:text-4xl font-bold text-dorado">$420.000.000</span>
          <span className="text-white/60 text-sm mt-1">Negociables · Admón. $420.000/mes</span>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onVerTour}
            className="bg-dorado hover:bg-dorado-dark text-white font-semibold px-8 py-4 rounded-sm transition-colors duration-200 flex items-center justify-center gap-2 text-lg"
          >
            <Camera size={20} />
            Tour Virtual 360°
          </button>
          <a
            href="#contacto"
            className="border-2 border-white/60 hover:border-dorado hover:text-dorado text-white font-semibold px-8 py-4 rounded-sm transition-colors duration-200 flex items-center justify-center gap-2 text-lg"
          >
            <Phone size={20} />
            Contactar
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 animate-bounce">
        <span className="text-xs tracking-widest uppercase">Explorar</span>
        <ChevronDown size={20} />
      </div>
    </section>
  );
}
