'use client';

import { useState } from 'react';
import Header from '@/app/components/Header';

export default function KaloriHesaplama() {
  const [cinsiyet, setCinsiyet] = useState<'erkek' | 'kadın'>('erkek');
  const [yas, setYas] = useState('');
  const [boy, setBoy] = useState('');
  const [kilo, setKilo] = useState('');
  const [aktiviteSeviyesi, setAktiviteSeviyesi] = useState('1.2');
  const [sonuc, setSonuc] = useState<number | null>(null);

  const hesaplaKalori = () => {
    if (!yas || !boy || !kilo) {
      alert('Lütfen tüm alanları doldurun');
      return;
    }

    // Harris-Benedict denklemi
    let bmr;
    if (cinsiyet === 'erkek') {
      bmr = 88.362 + (13.397 * parseFloat(kilo)) + (4.799 * parseFloat(boy)) - (5.677 * parseFloat(yas));
    } else {
      bmr = 447.593 + (9.247 * parseFloat(kilo)) + (3.098 * parseFloat(boy)) - (4.330 * parseFloat(yas));
    }

    // Aktivite seviyesine göre günlük kalori ihtiyacı
    const gunlukKalori = bmr * parseFloat(aktiviteSeviyesi);
    setSonuc(Math.round(gunlukKalori));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-gray-900 p-8 rounded-lg">
          <h1 className="text-3xl font-bold mb-6">Günlük Kalori İhtiyacı Hesaplama</h1>
          
          <div className="space-y-6">
            <div>
              <label className="block mb-2">Cinsiyet:</label>
              <div className="flex space-x-4">
                <button
                  onClick={() => setCinsiyet('erkek')}
                  className={`px-4 py-2 rounded ${
                    cinsiyet === 'erkek' ? 'bg-blue-600' : 'bg-gray-700'
                  }`}
                >
                  Erkek
                </button>
                <button
                  onClick={() => setCinsiyet('kadın')}
                  className={`px-4 py-2 rounded ${
                    cinsiyet === 'kadın' ? 'bg-blue-600' : 'bg-gray-700'
                  }`}
                >
                  Kadın
                </button>
              </div>
            </div>

            <div>
              <label className="block mb-2">Yaş:</label>
              <input
                type="number"
                value={yas}
                onChange={(e) => setYas(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                placeholder="Yaşınızı girin"
              />
            </div>

            <div>
              <label className="block mb-2">Boy (cm):</label>
              <input
                type="number"
                value={boy}
                onChange={(e) => setBoy(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                placeholder="Boyunuzu girin (cm)"
              />
            </div>

            <div>
              <label className="block mb-2">Kilo (kg):</label>
              <input
                type="number"
                value={kilo}
                onChange={(e) => setKilo(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                placeholder="Kilonuzu girin (kg)"
              />
            </div>

            <div>
              <label className="block mb-2">Aktivite Seviyesi:</label>
              <select
                value={aktiviteSeviyesi}
                onChange={(e) => setAktiviteSeviyesi(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 border border-gray-700"
              >
                <option value="1.2">Hareketsiz (Masa başı iş)</option>
                <option value="1.375">Hafif Aktif (Haftada 1-3 gün egzersiz)</option>
                <option value="1.55">Orta Aktif (Haftada 3-5 gün egzersiz)</option>
                <option value="1.725">Çok Aktif (Haftada 6-7 gün egzersiz)</option>
                <option value="1.9">Ekstra Aktif (Ağır egzersiz/fiziksel iş)</option>
              </select>
            </div>

            <button
              onClick={hesaplaKalori}
              className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Hesapla
            </button>

            {sonuc && (
              <div className="mt-6 p-4 bg-gray-800 rounded">
                <h2 className="text-xl font-semibold mb-2">Sonuç:</h2>
                <p>Günlük kalori ihtiyacınız: <span className="text-2xl font-bold text-blue-400">{sonuc}</span> kalori</p>
                <p className="mt-2 text-sm text-gray-400">
                  Not: Bu hesaplama tahmini bir değerdir. Kişisel sağlık durumunuza göre bir uzmana danışmanız önerilir.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 