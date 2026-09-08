"use client";
import { useLanguage } from "../i18n/LanguageProvider";
import { motion, AnimatePresence } from "framer-motion";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type WheelEvent,
} from "react";
import type { ReactNode } from "react";
import { useLenisControl } from "../components/LenisProvider";

interface BookingFormProps {
  isOpen: boolean;
  onClose: () => void;
}

type Service = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  durationMinutes: number;
  priceMinor?: number | null;
  currencyCode?: string | null;
  isActive: boolean;
  isBookable: boolean;
  isConsultation?: boolean;
};

type Settings = {
  timezone: string;
  slotIntervalMinutes: number;
  minNoticeMinutes: number;
  maxAdvanceDays: number;
  bufferBeforeMinutes: number;
  bufferAfterMinutes: number;
  isActive: boolean;
};

type Slot = {
  startsAt: string;
  endsAt: string;
  startsAtLocal?: string;
  endsAtLocal?: string;
  status?: string;
  availabilityStatus?: string;
  isAvailable?: boolean;
};

type SettingsResponse = {
  settings: Settings;
  services: Service[];
};

type SlotsResponse = {
  slotsByDate?: Record<string, Slot[]>;
  slots?: Slot[];
};

type Step = "service" | "slot" | "details" | "success";

const API_ORIGIN = "https://api.getgrowthrocket.com";
const TENANT_SLUG = "plumber1";
const SITE_SLUG = "plumber1";
const API_BASE = `${API_ORIGIN}/api/v1/public`;

function toLocalDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addDays(d: Date, days: number): Date {
  const out = new Date(d);
  out.setDate(out.getDate() + days);
  return out;
}

function dateFromKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

function formatPrice(priceMinor?: number | null, currency?: string | null) {
  if (priceMinor == null) return null;
  const value = priceMinor / 100;
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency ?? "EUR",
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currency ?? ""}`.trim();
  }
}

function formatDateLong(key: string) {
  return dateFromKey(key).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function formatDateShort(key: string) {
  return dateFromKey(key).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function formatSingleTime(iso: string, local?: string) {
  if (local) {
    const t = local.split("T")[1] ?? "";
    const hhmm = t.slice(0, 5);
    if (hhmm) return formatHHMM(hhmm);
  }
  try {
    return new Date(iso).toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function formatTimeFromStartsAt(slot: Slot) {
  const start = formatSingleTime(slot.startsAt, slot.startsAtLocal);
  const end = formatSingleTime(slot.endsAt, slot.endsAtLocal);
  return `${start} - ${end}`;
}

function formatHHMM(hhmm: string) {
  const [hStr, mStr] = hhmm.split(":");
  let h = Number(hStr);
  const m = mStr ?? "00";
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${ampm}`;
}

function isSlotAvailable(slot: Slot): boolean {
  if (typeof slot.isAvailable === "boolean") return slot.isAvailable;
  const status = slot.availabilityStatus ?? slot.status;
  if (status) return status === "available";
  return true;
}

function stepIndex(s: Step): number {
  return { service: 0, slot: 1, details: 2, success: 3 }[s];
}

function ModalButton({
  children,
  onClick,
  disabled,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  arrow?: "right";
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "btn-primary inline-flex items-center justify-center gap-2",
        className,
      ].join(" ")}
    >
      <span>{children}</span>
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
    </button>
  );
}

export default function BookingForm({ isOpen, onClose }: BookingFormProps) {
  const { t } = useLanguage();
  const { stop: lenisStop, start: lenisStart } = useLenisControl();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [serviceId, setServiceId] = useState<number | null>(null);

  const [loadingSettings, setLoadingSettings] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);

  const [slotsByDate, setSlotsByDate] = useState<Record<string, Slot[]>>({});
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  const [step, setStep] = useState<Step>("service");
  const [direction, setDirection] = useState(1);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fetchedSettingsRef = useRef(false);

  const goTo = useCallback(
    (next: Step) => {
      setDirection(stepIndex(next) > stepIndex(step) ? 1 : -1);
      setStep(next);
    },
    [step],
  );

  // Load settings on open
  useEffect(() => {
    if (!isOpen) return;
    if (fetchedSettingsRef.current) return;
    fetchedSettingsRef.current = true;

    let cancelled = false;
    setLoadingSettings(true);
    setSettingsError(null);

    fetch(`${API_BASE}/bookings/settings`, {
      headers: { Accept: "application/json" },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return (await res.json()) as SettingsResponse;
      })
      .then((data) => {
        if (cancelled) return;
        setSettings(data.settings);
        const active = (data.services ?? [])
          .map((s) =>
            s.id === 9 && s.priceMinor === 65 ? { ...s, priceMinor: 6500 } : s,
          )
          .filter((s) => s.isActive && s.isBookable);
        setServices(active);
        if (active.length > 0) setServiceId(active[0].id);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const msg =
          err instanceof Error
            ? err.message
            : t({ en: "Failed to load", nl: "Laden mislukt" });
        setSettingsError(
          t({
            en: `Couldn't load booking options (${msg}).`,
            nl: `Kon de boekingsopties niet laden (${msg}).`,
          }),
        );
      })
      .finally(() => {
        if (cancelled) return;
        setLoadingSettings(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, t]);

  // Reset on close
  useEffect(() => {
    if (isOpen) return;
    const t = window.setTimeout(() => {
      fetchedSettingsRef.current = false;
      setSettings(null);
      setServices([]);
      setServiceId(null);
      setSlotsByDate({});
      setSelectedDate(null);
      setSelectedSlot(null);
      setStep("service");
      setName("");
      setEmail("");
      setPhone("");
      setNotes("");
      setSubmitError(null);
      setSubmitting(false);
      setSettingsError(null);
      setSlotsError(null);
      setLoadingSettings(false);
      setLoadingSlots(false);
    }, 350);
    return () => window.clearTimeout(t);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      lenisStop();
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
        lenisStart();
      };
    }
  }, [isOpen, lenisStop, lenisStart]);

  // ESC closes
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const selectedService = useMemo(
    () => services.find((s) => s.id === serviceId) ?? null,
    [services, serviceId],
  );

  const dateRange = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxDays = Math.min(Math.max(settings?.maxAdvanceDays ?? 14, 1), 60);
    const dates: string[] = [];
    for (let i = 0; i < maxDays; i++) {
      dates.push(toLocalDateKey(addDays(today, i)));
    }
    return dates;
  }, [settings]);

  // Fetch slots when entering slot step
  useEffect(() => {
    if (!isOpen) return;
    if (step !== "slot") return;
    if (!serviceId || dateRange.length === 0) return;

    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- loading indicator at start of fetch
    setLoadingSlots(true);
    setSlotsError(null);

    const from = dateRange[0];
    const to = dateRange[dateRange.length - 1];
    const url = `${API_BASE}/bookings/slots?serviceId=${serviceId}&from=${from}&to=${to}`;

    fetch(url, { headers: { Accept: "application/json" } })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return (await res.json()) as SlotsResponse;
      })
      .then((data) => {
        if (cancelled) return;
        let map: Record<string, Slot[]> = {};
        if (data.slotsByDate) {
          map = data.slotsByDate;
        } else if (Array.isArray(data.slots)) {
          for (const s of data.slots) {
            const key =
              (s.startsAtLocal && s.startsAtLocal.split("T")[0]) ||
              s.startsAt.split("T")[0];
            if (!map[key]) map[key] = [];
            map[key].push(s);
          }
        }
        setSlotsByDate(map);

        const firstAvailable = dateRange.find((d) =>
          (map[d] ?? []).some(isSlotAvailable),
        );
        setSelectedDate(firstAvailable ?? null);
        setSelectedSlot(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const msg =
          err instanceof Error
            ? err.message
            : t({ en: "Failed to load", nl: "Laden mislukt" });
        setSlotsError(
          t({
            en: `Couldn't load available times (${msg}).`,
            nl: `Kon beschikbare tijden niet laden (${msg}).`,
          }),
        );
      })
      .finally(() => {
        if (cancelled) return;
        setLoadingSlots(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, step, serviceId, dateRange, t]);

  const availableDateSet = useMemo(() => {
    const set = new Set<string>();
    for (const [d, slots] of Object.entries(slotsByDate)) {
      if (slots.some(isSlotAvailable)) set.add(d);
    }
    return set;
  }, [slotsByDate]);

  const slotsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return slotsByDate[selectedDate] ?? [];
  }, [slotsByDate, selectedDate]);

  const availableSlotsForDate = useMemo(
    () => slotsForSelectedDate.filter(isSlotAvailable),
    [slotsForSelectedDate],
  );

  const handleSubmit = useCallback(async () => {
    if (!serviceId || !selectedSlot || !name.trim()) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch(`${API_BASE}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          serviceId,
          customerName: name.trim(),
          customerEmail: email.trim() || undefined,
          customerPhone: phone.trim() || undefined,
          startsAt: selectedSlot.startsAt,
          endsAt: selectedSlot.endsAt,
          notes: notes.trim() || undefined,
        }),
      });

      if (!res.ok) {
        let msg = t({
          en: `Request failed (${res.status}).`,
          nl: `Verzoek mislukt (${res.status}).`,
        });
        try {
          const data = (await res.json()) as {
            message?: string;
            error?: string;
          };
          msg = data.message || data.error || msg;
        } catch {
          /* ignore */
        }
        throw new Error(msg);
      }

      goTo("success");
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : t({ en: "Something went wrong.", nl: "Er ging iets mis." });
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  }, [serviceId, selectedSlot, name, email, phone, notes, goTo, t]);

  const stepNumber: Record<Step, number> = {
    service: 1,
    slot: 2,
    details: 3,
    success: 3,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[1800] bg-black/60 backdrop-blur-sm"
          />

          <div className="fixed inset-0 z-[1801] flex items-center justify-center p-3 lg:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 24 }}
              transition={{ type: "spring", duration: 0.55, bounce: 0.28 }}
              className="relative w-full max-w-[600px] bg-card rounded-3xl shadow-2xl pointer-events-auto overflow-hidden flex flex-col max-h-[520px] lg:max-h-[calc(100vh-24px)]"
              role="dialog"
              aria-modal="true"
              aria-label={t({
                en: "Book an appointment",
                nl: "Afspraak maken",
              })}
              data-lenis-prevent
            >
              {/* Header */}
              <div className="bg-grad relative shrink-0 px-6 lg:px-8 pt-5 pb-5 text-white overflow-hidden">
                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[2px] text-white/75">
                      {step === "success"
                        ? t({ en: "All done", nl: "Klaar" })
                        : t({
                            en: "Book an Appointment",
                            nl: "Afspraak maken",
                          })}
                    </p>
                    <h2 className="font-extrabold text-[clamp(20px,3.8vw,24px)] leading-[1.15] mt-1">
                      {step === "service" &&
                        t({ en: "Pick a service", nl: "Kies een dienst" })}
                      {step === "slot" &&
                        t({
                          en: "Choose a date & time",
                          nl: "Kies een datum & tijd",
                        })}
                      {step === "details" &&
                        t({ en: "Your details", nl: "Jouw gegevens" })}
                      {step === "success" &&
                        t({
                          en: "You're booked in 🎉",
                          nl: "Je bent ingepland 🎉",
                        })}
                    </h2>
                  </div>
                  <button
                    onClick={onClose}
                    aria-label={t({ en: "Close", nl: "Sluiten" })}
                    className="shrink-0 -m-2 p-2 rounded-full text-white/85 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {step !== "success" && (
                  <div className="relative mt-4 flex items-center gap-2">
                    {[1, 2, 3].map((n) => {
                      const active = stepNumber[step] >= n;
                      return (
                        <div
                          key={n}
                          className="flex-1 h-[5px] rounded-full overflow-hidden bg-white/25"
                        >
                          <motion.div
                            initial={false}
                            animate={{ width: active ? "100%" : "0%" }}
                            transition={{
                              duration: 0.45,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            className="h-full bg-white"
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Body — make content area scrollable when content is long */}
              <div
                className="booking-body-scroll relative px-6 lg:px-8 py-6 flex flex-col flex-1 min-h-0 max-h-[calc(100vh-64px)] overflow-y-auto touch-pan-y"
                data-lenis-prevent
              >
                <AnimatePresence mode="wait" custom={direction}>
                  {step === "service" && (
                    <Slide key="service" direction={direction}>
                      <ServiceStep
                        services={services}
                        loading={loadingSettings}
                        error={settingsError}
                        serviceId={serviceId}
                        onServiceChange={setServiceId}
                        onContinue={() => goTo("slot")}
                      />
                    </Slide>
                  )}

                  {step === "slot" && (
                    <Slide key="slot" direction={direction}>
                      <SlotStep
                        loading={loadingSlots}
                        error={slotsError}
                        dateRange={dateRange}
                        availableDateSet={availableDateSet}
                        selectedDate={selectedDate}
                        onSelectDate={(d) => {
                          setSelectedDate(d);
                          setSelectedSlot(null);
                        }}
                        slots={slotsForSelectedDate}
                        availableSlots={availableSlotsForDate}
                        selectedSlot={selectedSlot}
                        onSelectSlot={setSelectedSlot}
                        onBack={() => goTo("service")}
                        onContinue={() => goTo("details")}
                      />
                    </Slide>
                  )}

                  {step === "details" && (
                    <Slide key="details" direction={direction}>
                      <DetailsStep
                        service={selectedService}
                        slot={selectedSlot}
                        name={name}
                        setName={setName}
                        email={email}
                        setEmail={setEmail}
                        phone={phone}
                        setPhone={setPhone}
                        notes={notes}
                        setNotes={setNotes}
                        onBack={() => goTo("slot")}
                        onSubmit={handleSubmit}
                        submitting={submitting}
                        error={submitError}
                      />
                    </Slide>
                  )}

                  {step === "success" && (
                    <Slide key="success" direction={1}>
                      <SuccessStep
                        service={selectedService}
                        slot={selectedSlot}
                        name={name}
                        onClose={onClose}
                      />
                    </Slide>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          <style jsx global>{`
            .slots-row::-webkit-scrollbar {
              height: 3px;
            }
            .slots-row::-webkit-scrollbar-track {
              background: transparent;
            }
            .slots-row::-webkit-scrollbar-thumb {
              background: var(--accent);
              border-radius: 999px;
            }
            .slots-row::-webkit-scrollbar-thumb:hover {
              background: var(--accent-2);
            }
            .slots-row {
              scrollbar-width: thin;
              scrollbar-color: var(--accent) transparent;
            }
            .services-scroll::-webkit-scrollbar {
              width: 8px;
            }
            .services-scroll::-webkit-scrollbar-track {
              background: var(--soft);
              border-radius: 999px;
            }
            .services-scroll::-webkit-scrollbar-thumb {
              background: var(--accent);
              border: 2px solid var(--soft);
              border-radius: 999px;
            }
            .services-scroll::-webkit-scrollbar-thumb:hover {
              background: var(--accent-2);
            }
            .services-scroll {
              scrollbar-width: thin;
              scrollbar-color: var(--accent) var(--soft);
            }
            .booking-body-scroll::-webkit-scrollbar {
              width: 8px;
            }
            .booking-body-scroll::-webkit-scrollbar-track {
              background: var(--soft);
              border-radius: 999px;
            }
            .booking-body-scroll::-webkit-scrollbar-thumb {
              background: var(--accent);
              border: 2px solid var(--soft);
              border-radius: 999px;
            }
            .booking-body-scroll::-webkit-scrollbar-thumb:hover {
              background: var(--accent-2);
            }
            .booking-body-scroll {
              scrollbar-width: thin;
              scrollbar-color: var(--accent) var(--soft);
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
}

function Slide({
  children,
  direction,
}: {
  children: ReactNode;
  direction: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: direction * 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: direction * -24 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="flex-1 flex flex-col min-h-0"
    >
      {children}
    </motion.div>
  );
}

/* ────────────── STEP 1: SERVICE SELECTION ────────────── */

function ServiceStep({
  services,
  loading,
  error,
  serviceId,
  onServiceChange,
  onContinue,
}: {
  services: Service[];
  loading: boolean;
  error: string | null;
  serviceId: number | null;
  onServiceChange: (id: number) => void;
  onContinue: () => void;
}) {
  const { t } = useLanguage();
  const canContinue = !!serviceId;
  const servicesRef = useRef<HTMLDivElement | null>(null);

  const onServicesWheel = (e: WheelEvent<HTMLDivElement>) => {
    const el = servicesRef.current;
    if (!el) return;
    const delta = e.deltaY;
    const atTop = delta < 0 && el.scrollTop === 0;
    const atBottom =
      delta > 0 && el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
    if (atTop || atBottom) {
      e.preventDefault();
    }
  };

  return (
    <div className="flex flex-col gap-4 flex-1">
      {loading && (
        <div className="flex items-center justify-center py-10 flex-1">
          <Spinner />
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <p className="text-[13px] text-muted -mt-1">
            {t({
              en: "Choose what you'd like to book.",
              nl: "Kies wat je wilt boeken.",
            })}
          </p>

          <div
            ref={servicesRef}
            onWheel={onServicesWheel}
            data-lenis-prevent
            className="services-scroll overflow-y-auto max-h-[260px] lg:max-h-[372px] pr-1 scroll-smooth"
          >
            <div className="grid grid-cols-1 gap-2.5">
              {services.length === 0 && (
                <div className="rounded-xl border border-line bg-soft px-4 py-3 text-[13px] text-muted">
                  {t({
                    en: "No services are available right now.",
                    nl: "Er zijn op dit moment geen diensten beschikbaar.",
                  })}
                </div>
              )}
              {services.map((s) => {
                const active = s.id === serviceId;
                const price = formatPrice(s.priceMinor, s.currencyCode);
                return (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => onServiceChange(s.id)}
                    className={
                      "group relative text-left rounded-xl border px-4 py-3.5 transition-all cursor-pointer " +
                      (active
                        ? "border-accent bg-accent/10 shadow-[0_8px_24px_-12px_rgba(79,126,242,0.35)]"
                        : "border-line hover:border-accent/50 hover:bg-accent/5")
                    }
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-semibold text-[15px] text-ink">
                          {s.name}
                        </div>
                        {s.description && (
                          <div className="mt-0.5 text-[12.5px] leading-[1.45] text-muted line-clamp-2">
                            {s.description}
                          </div>
                        )}
                        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-muted">
                          <span className="inline-flex items-center gap-1">
                            <svg
                              width="13"
                              height="13"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <path d="M12 6v6l4 2" />
                            </svg>
                            {s.durationMinutes} {t({ en: "min", nl: "min" })}
                          </span>
                          {price && (
                            <span className="inline-flex items-center gap-1 text-accent font-medium">
                              {price}
                            </span>
                          )}
                        </div>
                      </div>
                      <span
                        className={
                          "shrink-0 mt-0.5 inline-flex size-[20px] items-center justify-center rounded-full border-2 transition-colors " +
                          (active
                            ? "border-accent bg-accent"
                            : "border-line bg-soft")
                        }
                      >
                        {active && (
                          <motion.svg
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.18 }}
                            width="11"
                            height="11"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#ffffff"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M5 13l4 4L19 7" />
                          </motion.svg>
                        )}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 mt-auto">
            <ModalButton
              onClick={onContinue}
              disabled={!canContinue}
              className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
            >
              {t({ en: "Continue", nl: "Doorgaan" })}
            </ModalButton>
          </div>
        </>
      )}
    </div>
  );
}

/* ────────────── STEP 2: DATE + SLOT ────────────── */

function SlotStep({
  loading,
  error,
  dateRange,
  availableDateSet,
  selectedDate,
  onSelectDate,
  slots,
  availableSlots,
  selectedSlot,
  onSelectSlot,
  onBack,
  onContinue,
}: {
  loading: boolean;
  error: string | null;
  dateRange: string[];
  availableDateSet: Set<string>;
  selectedDate: string | null;
  onSelectDate: (d: string) => void;
  slots: Slot[];
  availableSlots: Slot[];
  selectedSlot: Slot | null;
  onSelectSlot: (s: Slot) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const { t, locale } = useLanguage();
  const slotsRowRef = useRef<HTMLDivElement | null>(null);

  // Scroll selected slot into view horizontally
  useEffect(() => {
    if (!selectedSlot || !slotsRowRef.current) return;
    const key = `${selectedSlot.startsAt}-${selectedSlot.endsAt}`;
    const el = slotsRowRef.current.querySelector<HTMLElement>(
      `[data-slot="${key}"]`,
    );
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [selectedSlot]);

  return (
    <div className="flex flex-col gap-5 flex-1">
      {loading && (
        <div className="flex flex-col items-center justify-center gap-3 py-10 flex-1">
          <Spinner />
          <p className="text-[13px] text-muted">
            {t({
              en: "Finding available times…",
              nl: "Beschikbare tijden zoeken…",
            })}
          </p>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <Calendar
            dateRange={dateRange}
            availableDateSet={availableDateSet}
            selectedDate={selectedDate}
            onSelectDate={onSelectDate}
          />

          <div>
            {selectedDate && (
              <p className="mb-1 font-semibold text-[13px] text-ink">
                {dateFromKey(selectedDate).toLocaleDateString(
                  locale === "nl" ? "nl-NL" : "en-US",
                  { month: "long", year: "numeric" },
                )}
              </p>
            )}
            <p className="mb-2 text-[11.5px] uppercase tracking-[1.4px] text-muted font-semibold">
              {t({ en: "Available times", nl: "Beschikbare tijden" })}{" "}
              {selectedDate && (
                <span className="text-ink normal-case tracking-normal font-medium">
                  · {formatDateShort(selectedDate)}
                </span>
              )}
            </p>

            {!selectedDate ? (
              <div className="rounded-xl border border-line bg-soft px-4 py-5 text-center">
                <p className="text-[13px] text-muted">
                  {t({
                    en: "Pick a date above to see available times.",
                    nl: "Kies hierboven een datum om beschikbare tijden te zien.",
                  })}
                </p>
              </div>
            ) : slots.length === 0 ? (
              <div className="rounded-xl border border-line bg-soft px-4 py-5 text-center">
                <p className="text-[13px] text-muted">
                  {t({
                    en: "No times on this day. Try another date.",
                    nl: "Geen tijden op deze dag. Probeer een andere datum.",
                  })}
                </p>
              </div>
            ) : availableSlots.length === 0 ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-5 text-center">
                <p className="text-[13px] text-amber-700">
                  {t({
                    en: "All slots are booked or unavailable on this day.",
                    nl: "Alle tijdvakken zijn geboekt of niet beschikbaar op deze dag.",
                  })}
                </p>
              </div>
            ) : (
              <div
                ref={slotsRowRef}
                className="slots-row flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scroll-smooth"
                data-lenis-prevent
              >
                {availableSlots.map((slot) => {
                  const key = `${slot.startsAt}-${slot.endsAt}`;
                  const active =
                    selectedSlot?.startsAt === slot.startsAt &&
                    selectedSlot?.endsAt === slot.endsAt;
                  return (
                    <motion.button
                      type="button"
                      key={key}
                      data-slot={key}
                      onClick={() => onSelectSlot(slot)}
                      whileHover={{ scale: 0.96 }}
                      whileTap={{ scale: 0.96 }}
                      className={
                        "shrink-0 rounded-xl border px-4 py-2.5 font-medium text-[13px] whitespace-nowrap transition-colors cursor-pointer " +
                        (active
                          ? "border-accent bg-accent text-white shadow-[0_8px_20px_-10px_rgba(79,126,242,0.5)]"
                          : "border-line bg-soft text-ink hover:border-accent/50 hover:bg-accent/5")
                      }
                    >
                      {formatTimeFromStartsAt(slot)}
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 pt-1 mt-auto">
            <button
              type="button"
              onClick={onBack}
              className="btn-secondary cursor-pointer"
            >
              {t({ en: "← Back", nl: "← Terug" })}
            </button>
            <ModalButton
              onClick={onContinue}
              disabled={!selectedSlot}
              className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
            >
              {t({ en: "Continue", nl: "Doorgaan" })}
            </ModalButton>
          </div>
        </>
      )}
    </div>
  );
}

/* ────────────── CUSTOM CALENDAR ────────────── */

function Calendar({
  dateRange,
  availableDateSet,
  selectedDate,
  onSelectDate,
}: {
  dateRange: string[];
  availableDateSet: Set<string>;
  selectedDate: string | null;
  onSelectDate: (d: string) => void;
}) {
  const { t, locale } = useLanguage();
  const todayKey = toLocalDateKey(new Date());
  const minKey = dateRange[0] ?? todayKey;
  const maxKey = dateRange[dateRange.length - 1] ?? todayKey;

  const [view, setView] = useState(() => {
    const anchor = selectedDate ?? minKey;
    const dt = dateFromKey(anchor);
    return { year: dt.getFullYear(), month: dt.getMonth() };
  });

  // Sync the view only when `selectedDate` changes from the outside (e.g. the
  // auto-selected first available after slots load). Once synced, don't snap
  // back — otherwise manual month navigation would be reverted on every render.
  const [prevSelectedDate, setPrevSelectedDate] = useState<string | null>(
    selectedDate,
  );
  if (selectedDate !== prevSelectedDate) {
    setPrevSelectedDate(selectedDate);
    if (selectedDate) {
      const dt = dateFromKey(selectedDate);
      if (dt.getFullYear() !== view.year || dt.getMonth() !== view.month) {
        setView({ year: dt.getFullYear(), month: dt.getMonth() });
      }
    }
  }

  const cells = useMemo(() => {
    const first = new Date(view.year, view.month, 1);
    const startWeekday = first.getDay(); // 0=Sun
    const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();

    const arr: Array<{ key: string | null; day: number | null }> = [];
    for (let i = 0; i < startWeekday; i++) arr.push({ key: null, day: null });
    for (let d = 1; d <= daysInMonth; d++) {
      const key = toLocalDateKey(new Date(view.year, view.month, d));
      arr.push({ key, day: d });
    }
    while (arr.length % 7 !== 0) arr.push({ key: null, day: null });
    while (arr.length < 42) arr.push({ key: null, day: null });
    return arr;
  }, [view]);

  const monthLabel = new Date(view.year, view.month, 1).toLocaleDateString(
    locale === "nl" ? "nl-NL" : "en-US",
    { month: "long", year: "numeric" },
  );

  const minDt = dateFromKey(minKey);
  const maxDt = dateFromKey(maxKey);

  const canPrev =
    view.year > minDt.getFullYear() ||
    (view.year === minDt.getFullYear() && view.month > minDt.getMonth());

  const canNext =
    view.year < maxDt.getFullYear() ||
    (view.year === maxDt.getFullYear() && view.month < maxDt.getMonth());

  const prevMonth = () =>
    setView((v) => {
      const m = v.month === 0 ? 11 : v.month - 1;
      const y = v.month === 0 ? v.year - 1 : v.year;
      return { year: y, month: m };
    });

  const nextMonth = () =>
    setView((v) => {
      const m = v.month === 11 ? 0 : v.month + 1;
      const y = v.month === 11 ? v.year + 1 : v.year;
      return { year: y, month: m };
    });

  return (
    <div className="rounded-2xl border border-line bg-soft p-3 lg:p-4">
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={prevMonth}
          disabled={!canPrev}
          aria-label={t({ en: "Previous month", nl: "Vorige maand" })}
          className="inline-flex items-center justify-center size-[32px] rounded-lg border border-line bg-card text-ink hover:border-accent/50 hover:bg-accent/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="font-semibold text-[14.5px] text-ink">{monthLabel}</div>
        <button
          type="button"
          onClick={nextMonth}
          disabled={!canNext}
          aria-label={t({ en: "Next month", nl: "Volgende maand" })}
          className="inline-flex items-center justify-center size-[32px] rounded-lg border border-line bg-card text-ink hover:border-accent/50 hover:bg-accent/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {(locale === "nl"
          ? ["Z", "M", "D", "W", "D", "V", "Z"]
          : ["S", "M", "T", "W", "T", "F", "S"]
        ).map((d, i) => (
          <div
            key={i}
            className="text-center text-[10.5px] uppercase tracking-[1px] text-muted py-1"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, i) => {
          if (!cell.key || !cell.day) {
            return <div key={i} className="h-9" />;
          }
          const available = availableDateSet.has(cell.key);
          const inRange = cell.key >= minKey && cell.key <= maxKey;
          const active = selectedDate === cell.key;
          const isToday = cell.key === todayKey;
          const disabled = !available || !inRange;

          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => !disabled && onSelectDate(cell.key!)}
              className={
                "relative h-9 rounded-lg text-[13px] transition-all cursor-pointer " +
                (active
                  ? "bg-accent text-white font-semibold shadow-[0_8px_20px_-10px_rgba(79,126,242,0.5)]"
                  : available && inRange
                    ? "bg-card text-ink hover:bg-accent/10 hover:text-accent font-medium"
                    : "text-[#c7cbd6] cursor-not-allowed")
              }
            >
              <span>{cell.day}</span>
              {!active && available && inRange && (
                <span
                  aria-hidden
                  className="absolute left-1/2 -translate-x-1/2 bottom-[3px] size-[3px] rounded-full bg-accent"
                />
              )}
              {!active && isToday && (
                <span
                  aria-hidden
                  className="absolute inset-[2px] rounded-lg ring-1 ring-accent/50 pointer-events-none"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ────────────── STEP 3: DETAILS ────────────── */

function DetailsStep({
  service,
  slot,
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
  notes,
  setNotes,
  onBack,
  onSubmit,
  submitting,
  error,
}: {
  service: Service | null;
  slot: Slot | null;
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  notes: string;
  setNotes: (v: string) => void;
  onBack: () => void;
  onSubmit: () => void;
  submitting: boolean;
  error: string | null;
}) {
  const { t } = useLanguage();
  const [fieldErrors, setFieldErrors] = useState({ phone: "", email: "" });

  const validate = (name: string, value: string) => {
    let err = "";
    if (name === "phone" && value) {
      if (value === "+") return true;
      if (!/^\+?[0-9\s\-()]{7,20}$/.test(value)) {
        err = t({
          en: "Please enter a valid international phone number",
          nl: "Voer een geldig internationaal telefoonnummer in",
        });
      }
    }
    if (name === "email" && value) {
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
        err = t({
          en: "Please enter a valid email address",
          nl: "Voer een geldig e-mailadres in",
        });
      }
    }
    setFieldErrors((prev) => ({ ...prev, [name]: err }));
    return err === "";
  };

  const canSubmit =
    name.trim().length > 0 &&
    !!slot &&
    !submitting &&
    !fieldErrors.phone &&
    !fieldErrors.email;

  const dateLabel = slot
    ? (() => {
        const key =
          (slot.startsAtLocal && slot.startsAtLocal.split("T")[0]) ||
          slot.startsAt.split("T")[0];
        return formatDateShort(key);
      })()
    : "";
  const timeLabel = slot ? formatTimeFromStartsAt(slot) : "";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (canSubmit) onSubmit();
      }}
      className="flex flex-col gap-4 flex-1"
    >
      {service && slot && (
        <div className="flex items-center gap-2.5 rounded-xl bg-accent/10 border border-accent/20 px-3 py-2.5">
          <span className="bg-grad inline-flex items-center justify-center size-[32px] rounded-lg text-white shrink-0">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-[13px] text-ink truncate">
              {service.name}
            </div>
            <div className="text-[12px] text-muted truncate">
              {dateLabel} · {timeLabel} · {service.durationMinutes}{" "}
              {t({ en: "min", nl: "min" })}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Field label={t({ en: "Your name *", nl: "Jouw naam *" })}>
          <Input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        </Field>
        <Field label={t({ en: "Phone", nl: "Telefoon" })}>
          <div className="space-y-1">
            <Input
              type="tel"
              placeholder="+31 6 1234 5678"
              value={phone}
              error={!!fieldErrors.phone}
              onChange={(e) => {
                setPhone(e.target.value);
                validate("phone", e.target.value);
              }}
              autoComplete="tel"
            />
            {fieldErrors.phone && (
              <p className="text-red-500 text-[10px] font-medium ml-1">
                {fieldErrors.phone}
              </p>
            )}
          </div>
        </Field>
        <div className="lg:col-span-2">
          <Field label={t({ en: "Email", nl: "E-mail" })}>
            <div className="space-y-1">
              <Input
                type="email"
                value={email}
                error={!!fieldErrors.email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validate("email", e.target.value);
                }}
                autoComplete="email"
              />
              {fieldErrors.email && (
                <p className="text-red-500 text-[10px] font-medium ml-1">
                  {fieldErrors.email}
                </p>
              )}
            </div>
          </Field>
        </div>
        <div className="lg:col-span-2">
          <Field
            label={t({
              en: "Message (optional)",
              nl: "Bericht (optioneel)",
            })}
          >
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-line bg-soft focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-[14px] text-ink resize-none"
            />
          </Field>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between gap-3 pt-1 mt-auto">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="btn-secondary cursor-pointer disabled:opacity-50"
        >
          {t({ en: "← Back", nl: "← Terug" })}
        </button>
        <button
          type="submit"
          disabled={!canSubmit}
          className="btn-primary cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
        >
          {submitting ? (
            <span className="inline-flex items-center gap-2">
              <Spinner small />
              {t({ en: "Booking…", nl: "Boeken…" })}
            </span>
          ) : (
            <>{t({ en: "Confirm booking", nl: "Boeking bevestigen" })}</>
          )}
        </button>
      </div>
    </form>
  );
}

/* ────────────── SUCCESS ────────────── */

function SuccessStep({
  service,
  slot,
  name,
  onClose,
}: {
  service: Service | null;
  slot: Slot | null;
  name: string;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  const dateLabel = slot
    ? (() => {
        const key =
          (slot.startsAtLocal && slot.startsAtLocal.split("T")[0]) ||
          slot.startsAt.split("T")[0];
        return formatDateLong(key);
      })()
    : "";
  const timeLabel = slot ? formatTimeFromStartsAt(slot) : "";

  return (
    <div className="flex flex-col items-center justify-center text-center gap-4 py-2 flex-1">
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 18,
          delay: 0.05,
        }}
        className="bg-grad size-[68px] rounded-full flex items-center justify-center text-white shadow-[0_18px_40px_-12px_rgba(79,126,242,0.45)]"
      >
        <motion.svg
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.55, delay: 0.18, ease: "easeOut" }}
          width="34"
          height="34"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.path d="M5 13l4 4L19 7" />
        </motion.svg>
      </motion.div>

      <div className="flex flex-col gap-1.5">
        <h3 className="font-semibold text-[22px] leading-[1.2] text-ink">
          {t({ en: "Thanks", nl: "Bedankt" })}
          {name ? `, ${name.split(" ")[0]}` : ""}!
        </h3>
        <p className="text-[14px] leading-[1.5] text-muted max-w-[420px]">
          {t({
            en: "Your booking is in. We've sent a confirmation and our team will be in touch shortly.",
            nl: "Je boeking is binnen. We hebben een bevestiging gestuurd en ons team neemt zo snel mogelijk contact met je op.",
          })}
        </p>
      </div>

      {(service || slot) && (
        <div className="w-full max-w-[420px] mt-2 rounded-2xl border border-line bg-soft px-4 py-3 text-left">
          <div className="grid grid-cols-2 gap-2 text-[13px]">
            {service?.name && (
              <SummaryRow
                label={t({ en: "Service", nl: "Dienst" })}
                value={service.name}
              />
            )}
            {dateLabel && (
              <SummaryRow
                label={t({ en: "Date", nl: "Datum" })}
                value={dateLabel}
              />
            )}
            {timeLabel && (
              <SummaryRow
                label={t({ en: "Time", nl: "Tijd" })}
                value={timeLabel}
              />
            )}
            {service?.durationMinutes && (
              <SummaryRow
                label={t({ en: "Duration", nl: "Duur" })}
                value={`${service.durationMinutes} ${t({ en: "min", nl: "min" })}`}
              />
            )}
          </div>
        </div>
      )}

      <button onClick={onClose} className="btn-primary mt-3 cursor-pointer">
        {t({ en: "Done", nl: "Klaar" })}
      </button>
    </div>
  );
}

/* ────────────── PRIMITIVES ────────────── */

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-medium text-[12.5px] text-muted">{label}</span>
      {children}
    </label>
  );
}

function Input({
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input
      {...props}
      className={
        "w-full h-[46px] px-4 rounded-xl border focus:ring-2 outline-none transition-all text-[14px] text-ink bg-soft " +
        (error
          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
          : "border-line focus:border-accent focus:ring-accent/20") +
        (props.placeholder ? " placeholder:text-[#8890a0]" : "") +
        " " +
        (props.className ?? "")
      }
    />
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[11px] uppercase tracking-[1px] text-muted">
        {label}
      </span>
      <span className="font-medium text-[13.5px] text-ink mt-0.5">{value}</span>
    </div>
  );
}

function Spinner({ small = false }: { small?: boolean }) {
  const size = small ? 16 : 28;
  return (
    <span
      className="inline-block animate-spin rounded-full border-[2.5px] border-line border-t-accent"
      style={{ width: size, height: size }}
      aria-label="Loading"
    />
  );
}
