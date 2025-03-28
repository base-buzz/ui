import "@/styles/globals.css";
import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "next-themes";
import { Toaster as DefaultToaster } from "sonner";
import { fontMono, fontSans } from "@/lib/fonts";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { Providers } from "@/components/providers";
import { cn } from "@/lib/utils";
import { Toaster as NewYorkSonner } from "@/registry/new-york/ui/sonner";
import { Toaster as NewYorkToaster } from "@/registry/new-york/ui/toaster";
import LeftNavigation from "@/components/layout/LeftNavigation";
import RightSidebar from "@/components/layout/RightSidebar";
import LayoutWrapper from "@/components/layout/LayoutWrapper";

export const metadata: Metadata = {
  title: {
    default: "Basebuzz",
    template: `%s | Basebuzz`,
  },
  description: "Welcome to the revolution. Let's go!",
  applicationName: "Basebuzz",
  keywords: ["Base", "Basebuzz", "BasedGhoul", "BasedDAO", "Web3", "Crypto"],
  authors: [
    {
      name: "BasedGhoul",
      url: "https://twitter.com/BasedGhoul",
    },
  ],
  creator: "BasedGhoul",
  metadataBase: new URL("https://basebuzz.xyz"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://basebuzz.xyz",
    title: "Basebuzz",
    description: "Welcome to the revolution.",
    siteName: "Basebuzz",
  },
  twitter: {
    card: "summary_large_image",
    title: "Basebuzz",
    description: "Welcome to the revolution.",
    creator: "@BasedGhoul",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-svh bg-background font-sans antialiased",
          fontSans.variable,
          fontMono.variable,
        )}
      >
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
            enableColorScheme
          >
            <LayoutWrapper>{children}</LayoutWrapper>
            <TailwindIndicator />
            <ThemeSwitcher />
            <Analytics />
            <NewYorkToaster />
            <DefaultToaster />
            <NewYorkSonner />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
