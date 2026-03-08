import type { Metadata } from "next";
import { chakra, inter } from "@/lib/fonts";

// import SideBar from "@/components/layout/SideBar";
import { Providers } from "@/lib/contexts/providers";
// import Navigation from "@/components/layout/Navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "tkdr 2026",
  description: "next app from the ground up",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${chakra.className} ${inter.variable} antialiased`}>
        <Providers>
          {/* <SideBar>{children}</SideBar> */}
          {/* <Navigation />
          <main className="main-content bg-layout-background">{children}</main> */}
          {children}
        </Providers>
      </body>
    </html>
  );
}
