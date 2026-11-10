"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createCandidate, replaceCandidate } from "@/lib/api";
import type { Candidate, CandidateCreate } from "@/types/candidate";

type CandidateFormProps = {
  candidate?: Candidate;
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

type FormErrors = Partial<Record<keyof FormValues, string>>;

const positions = ["Software Engineer", "Senior Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer", "Data Analyst", "Data Engineer", "Product Manager", "UX/UI Designer", "DevOps Engineer", "Otro"];
const experienceRanges = [
  { label: "Menos de 1 año", value: "0" },
  { label: "1–2 años", value: "1" },
  { label: "3–5 años", value: "3" },
  { label: "6–10 años", value: "6" },
  { label: "Más de 10 años", value: "11" },
];

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.full_name.trim()) errors.full_name = "Escribe el nombre completo.";
  else if (values.full_name.trim().length < 2) errors.full_name = "El nombre debe tener al menos 2 caracteres.";
  if (!values.email.trim()) errors.email = "Escribe un email.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = "Escribe un email válido.";
  if (!values.phone.trim()) errors.phone = "Escribe un teléfono de contacto.";
  else if (!/^\+\d[\d\s().-]{6,24}$/.test(values.phone.trim())) errors.phone = "Incluye el prefijo internacional + y un número válido.";
  if (!values.position) errors.position = "Selecciona un puesto.";
  if (!values.experience_years) errors.experience_years = "Selecciona un rango de experiencia.";
  if (values.linkedin_url && !/^https:\/\/(www\.)?linkedin\.com\//i.test(values.linkedin_url)) errors.linkedin_url = "Usa una URL segura de LinkedIn (https://linkedin.com/…).";
  if (values.cv_url && !/^https:\/\//i.test(values.cv_url)) errors.cv_url = "La URL del CV debe comenzar con https://.";
  return errors;
}

function fieldClass(hasError: boolean) {
  return `min-h-11 w-full rounded-lg border bg-white px-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${hasError ? "border-red-600 focus:border-red-700 focus:ring-red-700/20" : "border-slate-300 focus:border-teal-700 focus:ring-teal-700/20"}`;
}

export default function CandidateForm({ candidate }: CandidateFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<FormValues>({
    full_name: candidate?.full_name ?? "",
    email: candidate?.email ?? "",
    phone: candidate?.phone ?? "",
    position: candidate?.position ?? "",
    linkedin_url: candidate?.linkedin_url ?? "",
    cv_url: candidate?.cv_url ?? "",
    experience_years: candidate ? String(candidate.experience_years) : "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [errorSummary, setErrorSummary] = useState("");
  const [requestError, setRequestError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdCandidate, setCreatedCandidate] = useState<Candidate | null>(null);

  function updateField(field: keyof FormValues, value: string) {
    setValues((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => {
      if (!previous[field]) return previous;
      const next = { ...previous };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRequestError("");
    setCreatedCandidate(null);
    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setErrorSummary("Revisa los campos indicados antes de continuar.");
      requestAnimationFrame(() => document.getElementById("form-error-summary")?.focus());
      return;
    }

    setErrorSummary("");
    setIsSubmitting(true);
    const payload: CandidateCreate = {
      full_name: values.full_name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      position: values.position,
      linkedin_url: values.linkedin_url.trim() || null,
      cv_url: values.cv_url.trim() || null,
      experience_years: Number(values.experience_years),
    };

    try {
      if (candidate) {
        await replaceCandidate(candidate.id, payload);
        router.push(`/candidates/${encodeURIComponent(candidate.id)}`);
        router.refresh();
      } else {
        const created = await createCandidate(payload);
        setCreatedCandidate(created);
        setValues({ full_name: "", email: "", phone: "", position: "", linkedin_url: "", cv_url: "", experience_years: "" });
        router.refresh();
      }
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : "No se pudo guardar la candidatura. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function errorFor(field: keyof FormValues) {
    return errors[field] ? <p id={`${field}-error`} className="mt-1 text-sm text-red-700">{errors[field]}</p> : null;
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {errorSummary && (
        <div id="form-error-summary" tabIndex={-1} role="alert" className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-900 outline-none focus:ring-2 focus:ring-red-700">
          <p className="font-semibold">{errorSummary}</p>
          <ul className="mt-2 list-inside list-disc text-sm">
            {Object.values(errors).map((error) => <li key={error}>{error}</li>)}
          </ul>
        </div>
      )}
      {requestError && <p role="alert" className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-900">{requestError}</p>}
      {createdCandidate && (
        <div role="status" className="rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-emerald-900">
          <p className="font-semibold">Candidatura recibida correctamente.</p>
          <Link href={`/candidates/${encodeURIComponent(createdCandidate.id)}`} className="mt-1 inline-block font-medium underline underline-offset-4">Ver candidatura de {createdCandidate.full_name}</Link>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="full_name" className="mb-1.5 block text-sm font-semibold text-slate-800">Nombre completo <span aria-hidden="true" className="text-red-700">*</span></label>
          <input id="full_name" name="full_name" autoComplete="name" required value={values.full_name} onChange={(event) => updateField("full_name", event.target.value)} placeholder="Ej. Ana García López" aria-invalid={Boolean(errors.full_name)} aria-describedby={errors.full_name ? "full_name-error" : undefined} className={fieldClass(Boolean(errors.full_name))} />
          {errorFor("full_name")}
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-800">Email <span aria-hidden="true" className="text-red-700">*</span></label>
          <input id="email" name="email" type="email" autoComplete="email" required value={values.email} onChange={(event) => updateField("email", event.target.value)} placeholder="Ej. ana@correo.com" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} className={fieldClass(Boolean(errors.email))} />
          {errorFor("email")}
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-slate-800">Teléfono <span aria-hidden="true" className="text-red-700">*</span></label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" required value={values.phone} onChange={(event) => updateField("phone", event.target.value)} placeholder="Ej. +34 600 123 456" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "phone-error" : "phone-hint phone-error"} className={fieldClass(Boolean(errors.phone))} />
          <p id="phone-hint" className="mt-1 text-xs text-slate-500">Incluye el prefijo internacional, por ejemplo +34.</p>
          {errorFor("phone")}
        </div>
        <div>
          <label htmlFor="position" className="mb-1.5 block text-sm font-semibold text-slate-800">Puesto de interés <span aria-hidden="true" className="text-red-700">*</span></label>
          <select id="position" name="position" required value={values.position} onChange={(event) => updateField("position", event.target.value)} aria-invalid={Boolean(errors.position)} aria-describedby={errors.position ? "position-error" : undefined} className={fieldClass(Boolean(errors.position))}>
            <option value="">Selecciona un puesto</option>
            {positions.map((position) => <option key={position} value={position}>{position}</option>)}
          </select>
          {errorFor("position")}
        </div>
        <div>
          <label htmlFor="experience_years" className="mb-1.5 block text-sm font-semibold text-slate-800">Experiencia <span aria-hidden="true" className="text-red-700">*</span></label>
          <select id="experience_years" name="experience_years" required value={values.experience_years} onChange={(event) => updateField("experience_years", event.target.value)} aria-invalid={Boolean(errors.experience_years)} aria-describedby={errors.experience_years ? "experience_years-error" : undefined} className={fieldClass(Boolean(errors.experience_years))}>
            <option value="">Selecciona un rango</option>
            {experienceRanges.map((range) => <option key={range.value} value={range.value}>{range.label}</option>)}
          </select>
          {errorFor("experience_years")}
        </div>
        <div>
          <label htmlFor="linkedin_url" className="mb-1.5 block text-sm font-semibold text-slate-800">Perfil de LinkedIn <span className="font-normal text-slate-500">(opcional)</span></label>
          <input id="linkedin_url" name="linkedin_url" type="url" autoComplete="url" value={values.linkedin_url} onChange={(event) => updateField("linkedin_url", event.target.value)} placeholder="https://www.linkedin.com/in/tu-perfil" aria-invalid={Boolean(errors.linkedin_url)} aria-describedby={errors.linkedin_url ? "linkedin_url-error" : undefined} className={fieldClass(Boolean(errors.linkedin_url))} />
          {errorFor("linkedin_url")}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="cv_url" className="mb-1.5 block text-sm font-semibold text-slate-800">Enlace al CV <span className="font-normal text-slate-500">(opcional)</span></label>
          <input id="cv_url" name="cv_url" type="url" value={values.cv_url} onChange={(event) => updateField("cv_url", event.target.value)} placeholder="https://ejemplo.com/mi-cv.pdf" aria-invalid={Boolean(errors.cv_url)} aria-describedby={errors.cv_url ? "cv_url-error" : undefined} className={fieldClass(Boolean(errors.cv_url))} />
          {errorFor("cv_url")}
        </div>
      </div>

      <p className="text-xs text-slate-500"><span aria-hidden="true" className="text-red-700">*</span> Campos obligatorios.</p>
      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
        <Link href={candidate ? `/candidates/${encodeURIComponent(candidate.id)}` : "/"} className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 px-5 font-semibold text-slate-700 hover:bg-slate-50">Cancelar</Link>
        <button type="submit" disabled={isSubmitting} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-teal-800 px-5 font-semibold text-white hover:bg-teal-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800 disabled:cursor-wait disabled:opacity-60">{isSubmitting ? "Guardando…" : candidate ? "Guardar cambios" : "Enviar candidatura"}</button>
      </div>
    </form>
  );
}
