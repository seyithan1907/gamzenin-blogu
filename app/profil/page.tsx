'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  username: string;
  email: string;
  password: string;
}

const ADMIN_USER = {
  username: "seyithan1907",
  password: "hsy190778",
  email: ""
};

export default function ProfilePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Kullanıcı kontrolü
    const username = localStorage.getItem('user');
    if (!username) {
      router.push('/');
      return;
    }

    // Admin kontrolü
    if (username === ADMIN_USER.username) {
      setIsAdmin(true);
      setCurrentUser({
        username: ADMIN_USER.username,
        password: ADMIN_USER.password,
        email: localStorage.getItem('admin_email') || ''
      });
      setFormData({
        email: localStorage.getItem('admin_email') || '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
      setIsLoading(false);
      return;
    }

    // Normal kullanıcı bilgilerini al
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: User) => u.username === username);
    if (user) {
      setCurrentUser(user);
      setFormData({
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
    }
    setIsLoading(false);
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentUser) return;

    // Email formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Geçerli bir email adresi giriniz!');
      return;
    }

    if (isAdmin) {
      // Admin için şifre kontrolü
      if (formData.currentPassword && formData.currentPassword !== ADMIN_USER.password) {
        setError('Mevcut şifre hatalı!');
        return;
      }

      // Admin şifre değişikliği
      if (formData.newPassword) {
        if (formData.newPassword.length < 6) {
          setError('Yeni şifre en az 6 karakter olmalıdır!');
          return;
        }
        if (formData.newPassword !== formData.confirmNewPassword) {
          setError('Yeni şifreler eşleşmiyor!');
          return;
        }
        // Admin şifresini güncelle
        ADMIN_USER.password = formData.newPassword;
      }

      // Admin email'ini güncelle
      ADMIN_USER.email = formData.email;
      localStorage.setItem('admin_email', formData.email);
      setSuccess('Profil başarıyla güncellendi!');
      return;
    }

    // Normal kullanıcı güncellemesi
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: User) => u.username === currentUser.username);

    if (userIndex === -1) {
      setError('Kullanıcı bulunamadı!');
      return;
    }

    // Mevcut şifre kontrolü
    if (formData.currentPassword && formData.currentPassword !== users[userIndex].password) {
      setError('Mevcut şifre hatalı!');
      return;
    }

    // Yeni şifre kontrolü
    if (formData.newPassword) {
      if (formData.newPassword.length < 6) {
        setError('Yeni şifre en az 6 karakter olmalıdır!');
        return;
      }
      if (formData.newPassword !== formData.confirmNewPassword) {
        setError('Yeni şifreler eşleşmiyor!');
        return;
      }
    }

    // Kullanıcı bilgilerini güncelle
    const updatedUser = {
      ...users[userIndex],
      email: formData.email,
      password: formData.newPassword || users[userIndex].password
    };

    users[userIndex] = updatedUser;
    localStorage.setItem('users', JSON.stringify(users));
    setSuccess('Profil başarıyla güncellendi!');
  };

  if (isLoading || !currentUser) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-900 p-8 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Profil Düzenle</h1>
          <Link href="/" className="text-blue-400 hover:text-blue-300 text-sm">
            Ana Sayfa
          </Link>
        </div>

        <div className="mb-6">
          <p className="text-gray-400 text-sm">Kullanıcı Adı:</p>
          <p className="text-white font-semibold">
            {currentUser.username}
            {isAdmin && (
              <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-1 rounded">
                Admin
              </span>
            )}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-1">
              Mevcut Şifre
            </label>
            <input
              type="password"
              id="currentPassword"
              value={formData.currentPassword}
              onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
              required={!!formData.newPassword}
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-1">
              Yeni Şifre (Opsiyonel)
            </label>
            <input
              type="password"
              id="newPassword"
              value={formData.newPassword}
              onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
              minLength={6}
            />
          </div>

          <div>
            <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-300 mb-1">
              Yeni Şifre Tekrar
            </label>
            <input
              type="password"
              id="confirmNewPassword"
              value={formData.confirmNewPassword}
              onChange={(e) => setFormData({...formData, confirmNewPassword: e.target.value})}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
              required={!!formData.newPassword}
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          {success && (
            <p className="text-green-400 text-sm">{success}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Değişiklikleri Kaydet
          </button>
        </form>
      </div>
    </div>
  );
} 