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
    <section className="bg-carbon text-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-0 divide-x divide-white/10">
          {stats.map((s, i) => (
            <div key={i} className="flex flex-col items-center py-4 px-3 text-center">
              <div className="flex items-baseline gap-1">
                <span className="font-serif text-2xl md:text-3xl font-bold text-dorado">{s.valor}</span>
                {s.unidad && <span className="text-dorado/80 text-sm">{s.unidad}</span>}
              </div>
              <span className="text-white/60 text-xs mt-1 tracking-wide">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
