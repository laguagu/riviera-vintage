import { Navbar } from "@/components/navbar";
import { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Riviera Vintage Group Oy | AI Chatbot",
  description:
    "Tekoälyyn perustuva chatbot, joka auttaa sinua löytämään tietoa ja vastauksia kysymyksiisi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-center" />
        {/* @ts-ignore */}
        <Navbar />
        {children}
      </body>
    </html>
  );
}
