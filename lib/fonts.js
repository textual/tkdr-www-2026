import { Chakra_Petch } from "next/font/google";
import { Public_Sans } from "next/font/google";
import { Inter } from "next/font/google"; // original

export const chakra = Chakra_Petch({
  weight: ["300", "400", "600", "700"],
  variable: "--font-chakra",
  subsets: ["latin"],
  display: "swap",
});

export const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
