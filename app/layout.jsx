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
  metadataBase: new URL("https://maygirl92.github.io/Before-you-go/"),
  title: "Before You Go",
  description: "在这里，背起精神行囊",
  openGraph: {
    title: "Before You Go",
    description: "在这里，背起精神行囊",
    type: "website",
    locale: "zh_CN",
    url: "https://maygirl92.github.io/Before-you-go/",
    images: [
      {
        url: "https://maygirl92.github.io/Before-you-go/og.png",
        width: 1730,
        height: 909,
        alt: "Before You Go · 在这里，背起精神行囊"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Before You Go",
    description: "在这里，背起精神行囊",
    images: ["https://maygirl92.github.io/Before-you-go/og.png"]
  }
};

export default function RootLayout({ children }) {
  return <html lang="zh-CN"><body className={`${uiFont.variable} ${editorialFont.variable}`}>{children}</body></html>;
}
