import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Hanken_Grotesk } from "next/font/google";
import { SmoothScrollProvider } from "@/app/components/LenisProvider";
import { LanguageProvider } from "@/app/i18n/LanguageProvider";
import FormModalProvider from "@/app/global/FormModalProvider";
import { isLocale } from "@/app/i18n/config";
import "@/app/globals.css";

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AquaFlow Plumbing & Heating | Amsterdam",
  description:
    "Certified local plumbers for repairs, installations and emergencies. Same-day appointments across Amsterdam with clear, fixed pricing.",
};

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "nl" }];
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale} className={`${hankenGrotesk.variable} antialiased`}>
      <body className="bg-bg text-ink font-sans">
        <SmoothScrollProvider>
          <LanguageProvider initialLocale={locale}>
            <FormModalProvider>{children}</FormModalProvider>
          </LanguageProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
