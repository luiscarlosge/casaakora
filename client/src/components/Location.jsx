import { MapPin, Clock, Car } from 'lucide-react';

const distancias = [
  { lugar: 'Bogotá (Centro)', tiempo: '~45 min', via: 'Autopista Norte' },
  { lugar: 'Chía', tiempo: '~15 min', via: 'Vía Chía-Cajicá' },
  { lugar: 'Zipaquirá', tiempo: '~20 min', via: 'Autopista Norte' },
  { lugar: 'Centro Comercial Fontanar', tiempo: '~25 min', via: 'Autopista Norte' },
];

export default function Location() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Info */}
          <div>
            <p className="section-subtitle">Ubicación</p>
            <h2 className="section-title">Tocancipá, Cundinamarca</h2>
            <div className="divider-gold" />
            <div className="flex items-start gap-3 mb-6">
              <MapPin size={18} className="text-dorado flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-carbon">Conjunto Residencial Reserva de Akora</p>
                <p className="text-carbon/60 text-sm">Tocancipá, Cundinamarca, Colombia</p>
              </div>
            </div>

            <p className="text-carbon/70 leading-relaxed mb-8">
              Tocancipá es uno de los municipios de mayor crecimiento en la Sabana Norte,
              con excelente conectividad a Bogotá y una creciente oferta de servicios, comercio,
              educación y entretenimiento. Ideal para familias que buscan calidad de vida
              sin alejarse de la ciudad.
            </p>

            {/* Distancias */}
            <div className="space-y-3">
              <h3 className="font-semibold text-carbon flex items-center gap-2 text-sm">
                <Car size={16} className="text-dorado" />
                Distancias aproximadas
              </h3>
              {distancias.map((d, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-carbon/10">
                  <div>
                    <p className="text-carbon text-sm font-medium">{d.lugar}</p>
                    <p className="text-carbon/40 text-xs">{d.via}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-dorado">
                    <Clock size={13} />
                    <span className="text-sm font-semibold">{d.tiempo}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mapa */}
          <div className="rounded-sm overflow-hidden shadow-lg h-80 md:h-full min-h-80 bg-carbon/5">
            <iframe
              title="Ubicación Reserva de Akora Tocancipá"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '320px' }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.04!2d-73.9096701!3d4.9676179!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e4073516842c7a7%3A0x1f89a411b5ae5970!2sConjunto%20Residencial%20Reserva%20de%20Akora!5e0!3m2!1ses!2sco!4v1718469600000!5m2!1ses!2sco"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
