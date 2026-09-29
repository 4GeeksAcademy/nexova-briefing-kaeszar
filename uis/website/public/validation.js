(() => {
  "use strict";

  const form = document.querySelector("#candidate-application");
  if (!(form instanceof HTMLFormElement)) return;

  const summary = document.querySelector("#form-error-summary");
  const success = document.querySelector("#form-success");
  const resetNotice = document.querySelector("#form-reset-notice");
  let preserveSuccessOnReset = false;
  let showResetNotice = false;
  const maxCvSize = 5 * 1024 * 1024;
  const allowedExtensions = new Set(["pdf", "doc", "docx"]);
  const phonePattern = /^[+()\d][\d\s().-]{6,28}$/;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const birthDate = form.elements.namedItem("birthDate");
  const availabilityDate = form.elements.namedItem("availabilityDate");
  const cvInput = form.elements.namedItem("cv");

  const fields = Array.from(form.querySelectorAll("input, select, textarea")).filter(
    (field) => field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement,
  );

  const messageFor = (field) => {
    if (field.validity.valueMissing) {
      if (field.type === "checkbox") return "Debes aceptar el uso de tus datos para continuar.";
      if (field.type === "file") return "Adjunta tu currículum para completar la aplicación.";
      if (field.tagName === "SELECT") return "Selecciona una opción para continuar.";
      return "Este campo es obligatorio.";
    }

    switch (field.name) {
      case "firstName":
        if (field.validity.tooShort) return "El nombre debe tener al menos 2 caracteres.";
        if (field.validity.tooLong) return "El nombre no puede superar los 80 caracteres.";
        if (!/^[\p{L}\p{M}][\p{L}\p{M} .'-]*$/u.test(field.value.trim())) return "Usa letras y caracteres habituales para escribir tu nombre.";
        break;
      case "lastName":
        if (field.validity.tooShort) return "Los apellidos deben tener al menos 2 caracteres.";
        if (field.validity.tooLong) return "Los apellidos no pueden superar los 100 caracteres.";
        if (!/^[\p{L}\p{M}][\p{L}\p{M} .'-]*$/u.test(field.value.trim())) return "Usa letras y caracteres habituales para escribir tus apellidos.";
        break;
      case "email":
        if (field.validity.typeMismatch || !emailPattern.test(field.value.trim())) return "Introduce un correo válido, por ejemplo nombre@ejemplo.com.";
        if (field.validity.tooLong) return "El correo electrónico no puede superar los 254 caracteres.";
        break;
      case "phone": {
        const digits = field.value.replace(/\D/g, "");
        if (!phonePattern.test(field.value.trim()) || digits.length < 7 || digits.length > 15) return "Introduce un teléfono válido con código de país si corresponde (entre 7 y 15 dígitos).";
        break;
      }
      case "location":
        if (field.validity.tooShort) return "Indica una ciudad y un país (al menos 2 caracteres).";
        if (field.validity.tooLong) return "La ubicación no puede superar los 120 caracteres.";
        break;
      case "birthDate":
        if (field.value && field.validity.badInput) return "Introduce una fecha de nacimiento válida.";
        if (field.value && isFutureDate(field.value)) return "La fecha de nacimiento no puede ser futura.";
        if (field.value && !isValidBirthDate(field.value)) return "La fecha de nacimiento debe corresponder a una edad entre 16 y 100 años.";
        break;
      case "area":
        if (!field.value) return "Selecciona el área profesional que más te interesa.";
        break;
      case "experienceYears":
        if (field.validity.badInput || field.value === "") return "Indica tus años de experiencia.";
        if (!Number.isInteger(Number(field.value))) return "Los años de experiencia deben ser un número entero.";
        if (field.validity.rangeUnderflow || Number(field.value) < 0) return "La experiencia no puede ser inferior a 0 años.";
        if (field.validity.rangeOverflow || Number(field.value) > 60) return "La experiencia no puede superar los 60 años.";
        break;
      case "englishLevel":
        if (!field.value) return "Selecciona tu nivel de inglés.";
        break;
      case "availabilityDate":
        if (field.value && field.validity.badInput) return "Introduce una fecha de disponibilidad válida.";
        break;
      case "coverLetter":
        if (field.value.length > 2000) return "El texto no puede superar los 2.000 caracteres.";
        break;
      case "cv": {
        const file = field.files?.[0];
        if (!file) return "Adjunta tu currículum para completar la aplicación.";
        const extension = file.name.split(".").pop()?.toLowerCase();
        if (!extension || !allowedExtensions.has(extension)) return "El currículum debe estar en formato PDF, DOC o DOCX.";
        if (file.size > maxCvSize) return "El archivo supera el límite de 5 MB. Selecciona un archivo más pequeño.";
        if (file.size === 0) return "El archivo seleccionado está vacío. Comprueba tu currículum e inténtalo de nuevo.";
        break;
      }
      case "privacyConsent":
        if (!field.checked) return "Necesitamos tu autorización para gestionar esta aplicación.";
        break;
      default:
        if (!field.checkValidity()) return "Revisa el valor introducido en este campo.";
    }

    return "";
  };

  function isFutureDate(value) {
    const date = new Date(`${value}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Number.isNaN(date.getTime()) || date > today;
  }

  function isValidBirthDate(value) {
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return false;
    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const monthDifference = today.getMonth() - date.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < date.getDate())) age -= 1;
    return age >= 16 && age <= 100;
  }

  function getErrorElement(field) {
    return document.getElementById(`${field.id}-error`);
  }

  function validateField(field) {
    const error = messageFor(field);
    const errorElement = getErrorElement(field);
    field.setAttribute("aria-invalid", error ? "true" : "false");
    if (errorElement) {
      errorElement.textContent = error;
      errorElement.classList.toggle("hidden", !error);
    }
    return !error;
  }

  function hideStatusMessages() {
    summary?.classList.add("hidden");
    success?.classList.add("hidden");
    resetNotice?.classList.add("hidden");
  }

  // Custom validation messages replace browser popups while preserving native fallback without JS.
  form.noValidate = true;

  for (const field of fields) {
    field.addEventListener("blur", () => {
      validateField(field);
    });
    field.addEventListener("input", () => {
      hideStatusMessages();
      if (field.getAttribute("aria-invalid") === "true") validateField(field);
      if (field === birthDate && availabilityDate?.value) validateField(availabilityDate);
      if (field === availabilityDate && birthDate?.value) validateField(birthDate);
    });
    field.addEventListener("change", () => {
      if (preserveSuccessOnReset) {
        preserveSuccessOnReset = false;
      } else {
        hideStatusMessages();
      }
      if (field.getAttribute("aria-invalid") === "true" || field.type === "file" || field.type === "checkbox" || field.tagName === "SELECT") {
        validateField(field);
      }
    });
  }

  form.addEventListener("reset", () => {
    window.setTimeout(() => {
      for (const field of fields) {
        field.removeAttribute("aria-invalid");
        const errorElement = getErrorElement(field);
        if (errorElement) {
          errorElement.textContent = "";
          errorElement.classList.add("hidden");
        }
      }
      if (preserveSuccessOnReset) {
        preserveSuccessOnReset = false;
      } else {
        summary?.classList.add("hidden");
        success?.classList.add("hidden");
        if (showResetNotice) {
          showResetNotice = false;
          resetNotice?.classList.remove("hidden");
          resetNotice?.focus();
        } else {
          resetNotice?.classList.add("hidden");
        }
      }
    }, 0);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    hideStatusMessages();

    let firstInvalid = null;
    let isFormValid = true;
    for (const field of fields) {
      const isFieldValid = validateField(field);
      if (!isFieldValid) {
        isFormValid = false;
        firstInvalid ??= field;
      }
    }

    if (!isFormValid) {
      summary?.classList.remove("hidden");
      summary?.focus();
      firstInvalid?.focus();
      return;
    }

    // Reset the fields but keep the confirmation visible after a valid submission.
    preserveSuccessOnReset = true;
    showResetNotice = false;
    form.reset();
    success?.classList.remove("hidden");
    success?.focus();
  });

  form.addEventListener("reset", () => {
    // A user-triggered reset should give a small confirmation; the successful-submit
    // reset is handled separately above and keeps its success message instead.
    if (!preserveSuccessOnReset) showResetNotice = true;
  });
})();
