// src/utils/validation-messages.ts

/**
 * Mesaje de validare centralizate pentru formulare în limba română
 */
export const VALIDATION_MESSAGES = {
  REQUIRED: "Acest câmp este obligatoriu.",
  REQUIRED_FIELD: (field: string) => `${field} este obligatoriu.`,
  EMAIL: {
    INVALID: "Vă rugăm să introduceți o adresă de email validă.",
  },
  STRING: {
    MIN: (field: string, min: number) =>
      `${field} trebuie să aibă cel puțin ${min} caracter${
        min === 1 ? "" : "e"
      }.`,
    MAX: (field: string, max: number) =>
      `${field} nu poate depăși ${max} caracter${max === 1 ? "" : "e"}.`,
  },
  NUMBER: {
    MIN: (field: string, min: number) =>
      `${field} trebuie să fie cel puțin ${min}.`,
    MAX: (field: string, max: number) => `${field} nu poate depăși ${max}.`,
  },
  ARRAY: {
    MIN: (field: string, min: number) =>
      `${field} trebuie să conțină cel puțin ${min} element${
        min === 1 ? "" : "e"
      }.`,
    MAX: (field: string, max: number) =>
      `${field} nu poate conține mai mult de ${max} element${
        max === 1 ? "" : "e"
      }.`,
  },
  DATE: {
    INVALID: (field: string) =>
      `Vă rugăm să introduceți o dată validă pentru ${field}.`,
    MIN: (field: string, date: string) =>
      `${field} trebuie să fie după ${date}.`,
    MAX: (field: string, date: string) =>
      `${field} trebuie să fie înainte de ${date}.`,
  },
  FORMAT: {
    ALPHANUMERIC: (field: string) =>
      `${field} trebuie să conțină doar litere și cifre.`,
    NUMERIC: (field: string) => `${field} trebuie să conțină doar cifre.`,
    URL: "Vă rugăm să introduceți un URL valid.",
    PHONE: "Vă rugăm să introduceți un număr de telefon valid.",
  },
  CUSTOM: {
    PASSWORD_MATCH: "Parolele nu coincid.",
    USERNAME_AVAILABLE: "Acest nume de utilizator este deja folosit.",
    INVALID_CREDENTIALS: "Email sau parolă invalidă.",
  },
};
