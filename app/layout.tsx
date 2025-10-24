import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Health Records Management System",
  description: "Modern patient data management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <a href="#main-content" className="skip-to-main">
          Skip to main content
        </a>
        <div id="main-content">
          {children}
        </div>
      </body>
    </html>
  );
}