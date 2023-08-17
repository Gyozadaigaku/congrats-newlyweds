import "./globals.css";
import { Inter, Parisienne } from "next/font/google";

const parisienne = Parisienne({ weight: ["400"], subsets: ["latin"] });

export const metadata = {
  title: "れなぴょん結婚おめでとう🎉",
  description: "Massive congrats to the newlyweds! yay!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={parisienne.className}>{children}</body>
    </html>
  );
}
