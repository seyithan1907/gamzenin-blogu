'use client';

import { useState, useEffect } from 'react';

export default function DateTime() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    // İlk render'da tarihi ayarla
    setCurrentTime(new Date());

    // Her saniye güncelle
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    const day = days[date.getDay()];
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${day} ${hours}:${minutes}:${seconds}`;
  };

  // İlk render'da null göster
  if (!currentTime) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 bg-gray-900 p-3 rounded-lg shadow-lg z-50">
      <div className="text-gray-300 text-sm font-medium">
        {formatDate(currentTime)}
      </div>
    </div>
  );
} 