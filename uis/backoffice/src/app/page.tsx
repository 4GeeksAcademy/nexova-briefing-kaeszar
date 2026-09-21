export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">
          Panel de Nexova Solutions
        </h1>
        <p className="text-neutral-500 mt-1">
          Vista general del estado del negocio — Datos actualizados desde el briefing de la empresa.
        </p>
      </div>

      {/* KPIs overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiCard label="Empleados" value="120" sub="7 departamentos" color="bg-primary-500" />
        <KpiCard label="Oficinas" value="2" sub="Valencia · Miami" color="bg-accent-500" />
        <KpiCard label="Facturación" value="$8M+" sub="USD anual" color="bg-emerald-500" />
        <KpiCard label="Antigüedad" value="12+ años" sub="Fundada en 2011" color="bg-violet-500" />
      </div>

      {/* Staff distribution */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Distribución de personal por departamento</h2>
        <div className="space-y-3">
          <StaffBar dept="Selección" count={40} pct={33} color="bg-primary-600" />
          <StaffBar dept="Atención al Cliente" count={30} pct={25} color="bg-violet-500" />
          <StaffBar dept="Ventas" count={18} pct={15} color="bg-orange-500" />
          <StaffBar dept="Formación" count={12} pct={10} color="bg-accent-600" />
          <StaffBar dept="Tech" count={6} pct={5} color="bg-indigo-500" />
          <StaffBar dept="Marketing" count={6} pct={5} color="bg-pink-500" />
          <StaffBar dept="RRHH" count={4} pct={3} color="bg-cyan-500" />
          <StaffBar dept="Dirección" count={4} pct={3} color="bg-neutral-500" />
        </div>
      </div>

      {/* Department heads */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Directores de departamento</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <HeadCard name="Javier Almeida" dept="Selección" people={40} />
          <HeadCard name="Roberto Díaz" dept="Atención al Cliente" people={30} />
          <HeadCard name="Marcos Ibáñez" dept="Ventas" people={18} />
          <HeadCard name="Elena Vargas" dept="Formación Corporativa" people={12} />
          <HeadCard name="Sergio Molina" dept="Tecnología" people={6} />
          <HeadCard name="Carmen Ruiz" dept="Marketing" people={6} />
          <HeadCard name="Patricia Solís" dept="RRHH" people={4} />
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-5">
      <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center mb-3`}>
        <span className="text-white text-sm font-bold">{value.charAt(0)}</span>
      </div>
      <p className="text-sm text-neutral-500">{label}</p>
      <p className="text-2xl font-bold text-neutral-900">{value}</p>
      <p className="text-xs text-neutral-400 mt-1">{sub}</p>
    </div>
  );
}

function StaffBar({
  dept,
  count,
  pct,
  color,
}: {
  dept: string;
  count: number;
  pct: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-neutral-600 w-40 shrink-0">{dept}</span>
      <div className="flex-1 bg-neutral-100 rounded-full h-5 overflow-hidden">
        <div className={`${color} h-full rounded-full`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm font-medium text-neutral-700 w-16 text-right">{count} personas</span>
    </div>
  );
}

function HeadCard({
  name,
  dept,
  people,
}: {
  name: string;
  dept: string;
  people: number;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-neutral-100">
      <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
        {name
          .split(" ")
          .map((n) => n[0])
          .join("")}
      </div>
      <div>
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-neutral-500">
          {dept} · {people} personas
        </p>
      </div>
    </div>
  );
}
