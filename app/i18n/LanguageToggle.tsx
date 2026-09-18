"use client";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "./LanguageProvider";
import { localizedHref } from "./locale-href";
import type { Locale } from "./config";

const BTN = (active: boolean) =>
  clsx(
    "px-[10px] py-[5px] rounded-[6px] font-sans font-semibold text-[12px] leading-none transition-colors",
    active
      ? "bg-grad-cta text-white cursor-default"
      : "text-ink hover:text-accent cursor-pointer"
  );

export default function LanguageToggle({ className }: { className?: string }) {
  const { locale, t } = useLanguage();
  const pathname = usePathname() || "/";
  const router = useRouter();
  const isNl = locale === "nl";

  function go(target: Locale) {
    if (target === locale) return;
    router.push(localizedHref(pathname, target));
  }

  return (
    <div
      role="group"
      aria-label={t({ en: "Language", nl: "Taal" })}
      className={clsx(
        "items-center rounded-[8px] border border-black/10 bg-white p-[2px]",
        className
      )}
    >
      <button
        type="button"
        onClick={() => go("en")}
        aria-pressed={!isNl}
        aria-label="English"
        className={BTN(!isNl)}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => go("nl")}
        aria-pressed={isNl}
        aria-label="Nederlands"
        className={BTN(isNl)}
      >
        NL
      </button>
    </div>
  );
}
