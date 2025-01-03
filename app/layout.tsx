import './globals.css';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import ScrollToTop from './components/ScrollToTop';

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
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#000000" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        <Script
          id="register-sw"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('Service Worker registration successful');
                    },
                    function(err) {
                      console.log('Service Worker registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9548855782686247"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}
