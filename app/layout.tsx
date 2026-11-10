import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Beyond Japan 2027 — The Northern Route",
  description: "Un viaje hacia el norte de Japón · 24 abril – 15 mayo 2027"
};
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="es"><body>{children}</body></html>;
}
