"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import BookingForm from "./BookingForm";
import EnquiryModal from "./EnquiryModal";
import CookieConsent from "./CookieConsent";

type FormModalContextValue = {
  openBooking: () => void;
  openEnquiry: () => void;
};

const FormModalContext = createContext<FormModalContextValue | null>(null);

export function useFormModals() {
  return useContext(FormModalContext);
}

export default function FormModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  const openBooking = useCallback(() => {
    setIsBookingOpen(true);
  }, []);

  const openEnquiry = useCallback(() => {
    setIsEnquiryOpen(true);
  }, []);

  useEffect(() => {
    const openFromHash = (hash: string) => {
      if (hash === "#booking") {
        openBooking();
        return true;
      }
      if (hash === "#enquiry") {
        openEnquiry();
        return true;
      }
      return false;
    };

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest("a[href]");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }

      if (
        url.origin !== window.location.origin ||
        url.pathname !== window.location.pathname
      ) {
        return;
      }

      if (openFromHash(url.hash)) {
        event.preventDefault();
        window.history.replaceState(
          null,
          "",
          `${window.location.pathname}${window.location.search}`,
        );
      }
    };

    document.addEventListener("click", onClick, true);
    openFromHash(window.location.hash);

    return () => document.removeEventListener("click", onClick, true);
  }, [openBooking, openEnquiry]);

  const value = useMemo(
    () => ({ openBooking, openEnquiry }),
    [openBooking, openEnquiry],
  );

  return (
    <FormModalContext.Provider value={value}>
      {children}
      <BookingForm
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
      />
      <CookieConsent />
    </FormModalContext.Provider>
  );
}
