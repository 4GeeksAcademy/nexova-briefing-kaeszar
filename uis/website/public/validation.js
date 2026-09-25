document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  if (!form) {
    return;
  }

  form.setAttribute("novalidate", "");

  const fields = {
    firstName: document.querySelector("#first-name"),
    lastName: document.querySelector("#last-name"),
    email: document.querySelector("#email"),
    phone: document.querySelector("#phone"),
    location: document.querySelector("#location"),
    birthDate: document.querySelector("#birth-date"),
    area: document.querySelector("#area"),
    experienceYears: document.querySelector("#experience-years"),
    englishLevel: document.querySelector("#english-level"),
    availabilityDate: document.querySelector("#availability-date"),
    coverLetter: document.querySelector("#cover-letter"),
    cv: document.querySelector("#cv"),
    privacyConsent: document.querySelector("#privacy-consent"),
  };

  const requiredFields = [
    fields.firstName,
    fields.lastName,
    fields.email,
    fields.phone,
    fields.location,
    fields.area,
    fields.experienceYears,
    fields.englishLevel,
    fields.cv,
    fields.privacyConsent,
  ];

  const errorMessages = {
    firstName: "Introduce tu nombre.",
    lastName: "Introduce tus apellidos.",
    email: "Introduce un correo electrónico válido.",
    phone: "Introduce un teléfono válido.",
    location: "Introduce tu ciudad y país de residencia.",
    area: "Selecciona un área de interés.",
    experienceYears: "Introduce un número de años entre 0 y 60.",
    englishLevel: "Selecciona tu nivel de inglés.",
    cv: "Adjunta tu currículum en formato PDF, DOC o DOCX.",
    privacyConsent: "Debes aceptar el tratamiento de tus datos para continuar.",
    birthDate: "La fecha de nacimiento no puede ser futura.",
    availabilityDate: "La fecha de disponibilidad no puede ser anterior a hoy.",
    coverLetter: "El texto no puede superar los 2.000 caracteres.",
  };

  const getFieldName = (field) =>
    Object.keys(fields).find((name) => fields[name] === field);

  const getErrorElement = (field) => {
    const errorId = `${field.id}-error`;
    let error = document.getElementById(errorId);

    if (!error) {
      error = document.createElement("p");
      error.id = errorId;
      error.className = "mt-2 text-sm text-red-700";
      error.setAttribute("role", "alert");
      field.insertAdjacentElement("afterend", error);
    }

    return error;
  };

  const clearError = (field) => {
    if (!field) return;

    field.removeAttribute("aria-invalid");
    field.removeAttribute("aria-describedby");
    field.classList.remove("border-red-500", "focus:border-red-500", "focus:ring-red-200");

    const error = document.getElementById(`${field.id}-error`);
    if (error) {
      error.textContent = "";
    }
  };

  const showError = (field, message) => {
    if (!field) return false;

    const error = getErrorElement(field);
    error.textContent = message;
    field.setAttribute("aria-invalid", "true");
    field.setAttribute("aria-describedby", error.id);
    field.classList.add("border-red-500", "focus:border-red-500", "focus:ring-red-200");
    return false;
  };

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const isValidPhone = (value) => /^[+\d][\d\s().-]{7,}$/.test(value);
  const isFutureDate = (value) => value && new Date(`${value}T00:00:00`) > new Date();
  const isPastDate = (value) => {
    if (!value) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(`${value}T00:00:00`) < today;
  };

  const validateField = (field) => {
    if (!field) return true;

    clearError(field);
    const fieldName = getFieldName(field);
    const value = field.type === "checkbox" ? field.checked : field.value.trim();

    if (field.required && !value) {
      return showError(field, errorMessages[fieldName]);
    }

    if (!value) {
      return true;
    }

    if (field === fields.email && !isValidEmail(value)) {
      return showError(field, errorMessages.email);
    }

    if (field === fields.phone && !isValidPhone(value)) {
      return showError(field, errorMessages.phone);
    }

    if (field === fields.experienceYears) {
      const years = Number(value);
      if (!Number.isInteger(years) || years < 0 || years > 60) {
        return showError(field, errorMessages.experienceYears);
      }
    }

    if (field === fields.cv) {
      const file = field.files[0];
      const allowedExtensions = ["pdf", "doc", "docx"];
      const extension = file?.name.split(".").pop().toLowerCase();
      if (!file || !allowedExtensions.includes(extension)) {
        return showError(field, errorMessages.cv);
      }
    }

    if (field === fields.birthDate && isFutureDate(value)) {
      return showError(field, errorMessages.birthDate);
    }

    if (field === fields.availabilityDate && isPastDate(value)) {
      return showError(field, errorMessages.availabilityDate);
    }

    if (field === fields.coverLetter && value.length > 2000) {
      return showError(field, errorMessages.coverLetter);
    }

    return true;
  };

  [...requiredFields, fields.birthDate, fields.availabilityDate, fields.coverLetter].forEach((field) => {
    field?.addEventListener("blur", () => validateField(field));
    field?.addEventListener("change", () => validateField(field));
    field?.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") {
        validateField(field);
      }
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const fieldsToValidate = [
      ...requiredFields,
      fields.birthDate,
      fields.availabilityDate,
      fields.coverLetter,
    ];
    const isFormValid = fieldsToValidate.every(validateField);
    const previousMessage = document.querySelector("#form-status");
    previousMessage?.remove();

    if (!isFormValid) {
      const firstInvalidField = form.querySelector('[aria-invalid="true"]');
      firstInvalidField?.focus();
      return;
    }

    const successMessage = document.createElement("p");
    successMessage.id = "form-status";
    successMessage.className = "mt-4 text-sm font-medium text-teal-700";
    successMessage.setAttribute("role", "status");
    successMessage.textContent = "Tu aplicación ha sido validada correctamente. El envío estará disponible próximamente.";
    form.querySelector("button[type=submit]").insertAdjacentElement("afterend", successMessage);
  });

  form.addEventListener("reset", () => {
    window.setTimeout(() => {
      Object.values(fields).forEach(clearError);
      document.querySelector("#form-status")?.remove();
    }, 0);
  });
});
