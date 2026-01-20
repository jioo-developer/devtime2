import localFont from "next/font/local";
import TanstackProvider from "@/provider/TanstackProvider";
import "../asset/reset.css";
import "../asset/common.css";

const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable}`}>
      <body>
        <TanstackProvider>
          <div className="wrap">{children}</div>
        </TanstackProvider>
      </body>
    </html>
  );
}
