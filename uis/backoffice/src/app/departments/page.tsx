import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Departamentos — Nexova Backoffice",
};

const DEPARTMENTS = [
  {
    id: "seleccion",
    name: "Operaciones de Selección",
    head: "Javier Almeida",
    headcount: 40,
    color: "#1a3a8a",
    pain_points: [
      "Cribado manual de 30-80 CVs por proceso",
      "Email individual sin plantillas",
      "Sin estado en tiempo real",
    ],
  },
  {
    id: "formacion",
    name: "Formación Corporativa",
    head: "Elena Vargas",
    headcount: 12,
    color: "#0d9488",
    pain_points: ["Catálogo en PDF", "Inscripciones por Google Form", "Sin tracking"],
  },
  {
    id: "soporte",
    name: "Atención al Cliente",
    head: "Roberto Díaz",
    headcount: 30,
    color: "#7c3aed",
    pain_points: ["Sin base de conocimiento", "Resolución 48h vs SLA 24h", "Sin visibilidad"],
  },
  {
    id: "ventas",
    name: "Ventas y Desarrollo",
    head: "Marcos Ibáñez",
    headcount: 18,
    color: "#ea580c",
    pain_points: ["Prospectación manual", "40% CRM adoption", "Sin scoring"],
  },
  {
    id: "marketing",
    name: "Marketing y Comunicación",
    head: "Carmen Ruiz",
    headcount: 6,
    color: "#db2777",
    pain_points: ["Web obsoleta", "Contenido manual", "Sin métricas"],
  },
  {
    id: "rrhh",
    name: "Recursos Humanos",
    head: "Patricia Solís",
    headcount: 4,
    color: "#0891b2",
    pain_points: ["Solicitudes por email", "Onboarding manual", "Sin KPIs"],
  },
  {
    id: "tech",
    name: "Tecnología",
    head: "Sergio Molina",
    headcount: 6,
    color: "#4f46e5",
    pain_points: ["Herramientas desconectadas", "Sin telemetría", "Despliegues manuales"],
  },
];

export default function DepartmentsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Departamentos</h1>
        <p className="text-neutral-500 mt-1">
          {DEPARTMENTS.length} departamentos · {DEPARTMENTS.reduce((a, d) => a + d.headcount, 0)} personas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {DEPARTMENTS.map((dept) => (
          <div
            key={dept.id}
            className="bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-semibold text-lg">{dept.name}</h2>
                <p className="text-sm text-neutral-500">{dept.head}</p>
              </div>
              <span
                className="text-white text-xs font-bold px-2 py-1 rounded-full"
                style={{ backgroundColor: dept.color }}
              >
                {dept.headcount}
              </span>
            </div>

            <div>
              <p className="text-xs font-medium text-neutral-400 uppercase mb-2">Puntos de dolor</p>
              <ul className="space-y-1">
                {dept.pain_points.map((point, i) => (
                  <li key={i} className="text-sm text-neutral-600 flex items-start gap-2">
                    <span className="text-red-400 mt-0.5">•</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
