import type { Metadata, Viewport } from "next";
import { Sora, Instrument_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jash Garach | Android & Flutter Developer",
  description:
    "Jash Garach is an Android and Flutter developer with 4+ years building high-performance mobile experiences for consumer and hospitality products.",
  keywords: [
    "Android Developer",
    "Flutter Developer",
    "Kotlin",
    "Jetpack Compose",
    "Mobile Development",
    "Hospitality Tech",
    "Jash Garach",
  ],
  authors: [{ name: "Jash Garach" }],
  creator: "Jash Garach",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Jash Garach | Android & Flutter Developer",
    description:
      "Building mobile products that stay fast, clear, and dependable in the real world.",
    siteName: "Jash Garach Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jash Garach | Android & Flutter Developer",
    description:
      "Building mobile products that stay fast, clear, and dependable in the real world.",
  },
  icons: {
    icon: [
      { url: "/assets/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/assets/favicon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/assets/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#050505" },
    { media: "(prefers-color-scheme: light)", color: "#f4f4f5" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sora.variable} ${instrumentSans.variable}`}
    >
      <body>
        {/* Skip to content for accessibility */}
        <a className="skip-link" href="#main">
          Skip to content
        </a>

        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          {/* Film grain overlay */}
          <div className="noise-overlay" aria-hidden="true" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
