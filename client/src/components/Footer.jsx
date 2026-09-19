import { casa } from '../data/house';

export default function Footer() {
  return (
    <footer className="bg-carbon/95 border-t border-white/5 py-8 text-center">
      <div className="container-page">
        <p className="font-serif text-dorado text-base sm:text-lg mb-1">
          Reserva de Akora · Tocancipá
        </p>
        <p className="text-white/30 text-[11px] sm:text-xs leading-relaxed">
          Casa en venta · {casa.area} m² · {casa.pisos} pisos · {casa.precio} negociables
        </p>
        <div className="mt-4 pt-4 border-t border-white/5">
          <p className="text-white/20 text-[11px] sm:text-xs leading-relaxed">
            Fotos tomadas con Insta 360 · Sitio web desarrollado para uso privado de venta
          </p>
        </div>
      </div>
    </footer>
  );
}
