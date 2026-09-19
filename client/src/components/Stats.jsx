const stats = [
  { valor: '104', unidad: 'm²', label: 'Área Total' },
  { valor: '3', unidad: '', label: 'Pisos' },
  { valor: '3+2', unidad: '', label: 'Hab. + Estudios' },
  { valor: '3', unidad: '', label: 'Baños' },
  { valor: '1', unidad: '', label: 'Parqueadero' },
  { valor: '250', unidad: 'L', label: 'Tanque Reserva' },
];

export default function Stats() {
  return (
    <section className="bg-carbon text-white py-4 sm:py-8">
      <div className="container-page">
        {/* En móvil: 3 columnas con separadores en ambos ejes; en desktop: una sola fila */}
        <div className="grid grid-cols-3 md:grid-cols-6">
          {stats.map((s, i) => (
            <div
              key={i}
              className={`flex flex-col items-center py-3 sm:py-4 px-2 sm:px-3 text-center border-white/10
                ${i % 3 !== 2 ? 'border-r' : ''} md:border-r
                ${i < 3 ? 'border-b md:border-b-0' : ''}
                ${i === 5 ? 'md:border-r-0' : ''}
                ${i === 2 ? 'border-r-0 md:border-r' : ''}`}
            >
              <div className="flex items-baseline gap-1">
                <span className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-dorado">
                  {s.valor}
                </span>
                {s.unidad && <span className="text-dorado/80 text-xs sm:text-sm">{s.unidad}</span>}
              </div>
              <span className="text-white/60 text-[10px] sm:text-xs mt-1 tracking-wide leading-tight">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
