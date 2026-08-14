import "./globals.css";

export const metadata = {
  title: "Before You Go",
  description: "在这里，背起精神行囊"
};

export default function RootLayout({ children }) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
