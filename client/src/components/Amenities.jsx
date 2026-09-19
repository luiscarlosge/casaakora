import { amenidades, casa } from '../data/house';

export default function Amenities() {
  return (
    <section id="amenidades" className="section-pad bg-crema">
      <div className="container-page">
        <div className="text-center mb-8 sm:mb-12">
          <p className="section-subtitle">Conjunto Residencial</p>
          <h2 className="section-title">Club House Reserva de Akora</h2>
          <div className="divider-gold mx-auto" />
          <p className="text-carbon/60 text-sm sm:text-base max-w-xl mx-auto">
            El conjunto cuenta con instalaciones de primer nivel para el disfrute
            de toda la familia, disponibles para todos los residentes.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {amenidades.map((a, i) => (
            <div
              key={i}
              className="bg-white p-4 sm:p-6 rounded-sm shadow-sm hover:shadow-md hover:border-dorado border border-transparent transition-all duration-200 flex flex-col items-center text-center gap-2 sm:gap-3"
            >
              <span className="text-3xl sm:text-4xl">{a.icono}</span>
              <div>
                <h3 className="font-semibold text-carbon text-[13px] sm:text-sm leading-snug">{a.nombre}</h3>
                <p className="text-carbon/50 text-[11px] sm:text-xs mt-1 leading-relaxed">{a.detalle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Nota de administración */}
        <div className="mt-8 sm:mt-10 bg-carbon text-white rounded-sm p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="font-serif text-lg text-dorado">Administración</p>
            <p className="text-white/60 text-sm mt-1 leading-snug">
              Acceso a todas las amenidades del conjunto incluidas en la cuota mensual.
            </p>
          </div>
          <div className="sm:text-right flex-shrink-0">
            <p className="font-serif text-2xl sm:text-3xl text-dorado font-bold">
              {casa.administracion.split(' / ')[0]}
            </p>
            <p className="text-white/50 text-xs">por mes</p>
          </div>
        </div>
      </div>
    </section>
  );
}
