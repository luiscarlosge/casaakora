import { Phone, MessageCircle, Mail, Tag, Shield } from 'lucide-react';

const NUM1 = '573046267937';
const NUM2 = '573164654180';

export default function Contact() {
  const whatsappMsg = encodeURIComponent(
    '¡Hola! Me interesa la casa en Reserva de Akora, Tocancipá. ¿Podría darme más información?'
  );

  return (
    <section id="contacto" className="py-20 bg-carbon text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Precio */}
        <div className="text-center mb-16">
          <p className="text-dorado font-medium text-sm tracking-widest uppercase mb-4">
            Precio de venta
          </p>
          <div className="inline-flex flex-col items-center bg-white/5 border border-white/10 rounded-sm px-12 py-8 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Tag size={20} className="text-dorado" />
              <span className="font-serif text-4xl md:text-5xl font-bold text-dorado">
                $420.000.000
              </span>
            </div>
            <p className="text-white/50 text-sm">Pesos colombianos · Precio negociable</p>
            <div className="w-full h-px bg-white/10 my-4" />
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-center">
              <div>
                <p className="text-white/40 text-xs uppercase tracking-widest">Administración</p>
                <p className="text-white font-semibold">$420.000 / mes</p>
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-widest">Área</p>
                <p className="text-white font-semibold">104 m²</p>
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-widest">Estrato</p>
                <p className="text-white font-semibold">Consultar</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-white/40 text-sm">
            <Shield size={14} />
            <span>Propietario directo · Sin intermediarios</span>
          </div>
        </div>

        {/* Contacto — dos WhatsApp + Email */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {/* WhatsApp 1 */}
          <a
            href={`https://wa.me/${NUM1}?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-3 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 hover:border-[#25D366] rounded-sm p-6 transition-all duration-200"
          >
            <MessageCircle size={28} className="text-[#25D366]" />
            <div className="text-center">
              <p className="text-white font-semibold text-sm">WhatsApp</p>
              <p className="text-[#25D366]/80 text-xs font-mono mt-1">+57 304 626 7937</p>
              <p className="text-white/30 text-xs mt-0.5">Escribir ahora</p>
            </div>
          </a>

          {/* WhatsApp 2 */}
          <a
            href={`https://wa.me/${NUM2}?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-3 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 hover:border-[#25D366] rounded-sm p-6 transition-all duration-200"
          >
            <MessageCircle size={28} className="text-[#25D366]" />
            <div className="text-center">
              <p className="text-white font-semibold text-sm">WhatsApp</p>
              <p className="text-[#25D366]/80 text-xs font-mono mt-1">+57 316 465 4180</p>
              <p className="text-white/30 text-xs mt-0.5">Escribir ahora</p>
            </div>
          </a>

          {/* Llamada */}
          <a
            href={`tel:+${NUM1}`}
            className="group flex flex-col items-center gap-3 bg-dorado/10 hover:bg-dorado/20 border border-dorado/30 hover:border-dorado rounded-sm p-6 transition-all duration-200"
          >
            <Phone size={28} className="text-dorado" />
            <div className="text-center">
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
