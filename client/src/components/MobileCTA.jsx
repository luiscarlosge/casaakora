import { useEffect, useState } from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { casa, CONTACTO } from '../data/house';

/**
 * Barra fija de contacto en móvil. Aparece al salir del hero
 * y se oculta en pantallas medianas hacia arriba.
 */
export default function MobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.75);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  const whatsappMsg = encodeURIComponent(CONTACTO.mensaje);

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-carbon border-t border-dorado/30 shadow-[0_-4px_20px_rgba(0,0,0,0.35)] animate-slide-up pb-safe">
      <div className="flex items-center gap-2 px-3 py-2.5">
        <div className="min-w-0 flex-shrink">
          <p className="text-white/45 text-[10px] uppercase tracking-widest leading-none">Precio</p>
          <p className="font-serif text-dorado text-lg font-bold leading-tight whitespace-nowrap">
            {casa.precio}
          </p>
        </div>
        <a
          href={`tel:+${CONTACTO.whatsapp1}`}
          className="flex items-center justify-center w-12 h-12 rounded-sm border border-dorado/40 text-dorado flex-shrink-0"
          aria-label="Llamar"
        >
          <Phone size={20} />
        </a>
        <a
          href={`https://wa.me/${CONTACTO.whatsapp1}?text=${whatsappMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold text-sm h-12 rounded-sm min-w-0"
        >
          <MessageCircle size={18} className="flex-shrink-0" />
          <span className="truncate">
            <span className="xs:hidden">WhatsApp</span>
            <span className="hidden xs:inline">Escribir por WhatsApp</span>
          </span>
        </a>
      </div>
    </div>
  );
}
