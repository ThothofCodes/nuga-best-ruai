import "leaflet/dist/leaflet.css";
import "./globals.css";
import { business } from "@/lib/config";

export const metadata = {
  title: `${business.name} — Thermal Jade Therapy in Ruai`,
  description:
    "Far-infrared heat and heated jade stone therapy at Gatwick Mall, Ruai — on-site or at home, equipment included.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
