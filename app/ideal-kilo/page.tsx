'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function IdealWeightPage() {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [height, setHeight] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const calculateIdealWeight = (e: React.FormEvent) => {
    e.preventDefault();
    
    const heightInCm = parseFloat(height);
    
    if (isNaN(heightInCm) || heightInCm <= 0) {
      alert('Lütfen geçerli bir boy değeri girin.');
      return;
    }

    let idealWeight: number;
    
    if (gender === 'male') {
      // Erkekler için Devine formülü
      idealWeight = 50 + 2.3 * ((heightInCm / 2.54) - 60);
    } else {
      // Kadınlar için Devine formülü
      idealWeight = 45.5 + 2.3 * ((heightInCm / 2.54) - 60);
    }

    // İdeal kilo aralığı (±10%)
    const minWeight = (idealWeight * 0.9).toFixed(1);
    const maxWeight = (idealWeight * 1.1).toFixed(1);
    
    setResult(`İdeal kilonuz ${minWeight} kg ile ${maxWeight} kg arasındadır.`);
  };

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-gray-900 rounded-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">İdeal Kilo Hesaplama</h1>
            <Link
              href="/"
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Ana Sayfaya Dön
            </Link>
          </div>

          <p className="text-gray-400 mb-8">
            Boyunuza ve cinsiyetinize göre ideal kilo aralığınızı hesaplayın.
            Bu hesaplama Devine formülü kullanılarak yapılmaktadır.
          </p>

          <form onSubmit={calculateIdealWeight} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Cinsiyet
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`px-4 py-2 rounded ${
                    gender === 'male'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  Erkek
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`px-4 py-2 rounded ${
                    gender === 'female'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  Kadın
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Boy (cm)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="Örn: 170"
                className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Hesapla
            </button>
          </form>

          {result && (
            <div className="mt-8 p-4 bg-gray-800 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Sonuç</h2>
              <p className="text-gray-300">{result}</p>
            </div>
          )}

          <div className="mt-8 text-sm text-gray-400">
            <p>Not: Bu hesaplama genel bir referans sağlar ve kişisel sağlık durumunuza göre değişiklik gösterebilir. Daha detaylı bilgi için bir sağlık uzmanına danışmanızı öneririz.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 