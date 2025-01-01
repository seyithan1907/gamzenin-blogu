'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function BKICalculator() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [result, setResult] = useState<{bmi: number; category: string} | null>(null);
  const [error, setError] = useState('');

  const calculateBMI = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);

    // Değerleri sayıya çevir
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    // Geçerlilik kontrolü
    if (isNaN(weightNum) || isNaN(heightNum)) {
      setError('Lütfen geçerli değerler girin');
      return;
    }

    if (weightNum <= 0 || heightNum <= 0) {
      setError('Değerler 0\'dan büyük olmalıdır');
      return;
    }

    if (weightNum > 300) {
      setError('Kilo 300 kg\'dan fazla olamaz');
      return;
    }

    if (heightNum > 250) {
      setError('Boy 250 cm\'den fazla olamaz');
      return;
    }

    // BKİ hesaplama
    const heightInMeters = heightNum / 100;
    const bmi = weightNum / (heightInMeters * heightInMeters);

    // BKİ kategorisi belirleme
    let category = '';
    if (bmi < 18.5) {
      category = 'Zayıf';
    } else if (bmi < 25) {
      category = 'Normal';
    } else if (bmi < 30) {
      category = 'Fazla Kilolu';
    } else if (bmi < 35) {
      category = 'Obez (1. Derece)';
    } else if (bmi < 40) {
      category = 'Obez (2. Derece)';
    } else {
      category = 'Aşırı Obez (3. Derece)';
    }

    setResult({ bmi, category });
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-900 rounded-lg shadow-lg p-6 mb-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">BKİ Hesaplama</h1>
            <Link href="/" className="text-blue-400 hover:text-blue-300 text-sm">
              Ana Sayfa
            </Link>
          </div>

          <form onSubmit={calculateBMI} className="space-y-4">
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-300 mb-1">
                Kilo (kg)
              </label>
              <input
                type="number"
                id="weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
                placeholder="Örn: 70"
                step="0.1"
                required
              />
            </div>

            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-300 mb-1">
                Boy (cm)
              </label>
              <input
                type="number"
                id="height"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
                placeholder="Örn: 170"
                step="0.1"
                required
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Hesapla
            </button>
          </form>
        </div>

        {result && (
          <div className="bg-gray-900 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Sonuç</h2>
            <div className="space-y-2">
              <p className="text-gray-300">
                BKİ Değeriniz: <span className="font-semibold">{result.bmi.toFixed(1)}</span>
              </p>
              <p className="text-gray-300">
                Kategori: <span className="font-semibold">{result.category}</span>
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-2">BKİ Kategorileri</h3>
              <ul className="space-y-1 text-sm text-gray-300">
                <li>{'<18.5'}: Zayıf</li>
                <li>18.5 - 24.9: Normal</li>
                <li>25 - 29.9: Fazla Kilolu</li>
                <li>30 - 34.9: Obez (1. Derece)</li>
                <li>35 - 39.9: Obez (2. Derece)</li>
                <li>{'>40'}: Aşırı Obez (3. Derece)</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 