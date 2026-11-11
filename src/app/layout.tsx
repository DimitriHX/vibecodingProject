import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FocusFlow",
  description: "Hub de productividad, hábitos y recursos tech para desarrolladores.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
