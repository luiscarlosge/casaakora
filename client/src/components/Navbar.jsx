import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { casa } from '../data/house';

const links = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#descripcion', label: 'La Casa' },
  { href: '#pisos', label: 'Por Pisos' },
  { href: '#tour', label: 'Tour 360°' },
  { href: '#amenidades', label: 'Club House' },
  { href: '#contacto', label: 'Contacto' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Bloquear el scroll del fondo mientras el menú móvil está abierto
  useEffect(() => {
    document.body.style.overflow = menuAbierto ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuAbierto]);

  // Cerrar el menú si se pasa a desktop
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const cerrar = (e) => { if (e.matches) setMenuAbierto(false); };
    mq.addEventListener('change', cerrar);
    return () => mq.removeEventListener('change', cerrar);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 pt-safe ${
        scrolled || menuAbierto
          ? 'bg-carbon/95 backdrop-blur-sm shadow-lg py-2.5 sm:py-3'
          : 'bg-gradient-to-b from-carbon/60 to-transparent py-3 sm:py-5'
      }`}
    >
      <div className="container-page flex items-center justify-between gap-3">
        {/* Logo */}
        <a href="#inicio" className="flex flex-col leading-tight min-w-0">
          <span className="font-serif text-dorado text-base sm:text-lg font-semibold tracking-wide truncate">
            Reserva de Akora
          </span>
          <span className="text-white/70 text-[10px] sm:text-xs tracking-widest uppercase truncate">
            Tocancipá · Colombia
          </span>
        </a>

        {/* Links desktop */}
        <div className="hidden lg:flex items-center gap-5 xl:gap-6">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-white/80 hover:text-dorado text-sm font-medium transition-colors duration-200 whitespace-nowrap"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contacto"
            className="bg-dorado text-white text-sm font-semibold px-4 lg:px-5 py-2 rounded-sm hover:bg-dorado-dark transition-colors ml-1 whitespace-nowrap"
          >
            {casa.precioCorto} · Ver Precio
          </a>
        </div>

        {/* Precio compacto + hamburguesa en móvil */}
        <div className="flex lg:hidden items-center gap-2">
          <a
            href="#contacto"
            className="bg-dorado text-white text-xs font-bold px-3 py-2 rounded-sm whitespace-nowrap"
          >
            {casa.precioCorto}
          </a>
          <button
            className="text-white p-2 -mr-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
            onClick={() => setMenuAbierto(!menuAbierto)}
            aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuAbierto}
          >
            {menuAbierto ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      {menuAbierto && (
        <div className="lg:hidden bg-carbon border-t border-white/10 px-4 py-3 flex flex-col max-h-[calc(100dvh-64px)] overflow-y-auto pb-safe">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-white/85 hover:text-dorado py-3.5 font-medium border-b border-white/10"
              onClick={() => setMenuAbierto(false)}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contacto"
            className="bg-dorado text-white text-center font-semibold py-3.5 rounded-sm mt-4"
            onClick={() => setMenuAbierto(false)}
          >
            {casa.precio} · Ver Precio
          </a>
        </div>
      )}
    </nav>
  );
}
