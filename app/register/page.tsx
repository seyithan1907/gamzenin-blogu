'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  username: string;
  email: string;
  password: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Şifre kontrolü
    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor!');
      return;
    }

    // Email formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Geçerli bir email adresi giriniz!');
      return;
    }

    // Kullanıcı adı kontrolü
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some((u: User) => u.username === formData.username)) {
      setError('Bu kullanıcı adı zaten kullanılıyor!');
      return;
    }

    // Yeni kullanıcıyı kaydet
    const newUser = {
      username: formData.username,
      email: formData.email,
      password: formData.password
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Ana sayfaya yönlendir
    router.push('/?registered=true');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-900 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-white mb-6">Üye Ol</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
              Kullanıcı Adı
            </label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
              required
              minLength={3}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              E-posta Adresi
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Şifre
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
              required
              minLength={6}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
              Şifre Tekrar
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
              required
              minLength={6}
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Üye Ol
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link href="/" className="text-blue-400 hover:text-blue-300 text-sm">
            Zaten üye misin? Giriş yap
          </Link>
        </div>
      </div>
    </div>
  );
} 