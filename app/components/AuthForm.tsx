'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const ADMIN_USER = {
  username: "seyithan1907",
  password: "hsy190778"
};

export default function AuthForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
      setCurrentUser(user);
      setIsAdmin(user === ADMIN_USER.username);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Önce admin girişini kontrol et
    if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
      localStorage.setItem('user', username);
      setIsLoggedIn(true);
      setCurrentUser(username);
      setIsAdmin(true);
      setUsername('');
      setPassword('');
      return;
    }

    // Admin değilse normal kullanıcı girişini kontrol et
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.username === username && u.password === password);

    if (user) {
      localStorage.setItem('user', username);
      setIsLoggedIn(true);
      setCurrentUser(username);
      setIsAdmin(false);
      setUsername('');
      setPassword('');
    } else {
      alert('Kullanıcı adı veya şifre hatalı!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setCurrentUser(null);
    setIsAdmin(false);
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg">
      {isLoggedIn ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Üye Paneli</h2>
          <p className="text-gray-400">Hoş geldin, {currentUser}</p>
          <div className="space-y-2">
            {isAdmin && (
              <>
                <Link 
                  href="/blog/yeni" 
                  className="block w-full text-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Yeni Yazı Ekle
                </Link>
                <Link 
                  href="/uyeler" 
                  className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Üye Listesi
                </Link>
                <Link 
                  href="/bildirimler" 
                  className="block w-full text-center px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Bildirimleri Yönet
                </Link>
                <Link 
                  href="/mesajlar" 
                  className="block w-full text-center px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                >
                  Mesajları Yönet
                </Link>
              </>
            )}
            <Link 
              href="/profil" 
              className="block w-full text-center px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
            >
              Profil Düzenle
            </Link>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Üye Paneli</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Kullanıcı Adı
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Şifre
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
                required
              />
            </div>
            <div className="flex flex-col space-y-2">
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Giriş Yap
              </button>
              <Link
                href="/kayit"
                className="block w-full text-center px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
              >
                Kayıt Ol
              </Link>
            </div>
          </form>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-800">
        <h3 className="text-lg font-semibold text-white mb-4">Hızlı Araçlar</h3>
        <div className="space-y-3">
          <Link
            href="/bki-hesaplama"
            className="block w-full text-center bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors"
          >
            BKİ Hesaplama
          </Link>
          <Link
            href="/ideal-kilo"
            className="block w-full text-center bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors"
          >
            İdeal Kilo Hesaplama
          </Link>
          <Link
            href="/kalori-hesaplama"
            className="block w-full text-center bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors"
          >
            Kalori Hesaplama
          </Link>
          <Link
            href="/danismanlik"
            className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            Online Danışmanlık
          </Link>
          <Link
            href="/iletisim"
            className="block w-full text-center bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
          >
            İletişim Formu
          </Link>
        </div>
      </div>
    </div>
  );
} 