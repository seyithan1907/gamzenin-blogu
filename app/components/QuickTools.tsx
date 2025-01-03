'use client';

import { useRouter } from 'next/navigation';

export default function QuickTools() {
  const router = useRouter();
  const user = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const isAdmin = user && ['seyithan1907', 'gamzeaktas'].includes(user);

  return (
    <div className="space-y-3">
      {isAdmin && (
        <button
          onClick={() => router.push('/blog/yeni')}
          className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Yeni Yazı Ekle
        </button>
      )}
      <button
        onClick={() => router.push('/')}
        className="w-full bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
      >
        Ana Sayfa
      </button>
      <button
        onClick={() => router.push('/kategoriler')}
        className="w-full bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
      >
        Kategoriler
      </button>
      <button
        onClick={() => router.push('/hakkimda')}
        className="w-full bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
      >
        Hakkımda
      </button>
      <button
        onClick={() => router.push('/iletisim')}
        className="w-full bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
      >
        İletişim
      </button>
    </div>
  );
} 