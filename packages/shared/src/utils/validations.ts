/** A single business-rule violation reported by a validator. */
export interface BusinessValidationIssue {
  path: string;
  message: string;
}

/** Result returned by every business validator. */
export interface BusinessValidationResult {
  valid: boolean;
  issues: BusinessValidationIssue[];
}

const DEPARTMENT_RULES = [
  { name: "Operaciones de Selección", headcount: 40, lead: "Javier Almeida" },
  { name: "Formación Corporativa", headcount: 12, lead: "Elena Vargas" },
  { name: "Soporte al Cliente Externalizado", headcount: 30, lead: "Roberto Díaz" },
  // Sales leadership is omitted because the briefing gives conflicting names.
  { name: "Ventas y Desarrollo de Negocio", headcount: 18 },
  { name: "Marketing y Comunicación", lead: "Carmen Ruiz" },
  { name: "Recursos Humanos", headcount: 4, lead: "Patricia Solís" },
  { name: "Tecnología e Infraestructura", headcount: 6, lead: "Sergio Molina" },
  { name: "Dirección Ejecutiva", lead: "Laura Mendoza" },
] as const;

const RECRUITMENT_STAGES = ["Briefing", "CV screening", "Interviews", "Hiring"] as const;
const TRAINING_FORMATS = ["Course", "Workshop", "Webinar"] as const;
const SUPPORT_CHANNELS = ["Phone", "Email", "Web chat"] as const;
const SALES_STAGES = ["First contact", "Follow-up", "Closed", "Discarded"] as const;
const HR_REQUEST_TYPES = ["Vacation", "Absence", "Question"] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function createResult(issues: BusinessValidationIssue[]): BusinessValidationResult {
  return { valid: issues.length === 0, issues };
}

function addRequiredStringIssue(
  record: Record<string, unknown>,
  field: string,
  path: string,
  issues: BusinessValidationIssue[],
): void {
  if (typeof record[field] !== "string" || record[field].trim() === "") {
    issues.push({ path, message: "Debe ser un texto no vacío." });
  }
}

/** Validates stable company facts stated in the Nexova briefing. */
export function validateNexovaCompany(value: unknown): BusinessValidationResult {
  const issues: BusinessValidationIssue[] = [];
  if (!isRecord(value)) {
    return createResult([{ path: "", message: "Debe ser un objeto de compañía." }]);
  }

  if (value.name !== "Nexova Solutions") {
    issues.push({ path: "name", message: "Debe corresponder a Nexova Solutions." });
  }
  if (value.foundedYear !== 2011) {
    issues.push({ path: "foundedYear", message: "El briefing indica que Nexova fue fundada en 2011." });
  }
  if (value.employeeCount !== 120) {
    issues.push({ path: "employeeCount", message: "El briefing indica una plantilla de 120 empleados." });
  }
  if (typeof value.annualRevenueUsd !== "number" || !Number.isFinite(value.annualRevenueUsd) || value.annualRevenueUsd <= 0) {
    issues.push({ path: "annualRevenueUsd", message: "Debe ser una cifra de facturación positiva y válida." });
  }

  const headquarters = value.headquarters;
  if (!isRecord(headquarters) || headquarters.city !== "Valencia" || headquarters.country !== "Spain") {
    issues.push({ path: "headquarters", message: "La sede debe estar en Valencia, España." });
  }

  const offices = value.offices;
  if (!Array.isArray(offices)) {
    issues.push({ path: "offices", message: "Debe incluir las oficinas de la empresa." });
  } else {
    for (const [city, country] of [["Valencia", "Spain"], ["Miami", "United States"]]) {
      const found = offices.some(
        (office: unknown): boolean => isRecord(office) && office.city === city && office.country === country,
      );
      if (!found) {
        issues.push({ path: "offices", message: `Debe incluir la oficina de ${city}, ${country}.` });
      }
    }
  }

  const ceo = value.chiefExecutiveOfficer;
  if (!isRecord(ceo) || ceo.fullName !== "Laura Mendoza") {
    issues.push({ path: "chiefExecutiveOfficer", message: "La CEO indicada en el briefing es Laura Mendoza." });
  }

  return createResult(issues);
}

/** Validates department names, stated headcounts, and unambiguous leads. */
export function validateDepartment(value: unknown): BusinessValidationResult {
  const issues: BusinessValidationIssue[] = [];
  if (!isRecord(value)) {
    return createResult([{ path: "", message: "Debe ser un objeto de departamento." }]);
  }

  const rule = DEPARTMENT_RULES.find(
    (department: (typeof DEPARTMENT_RULES)[number]): boolean => department.name === value.name,
  );
  if (!rule) {
    issues.push({ path: "name", message: "El nombre no corresponde a un departamento del briefing." });
    return createResult(issues);
  }

  if ("headcount" in rule && value.headcount !== rule.headcount) {
    issues.push({ path: "headcount", message: `El briefing indica ${rule.headcount} personas para este departamento.` });
  }
  if ("lead" in rule && (!isRecord(value.lead) || value.lead.fullName !== rule.lead)) {
    issues.push({ path: "lead", message: `El responsable indicado en el briefing es ${rule.lead}.` });
  }

  return createResult(issues);
}

/** Validates a recruitment process' required data and briefing-defined stage. */
export function validateRecruitmentProcess(value: unknown): BusinessValidationResult {
  const issues: BusinessValidationIssue[] = [];
  if (!isRecord(value)) {
    return createResult([{ path: "", message: "Debe ser un objeto de proceso de selección." }]);
  }

  if (!RECRUITMENT_STAGES.includes(value.stage as (typeof RECRUITMENT_STAGES)[number])) {
    issues.push({ path: "stage", message: "La etapa debe ser una de las definidas para selección." });
  }
  if (!isRecord(value.vacancy)) {
    issues.push({ path: "vacancy", message: "Debe incluir una vacante." });
  } else {
    addRequiredStringIssue(value.vacancy, "title", "vacancy.title", issues);
    if (!isRecord(value.vacancy.client)) {
      issues.push({ path: "vacancy.client", message: "La vacante debe incluir un cliente." });
    }
  }
  if (!isRecord(value.consultant)) {
    issues.push({ path: "consultant", message: "Debe asignarse un consultor al proceso." });
  }
  if (!Array.isArray(value.candidates)) {
    issues.push({ path: "candidates", message: "La lista de candidatos debe ser un array." });
  }

  return createResult(issues);
}

/** Validates a support ticket against the channels stated in the briefing. */
export function validateSupportTicket(value: unknown): BusinessValidationResult {
  const issues: BusinessValidationIssue[] = [];
  if (!isRecord(value)) {
    return createResult([{ path: "", message: "Debe ser un objeto de ticket de soporte." }]);
  }

  addRequiredStringIssue(value, "subject", "subject", issues);
  addRequiredStringIssue(value, "description", "description", issues);
  if (!SUPPORT_CHANNELS.includes(value.channel as (typeof SUPPORT_CHANNELS)[number])) {
    issues.push({ path: "channel", message: "El canal debe ser Phone, Email o Web chat." });
  }
  if (!isRecord(value.client)) {
    issues.push({ path: "client", message: "El ticket debe estar asociado a un cliente." });
  }

  return createResult(issues);
}

/** Validates a training program against the formats described in the briefing. */
export function validateTrainingProgram(value: unknown): BusinessValidationResult {
  const issues: BusinessValidationIssue[] = [];
  if (!isRecord(value)) {
    return createResult([{ path: "", message: "Debe ser un objeto de programa formativo." }]);
  }

  addRequiredStringIssue(value, "name", "name", issues);
  if (!TRAINING_FORMATS.includes(value.format as (typeof TRAINING_FORMATS)[number])) {
    issues.push({ path: "format", message: "El formato debe ser Course, Workshop o Webinar." });
  }
  if (!Array.isArray(value.topics) || value.topics.some((topic: unknown): boolean => typeof topic !== "string")) {
    issues.push({ path: "topics", message: "Los temas deben ser una lista de textos." });
  }

  return createResult(issues);
}

/** Validates an HR request against the request types stated in the briefing. */
export function validateHumanResourcesRequest(value: unknown): BusinessValidationResult {
  const issues: BusinessValidationIssue[] = [];
  if (!isRecord(value)) {
    return createResult([{ path: "", message: "Debe ser una solicitud de Recursos Humanos." }]);
  }

  addRequiredStringIssue(value, "employeeName", "employeeName", issues);
  if (!HR_REQUEST_TYPES.includes(value.type as (typeof HR_REQUEST_TYPES)[number])) {
    issues.push({ path: "type", message: "El tipo debe ser Vacation, Absence o Question." });
  }

  return createResult(issues);
}

/** Validates prospecting stages and an optional opportunity value. */
export function validateSalesOpportunity(value: unknown): BusinessValidationResult {
  const issues: BusinessValidationIssue[] = [];
  if (!isRecord(value)) {
    return createResult([{ path: "", message: "Debe ser un objeto de oportunidad de ventas." }]);
  }

  if (!isRecord(value.prospect)) {
    issues.push({ path: "prospect", message: "La oportunidad debe estar asociada a un prospecto." });
  } else if (!SALES_STAGES.includes(value.prospect.stage as (typeof SALES_STAGES)[number])) {
    issues.push({ path: "prospect.stage", message: "La etapa del prospecto no es válida." });
  }
  if (!SALES_STAGES.includes(value.stage as (typeof SALES_STAGES)[number])) {
    issues.push({ path: "stage", message: "La etapa de ventas debe ser First contact, Follow-up, Closed o Discarded." });
  }
  if (value.estimatedValueUsd !== undefined &&
      (typeof value.estimatedValueUsd !== "number" || !Number.isFinite(value.estimatedValueUsd) || value.estimatedValueUsd < 0)) {
    issues.push({ path: "estimatedValueUsd", message: "El valor estimado debe ser una cifra no negativa y válida." });
  }

  return createResult(issues);
}
