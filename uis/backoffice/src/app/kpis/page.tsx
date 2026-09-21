import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "KPIs — Nexova Backoffice",
};

const METRICS = [
  {
    category: "Empresa",
    items: [
      { label: "Año de fundación", value: "2011", delta: null },
      { label: "Empleados totales", value: "120", delta: null },
      { label: "Oficinas", value: "2", delta: "Valencia + Miami" },
      { label: "Facturación anual", value: "$8M+", delta: "USD" },
    ],
  },
  {
    category: "Selección",
    items: [
      { label: "Consultores activos", value: "40", delta: null },
      { label: "CVs por proceso", value: "30-80", delta: "manual" },
      { label: "Reducción target (IA)", value: "70%", delta: null },
    ],
  },
  {
    category: "Soporte",
    items: [
      { label: "Agentes dedicados", value: "30", delta: null },
      { label: "Tiempo resolución actual", value: "48h", delta: "SLA: 24h" },
      { label: "Resolución en 1ª línea target", value: "40%", delta: "con IA" },
    ],
  },
  {
    category: "Ventas",
    items: [
      { label: "Equipo", value: "18", delta: "6 AM + 12 SDR" },
      { label: "CRM adoption", value: "40%", delta: "HubSpot" },
    ],
  },
];

export default function KpisPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">KPIs del Negocio</h1>
        <p className="text-neutral-500 mt-1">Métricas clave extraídas del briefing de Nexova Solutions</p>
      </div>

      <div className="space-y-8">
        {METRICS.map((group) => (
          <div key={group.category}>
            <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-3">
              {group.category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {group.items.map((item) => (
                <div key={item.label} className="bg-white rounded-xl border border-neutral-200 p-4">
                  <p className="text-xs text-neutral-500">{item.label}</p>
                  <p className="text-2xl font-bold text-neutral-900 mt-1">{item.value}</p>
                  {item.delta && (
                    <p className="text-xs text-neutral-400 mt-1">{item.delta}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
