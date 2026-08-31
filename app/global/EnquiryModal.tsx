"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { useLanguage } from "../i18n/LanguageProvider";
import { useLenisControl } from "../components/LenisProvider";
import LeadEnquiryForm from "./LeadEnquiryForm";

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EnquiryModal({ isOpen, onClose }: EnquiryModalProps) {
  const { t } = useLanguage();
  const { stop, start } = useLenisControl();

  useEffect(() => {
    if (isOpen) {
      stop();
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
        start();
      };
    }
  }, [isOpen, stop, start]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

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
              className="relative w-full max-w-[560px] bg-card rounded-3xl shadow-2xl pointer-events-auto overflow-hidden flex flex-col max-h-[calc(100vh-24px)]"
              role="dialog"
              aria-modal="true"
              aria-label={t({
                en: "Request a visit or quote",
                nl: "Vraag een bezoek of offerte aan",
              })}
              data-lenis-prevent
            >
              <div className="bg-grad relative shrink-0 px-6 lg:px-8 pt-6 pb-6 text-white overflow-hidden">
                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[2px] text-white/75">
                      {t({ en: "Get in touch", nl: "Neem contact op" })}
                    </p>
                    <h2 className="mt-1 text-[clamp(20px,3.8vw,24px)] leading-[1.15] font-extrabold">
                      {t({
                        en: "Request a visit or quote",
                        nl: "Vraag een bezoek of offerte aan",
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
              </div>

              <div
                className="relative px-6 lg:px-8 py-6 flex-1 min-h-0 overflow-y-auto touch-pan-y"
                data-lenis-prevent
              >
                <LeadEnquiryForm idPrefix="enquiry-modal" />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
