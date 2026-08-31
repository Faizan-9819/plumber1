import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import { SmoothScrollProvider } from "@/app/components/LenisProvider";
import { LanguageProvider } from "@/app/i18n/LanguageProvider";
import FormModalProvider from "@/app/global/FormModalProvider";
import "./globals.css";

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AquaFlow Plumbing & Heating | Amsterdam",
  description:
    "Certified local plumbers for repairs, installations and emergencies. Same-day appointments across Amsterdam with clear, fixed pricing.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${hankenGrotesk.variable} antialiased`}>
      <body className="bg-bg text-ink font-sans">
        <SmoothScrollProvider>
          <LanguageProvider initialLocale="en">
            <FormModalProvider>{children}</FormModalProvider>
          </LanguageProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
