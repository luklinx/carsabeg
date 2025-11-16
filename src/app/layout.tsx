// src/app/layout.tsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata = {
  title: "Cars Abeg - Clean Used Cars in Nigeria",
  description:
    "Foreign used and Nigerian used cars at the best prices. No Wahala.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
