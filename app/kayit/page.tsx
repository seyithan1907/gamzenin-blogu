'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/app/components/Header';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validasyon kontrolleri
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.');
      return;
    }

    // E-posta formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Geçerli bir e-posta adresi girin.');
      return;
    }

    // Mevcut kullanıcıları kontrol et
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some((user: any) => user.username === formData.username)) {
      setError('Bu kullanıcı adı zaten kullanılıyor.');
      return;
    }

    if (users.some((user: any) => user.email === formData.email)) {
      setError('Bu e-posta adresi zaten kullanılıyor.');
      return;
    }

    // Yeni kullanıcıyı kaydet
    const newUser = {
      ...formData,
      id: Date.now().toString(),
      registrationDate: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    setSuccess('Kayıt başarılı! Yönlendiriliyorsunuz...');

    // 2 saniye sonra ana sayfaya yönlendir
    setTimeout(() => {
      router.push('/');
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="max-w-md mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Kayıt Ol</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Kullanıcı Adı */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Kullanıcı Adı <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* E-posta */}
          <div>
            <label className="block text-sm font-medium mb-2">
              E-posta <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Şifre */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Şifre <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Şifre Tekrar */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Şifre Tekrar <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          {success && (
            <p className="text-green-500 text-sm">{success}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            Kayıt Ol
          </button>

          <p className="text-center text-gray-400">
            Zaten hesabınız var mı?{' '}
            <Link href="/" className="text-blue-400 hover:text-blue-300">
              Giriş Yap
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
} 