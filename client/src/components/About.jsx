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
    <section id="descripcion" className="py-20 bg-crema">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Texto */}
          <div>
            <p className="section-subtitle">La vivienda</p>
            <h2 className="section-title">Diseñada para el<br />confort familiar</h2>
            <div className="divider-gold" />
            <p className="text-carbon/70 leading-relaxed mb-6">
              Ubicada en el exclusivo <strong>Conjunto Residencial Reserva de Akora</strong> en Tocancipá,
              esta vivienda multinivel de 3 pisos ofrece 104 m² cuidadosamente distribuidos
              para maximizar el espacio y la funcionalidad.
            </p>
            <p className="text-carbon/70 leading-relaxed mb-8">
              Con acabados en <strong>piso de madera laminada</strong>, chimenea funcional y múltiples
              espacios flexibles, esta casa es perfecta para familias que buscan comodidad,
              privacidad y una excelente calidad de vida a las afueras de Bogotá.
            </p>

            <ul className="space-y-3">
              {caracteristicas.map((c, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-dorado flex-shrink-0 mt-0.5" />
                  <span className="text-carbon/80 text-sm">{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Imagen destacada */}
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-sm shadow-2xl">
              <img
                src="/fotos360/SalaPiso1.jpg"
                alt="Sala principal con chimenea"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Badge flotante */}
            <div className="absolute -bottom-6 -left-6 bg-carbon text-white p-6 shadow-xl hidden md:block">
              <p className="text-dorado font-serif text-3xl font-bold">104</p>
              <p className="text-white/70 text-xs tracking-widest uppercase">metros²</p>
              <p className="text-white/70 text-xs mt-1">3 pisos · 3 habs.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
