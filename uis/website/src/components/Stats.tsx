const stats = [
  { value: "12+", label: "Años de experiencia" },
  { value: "120", label: "Empleados en 2 países" },
  { value: "8M+", label: "Facturación anual (USD)" },
  { value: "300+", label: "Clientes atendidos" },
];

export default function Stats() {
  return (
    <section id="resultados" className="py-16 bg-primary-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="font-heading text-4xl lg:text-5xl font-extrabold text-accent-400 mb-2">
                {stat.value}
              </div>
              <div className="text-primary-200 text-sm font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
