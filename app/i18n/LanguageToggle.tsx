"use client";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";

const NL_PREFIX = "/nl";

// Map of EN paths that have different NL slugs
const EN_TO_NL: Record<string, string> = {
  "/website-for-electricians": "/website-voor-elektriciens",
  "/partner-network": "/partnernetwerk",
};
const NL_TO_EN: Record<string, string> = {
  "/website-voor-elektriciens": "/website-for-electricians",
  "/partnernetwerk": "/partner-network",
};

function toNlPath(enPath: string): string {
  const mapped = EN_TO_NL[enPath];
  if (mapped) return NL_PREFIX + mapped;
  return NL_PREFIX + (enPath === "/" ? "" : enPath);
}

function toEnPath(nlPath: string): string {
  const withoutPrefix = nlPath.slice(NL_PREFIX.length) || "/";
  const mapped = NL_TO_EN[withoutPrefix];
  return mapped ?? withoutPrefix;
}

const BTN = (active: boolean) =>
  clsx(
    "px-[10px] py-[5px] rounded-[6px] font-sans font-semibold text-[12px] leading-none transition-colors",
    active
      ? "bg-[var(--color-violet-42)] text-white cursor-default"
      : "text-[var(--color-haiti)] hover:text-[var(--color-violet-42)] cursor-pointer"
  );

export default function LanguageToggle({ className }: { className?: string }) {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const isNl = pathname === NL_PREFIX || pathname.startsWith(NL_PREFIX + "/");

  function go(toNl: boolean) {
    if (toNl === isNl) return;
    const target = toNl ? toNlPath(pathname) : toEnPath(pathname);
    router.push(target);
  }

  return (
    <div
      role="group"
      aria-label="Language"
      className={clsx(
        "inline-flex items-center rounded-[8px] border border-black/10 bg-white p-[2px]",
        className
      )}
    >
      <button
        type="button"
        onClick={() => go(false)}
        aria-pressed={!isNl}
        aria-label="English"
        className={BTN(!isNl)}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => go(true)}
        aria-pressed={isNl}
        aria-label="Nederlands"
        className={BTN(isNl)}
      >
        NL
      </button>
    </div>
  );
}
