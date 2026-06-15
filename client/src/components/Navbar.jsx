import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

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
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-carbon/95 backdrop-blur-sm shadow-lg py-3' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#inicio" className="flex flex-col leading-none">
          <span className="font-serif text-dorado text-lg font-semibold tracking-wide">Reserva de Akora</span>
          <span className="text-white/70 text-xs tracking-widest uppercase">Tocancipá · Colombia</span>
        </a>

        {/* Links desktop */}
        <div className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <a
              key={l.href}
              href={l.href}
              className="text-white/80 hover:text-dorado text-sm font-medium transition-colors duration-200"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contacto"
            className="bg-dorado text-white text-sm font-semibold px-5 py-2 rounded-sm hover:bg-dorado-dark transition-colors ml-2"
          >
            $420M · Ver Precio
          </a>
        </div>

        {/* Hamburger mobile */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMenuAbierto(!menuAbierto)}
          aria-label="Menú"
        >
          {menuAbierto ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menú mobile */}
      {menuAbierto && (
        <div className="md:hidden bg-carbon/98 border-t border-white/10 px-4 py-4 flex flex-col gap-4">
          {links.map(l => (
            <a
              key={l.href}
              href={l.href}
              className="text-white/80 hover:text-dorado py-2 font-medium border-b border-white/10"
              onClick={() => setMenuAbierto(false)}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contacto"
            className="bg-dorado text-white text-center font-semibold py-3 rounded-sm mt-2"
            onClick={() => setMenuAbierto(false)}
          >
            $420M · Ver Precio
          </a>
        </div>
      )}
    </nav>
  );
}
