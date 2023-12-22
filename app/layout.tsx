import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title></title>
        <link rel="shortcut icon" href="/logo-1.ico" />
        <meta
          name="description"
          content="Transforming Rejections into Constructive Feedback"
        />
        <meta property="og:title" content="HonestHire - Transforming Rejections into Constructive Feedback" />
        <meta
          property="og:description"
          content="HonestHire - Transforming Rejections into Constructive Feedback"
        />
        {/* <meta property="og:image" content="/images/og-image.png" /> */}
        {/* <meta name="twitter:card" content="summary_large_image" /> */}
        <meta name="twitter:title" content="HonestHire - Transforming Rejections into Constructive Feedback" />
        <meta
          name="twitter:description"
          content="HonestHire - Transforming Rejections into Constructive Feedback"
        />
        {/* <meta name="twitter:image" content="/images/og-image.png" /> */}
      </head>
      <body className={inter.className}>
        <div className="flex flex-col h-full p-4 md:p-12">
          {children}
        </div>
      </body>
    </html>
  );
}
