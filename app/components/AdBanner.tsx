'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default function AdBanner() {
  useEffect(() => {
    try {
      const pushAd = () => {
        try {
          const adsbygoogle = window.adsbygoogle || [];
          adsbygoogle.push({});
        } catch (e) {
          console.error('AdSense push hatası:', e);
        }
      };

      if (window.adsbygoogle) {
        pushAd();
      } else {
        // Script henüz yüklenmediyse biraz bekle
        setTimeout(pushAd, 1000);
      }
    } catch (err) {
      console.error('AdSense hata:', err);
    }
  }, []);

  return (
    <div className="my-4 min-h-[100px] bg-gray-800/50">
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minHeight: '100px' }}
        data-ad-client="ca-pub-9548855782686247"
        data-ad-slot="3194959167"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
} 