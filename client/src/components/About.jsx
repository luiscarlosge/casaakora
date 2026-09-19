import { CheckCircle2 } from 'lucide-react';

const caracteristicas = [
  'Piso de madera laminada en toda la casa (exc. baños, cocina y patio)',
  'Chimenea funcional en la sala principal',
  'Balcón privado en el tercer piso',
  'Walking Closet en habitación principal',
  'Ático con tanque de reserva de agua de 250 L',
  'Cuarto de bodega bajo escalera del primer piso',
  'Puerta de seguridad blindada',
  'Parqueadero privado descubierto incluido',
  'Acceso completo al Club House del conjunto',
];

export default function About() {
  return (
    <section id="descripcion" className="section-pad bg-crema">
      <div className="container-page">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Imagen — primero en móvil para enganchar, a la derecha en desktop */}
          <div className="relative order-first md:order-last">
            <div className="aspect-[4/3] sm:aspect-[16/10] md:aspect-[4/5] overflow-hidden rounded-sm shadow-xl md:shadow-2xl">
              <img
                src="/sala-sm.jpg"
                srcSet="/sala-sm.jpg 800w, /sala.jpg 1200w"
                sizes="(min-width: 768px) 50vw, 100vw"
                alt="Sala principal con chimenea"
                loading="lazy"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Badge flotante */}
            <div className="absolute -bottom-4 left-3 md:-bottom-6 md:-left-6 bg-carbon text-white px-4 py-3 md:p-6 shadow-xl">
              <p className="text-dorado font-serif text-2xl md:text-3xl font-bold leading-none">104</p>
              <p className="text-white/70 text-[10px] md:text-xs tracking-widest uppercase mt-1">metros²</p>
              <p className="text-white/70 text-[10px] md:text-xs mt-0.5 md:mt-1">3 pisos · 3 habs.</p>
            </div>
          </div>

          {/* Texto */}
          <div className="pt-6 md:pt-0">
            <p className="section-subtitle">La vivienda</p>
            <h2 className="section-title">
              Diseñada para el<br className="hidden sm:block" /> confort familiar
            </h2>
            <div className="divider-gold" />
            <p className="text-carbon/70 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6">
              Ubicada en el exclusivo <strong>Conjunto Residencial Reserva de Akora</strong> en Tocancipá,
              esta vivienda multinivel de 3 pisos ofrece 104 m² cuidadosamente distribuidos
              para maximizar el espacio y la funcionalidad.
            </p>
            <p className="text-carbon/70 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8">
              Con acabados en <strong>piso de madera laminada</strong>, chimenea funcional y múltiples
              espacios flexibles, esta casa es perfecta para familias que buscan comodidad,
              privacidad y una excelente calidad de vida a las afueras de Bogotá.
            </p>

            <ul className="space-y-2.5 sm:space-y-3">
              {caracteristicas.map((c, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-dorado flex-shrink-0 mt-0.5" />
                  <span className="text-carbon/80 text-sm leading-snug">{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
