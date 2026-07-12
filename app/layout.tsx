import type { Metadata } from "next";
import { Cinzel, Great_Vibes, Prompt, Work_Sans } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "500", "600", "700"],
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  variable: "--font-great-vibes",
  weight: "400",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  weight: ["300", "400", "500", "600", "700"],
});

const prompt = Prompt({
  subsets: ["latin", "thai"],
  variable: "--font-prompt",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jah-smart-wedding.example.com"),
  title: "Jajah & Smart Wedding",
  description:
    "Join Jajah & Smart for their wedding celebration on Sunday, 1 November 2026 at Pearl Wedding Venue.",
  openGraph: {
    title: "Jajah & Smart Wedding",
    description:
      "Wedding details, schedule, location, dress code, RSVP, and contact information for Jajah & Smart.",
    type: "website",
    images: ["/images/wedding-hero.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cinzel.variable} ${greatVibes.variable} ${workSans.variable} ${prompt.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
