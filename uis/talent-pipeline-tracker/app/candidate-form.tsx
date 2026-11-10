"use client";

import { useState, type FormEvent } from "react";
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

const emptyValues: FormValues = {
  full_name: "",
  email: "",
  phone: "",
  position: "",
  linkedin_url: "",
  cv_url: "",
  experience_years: "",
};

function valuesFromCandidate(candidate?: Candidate): FormValues {
  if (!candidate) return emptyValues;

  return {
    full_name: candidate.full_name,
    email: candidate.email,
    phone: candidate.phone,
    position: candidate.position,
    linkedin_url: candidate.linkedin_url ?? "",
    cv_url: candidate.cv_url ?? "",
    experience_years: String(candidate.experience_years),
  };
}

function validate(values: FormValues): string | null {
  if (!values.full_name.trim()) return "El nombre completo es obligatorio.";
  if (!values.email.trim()) return "El email es obligatorio.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) return "Introduce un email válido.";
  if (!values.phone.trim()) return "El teléfono es obligatorio.";
  if (!values.position.trim()) return "El puesto es obligatorio.";
  if (values.experience_years.trim() === "") return "Los años de experiencia son obligatorios.";

  const experience = Number(values.experience_years);
  if (!Number.isFinite(experience) || experience < 0) return "Los años de experiencia deben ser un número igual o mayor que cero.";

  for (const [label, value] of [["LinkedIn", values.linkedin_url], ["CV", values.cv_url]]) {
    if (value.trim() && !isValidUrl(value.trim())) return `El enlace de ${label} debe ser una URL válida.`;
  }

  return null;
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export default function CandidateForm({ candidate, onSuccess }: CandidateFormProps) {
  const isEditing = Boolean(candidate);
  const [values, setValues] = useState<FormValues>(() => valuesFromCandidate(candidate));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  function updateValue(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrorMessage(null);
    setSuccessMessage(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const validationError = validate(values);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

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
      } else {
        setValues(emptyValues);
        setSuccessMessage("La candidatura se registró correctamente.");
      }
      onSuccess?.(result);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "No se pudo guardar la candidatura. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClassName = "mt-1 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20 disabled:bg-slate-100";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-medium text-slate-700">
          Nombre completo <span aria-hidden="true">*</span>
          <input className={inputClassName} name="full_name" autoComplete="name" value={values.full_name} onChange={(event) => updateValue("full_name", event.target.value)} required maxLength={200} disabled={isSubmitting} />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Email <span aria-hidden="true">*</span>
          <input className={inputClassName} name="email" type="email" autoComplete="email" value={values.email} onChange={(event) => updateValue("email", event.target.value)} required maxLength={254} disabled={isSubmitting} />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Teléfono <span aria-hidden="true">*</span>
          <input className={inputClassName} name="phone" type="tel" autoComplete="tel" value={values.phone} onChange={(event) => updateValue("phone", event.target.value)} required maxLength={50} disabled={isSubmitting} />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Puesto <span aria-hidden="true">*</span>
          <input className={inputClassName} name="position" value={values.position} onChange={(event) => updateValue("position", event.target.value)} required maxLength={200} disabled={isSubmitting} />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Enlace a LinkedIn
          <input className={inputClassName} name="linkedin_url" type="url" inputMode="url" placeholder="https://…" value={values.linkedin_url} onChange={(event) => updateValue("linkedin_url", event.target.value)} disabled={isSubmitting} />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Enlace al CV
          <input className={inputClassName} name="cv_url" type="url" inputMode="url" placeholder="https://…" value={values.cv_url} onChange={(event) => updateValue("cv_url", event.target.value)} disabled={isSubmitting} />
        </label>
        <label className="text-sm font-medium text-slate-700 sm:max-w-xs">
          Años de experiencia <span aria-hidden="true">*</span>
          <input className={inputClassName} name="experience_years" type="number" min="0" step="0.1" value={values.experience_years} onChange={(event) => updateValue("experience_years", event.target.value)} required disabled={isSubmitting} />
        </label>
      </div>

      {errorMessage && <p role="alert" className="rounded-lg bg-rose-50 p-4 text-sm text-rose-900">{errorMessage}</p>}
      {successMessage && <p role="status" className="rounded-lg bg-teal-50 p-4 text-sm text-teal-900">{successMessage}</p>}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
        <p className="text-xs text-slate-500"><span aria-hidden="true">*</span> Campos obligatorios.</p>
        <button type="submit" disabled={isSubmitting} className="rounded-lg bg-teal-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800 disabled:cursor-wait disabled:opacity-60">
          {isSubmitting ? "Guardando…" : isEditing ? "Guardar cambios" : "Registrar candidatura"}
        </button>
      </div>
    </form>
  );
}
