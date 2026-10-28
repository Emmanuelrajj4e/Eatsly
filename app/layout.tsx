import type { Metadata, Viewport } from "next";
import { APP_MISSION, APP_NAME, APP_TAGLINE } from "@/config/brand";
import { Providers } from "@/components/providers";
import { AnnouncementBar } from "@/components/announcement-bar";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} — ${APP_TAGLINE}`,
    template: `%s · Eatsly`,
  },
  description: APP_MISSION,
};

/** Light theme only — there is no dark mode in this palette. */
export const viewport: Viewport = {
  themeColor: "#f6f8f7",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        <Providers>
          {/* Skip link: first tabbable element on every page */}
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-md focus:bg-surface focus:px-3 focus:py-2 focus:font-medium focus:text-ink focus:shadow-[0_0_0_5px_white]"
          >
            Skip to content
          </a>
          <AnnouncementBar />
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
