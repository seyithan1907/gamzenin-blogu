import './globals.css';
import { Inter } from 'next/font/google';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Gamzenin Bloğu',
  description: 'Beslenme ve diyetetik adına her şey',
  verification: {
    google: 'ca-pub-9548855782686247',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        <meta name="google-adsense-account" content="ca-pub-9548855782686247" />
      </head>
      <body className={inter.className}>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9548855782686247"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
        {children}
      </body>
    </html>
  );
}
