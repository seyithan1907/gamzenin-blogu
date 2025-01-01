'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface GoogleAdsProps {
  style?: React.CSSProperties;
  format?: 'horizontal' | 'vertical' | 'rectangle';
}

export default function GoogleAds({ style = {}, format = 'rectangle' }: GoogleAdsProps) {
  // Test reklamları için slot ID'leri
  const TEST_SLOTS = {
    horizontal: '6057949479',  // 728x90
    vertical: '2493173059',    // 160x600
    rectangle: '4336908195'    // 300x250
  };

  useEffect(() => {
    try {
      const pushAd = () => {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      };

      // Eğer script yüklendiyse reklamı push et
      if (window.adsbygoogle) {
        pushAd();
      } else {
        // Script yüklenene kadar bekle
        const interval = setInterval(() => {
          if (window.adsbygoogle) {
            pushAd();
            clearInterval(interval);
          }
        }, 500);

        // 10 saniye sonra interval'i temizle
        setTimeout(() => clearInterval(interval), 10000);
      }
    } catch (err) {
      console.error('Google AdSense hatası:', err);
    }
  }, []);

  return (
    <div style={{ textAlign: 'center', overflow: 'hidden', ...style }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', height: '100%' }}
        data-ad-client="ca-pub-9548855782686247"
        data-ad-slot={TEST_SLOTS[format]}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
} 