import "@/styles/globals.css";
import { Metadata, Viewport } from "next";

import { META_THEME_COLORS, siteConfig } from "@/config/site";
import { fontMono, fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { Analytics } from "@/components/analytics";
import { Providers } from "@/lib/wagmi"; // our custom wrapper
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { config } from "@/lib/wagmi";
import { ThemeProvider } from "@/components/providers";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Toaster as DefaultToaster } from "@/registry/default/ui/toaster";
import { Toaster as NewYorkSonner } from "@/registry/new-york/ui/sonner";
import { Toaster as NewYorkToaster } from "@/registry/new-york/ui/toaster";

export const metadata: Metadata = {
  title: "BaseBuzz",
  description:
    "BaseBuzz is the ultimate hub for AI-driven DeFi, meme speculation, and real-world asset tokenization. Trade, engage, and build—powered by $BUZZ.",
  metadataBase: new URL(siteConfig.url),
  keywords: [
    "Next.js",
    "React",
    "Tailwind CSS",
    "Server Components",
    "Radix UI",
  ],
  authors: [
    {
      name: "shadcn",
      url: "https://shadcn.com",
    },
  ],
  creator: "shadcn",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: `/og?title=${encodeURIComponent("BaseBuzz | Trade crypto and NFT's safely on the top Base platform")}&description=${encodeURIComponent("BaseBuzz is the ultimate hub for AI-driven DeFi, meme speculation, and real-world asset tokenization. Trade, engage, and build—powered by $BUZZ.")}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: `/og?title=${encodeURIComponent("BaseBuzz | Trade crypto and NFT's safely on the top Base platform")}&description=${encodeURIComponent("BaseBuzz is the ultimate hub for AI-driven DeFi, meme speculation, and real-world asset tokenization. Trade, engage, and build—powered by $BUZZ.")}`,
      },
    ],
    creator: "@shadcn",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
};

export const viewport: Viewport = {
  themeColor: META_THEME_COLORS.light,
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
              try {
                localStorage.setItem('theme', 'light');
                document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.light}')
              } catch (_) {}
            `,
            }}
          />
        </head>
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
              forcedTheme="light"
              enableSystem={false}
              disableTransitionOnChange
              enableColorScheme
            >
              <div vaul-drawer-wrapper="">
                <div className="relative flex min-h-svh flex-col bg-background">
                  {children}
                </div>
              </div>
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
    </>
  );
}
