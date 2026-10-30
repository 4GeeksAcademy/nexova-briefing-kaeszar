/**
 * Shared domain models for Nexova Solutions.
 * These types describe information stated in the company briefing; operational
 * behavior, transformations, and validation belong in separate utility modules.
 */

/** String identifier retained for compatibility with existing shared types. */
export type Id = string;

/** Common identifier and timestamps for entities that are persisted. */
export interface BaseEntity {
  id: Id;
  createdAt?: string;
  updatedAt?: string;
}

export interface Person {
  fullName: string;
  role: string;
}

export interface Employee extends Person {
  department: DepartmentName;
}

export interface Office {
  city: string;
  country: string;
  isHeadquarters: boolean;
}

export interface BusinessLine {
  name: string;
  description: string;
}

export interface Department {
  name: DepartmentName;
  /** Optional because the briefing contains conflicting sales-lead names. */
  lead?: Person;
  /** Present only where a headcount is specified in the briefing. */
  headcount?: number;
  description: string;
}

export type DepartmentName =
  | "Operaciones de Selección"
  | "Formación Corporativa"
  | "Soporte al Cliente Externalizado"
  | "Ventas y Desarrollo de Negocio"
  | "Marketing y Comunicación"
  | "Recursos Humanos"
  | "Tecnología e Infraestructura"
  | "Dirección Ejecutiva";

export interface Company {
  name: string;
  foundedYear: number;
  employeeCount: number;
  annualRevenueUsd: number;
  headquarters: Office;
  offices: Office[];
  businessLines: BusinessLine[];
  departments: Department[];
  chiefExecutiveOfficer: Person;
}

export interface Client {
  companyName: string;
  sector: string;
  companySize: string;
}

export interface CandidateProfile {
  /** Candidate details are intentionally not expanded beyond fields supported by the briefing. */
  experienceDescription?: string;
  skills?: string[];
  languages?: CandidateLanguage[];
}

export interface CandidateLanguage {
  language: string;
  proficiencyLevel: string;
}

export interface JobVacancy {
  title: string;
  client: Client;
  requiredExperience?: string;
  requiredSkills?: string[];
  requiredLanguages?: CandidateLanguage[];
}

export type RecruitmentStage =
  | "Briefing"
  | "CV screening"
  | "Interviews"
  | "Hiring";

export interface RecruitmentProcess {
  vacancy: JobVacancy;
  consultant: Person;
  candidates: CandidateProfile[];
  stage: RecruitmentStage;
}

export type TrainingFormat = "Course" | "Workshop" | "Webinar";

export interface TrainingProgram {
  name: string;
  topics: string[];
  format: TrainingFormat;
}

export interface TrainingEnrollment {
  learnerName: string;
  program: TrainingProgram;
  /** Progress is not currently tracked according to the briefing. */
  progressPercentage?: number;
}

export type SupportChannel = "Phone" | "Email" | "Web chat";

export interface SupportTicket {
  subject: string;
  description: string;
  client: Client;
  channel: SupportChannel;
  assignedAgent?: Person;
}

export type SalesRole = "Account manager" | "Sales development representative";

export interface SalesRepresentative extends Person {
  role: SalesRole;
}

export type ProspectingStage = "First contact" | "Follow-up" | "Closed" | "Discarded";

export interface SalesProspect {
  companyName: string;
  sector: string;
  stage: ProspectingStage;
  lastActivityDate?: string;
}

export interface SalesOpportunity {
  prospect: SalesProspect;
  accountManager?: SalesRepresentative;
  estimatedValueUsd?: number;
  stage: ProspectingStage;
}

export type MarketingChannel = "Website" | "LinkedIn" | "Newsletter" | "Blog";

export interface MarketingContent {
  title: string;
  channel: MarketingChannel;
}

export interface TrafficSourceMetric {
  source: string;
  visits: number;
}

export interface MarketingMetrics {
  visits: number;
  trafficSources: TrafficSourceMetric[];
  conversions: number;
  conversionRate: number;
}

export type HumanResourcesRequestType = "Vacation" | "Absence" | "Question";

export interface HumanResourcesRequest {
  employeeName: string;
  type: HumanResourcesRequestType;
  startDate?: string;
  endDate?: string;
  question?: string;
}

export interface OnboardingProcess {
  employeeName: string;
  checklist: string[];
}

export interface PerformanceReview {
  employeeName: string;
  reviewDate: string;
}

export interface TechnologySystem {
  name: string;
  purpose: string;
}

export interface BusinessKpi {
  name: string;
  category: string;
  value: number;
  unit: string;
}

export interface ExecutiveReport {
  reportingPeriod: string;
  kpis: BusinessKpi[];
}

/** Reference data explicitly stated in the company briefing. */
export const NEXOVA_BUSINESS_LINES: readonly BusinessLine[] = [
  {
    name: "Headhunting",
    description: "Selección para perfiles de mandos medios y directivos.",
  },
  {
    name: "Outsourcing de soporte al cliente",
    description: "Equipos de atención al cliente dedicados para empresas.",
  },
  {
    name: "Formación corporativa",
    description: "Programas de habilidades blandas y liderazgo para empresas.",
  },
];

export const NEXOVA_DEPARTMENTS: readonly Department[] = [
  {
    name: "Operaciones de Selección",
    lead: { fullName: "Javier Almeida", role: "Responsable de Operaciones de Selección" },
    headcount: 40,
    description: "Procesos de selección desde el briefing inicial hasta la contratación.",
  },
  {
    name: "Formación Corporativa",
    lead: { fullName: "Elena Vargas", role: "Responsable de Formación Corporativa" },
    headcount: 12,
    description: "Cursos, talleres y webinars para empresas clientes.",
  },
  {
    name: "Soporte al Cliente Externalizado",
    lead: { fullName: "Roberto Díaz", role: "Responsable de Soporte al Cliente Externalizado" },
    headcount: 30,
    description: "Equipos dedicados de atención para clientes de Nexova.",
  },
  {
    name: "Ventas y Desarrollo de Negocio",
    headcount: 18,
    description: "Gestión de cuentas y desarrollo de negocio.",
  },
  {
    name: "Marketing y Comunicación",
    lead: { fullName: "Carmen Ruiz", role: "Responsable de Marketing y Comunicación" },
    description: "Web corporativa, LinkedIn, newsletter y blog.",
  },
  {
    name: "Recursos Humanos",
    lead: { fullName: "Patricia Solís", role: "Responsable de Recursos Humanos" },
    headcount: 4,
    description: "Contratos, onboarding, vacaciones, evaluaciones y consultas internas.",
  },
  {
    name: "Tecnología e Infraestructura",
    lead: { fullName: "Sergio Molina", role: "CTO" },
    headcount: 6,
    description: "Tecnología e infraestructura de Nexova.",
  },
  {
    name: "Dirección Ejecutiva",
    lead: { fullName: "Laura Mendoza", role: "CEO" },
    description: "Dirección ejecutiva e informes del negocio.",
  },
];

export const NEXOVA_COMPANY: Company = {
  name: "Nexova Solutions",
  foundedYear: 2011,
  employeeCount: 120,
  annualRevenueUsd: 8_000_000,
  headquarters: { city: "Valencia", country: "Spain", isHeadquarters: true },
  offices: [
    { city: "Valencia", country: "Spain", isHeadquarters: true },
    { city: "Miami", country: "United States", isHeadquarters: false },
  ],
  businessLines: [...NEXOVA_BUSINESS_LINES],
  departments: [...NEXOVA_DEPARTMENTS],
  chiefExecutiveOfficer: { fullName: "Laura Mendoza", role: "CEO" },
};
