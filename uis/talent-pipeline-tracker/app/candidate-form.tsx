"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Candidate, CandidateFormData } from "@/lib/api";
import { createCandidate, replaceCandidate } from "@/lib/api";

type CandidateFormProps = {
  candidate?: Candidate;
  onSuccess?: (candidate: Candidate) => void;
};

type FormValues = {
  full_name: string;
  email: string;
  phone: string;
  position: string;
  linkedin_url: string;
  cv_url: string;
  experience_years: string;
};

type FormField = keyof FormValues;
type FormErrors = Partial<Record<FormField, string>>;

const emptyValues: FormValues = {
  full_name: "",
  email: "",
  phone: "",
  position: "",
  linkedin_url: "",
  cv_url: "",
  experience_years: "",
};

const positionOptions = [
  "Tecnología de la Información",
  "Recursos Humanos",
  "Administración",
  "Logística",
  "Operaciones",
  "Ventas",
  "Marketing y Comunicación",
  "Atención al Cliente",
  "Finanzas y Contabilidad",
  "Formación",
  "Otro",
];

const experienceOptions = [
  { value: "0", label: "De 0 a 3 años" },
  { value: "3", label: "De 3 a 10 años" },
  { value: "10", label: "De 10 a 15 años" },
  { value: "15", label: "De 15 a 20 años" },
  { value: "21", label: "Más de 20 años" },
];

function valuesFromCandidate(candidate?: Candidate): FormValues {
  if (!candidate) return emptyValues;

  const experienceRange = [...experienceOptions]
    .reverse()
    .find(({ value }) => candidate.experience_years >= Number(value));

  return {
    full_name: candidate.full_name,
    email: candidate.email,
    phone: candidate.phone,
    position: candidate.position,
    linkedin_url: candidate.linkedin_url ?? "",
    cv_url: candidate.cv_url ?? "",
    experience_years: experienceRange?.value ?? "0",
  };
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  const fullName = values.full_name.trim();
  if (!fullName) errors.full_name = "El nombre completo es obligatorio.";
  else if (fullName.length < 2 || fullName.length > 200) errors.full_name = "El nombre completo debe tener entre 2 y 200 caracteres.";
  else if (!/^[\p{L}\p{M}][\p{L}\p{M} .'-]*$/u.test(fullName)) errors.full_name = "Usa letras y caracteres habituales para escribir el nombre completo.";

  const email = values.email.trim();
  if (!email) errors.email = "El email es obligatorio.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = "Introduce un correo válido, por ejemplo nombre@ejemplo.com.";
  else if (email.length > 254) errors.email = "El correo electrónico no puede superar los 254 caracteres.";

  const phone = values.phone.trim();
  if (!phone) errors.phone = "El teléfono es obligatorio.";
  else {
    const phoneDigits = phone.replace(/\D/g, "");
    if (!/^\+\d[\d\s().-]*$/.test(phone) || phoneDigits.length < 7 || phoneDigits.length > 15) {
      errors.phone = "Incluye + y el código internacional; el teléfono debe contener entre 7 y 15 dígitos.";
    }
  }

  const position = values.position.trim();
  if (!position) errors.position = "El puesto es obligatorio.";
  else if (position.length > 200) errors.position = "El puesto no puede superar los 200 caracteres.";

  if (values.experience_years.trim() === "") errors.experience_years = "Los años de experiencia son obligatorios.";
  else if (!experienceOptions.some(({ value }) => value === values.experience_years)) errors.experience_years = "Selecciona un rango de experiencia válido.";

  for (const [field, label] of [["linkedin_url", "LinkedIn"], ["cv_url", "CV"]] as const) {
    const value = values[field].trim();
    if (value && (value.length > 2048 || !isValidUrl(value))) {
      errors[field] = `El enlace de ${label} debe ser una URL HTTP o HTTPS válida (máximo 2048 caracteres).`;
    }
  }

  return errors;
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return (url.protocol === "https:" || url.protocol === "http:") && Boolean(url.hostname) && !url.username && !url.password;
  } catch {
    return false;
  }
}

export default function CandidateForm({ candidate, onSuccess }: CandidateFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const isEditing = Boolean(candidate);
  const [values, setValues] = useState<FormValues>(() => valuesFromCandidate(candidate));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [createdCandidate, setCreatedCandidate] = useState<Candidate | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showResetNotice, setShowResetNotice] = useState(false);

  function validateField(field: FormField, value: string) {
    const nextErrors = validate({ ...values, [field]: value });
    setErrors((current) => ({ ...current, [field]: nextErrors[field] }));
    return nextErrors[field];
  }

  function updateValue(field: FormField, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrorMessage(null);
    setSuccessMessage(null);
    setCreatedCandidate(null);
    setShowResetNotice(false);
    if (errors[field]) {
      const nextErrors = validate({ ...values, [field]: value });
      setErrors((current) => ({ ...current, [field]: nextErrors[field] }));
    }
  }

  function clearForm() {
    setValues(emptyValues);
    setErrors({});
    setErrorMessage(null);
    setSuccessMessage(null);
    setCreatedCandidate(null);
    setShowResetNotice(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setErrorMessage("Revisa los campos indicados y vuelve a intentarlo.");
      errorSummaryRef.current?.focus();
      window.requestAnimationFrame(() => {
        formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      });
      return;
    }
    setShowResetNotice(false);

    const payload: CandidateFormData = {
      full_name: values.full_name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      position: values.position.trim(),
      linkedin_url: values.linkedin_url.trim() || null,
      cv_url: values.cv_url.trim() || null,
      experience_years: Number(values.experience_years),
    };

    setIsSubmitting(true);
    try {
      const result = isEditing && candidate
        ? await replaceCandidate(candidate.id, payload)
        : await createCandidate(payload);

      if (isEditing) {
        setValues(valuesFromCandidate(result));
        setSuccessMessage("Los datos de la candidatura se actualizaron correctamente.");
        router.refresh();
      } else {
        setValues(emptyValues);
        setSuccessMessage("La candidatura se registró correctamente.");
        setCreatedCandidate(result);
      }
      onSuccess?.(result);
      window.requestAnimationFrame(() => successRef.current?.focus());
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "No se pudo guardar la candidatura. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClassName = "mt-1 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20 disabled:bg-slate-100";

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-5">
      {errorMessage && (
        <div ref={errorSummaryRef} tabIndex={-1} role="alert" aria-live="assertive" className="rounded-xl border border-rose-300 bg-rose-50 p-4 text-sm text-rose-900 focus:outline-2 focus:outline-offset-2 focus:outline-rose-700">
          <p className="font-semibold">{Object.keys(errors).length > 0 ? "No pudimos validar la candidatura." : "No se pudo guardar la candidatura."}</p>
          <p className="mt-1">{errorMessage}</p>
        </div>
      )}
      {showResetNotice && <p role="status" aria-live="polite" className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900"><span className="font-semibold">Formulario limpio.</span> Ya puedes empezar de nuevo.</p>}
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-medium text-slate-700">
          Nombre completo <span aria-hidden="true">*</span>
          <input id="candidate-full-name" className={inputClassName} name="full_name" autoComplete="name" placeholder="Ej.: Ana García López" value={values.full_name} onChange={(event) => updateValue("full_name", event.target.value)} onBlur={(event) => validateField("full_name", event.target.value)} required minLength={2} maxLength={200} aria-invalid={Boolean(errors.full_name)} aria-describedby={errors.full_name ? "candidate-full-name-error" : undefined} disabled={isSubmitting} />
          {errors.full_name && <span id="candidate-full-name-error" className="mt-2 block text-sm font-medium text-rose-700">{errors.full_name}</span>}
        </label>
        <label className="text-sm font-medium text-slate-700">
          Email <span aria-hidden="true">*</span>
          <input id="candidate-email" className={inputClassName} name="email" type="email" autoComplete="email" inputMode="email" placeholder="nombre@ejemplo.com" value={values.email} onChange={(event) => updateValue("email", event.target.value)} onBlur={(event) => validateField("email", event.target.value)} required maxLength={254} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "candidate-email-error" : undefined} disabled={isSubmitting} />
          {errors.email && <span id="candidate-email-error" className="mt-2 block text-sm font-medium text-rose-700">{errors.email}</span>}
        </label>
        <label className="text-sm font-medium text-slate-700">
          Teléfono <span aria-hidden="true">*</span>
          <input id="candidate-phone" className={inputClassName} name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="Obligatorio: +34 600 000 000" value={values.phone} onChange={(event) => updateValue("phone", event.target.value)} onBlur={(event) => validateField("phone", event.target.value)} required maxLength={30} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "candidate-phone-error" : undefined} disabled={isSubmitting} />
          {errors.phone && <span id="candidate-phone-error" className="mt-2 block text-sm font-medium text-rose-700">{errors.phone}</span>}
        </label>
        <label className="text-sm font-medium text-slate-700">
          Puesto <span aria-hidden="true">*</span>
          <select id="candidate-position" className={inputClassName} name="position" value={values.position} onChange={(event) => updateValue("position", event.target.value)} onBlur={(event) => validateField("position", event.target.value)} required aria-invalid={Boolean(errors.position)} aria-describedby={errors.position ? "candidate-position-error" : undefined} disabled={isSubmitting}>
            <option value="">Selecciona un área profesional</option>
            {values.position && !positionOptions.includes(values.position) && <option value={values.position}>{values.position}</option>}
            {positionOptions.map((position) => <option key={position} value={position}>{position}</option>)}
          </select>
          {errors.position && <span id="candidate-position-error" className="mt-2 block text-sm font-medium text-rose-700">{errors.position}</span>}
        </label>
        <label className="text-sm font-medium text-slate-700">
          Enlace a LinkedIn
          <input id="candidate-linkedin" className={inputClassName} name="linkedin_url" type="url" inputMode="url" placeholder="https://www.linkedin.com/in/tu-perfil" value={values.linkedin_url} onChange={(event) => updateValue("linkedin_url", event.target.value)} onBlur={(event) => validateField("linkedin_url", event.target.value)} maxLength={2048} aria-invalid={Boolean(errors.linkedin_url)} aria-describedby={errors.linkedin_url ? "candidate-linkedin-error" : undefined} disabled={isSubmitting} />
          {errors.linkedin_url && <span id="candidate-linkedin-error" className="mt-2 block text-sm font-medium text-rose-700">{errors.linkedin_url}</span>}
        </label>
        <label className="text-sm font-medium text-slate-700">
          Enlace al CV
          <input id="candidate-cv-url" className={inputClassName} name="cv_url" type="url" inputMode="url" placeholder="https://ejemplo.com/mi-cv.pdf" value={values.cv_url} onChange={(event) => updateValue("cv_url", event.target.value)} onBlur={(event) => validateField("cv_url", event.target.value)} maxLength={2048} aria-invalid={Boolean(errors.cv_url)} aria-describedby={errors.cv_url ? "candidate-cv-url-error" : undefined} disabled={isSubmitting} />
          {errors.cv_url && <span id="candidate-cv-url-error" className="mt-2 block text-sm font-medium text-rose-700">{errors.cv_url}</span>}
        </label>
        <label className="text-sm font-medium text-slate-700 sm:max-w-xs">
          Años de experiencia <span aria-hidden="true">*</span>
          <select id="candidate-experience" className={inputClassName} name="experience_years" value={values.experience_years} onChange={(event) => updateValue("experience_years", event.target.value)} onBlur={(event) => validateField("experience_years", event.target.value)} required aria-invalid={Boolean(errors.experience_years)} aria-describedby={errors.experience_years ? "candidate-experience-error" : undefined} disabled={isSubmitting}>
            <option value="">Selecciona tu experiencia</option>
            {experienceOptions.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
          </select>
          {errors.experience_years && <span id="candidate-experience-error" className="mt-2 block text-sm font-medium text-rose-700">{errors.experience_years}</span>}
        </label>
      </div>

      {successMessage && (
        <div ref={successRef} tabIndex={-1} role="status" aria-live="polite" className="rounded-lg bg-teal-50 p-4 text-sm text-teal-900 focus:outline-2 focus:outline-offset-2 focus:outline-teal-700">
          <p>{successMessage}</p>
          {createdCandidate && (
            <Link href={`/candidates/${encodeURIComponent(createdCandidate.id)}`} className="mt-2 inline-flex font-semibold underline underline-offset-2">
              Ver candidatura de {createdCandidate.full_name}
            </Link>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
        <p className="text-xs text-slate-500"><span aria-hidden="true">*</span> Campos obligatorios.</p>
        <div className="flex flex-wrap gap-3">
          {!isEditing && <button type="button" onClick={clearForm} disabled={isSubmitting} className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 disabled:opacity-60">Limpiar formulario</button>}
          <button type="submit" disabled={isSubmitting} className="rounded-lg bg-teal-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800 disabled:cursor-wait disabled:opacity-60">
            {isSubmitting ? "Guardando…" : isEditing ? "Guardar cambios" : "Registrar candidatura"}
          </button>
        </div>
      </div>
    </form>
  );
}
