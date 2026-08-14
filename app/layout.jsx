import "./globals.css";
import { Noto_Sans_SC, Noto_Serif_SC } from "next/font/google";

const uiFont = Noto_Sans_SC({
  variable: "--font-ui",
  weight: "variable",
  display: "swap",
  preload: false
});

const editorialFont = Noto_Serif_SC({
  variable: "--font-editorial",
  weight: "variable",
  display: "swap",
  preload: false
});

export const metadata = {
  title: "Before You Go",
  description: "在这里，背起精神行囊"
};

export default function RootLayout({ children }) {
  return <html lang="zh-CN"><body className={`${uiFont.variable} ${editorialFont.variable}`}>{children}</body></html>;
}
