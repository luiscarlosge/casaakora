import { Phone, MessageCircle, Tag, Shield } from 'lucide-react';
import { casa, CONTACTO } from '../data/house';

export default function Contact() {
  const whatsappMsg = encodeURIComponent(CONTACTO.mensaje);

  return (
    <section id="contacto" className="section-pad bg-carbon text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Precio */}
        <div className="text-center mb-10 sm:mb-16">
          <p className="text-dorado font-medium text-xs sm:text-sm tracking-widest uppercase mb-3 sm:mb-4">
            Precio de venta
          </p>
          <div className="flex flex-col items-center bg-white/5 border border-white/10 rounded-sm px-4 sm:px-12 py-6 sm:py-8 mb-5 sm:mb-6 sm:inline-flex">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <Tag size={20} className="text-dorado flex-shrink-0" />
              <span className="font-serif text-[1.75rem] xs:text-4xl md:text-5xl font-bold text-dorado whitespace-nowrap">
                {casa.precio}
              </span>
            </div>
            <p className="text-white/50 text-xs sm:text-sm">Pesos colombianos · Precio negociable</p>
            <div className="w-full h-px bg-white/10 my-4" />
            <div className="grid grid-cols-3 gap-2 sm:flex sm:gap-8 text-center w-full sm:w-auto">
              <div>
                <p className="text-white/40 text-[10px] sm:text-xs uppercase tracking-widest leading-tight">
                  <span className="sm:hidden">Admón./mes</span>
                  <span className="hidden sm:inline">Administración</span>
                </p>
                <p className="text-white font-semibold text-sm sm:text-base mt-0.5 whitespace-nowrap">
                  <span className="sm:hidden">{casa.administracion.split(' / ')[0]}</span>
                  <span className="hidden sm:inline">{casa.administracion}</span>
                </p>
              </div>
              <div>
                <p className="text-white/40 text-[10px] sm:text-xs uppercase tracking-widest leading-tight">Área</p>
                <p className="text-white font-semibold text-sm sm:text-base mt-0.5">{casa.area} m²</p>
              </div>
              <div>
                <p className="text-white/40 text-[10px] sm:text-xs uppercase tracking-widest leading-tight">Estrato</p>
                <p className="text-white font-semibold text-sm sm:text-base mt-0.5">Consultar</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-white/40 text-xs sm:text-sm">
            <Shield size={14} className="flex-shrink-0" />
            <span>Propietario directo · Sin intermediarios</span>
          </div>
        </div>

        {/* Contacto — dos WhatsApp + llamada */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <a
            href={`https://wa.me/${CONTACTO.whatsapp1}?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-row sm:flex-col items-center gap-4 sm:gap-3 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 hover:border-[#25D366] rounded-sm p-4 sm:p-6 transition-all duration-200"
          >
            <MessageCircle size={28} className="text-[#25D366] flex-shrink-0" />
            <div className="text-left sm:text-center">
              <p className="text-white font-semibold text-sm">WhatsApp</p>
              <p className="text-[#25D366]/80 text-xs font-mono mt-1">+57 304 626 7937</p>
              <p className="text-white/30 text-xs mt-0.5">Escribir ahora</p>
            </div>
          </a>

          <a
            href={`https://wa.me/${CONTACTO.whatsapp2}?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-row sm:flex-col items-center gap-4 sm:gap-3 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 hover:border-[#25D366] rounded-sm p-4 sm:p-6 transition-all duration-200"
          >
            <MessageCircle size={28} className="text-[#25D366] flex-shrink-0" />
            <div className="text-left sm:text-center">
              <p className="text-white font-semibold text-sm">WhatsApp</p>
              <p className="text-[#25D366]/80 text-xs font-mono mt-1">+57 316 465 4180</p>
              <p className="text-white/30 text-xs mt-0.5">Escribir ahora</p>
            </div>
          </a>

          <a
            href={`tel:+${CONTACTO.whatsapp1}`}
            className="group flex flex-row sm:flex-col items-center gap-4 sm:gap-3 bg-dorado/10 hover:bg-dorado/20 border border-dorado/30 hover:border-dorado rounded-sm p-4 sm:p-6 transition-all duration-200"
          >
            <Phone size={28} className="text-dorado flex-shrink-0" />
            <div className="text-left sm:text-center">
              <p className="text-white font-semibold text-sm">Llamar</p>
              <p className="text-dorado/80 text-xs font-mono mt-1">+57 304 626 7937</p>
              <p className="text-white/30 text-xs mt-0.5">Lun – Sáb 8am – 7pm</p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
