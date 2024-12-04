import { NavbarWrapper } from "@/components/navbar-wrapper";
import { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Antiikki Avustaja | AI Chatbot",
  description:
    "Chatbot auttaa sinua löytämään tietoa ja vastauksia kysymyksiisi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fi">
      <body className="min-h-screen">
        <Toaster position="top-center" />
        <NavbarWrapper />
        {children}
      </body>
    </html>
  );
}
