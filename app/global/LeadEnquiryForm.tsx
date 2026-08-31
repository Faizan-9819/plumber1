"use client";

import { Check, ChevronDown, Loader2 } from "lucide-react";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useLanguage } from "../i18n/LanguageProvider";
import type { Translation } from "../i18n/config";

type LeadEnquiryFormProps = {
  idPrefix?: string;
  onSuccessComplete?: () => void;
  className?: string;
  submitLabel?: Translation;
};

type BookableService = {
  id: number;
  name: string;
  isActive: boolean;
  isConsultation?: boolean;
};

const TENANT_SLUG = "plumber1";
const SITE_SLUG = "plumber1";
const API_BASE = `https://api.getgrowthrocket.com/api/v1/public/tenants/${TENANT_SLUG}/sites/${SITE_SLUG}`;

const INDUSTRIES: { value: string; label: Translation }[] = [
  { value: "Electrician", label: { en: "Electrician", nl: "Elektricien" } },
  { value: "Plumber", label: { en: "Plumber", nl: "Loodgieter" } },
  {
    value: "HVAC / Heating Technician",
    label: { en: "HVAC / Heating Technician", nl: "HVAC / Verwarmingsmonteur" },
  },
  {
    value: "Solar Panel Installer",
    label: { en: "Solar Panel Installer", nl: "Zonnepaneel-installateur" },
  },
  {
    value: "EV Charging Installer",
    label: { en: "EV Charging Installer", nl: "Laadpaal-installateur" },
  },
  { value: "Handyman", label: { en: "Handyman", nl: "Klusjesman" } },
  { value: "Painter", label: { en: "Painter", nl: "Schilder" } },
  { value: "Carpenter", label: { en: "Carpenter", nl: "Timmerman" } },
  { value: "Tiler", label: { en: "Tiler", nl: "Tegelzetter" } },
  { value: "Roofer", label: { en: "Roofer", nl: "Dakdekker" } },
  {
    value: "Construction Contractor",
    label: { en: "Construction Contractor", nl: "Aannemer" },
  },
  {
    value: "Hair Salon / Barber",
    label: { en: "Hair Salon / Barber", nl: "Kapsalon / Barbier" },
  },
  {
    value: "Beauty Salon / Spa",
    label: { en: "Beauty Salon / Spa", nl: "Schoonheidssalon / Spa" },
  },
  { value: "Nail Salon", label: { en: "Nail Salon", nl: "Nagelsalon" } },
  {
    value: "Massage Therapist",
    label: { en: "Massage Therapist", nl: "Massagetherapeut" },
  },
  {
    value: "Fitness Trainer / Gym",
    label: { en: "Fitness Trainer / Gym", nl: "Fitnesstrainer / Sportschool" },
  },
  { value: "Other", label: { en: "Other", nl: "Anders" } },
];

const REGEX = {
  phone: /^\+?[0-9\s\-()]{7,20}$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
};

const INITIAL_FORM_DATA = {
  name: "",
  phone: "",
  email: "",
  businessName: "",
  industry: "",
  industryOther: "",
  serviceArea: "",
  service: "",
  message: "",
};

const INITIAL_FIELD_ERRORS = {
  phone: "",
  email: "",
};

const LABEL_CLASS = "text-[13px] font-semibold text-muted ml-1";
const INPUT_BASE =
  "w-full h-fit p-2 rounded-xl border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-ink bg-soft placeholder:text-[#8890a0]";
const SELECT_BASE =
  "w-full h-[41.45px] py-1 pl-4 pr-10 rounded-xl border border-line focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-ink bg-soft appearance-none cursor-pointer";

export default function LeadEnquiryForm({
  idPrefix = "lead",
  onSuccessComplete,
  className,
  submitLabel,
}: LeadEnquiryFormProps) {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [fieldErrors, setFieldErrors] = useState(INITIAL_FIELD_ERRORS);
  const [services, setServices] = useState<BookableService[]>([]);

  const fieldId = (name: string) => `${idPrefix}-${name}`;

  useEffect(() => {
    let cancelled = false;

    fetch(`${API_BASE}/bookings/settings`, {
      headers: { Accept: "application/json" },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return (await res.json()) as { services?: BookableService[] };
      })
      .then((data) => {
        if (cancelled) return;
        const enquirable = (data.services ?? []).filter(
          (s) => s.isActive && !s.isConsultation,
        );
        setServices(enquirable);
      })
      .catch(() => {
        // Non-critical — the form still works without the services list.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const validateField = (name: string, value: string) => {
    let nextError = "";
    if (name === "phone" && value) {
      if (value === "+") return true;
      if (!REGEX.phone.test(value)) {
        nextError = t({
          en: "Please enter a valid international phone number",
          nl: "Voer een geldig internationaal telefoonnummer in",
        });
      }
    }
    if (name === "email" && value && !REGEX.email.test(value)) {
      nextError = t({
        en: "Please enter a valid email address",
        nl: "Voer een geldig e-mailadres in",
      });
    }
    setFieldErrors((prev) => ({ ...prev, [name]: nextError }));
    return nextError === "";
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (["phone", "email"].includes(name)) {
      validateField(name, value);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const isPhoneValid = validateField("phone", formData.phone);
    const isEmailValid = validateField("email", formData.email);

    if (!isPhoneValid || !isEmailValid) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          businessName: formData.businessName,
          industry: formData.industry,
          industryOther:
            formData.industry === "Other" ? formData.industryOther : undefined,
          serviceArea: formData.serviceArea,
          serviceId: formData.service ? Number(formData.service) : undefined,
          message: formData.message,
          source: "PUBLIC_ENQUIRY",
          tags: ["Website", "Enquiry"],
        }),
      });

      if (!response.ok) {
        throw new Error(
          t({
            en: "Failed to submit enquiry. Please try again.",
            nl: "Verzenden van de aanvraag is mislukt. Probeer het opnieuw.",
          }),
        );
      }

      setIsSuccess(true);
      onSuccessComplete?.();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : t({ en: "Something went wrong.", nl: "Er ging iets mis." }),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-accent/10">
          <Check className="h-10 w-10 text-accent" />
        </div>
        <p className="mb-2 text-2xl font-semibold text-ink">
          {t({ en: "Message Sent!", nl: "Bericht verzonden!" })}
        </p>
        <p className="text-muted">
          {t({
            en: "We'll get back to you shortly.",
            nl: "We nemen zo snel mogelijk contact met je op.",
          })}
        </p>
      </div>
    );
  }

  return (
    <form
      className={["space-y-2", className].filter(Boolean).join(" ")}
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor={fieldId("name")} className={LABEL_CLASS}>
            {t({ en: "Full Name", nl: "Volledige naam" })}
          </label>
          <input
            id={fieldId("name")}
            required
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            className={`${INPUT_BASE} border-line`}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor={fieldId("phone")} className={LABEL_CLASS}>
            {t({ en: "Phone Number", nl: "Telefoonnummer" })}
          </label>
          <input
            id={fieldId("phone")}
            required
            name="phone"
            type="tel"
            placeholder="+31 85 744 4176"
            value={formData.phone}
            onChange={handleInputChange}
            className={`${INPUT_BASE} ${fieldErrors.phone ? "border-red-500" : "border-line"}`}
          />
          {fieldErrors.phone && (
            <p className="ml-1 text-[11px] font-medium text-red-500">
              {fieldErrors.phone}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor={fieldId("email")} className={LABEL_CLASS}>
            {t({ en: "Email Address", nl: "E-mailadres" })}
          </label>
          <input
            id={fieldId("email")}
            required
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`${INPUT_BASE} ${fieldErrors.email ? "border-red-500" : "border-line"}`}
          />
          {fieldErrors.email && (
            <p className="ml-1 text-[11px] font-medium text-red-500">
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor={fieldId("businessName")} className={LABEL_CLASS}>
            {t({ en: "Business Name", nl: "Bedrijfsnaam" })}
          </label>
          <input
            id={fieldId("businessName")}
            required
            name="businessName"
            type="text"
            value={formData.businessName}
            onChange={handleInputChange}
            className={`${INPUT_BASE} border-line`}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor={fieldId("industry")} className={LABEL_CLASS}>
            {t({
              en: "Type of Work / Industry",
              nl: "Soort werk / Branche",
            })}
          </label>
          <div className="relative">
            <select
              id={fieldId("industry")}
              required
              name="industry"
              value={formData.industry}
              onChange={handleInputChange}
              className={SELECT_BASE}
            >
              <option value="" disabled>
                {t({ en: "Select Industry", nl: "Kies een branche" })}
              </option>
              {INDUSTRIES.map((ind) => (
                <option key={ind.value} value={ind.value}>
                  {t(ind.label)}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted"
              size={18}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor={fieldId("serviceArea")} className={LABEL_CLASS}>
            {t({
              en: "Service Area / Location",
              nl: "Werkgebied / Locatie",
            })}
          </label>
          <input
            id={fieldId("serviceArea")}
            required
            name="serviceArea"
            type="text"
            value={formData.serviceArea}
            onChange={handleInputChange}
            className={`${INPUT_BASE} border-line`}
          />
        </div>

        {formData.industry === "Other" && (
          <div className="space-y-1.5 lg:col-span-2">
            <label htmlFor={fieldId("industryOther")} className={LABEL_CLASS}>
              {t({ en: "Please specify", nl: "Specificeer" })}
            </label>
            <input
              id={fieldId("industryOther")}
              required
              name="industryOther"
              type="text"
              value={formData.industryOther}
              onChange={handleInputChange}
              className={`${INPUT_BASE} border-line`}
            />
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor={fieldId("service")} className={LABEL_CLASS}>
            {t({ en: "Service Needed", nl: "Gewenste dienst" })}
          </label>
          <div className="relative">
            <select
              id={fieldId("service")}
              name="service"
              value={formData.service}
              onChange={handleInputChange}
              className={SELECT_BASE}
            >
              <option value="">
                {t({ en: "Select a service", nl: "Kies een dienst" })}
              </option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted"
              size={18}
            />
          </div>
        </div>

        <div className="space-y-1.5 lg:col-span-2">
          <label htmlFor={fieldId("message")} className={LABEL_CLASS}>
            {t({
              en: "Message (Optional)",
              nl: "Bericht (optioneel)",
            })}
          </label>
          <textarea
            id={fieldId("message")}
            name="message"
            rows={3}
            value={formData.message}
            onChange={handleInputChange}
            className="w-full resize-none rounded-xl border border-line bg-soft px-4 py-3 text-sm text-ink transition-all outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </div>
      </div>

      {error && <p className="text-[13px] font-medium text-red-500">{error}</p>}

      <button
        disabled={isSubmitting}
        type="submit"
        className="btn-primary mt-4 flex w-full items-center justify-center gap-2 py-3.5 text-[15px] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 shrink-0 animate-spin" />
            <span>{t({ en: "Submitting...", nl: "Versturen..." })}</span>
          </>
        ) : (
          <>
            <span>
              {t(
                submitLabel ?? {
                  en: "Submit Enquiry",
                  nl: "Aanvraag versturen",
                },
              )}
            </span>
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </>
        )}
      </button>
    </form>
  );
}
