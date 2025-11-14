import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Timeblocking - Find the Best Meeting Time",
  description: "A collaborative date polling app to help groups find the best meeting time",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
